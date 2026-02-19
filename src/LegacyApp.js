import React, { useState } from 'react';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import NewDesign from './NewDesign';

// --- ESTILOS CORRIGIDOS ---
const estilosGlobais = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;600;700&display=swap');

  body { background: #020305; color: #e2e8f0; font-family: 'Inter', sans-serif; margin: 0; }
  .font-game { font-family: 'Orbitron', sans-serif; }

  .main-header {
    position: relative; padding: 4rem 1rem;
    background: radial-gradient(circle at center, #1a1e26 0%, #020305 100%);
    border-bottom: 2px solid #ef4444; text-align: center;
  }
  .header-title {
    font-family: 'Orbitron', sans-serif; font-size: 4rem; font-weight: 900;
    text-transform: uppercase; letter-spacing: -3px; color: #fff;
    text-shadow: 0 0 20px rgba(239, 68, 68, 0.6); margin: 0;
  }
  .header-title span { color: #ef4444; font-style: italic; }

  .class-card { 
    background: #0b0e14; border: 1px solid #1f242d; border-radius: 12px;
    transition: all 0.4s; cursor: pointer;
  }
  .class-card:hover { border-color: #ef4444; transform: translateY(-10px); box-shadow: 0 0 40px rgba(239, 68, 68, 0.2); }
  .class-portrait { width: 140px; height: 140px; object-fit: contain; filter: drop-shadow(0 10px 20px rgba(0,0,0,1)); }

  .modal-container { 
    background: #080a0f; border: 1px solid #242933; 
    width: 95%; max-width: 1300px; height: 85vh;
    display: grid; grid-template-columns: 320px 1fr; position: relative;
  }
  .modal-sidebar { background: #06080c; border-right: 1px solid #1f242d; padding: 2.5rem; display: flex; flex-direction: column; }
  
  .nav-link {
    padding: 1rem; margin-bottom: 0.5rem; border-radius: 4px;
    color: #475569; font-size: 0.7rem; font-weight: 900; text-transform: uppercase;
    cursor: pointer; transition: 0.2s; border-left: 3px solid transparent; user-select: none;
  }
  .nav-link.active { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-left-color: #ef4444; }

  /* CORREÇÃO DAS SKILLS */
  .wiki-data table { width: 100% !important; border-collapse: separate; border-spacing: 0 12px; margin-bottom: 2rem; table-layout: fixed; }
  .wiki-data tr { background: #0d1117; }
  .wiki-data td { padding: 1.5rem; border-top: 1px solid #1f242d; border-bottom: 1px solid #1f242d; vertical-align: top; color: #94a3b8; }
  
  /* Coluna do Ícone */
  .wiki-data td:first-child { 
    width: 80px !important; 
    border-left: 1px solid #1f242d; 
    border-radius: 8px 0 0 8px; 
    text-align: center;
    padding: 1rem;
  }

  /* O ÍCONE (Ajuste para Quadrado) */
  .wiki-data img { 
    width: 64px !important; 
    height: 64px !important; 
    min-width: 64px !important;
    min-height: 64px !important;
    object-fit: cover !important; /* Garante que a imagem preencha sem esticar */
    border: 2px solid #ef4444; 
    border-radius: 12px; /* Cantos arredondados */
    display: block;
    margin: 0 auto;
  }

  .wiki-data b { color: #ef4444; font-family: 'Orbitron', sans-serif; font-size: 0.85rem; display: block; margin-bottom: 5px; }

  .weapon-badge {
    background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);
    padding: 0.6rem 1.2rem; border-radius: 2px; font-size: 0.7rem; font-weight: 900; color: #ef4444; text-transform: uppercase;
  }

  .close-modal-btn {
    position: absolute; top: 1.5rem; right: 1.5rem; width: 40px; height: 40px;
    background: #111; border: 1px solid #333; color: #fff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 100;
  }
  .close-modal-btn:hover { background: #ef4444; box-shadow: 0 0 15px #ef4444; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
`;

function LegacyApp() {
  const [showPreview, setShowPreview] = useState(false);
  const [classes] = useState(["Viking", "Pyromancer", "Marksman", "Pirate", "Nomad", "Redneck", "Necromancer", "Samurai", "Paladin", "Amazon", "Demon Slayer", "Demonspawn", "Shaman", "White Mage", "Marauder", "Plague Doctor", "Shield Lancer", "Jötunn", "Illusionist", "Exo", "Butcher", "Stormweaver", "Bard"]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [wikiData, setWikiData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  if (showPreview) {
    return <NewDesign onBack={() => setShowPreview(false)} />;
  }

  const fetchClassData = async (nome) => {
    setSelectedClass(nome);
    setWikiData(null);
    setActiveTab(0);
    
    // Converte nome para ID do documento (lowercase, hifens, remove acentos específicos)
    const docId = nome.toLowerCase().replace(/\s+/g, '-').replace(/ö/g, 'o');

    try {
      const docRef = doc(db, 'classes', docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        let mainSections = data.especializacoes || [{ title: "Geral", html: "<div>Sem dados de especialização.</div>" }];
        const extraSections = (data.extra_info || []).map(s => ({ ...s, isExtra: true }));
        if (nome === 'Bard') {
          const chest = 'https://herosiege.wiki.gg/images/Item_Chest.png';
          const iconPrimary = (base) => `https://herosiege.wiki.gg/images/Monk_${base}.png`;
          const iconAlt = (base) => `https://herosiege.wiki.gg/images/Icon_Monk_${base}.png`;
          const row = (n, r, l) => {
            const base = String(n).trim().replace(/['’!]/g, '').replace(/\s+/g, '_');
            return `
              <tr>
                <td><img src="${iconPrimary(base)}" alt="${n}" onerror="this.onerror=function(){this.onerror=null;this.src='${chest}'};this.src='${iconAlt(base)}'"/></td>
                <td>${n}</td>
                <td>${r}</td>
                <td>${l}</td>
              </tr>`;
          };
          const tableWrap = (rows) => `
            <div class="wiki-data">
              <table>
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Required Skill(s)</th>
                    <th>Required Level</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows}
                </tbody>
              </table>
            </div>`;
          const minstrel = tableWrap([
            row('Melodic Chord', 'None', '1'),
            row('Harmony', 'None', '1'),
            row('Sound Wave', 'Melodic Chord', '6'),
            row('Discord', 'None', '6'),
            row('Vibrant Echo', 'Discord', '12'),
            row('Rhythm', 'Harmony', '12'),
            row('Symphony', 'Sound Wave', '18'),
            row('Resonance', 'Vibrant Echo', '18'),
            row('Masterpiece', 'Rhythm', '24')
          ].join(''));
          const troubadour = tableWrap([
            row('Inspiring Tune', 'None', '1'),
            row('Dancing Step', 'None', '1'),
            row('Lullaby', 'None', '6'),
            row('Power Ballad', 'Dancing Step', '6'),
            row('Chorus', 'Lullaby', '12'),
            row('Battle Song', 'None', '12'),
            row('Heroic Anthem', 'Battle Song', '18'),
            row('Crescendo', 'Power Ballad', '18'),
            row('Final Encore', 'Heroic Anthem', '24')
          ].join(''));
          const augments = `
            <div class="wiki-data">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Special Effect from Augment</th>
                    <th>Gained per Augment Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Requiem</td>
                    <td>Masterpiece now releases homing Soul Notes from defeated enemies.</td>
                    <td>10% Soul Note Damage 2% Extra Note Chance</td>
                  </tr>
                  <tr>
                    <td>Cacophony</td>
                    <td>Discord leaves a chaotic sound trail that shreds enemy armor.</td>
                    <td>1.5s Trail Duration 3% Armor Reduction</td>
                  </tr>
                  <tr>
                    <td>Allegro</td>
                    <td>Dancing Step grants Haste and nullifies the first instance of damage.</td>
                    <td>5% Cast Speed -0.5s Internal Cooldown</td>
                  </tr>
                  <tr>
                    <td>Fortissimo</td>
                    <td>Heroic Anthem pulses healing waves to allies based on damage dealt.</td>
                    <td>1% Damage-to-Heal Conversion 5% Aura Radius</td>
                  </tr>
                </tbody>
              </table>
            </div>`;
          const section4 = `
            <div class="wiki-data">
              <table>
                <thead>
                  <tr>
                    <th>Section 4</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>● Viking ● Pyromancer ● Marksman ● Pirate ● Nomad ● Redneck ● Necromancer ● Samurai ● Paladin ● Amazon ● Demon Slayer ● Demonspawn ● Shaman ● White Mage ● Marauder ● Plague Doctor ● Shield Lancer ● Illusionist ● Jötunn ● Exo ● Butcher ● Stormweaver</td>
                  </tr>
                </tbody>
              </table>
            </div>`;
          mainSections = [
            { title: 'Minstrel', html: minstrel },
            { title: 'Troubadour', html: troubadour },
            { title: 'Class Augments', html: augments },
            { title: 'Section 4', html: section4 }
          ];
        }
        setWikiData({
          weapon: data.weapon,
          sections: [...mainSections, ...extraSections]
        });
      } else {
        console.error("Documento não encontrado:", docId);
        throw new Error("Classe não encontrada no banco de dados.");
      }

    } catch (e) {
      console.error("Erro ao buscar dados:", e);
      setWikiData({ 
        weapon: "Erro", 
        sections: [{ 
          title: "Erro", 
          html: `<div style='padding:40px; text-align:center; color:#ef4444; font-weight:bold;'>
            <p>Não foi possível carregar os dados do banco de dados.</p>
            <p style='font-size: 0.8em; margin-top: 10px; color: #94a3b8;'>Detalhe: ${e.message}</p>
            <p style='font-size: 0.8em; margin-top: 10px; color: #94a3b8;'>ID solicitado: ${docId}</p>
          </div>` 
        }] 
      });
    }
  };

  return (
    <>
      <style>{estilosGlobais}</style>
      <div className="min-h-screen">
        <header className="main-header">
          <button 
            onClick={() => setShowPreview(true)} 
            className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-white border border-red-500/30 hover:bg-red-600/20 px-4 py-2 rounded transition-all"
          >
            Ver Novo Layout (Preview)
          </button>
          <h1 className="header-title">HERO SIEGE <span>BRASIL</span></h1>
          <p className="text-[10px] font-bold text-gray-500 tracking-[0.8em] mt-2 uppercase">Database Season 2026</p>
        </header>

        <main className="max-w-7xl mx-auto p-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {classes.map(c => (
            <div key={c} className="class-card p-8 flex flex-col items-center group" onClick={() => fetchClassData(c)}>
              <img 
                src={c === 'Bard' ? 'https://i.postimg.cc/SN3qPPZ8/4r4342r.png' : `https://herosiege.wiki.gg/images/${c.replace(/\s+/g, '_')}.png`} 
                className="class-portrait mb-6" 
                alt={c} 
              />
              <h3 className="font-game text-sm text-white uppercase group-hover:text-red-500 transition-colors">{c}</h3>
            </div>
          ))}
        </main>

        {selectedClass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4" onClick={() => setSelectedClass(null)}>
            <div className="modal-container rounded-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedClass(null)} className="close-modal-btn">✕</button>
              <aside className="modal-sidebar">
                <img 
                  src={selectedClass === 'Bard' ? 'https://i.postimg.cc/SN3qPPZ8/4r4342r.png' : `https://herosiege.wiki.gg/images/${selectedClass.replace(/\s+/g, '_')}.png`} 
                  className="w-32 mx-auto mb-10" 
                  alt={selectedClass} 
                />
                <div className="flex-grow overflow-y-auto no-scrollbar">
                  {wikiData?.sections.map((s, i) => {
                    const n = (selectedClass || '')
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .replace(/\s+/g, '_')
                      .trim();
                    const specTitleFor = (cls, idx) => {
                      const map = {
                        viking: ['Berserker', 'Shield Bearer'],
                        pyromancer: ['Fire Mage', 'Burning Soul'],
                        marksman: ['Hunter', 'Marksman'],
                        pirate: ['Shipmaster', 'Cannoneer'],
                        nomad: ['Sand Walker', 'Desert Blade'],
                        redneck: ['Hillbilly', 'Moonshiner'],
                        necromancer: ['Summoner', 'Lich'],
                        samurai: ['Bushido', 'Ronin'],
                        paladin: ['Holy Knight', 'Crusader'],
                        amazon: ['Spear Maiden', 'Huntress'],
                        demon_slayer: ['Executioner', 'Inquisitor'],
                        demonspawn: ['Hellfire', 'Demonic'],
                        shaman: ['Elemental', 'Totemic'],
                        white_mage: ['Holy Beam', 'Benediction'],
                        marauder: ['Bombardier', 'Wrecker'],
                        plague_doctor: ['Infection', 'Medicine'],
                        illusionist: ['Phantasm', 'Mirror'],
                        exo: ['Gravity', 'Force'],
                        butcher: ['Meat', 'Blood'],
                        stormweaver: ['Thunder', 'Storm'],
                        bard: ['Minstrel', 'Troubadour']
                      };
                      const arr = map[cls];
                      if (arr && idx < arr.length) return arr[idx];
                      return `Especialização ${idx + 1}`;
                    };
                    const label = (s?.title && String(s.title).trim())
                      ? s.title
                      : (s?.isExtra ? '🔍 Extra' : specTitleFor(n, i));
                    return (
                      <div 
                        key={i}
                        className={`nav-link ${activeTab === i ? 'active' : ''}`} 
                        onClick={() => setActiveTab(i)}
                      >
                        {label}
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setSelectedClass(null)} className="mt-8 py-3 border border-white/10 text-[10px] text-gray-500 uppercase font-bold tracking-widest hover:text-white">Voltar ao Menu</button>
              </aside>
              <section className="p-12 overflow-y-auto no-scrollbar bg-[#080a0f]">
                {wikiData ? (
                  <>
                    <h2 className="font-game text-7xl font-black italic uppercase text-white mb-4">{selectedClass}</h2>
                    <div className="h-1 w-32 bg-red-600 mb-8"></div>
                    <div className="flex items-center gap-3 text-lg mb-10">
                      <span className="text-2xl">⚔️</span>
                      <span className="text-gray-400 uppercase tracking-wider text-sm font-bold">Equipamento Permitido:</span>
                      <span className="text-white font-medium">{wikiData.weapon}</span>
                    </div>
                    <div className="wiki-data" dangerouslySetInnerHTML={{ __html: wikiData.sections[activeTab]?.html }} />
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-red-600 font-bold uppercase animate-pulse">Sincronizando...</div>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default LegacyApp;
