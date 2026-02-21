import React, { useState } from 'react';

const MercenariosPage = () => {
  const [activeTab, setActiveTab] = useState('knight');

  const knightSkills = [
    {
      name: "Warrior's Might",
      icon: 'https://static.wikia.nocookie.net/herosiege/images/2/26/Warriors_might.png',
      type: null,
      isActive: false,
      description: 'Aumenta a Força do mercenário.'
    },
    {
      name: 'Defenses',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/8/82/Defenses.png',
      type: null,
      isActive: false,
      description: 'Aumenta a Armadura do mercenário.'
    },
    {
      name: 'Charge Strike',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/1/1e/Charge_strike.png',
      type: 'Físico',
      isActive: true,
      description: 'Avança até o inimigo mais próximo, atordoando e causando dano em área.'
    },
    {
      name: 'Fatal Strike',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/8/8e/Fatal_strike.png',
      type: null,
      isActive: false,
      description: 'Aumenta o dano de golpes críticos do mercenário.'
    },
    {
      name: 'Spiked Armor',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/5/52/Spiked_armor.png',
      type: null,
      isActive: false,
      description: 'Aumenta o dano de retorno recebido pelos inimigos ao atacar o mercenário.'
    },
    {
      name: 'Taunt',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/c/cc/Taunt.png',
      type: null,
      isActive: true,
      description: 'O mercenário provoca os inimigos próximos.'
    },
    {
      name: 'Stacked Rage',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/4/49/Stacked_rage.png',
      type: 'Físico',
      isActive: false,
      description: 'Gera acúmulos de raiva. Com a barra cheia, libera um ataque em área poderoso.'
    },
    {
      name: 'Sword Grip',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/a/a7/Sword_grip.png',
      type: null,
      isActive: false,
      description: 'Aumenta o dano de ataques corpo a corpo do mercenário.'
    },
    {
      name: 'Plated Armor',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/d/d6/Plated_armor.png',
      type: null,
      isActive: false,
      description: 'Aumenta a redução de dano do mercenário.'
    },
    {
      name: 'Stacked Pain',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/f/f3/Stacked_pain.png',
      type: 'Físico',
      isActive: false,
      description: 'Acúmulos de dor completos liberam um pulso em área que desacelera inimigos.'
    },
    {
      name: 'Hulking Rage',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/2/2b/Hulking_rage.png',
      type: null,
      isActive: false,
      description: 'Aumenta a vida recuperada por acerto em ataques corpo a corpo.'
    },
    {
      name: 'Aura Expert',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/1/11/Aura_expert.png',
      type: null,
      isActive: false,
      description: 'Aumenta o valor da aura do mercenário.'
    },
    {
      name: 'Evasive Tactics',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/0/0f/Evasive_tactics.png',
      type: null,
      isActive: false,
      description: 'Aumenta a chance de esquiva do mercenário.'
    },
    {
      name: "Commander's Heart",
      icon: 'https://static.wikia.nocookie.net/herosiege/images/9/91/Commanders_heart.png',
      type: null,
      isActive: false,
      description: 'A regeneração aumenta conforme a vida do mercenário diminui.'
    },
    {
      name: 'Blessed Strike',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/3/39/Blessed_strike.png',
      type: 'Físico',
      isActive: true,
      description: 'O mercenário realiza um ataque poderoso de longo alcance.'
    },
    {
      name: 'Brutal Bash',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/0/0c/Brutal_bash.png',
      type: 'Físico',
      isActive: false,
      description: 'Chance de causar dano extra e empurrar os inimigos.'
    },
    {
      name: 'Backlash',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/3/32/Backlash.png',
      type: 'Físico',
      isActive: false,
      description: 'Chance de atordoar inimigos quando o mercenário é atacado.'
    },
    {
      name: 'Protecting Charge',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/0/00/Protecting_charge.png',
      type: 'Físico',
      isActive: true,
      description: 'Avança contra inimigos que atacam o jogador e os provoca.'
    }
  ];

  const archerSkills = [
    {
      name: 'Trigger Power',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/4/48/Trigger_power.png',
      type: null,
      isActive: false,
      description: 'Aumenta a Força do mercenário.'
    },
    {
      name: 'Rapidfire',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/3/36/Rapidfire.png',
      type: null,
      isActive: false,
      description: 'Aumenta a velocidade de ataque do mercenário.'
    },
    {
      name: 'Powershot',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/d/d7/Powershot.png',
      type: 'Físico',
      isActive: true,
      description: 'Dispara um projétil perfurante poderoso que atordoa inimigos.'
    },
    {
      name: "Raven's Claw",
      icon: 'https://static.wikia.nocookie.net/herosiege/images/9/97/Ravens_claw.png',
      type: null,
      isActive: false,
      description: 'Aumenta o dano crítico e a taxa de acerto crítico.'
    },
    {
      name: 'Spreadshot',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/c/c7/Spreadshot.png',
      type: null,
      isActive: false,
      description: 'Chance de disparar múltiplos projéteis ao atacar.'
    },
    {
      name: 'Heatseeking Missile',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/9/98/Heatseeking_missile.png',
      type: 'Físico',
      isActive: true,
      description: 'Lança uma barragem de mísseis teleguiados.'
    },
    {
      name: 'Explosive Shot',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/6/6d/Explosive_shot.png',
      type: 'Físico',
      isActive: false,
      description: 'Projétil que explode ao colidir quando totalmente carregado.'
    },
    {
      name: 'Hawk Eye',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/2/2c/Hawk_eye.png',
      type: null,
      isActive: false,
      description: 'Aumenta o poder de ataque do mercenário.'
    },
    {
      name: 'Piercingshot',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/e/e5/Piercingshot.png',
      type: null,
      isActive: false,
      description: 'Chance de disparar um projétil perfurante com dano extra.'
    },
    {
      name: 'Ability Expert',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/6/6a/Ability_expert.png',
      type: null,
      isActive: false,
      description: 'Aumenta o Poder de Habilidade do mercenário.'
    },
    {
      name: 'Soul Funnel',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/8/87/Soul_funnel.png',
      type: null,
      isActive: false,
      description: 'Aumenta a vida por acerto para jogador e mercenário.'
    },
    {
      name: 'Aura Expert',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/c/c6/Aura_expert_archer.png',
      type: null,
      isActive: false,
      description: 'Aumenta o valor da aura do mercenário.'
    },
    {
      name: 'Shatter Armor',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/5/55/Shatter_armor.png',
      type: null,
      isActive: false,
      description: 'Chance ao atacar de quebrar as resistências do inimigo.'
    },
    {
      name: 'Quickslugs',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/2/28/Quickslugs.png',
      type: null,
      isActive: false,
      description: 'Chance ao atacar de realizar um disparo em rajada.'
    },
    {
      name: 'Artillery Command',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/f/fb/Artillery_command.png',
      type: 'Físico',
      isActive: true,
      description: 'Larga uma bomba que espalha flechas ao explodir.'
    },
    {
      name: 'Brainfreeze',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/7/70/Brainfreeze.png',
      type: null,
      isActive: false,
      description: 'Chance ao atacar de causar dano em área e confusão.'
    },
    {
      name: 'Burst of Agility',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/f/f6/Burst_of_agility.png',
      type: null,
      isActive: false,
      description: 'Chance de conceder um aumento na velocidade de ataque.'
    },
    {
      name: "Hunter's Trap",
      icon: 'https://static.wikia.nocookie.net/herosiege/images/3/38/Hunters_trap.png',
      type: 'Físico',
      isActive: true,
      description: 'Puxa e atordoa inimigos próximos.'
    }
  ];

  const magisterSkills = [
    {
      name: 'Elemental Intellect',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/4/45/Elemental_intellect.png',
      type: null,
      isActive: false,
      description: 'Aumenta o dano elemental do mercenário.'
    },
    {
      name: 'Tome of Power',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/c/c2/Tome_of_power.png',
      type: null,
      isActive: false,
      description: 'Aumenta o Poder de Habilidade do mercenário.'
    },
    {
      name: 'Arcane Blast',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/2/25/Arcane_blast.png',
      type: 'Mágico',
      isActive: true,
      description: 'Dispara um feixe arcano contra o inimigo mais próximo.'
    },
    {
      name: 'Arcane Fire',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/6/6f/Arcane_fire.png',
      type: 'Mágico',
      isActive: false,
      description: 'Chance ao atacar de incendiar o chão.'
    },
    {
      name: 'Replenishing Touch',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/d/d8/Replenishing_touch.png',
      type: null,
      isActive: false,
      description: 'Chance ao atacar de regenerar a mana do jogador.'
    },
    {
      name: 'Magic Claw',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/b/b0/Magic_claw.png',
      type: 'Mágico',
      isActive: true,
      description: 'Golpe arcano em cadeia que salta entre inimigos.'
    },
    {
      name: "Arcane's Blessing",
      icon: 'https://static.wikia.nocookie.net/herosiege/images/e/e8/Arcanes_blessing.png',
      type: null,
      isActive: false,
      description: 'Chance ao atacar de aumentar o Poder de Habilidade.'
    },
    {
      name: 'Cosmic Bolt',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/1/1b/Cosmic_bolt.png',
      type: 'Mágico',
      isActive: false,
      description: 'Dano acumulado desencadeia um raio cósmico.'
    },
    {
      name: 'Arcane Meteor',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/6/6c/Arcane_meteor.png',
      type: 'Mágico',
      isActive: false,
      description: 'Chance ao atacar de conjurar um Meteoro Arcano.'
    },
    {
      name: 'Manaflux',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/9/94/Manaflux.png',
      type: null,
      isActive: false,
      description: 'Aumenta a mana máxima do jogador.'
    },
    {
      name: 'Spellburn',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/a/ac/Spellburn.png',
      type: 'Mágico',
      isActive: false,
      description: 'Chance de queimar e desacelerar inimigos.'
    },
    {
      name: 'Aura Expert',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/9/93/Aura_expert_magister.png',
      type: null,
      isActive: false,
      description: 'Aumenta o valor da aura do mercenário.'
    },
    {
      name: 'Reptillian Brain',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/8/8f/Reptillian_brain.png',
      type: null,
      isActive: false,
      description: 'Chance de redefinir recargas e aumentar o Poder de Habilidade.'
    },
    {
      name: 'Arcane Nova',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/6/64/Arcane_nova.png',
      type: 'Mágico',
      isActive: false,
      description: 'Chance ao atacar de liberar uma Nova Arcana.'
    },
    {
      name: 'Arcane Link',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/2/20/Arcane_link.png',
      type: 'Mágico',
      isActive: true,
      description: 'Cria um elo danoso entre mercenário e jogador.'
    },
    {
      name: 'Arcane Barrage',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/d/db/Arcane_barrage.png',
      type: 'Mágico',
      isActive: false,
      description: 'Chance ao atacar de disparar múltiplos projéteis arcanos.'
    },
    {
      name: 'Word of Protection',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/e/e3/Word_of_protection.png',
      type: null,
      isActive: false,
      description: 'Chance ao atacar de conceder um escudo ao jogador.'
    },
    {
      name: 'Arcane Apocalypse',
      icon: 'https://static.wikia.nocookie.net/herosiege/images/f/f6/Arcane_apocalypse.png',
      type: 'Mágico',
      isActive: true,
      description: 'Devasta inimigos próximos com explosões arcanas.'
    }
  ];

  const renderSkillsTable = (skills, elementLabel) => (
    <div className="bg-[#111111] border border-white/10 rounded-b-lg overflow-hidden">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-black text-[11px] text-left text-yellow-400 uppercase tracking-widest px-3 py-2 border border-[#333] w-1/3">
              Skill
            </th>
            <th className="bg-black text-[11px] text-left text-yellow-400 uppercase tracking-widest px-3 py-2 border border-[#333] w-[15%]">
              Tipo
            </th>
            <th className="bg-black text-[11px] text-left text-yellow-400 uppercase tracking-widest px-3 py-2 border border-[#333]">
              Descrição
            </th>
          </tr>
        </thead>
        <tbody>
          {skills.map((s) => (
            <tr key={s.name} className="hover:bg-[#1d1d1d]">
              <td className="border border-[#222] px-3 py-2 align-middle">
                <div className="flex items-center gap-3">
                  <img src={s.icon} alt={s.name} className="w-9 h-9 border border-[#444] rounded" />
                  <span className="text-white font-semibold text-sm">{s.name}</span>
                </div>
              </td>
              <td className="border border-[#222] px-3 py-2 align-middle text-xs">
                {s.type && (
                  <span className="block text-[10px] font-bold text-orange-400 mb-1">
                    {elementLabel || s.type}
                  </span>
                )}
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-white/10 ${
                    s.isActive ? 'bg-red-600 text-white' : 'bg-[#333333] text-gray-300'
                  }`}
                >
                  {s.isActive ? 'Ativa' : 'Passiva'}
                </span>
              </td>
              <td className="border border-[#222] px-3 py-2 align-middle text-sm text-gray-300">
                {s.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-widest text-center mb-6 border-b border-white/10 pb-3">
          Mercenários
        </h2>

        <div className="text-gray-300 text-sm md:text-base leading-relaxed space-y-3 max-w-3xl mx-auto mb-10">
          <p>
            Os mercenários são <span className="font-semibold">NPCs</span> que o jogador pode contratar para lutar ao seu lado e oferecer suporte.
          </p>
          <p>
            Eles podem ser equipados com <span className="font-semibold">Elmos, Armas, Armaduras e Escudos</span>. Cada mercenário possui sua própria Árvore de Habilidades em que o jogador pode investir pontos, de forma semelhante à própria árvore de habilidades do personagem.
          </p>
          <p>
            A partir da Season 17, existem três tipos de mercenários que o jogador pode contratar com <span className="font-semibold">Gar Nor</span>, próximo aos bonecos de treino.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-5 justify-center mb-8">
          <div className="bg-[#151515] flex-1 min-w-[260px] max-w-xs rounded-lg shadow-xl border-t-4 border-[#c0392b] border-b-2 border-b-[#c0392b]">
            <div className="p-4 flex flex-col items-center">
              <div className="bg-black border border-gray-700 rounded-md p-2 mb-3">
                <img
                  src="https://static.wikia.nocookie.net/herosiege/images/f/f0/Melee_Mercenary.gif"
                  alt="Knight Mercenary"
                  className="h-24 w-auto"
                />
              </div>
              <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-2">Knight</h3>
              <div className="text-[13px] text-left bg-black/40 border border-black/60 rounded px-3 py-2 w-full">
                <span className="block">
                  <span className="text-yellow-400 font-semibold">Tipo:</span> Mercenário Corpo a Corpo
                </span>
                <span className="block">
                  <span className="text-yellow-400 font-semibold">Encontrado em:</span> Ato 1 – Cidade de Inoya
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#151515] flex-1 min-w-[260px] max-w-xs rounded-lg shadow-xl border-t-4 border-[#27ae60] border-b-2 border-b-[#27ae60]">
            <div className="p-4 flex flex-col items-center">
              <div className="bg-black border border-gray-700 rounded-md p-2 mb-3">
                <img
                  src="https://static.wikia.nocookie.net/herosiege/images/d/d9/Ranged_Mercenary.gif"
                  alt="Archer Mercenary"
                  className="h-24 w-auto"
                />
              </div>
              <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-2">Archer</h3>
              <div className="text-[13px] text-left bg-black/40 border border-black/60 rounded px-3 py-2 w-full">
                <span className="block">
                  <span className="text-yellow-400 font-semibold">Tipo:</span> Mercenário à Distância
                </span>
                <span className="block">
                  <span className="text-yellow-400 font-semibold">Encontrado em:</span> Ato 3 – Vila de Mos&apos;Arathim
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#151515] flex-1 min-w-[260px] max-w-xs rounded-lg shadow-xl border-t-4 border-[#8e44ad] border-b-2 border-b-[#8e44ad]">
            <div className="p-4 flex flex-col items-center">
              <div className="bg-black border border-gray-700 rounded-md p-2 mb-3">
                <img
                  src="https://static.wikia.nocookie.net/herosiege/images/b/be/Spell_Mercenary.gif"
                  alt="Magister Mercenary"
                  className="h-24 w-auto"
                />
              </div>
              <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-2">Magister</h3>
              <div className="text-[13px] text-left bg-black/40 border border-black/60 rounded px-3 py-2 w-full">
                <span className="block">
                  <span className="text-yellow-400 font-semibold">Tipo:</span> Mercenário Mago
                </span>
                <span className="block">
                  <span className="text-yellow-400 font-semibold">Encontrado em:</span> Ato 6 – Dawn&apos;s Chapel
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs md:text-sm italic border-t border-white/5 pt-4 mb-8">
          O jogador pode ter apenas um tipo de mercenário ativo por vez.
        </p>
        <div className="mt-6">
          <div className="flex flex-wrap justify-center gap-2 border-b border-white/10 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab('knight')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-t-md border border-b-0 ${
                activeTab === 'knight'
                  ? 'bg-[#151515] text-[#c0392b] border-[#c0392b]'
                  : 'bg-[#060606] text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <img
                src="https://static.wikia.nocookie.net/herosiege/images/2/26/Warriors_might.png"
                alt="Knight"
                className="w-6 h-6"
              />
              Knight
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('archer')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-t-md border border-b-0 ${
                activeTab === 'archer'
                  ? 'bg-[#151515] text-[#27ae60] border-[#27ae60]'
                  : 'bg-[#060606] text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <img
                src="https://static.wikia.nocookie.net/herosiege/images/4/48/Trigger_power.png"
                alt="Archer"
                className="w-6 h-6"
              />
              Archer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('magister')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-t-md border border-b-0 ${
                activeTab === 'magister'
                  ? 'bg-[#151515] text-[#8e44ad] border-[#8e44ad]'
                  : 'bg-[#060606] text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <img
                src="https://static.wikia.nocookie.net/herosiege/images/4/45/Elemental_intellect.png"
                alt="Magister"
                className="w-6 h-6"
              />
              Magister
            </button>
          </div>
          {activeTab === 'knight' && renderSkillsTable(knightSkills, 'Físico')}
          {activeTab === 'archer' && renderSkillsTable(archerSkills, 'Físico')}
          {activeTab === 'magister' && renderSkillsTable(magisterSkills, 'Mágico')}
        </div>
      </div>
    </div>
  );
};

export default MercenariosPage;
