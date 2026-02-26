
import React, { useEffect } from 'react';
import './AugmentsPage.css';

const AUGMENTS_DATA = [
  { en: "Artful Dodger", pt: "Esquiva Astuta", d: "Esquivar ou bloquear ataques concede bônus de velocidade e dano.", icon: "fa-person-running" },
  { en: "Artillery Aid", pt: "Apoio de Artilharia", d: "Chama artilharia, chovendo flechas nos monstros ao redor.", icon: "fa-arrow-down-long" },
  { en: "Avariciousness", pt: "Avareza", d: "Coletar ouro concede stacks que aumentam Magic Find e Gold Find.", icon: "fa-coins" },
  { en: "Awareness", pt: "Percepção", d: "Aumenta drasticamente sua velocidade de movimento por um curto período.", icon: "fa-eye" },
  { en: "Berserker's Rage", pt: "Fúria do Berserker", d: "Ganha Roubo de Vida e Dano, mas diminui resistências.", icon: "fa-fire-flame-curved" },
  { en: "Butchers Fury", pt: "Fúria do Açougueiro", d: "Libera uma onda de choque de sangue causando dano físico.", icon: "fa-droplet" },
  { en: "Conjured Hex", pt: "Feitiço Conjurado", d: "Amaldiçoa monstros, quebrando suas resistências Arcanas.", icon: "fa-wand-sparkles" },
  { en: "Corrosion", pt: "Corrosão", d: "Efeitos de DoT duram mais e aumentam o dano recebido.", icon: "fa-vial-circle-check" },
  { en: "Death's Anguish", pt: "Angústia da Morte", d: "Invoca um Crânio de um cadáver que persegue o monstro.", icon: "fa-skull" },
  { en: "Divine Piercing", pt: "Perfuração Divina", d: "Ataques perfurem e quebrem a armadura do monstro.", icon: "fa-scissors" },
  { en: "Doomcannon", pt: "Canhão da Perdição", d: "Dispara três bolas de canhão que explodem ao atingir o chão.", icon: "fa-bomb" },
  { en: "Double Swing", pt: "Giro Duplo", d: "Faz com que seus ataques ocorram duas vezes com dano aumentado.", icon: "fa-khanda" },
  { en: "Drunkard Mayhem", pt: "Caos do Bêbado", d: "Cada bônus ativo diminui o dano recebido.", icon: "fa-wine-glass" },
  { en: "Echoes of the Void", pt: "Ecos do Vazio", d: "A cada 30 segundos, conjura sua última habilidade usada.", icon: "fa-atom" },
  { en: "Elementalist", pt: "Elementalista", d: "Ganha dano mágico para cada 100 de mana máxima.", icon: "fa-hat-wizard" },
  { en: "Fleet Feet", pt: "Pés Ligeiros", d: "Aumenta sua chance de esquivar por um curto período.", icon: "fa-shoe-prints" },
  { en: "Flurry", pt: "Rajada", d: "Libera uma enxurrada de flechas causando dano físico.", icon: "fa-arrows-to-dot" },
  { en: "Freezing Enchant", pt: "Encanto Congelante", d: "Área que causa dano de gelo e congela monstros.", icon: "fa-snowflake" },
  { en: "Grave's Grasp", pt: "Abraço do Túmulo", d: "Invoca uma anomalia sombria para lutar ao seu lado.", icon: "fa-ghost" },
  { en: "Gravity", pt: "Gravidade", d: "Cria um campo que puxa e reduz o dano dos monstros.", icon: "fa-circle-dot" },
  { en: "Gut Ripper", pt: "Bola de Espinhos", d: "Invoca uma bola de espinhos mortal para orbitar você.", icon: "fa-bahai" },
  { en: "Hellfire", pt: "Fogo do Inferno", d: "Libera chamas infernais que causam dano de fogo.", icon: "fa-fire" },
  { en: "Homing Missiles", pt: "Mísseis Teleguiados", d: "Libera um míssil perseguidor que causa dano em área.", icon: "fa-rocket" },
  { en: "Impetus", pt: "Ímpeto", d: "Envia espinhos do chão causando dano físico.", icon: "fa-mountain" },
  { en: "Infinity", pt: "Infinito", d: "Casting elemental tem chance de ser conjurado duas vezes.", icon: "fa-infinity" },
  { en: "Lethal Tempo", pt: "Ritmo Letal", d: "Aumenta velocidade de ataque e dano crítico.", icon: "fa-bolt-lightning" },
  { en: "Longevity", pt: "Longevidade", d: "Habilidades orbitais duram mais tempo.", icon: "fa-hourglass-half" },
  { en: "Magefury", pt: "Fúria do Mago", d: "Libera explosões arcanas nos monstros ao redor.", icon: "fa-hand-sparkles" },
  { en: "Magistriker", pt: "Magistriker", d: "Dano mágico aumenta com base na velocidade de ataque.", icon: "fa-staff-snake" },
  { en: "Minion Mastery", pt: "Mestria de Lacaios", d: "Aumenta a velocidade de ataque das invocações.", icon: "fa-users-rays" },
  { en: "Mixture of Doom", pt: "Mistura da Perdição", d: "Habilidades de veneno criam campos de debuff.", icon: "fa-flask-vial" },
  { en: "Monstrosity", pt: "Monstruosidade", d: "Acumula stacks para redução de custo de mana.", icon: "fa-dragon" },
  { en: "Mystic Insight", pt: "Visão Mística", d: "Seus feitiços agora podem causar acertos críticos.", icon: "fa-eye-low-vision" },
  { en: "Mystic Orb", pt: "Orbe Místico", d: "Orbe que pulsa dano arcano e recupera mana.", icon: "fa-meteor" },
  { en: "Nordic Winter", pt: "Inverno Nórdico", d: "Dano de gelo pode aplicar Congelamento Profundo.", icon: "fa-icicles" },
  { en: "Odin's Wrath", pt: "Ira de Odin", d: "Invoca dois machados giratórios no local alvo.", icon: "fa-hammer" },
  { en: "Overloaded", pt: "Sobrecarga", d: "Projéteis ganham velocidade e dano crítico.", icon: "fa-battery-full" },
  { en: "Powder Keg", pt: "Barril de Pólvora", d: "Lança um barril que explode e incendeia o chão.", icon: "fa-oil-can" },
  { en: "Powershot", pt: "Tiro de Poder", d: "Invoca uma flecha gigante que atravessa os inimigos.", icon: "fa-bullseye" },
  { en: "Precision", pt: "Precisão", d: "Aumenta sua chance de ignorar a defesa do alvo.", icon: "fa-crosshairs" },
  { en: "Rupturing Strike", pt: "Golpe Rupturante", d: "Causa dano de ataque aumentado e sangramento.", icon: "fa-droplet-slash" },
  { en: "Seed of Destruction", pt: "Semente da Destruição", d: "Planta sementes arcanas explosivas.", icon: "fa-seedling" },
  { en: "Shadow Barrage", pt: "Barragem de Sombras", d: "Libera uma rajada de projéteis sombrios.", icon: "fa-cloud-moon" },
  { en: "Shadows Grasp", pt: "Aperto das Sombras", d: "Invoca mãos sombrias causando dano arcano.", icon: "fa-hand-back-fist" },
  { en: "Shroom of Doom", pt: "Cogumelo da Perdição", d: "Lança um cogumelo tóxico que quica entre inimigos.", icon: "fa-bacteria" },
  { en: "Singularity", pt: "Singularidade", d: "A cada 7 segundos, seu ataque puxa monstros.", icon: "fa-circle-dot" },
  { en: "Soul Tap", pt: "Dreno de Alma", d: "Aumenta seu Roubo de Vida baseado nos inimigos.", icon: "fa-ghost" },
  { en: "Spell Slinger", pt: "Lançador de Feitiços", d: "Aumenta dano mágico e velocidade de conjuração.", icon: "fa-wand-magic" },
  { en: "Spreadshot", pt: "Tiro Espalhado", d: "Projéteis se dividem ao atingir o alvo.", icon: "fa-arrows-split-up-and-left" },
  { en: "Sprouting Ivy", pt: "Hera Brotante", d: "Libera uma corrente de veneno que infecta monstros.", icon: "fa-leaf" },
  { en: "Staticshot", pt: "Tiro Estático", d: "Encanta projéteis com relâmpagos em cadeia.", icon: "fa-bolt" },
  { en: "Supershot", pt: "Super Tiro", d: "Projéteis causam uma onda de choque física.", icon: "fa-burst" },
  { en: "Survivors Shield", pt: "Escudo do Sobrevivente", d: "Fica imune a dano ao chegar em 35% de vida.", icon: "fa-shield-heart" },
  { en: "Tempest Strikes", pt: "Golpes da Tempestade", d: "Ganha AS e MS a cada golpe desferido.", icon: "fa-wind" },
  { en: "Tinkerer", pt: "Engenhoca", d: "Próxima explosão ocorre múltiplas vezes.", icon: "fa-gears" },
  { en: "Titans Power", pt: "Poder do Titã", d: "Ganha bônus de área e dano a cada 30 segundos.", icon: "fa-hand-fist" },
  { en: "Touch Down", pt: "Touch Down", d: "Lança o alvo causando dano em área no impacto.", icon: "fa-football" },
  { en: "Touch of Death", pt: "Toque da Morte", d: "Libera uma praga que causa dano de veneno.", icon: "fa-skull-crossbones" },
  { en: "Vacuuming Strike", pt: "Golpe de Vácuo", d: "Puxa todos os monstros à sua frente.", icon: "fa-arrows-to-circle" },
  { en: "Warsong", pt: "Canção de Guerra", d: "Debuff que reduz dano dos monstros.", icon: "fa-music" },
  { en: "Weapon Throw", pt: "Arremesso de Arma", d: "Arremessa sua arma causando dano massivo.", icon: "fa-gavel" },
  { en: "Wizards Wrath", pt: "Ira do Mago", d: "Aumenta velocidade de cast e dano arcano.", icon: "fa-hat-wizard" },
  { en: "Zapper", pt: "Zapper", d: "Dano de raio dispara relâmpagos em cadeia.", icon: "fa-plug-circle-bolt" }
];

const AugmentsPage = () => {
  useEffect(() => {
    // Adiciona o link do FontAwesome dinamicamente se não estiver presente
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="info-box-angelic">
        <img
          src="https://herosiege.wiki.gg/images/thumb/Angel_of_Justice.PNG/500px-Angel_of_Justice.PNG"
          className="angel-bg"
          alt="Angel"
          onError={(e) => e.target.style.display = 'none'}
        />

        <h2>Augments Angélicos</h2>

        <p className="text-detail">
          Augments requerem uma <span className="highlight-key">Angelic Key (Chave Angélica)</span> para serem adicionados e aprimorados.
          Os valores de dano exibidos podem variar e são calculados, em sua maioria, antes do escalonamento de atributos.
        </p>

        <h3 style={{ color: '#f97316', fontSize: '1rem', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
          Antigos Augments de Arma
        </h3>

        <div className="table-container">
          <table className="table-upgrade">
            <thead>
              <tr>
                <th>Nível Atual do Augment</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Custo para Próximo Upgrade</th><td>0</td><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>Máximo (Max)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-detail">
          Cada upgrade exige que você entre novamente no <span className="highlight-key">Reino Angélico</span>, o que custa 1 Chave Angélica por vez.<br />
          O primeiro upgrade é <strong>gratuito</strong> se você escolher a partir da seleção aleatória, ou custa <strong>5 chaves</strong> caso deseje escolher livremente.
        </p>

        <div className="cost-summary">
          <p style={{ margin: 0 }}>
            <strong>Custo total para um Augment Nível 7:</strong> <span style={{ fontSize: '1.2rem', color: '#f97316' }}>22 ou 27 Chaves Angélicas</span>
          </p>
        </div>

        <p style={{ marginTop: '20px', fontSize: '0.9rem', fontStyle: 'italic', color: '#aaa' }}>
          <strong>Dica:</strong> Você pode adicionar um Augment a uma Armadura e aprimorar um Augment já existente na mesma viagem, economizando uma chave.
        </p>
      </div>

      <div className="augments-grid" id="main-grid">
        {AUGMENTS_DATA.map((a) => (
          <div key={a.en} className="aug-card">
            <div className="aug-header">
              <div className="aug-icon">
                <i className={`fa-solid ${a.icon}`}></i>
              </div>
              <div className="name-wrapper">
                <span className="name-en">({a.en})</span>
                <span className="name-pt">{a.pt}</span>
              </div>
            </div>
            <div className="aug-desc">{a.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AugmentsPage;
