import React, { useMemo, useState } from 'react';

export const PASSIVE_RELICS = [
  { name: 'Barbed Shield', stats: ['Dmg Returned'], l1: ['10%'], l5: ['60%'], l10: ['200%'] },
  { name: 'Bonsai Tree', stats: ['Vitality', 'Magic Find'], l1: ['+2', '2%'], l5: ['+10', '10%'], l10: ['+20', '20%'] },
  { name: 'Bracer of Life', stats: ['Replenish Life'], l1: ['5%'], l5: ['25%'], l10: ['50%'] },
  { name: 'Butterfly Knife', stats: ['Atk Speed', 'Crit Dmg'], l1: ['+2%', '+2%'], l5: ['+10%', '+10%'], l10: ['+20%', '+20%'] },
  { name: 'Cake', stats: ['Life Increased'], l1: ['2%'], l5: ['10%'], l10: ['20%'] },
  { name: 'Charmed Blood', stats: ['Life Stolen'], l1: ['1%'], l5: ['5%'], l10: ['10%'] },
  { name: 'Cheese Burger', stats: ['Replenish Life', 'Life'], l1: ['5%', '+25'], l5: ['25%', '+245'], l10: ['50%', '+580'] },
  { name: "Commander's Sword", stats: ['Move Speed', 'Atk Damage'], l1: ['-2%', '10%'], l5: ['-10%', '50%'], l10: ['-20%', '100%'] },
  { name: 'Cookies & Milk', img: 'https://herosiege.wiki.gg/images/Relics_Cookies_%26_Milk.png', stats: ['Replenish Life', 'Replenish Mana'], l1: ['3%', '3%'], l5: ['15%', '15%'], l10: ['30%', '30%'] },
  { name: 'Damned Buckler', stats: ['Armor', 'FHR'], l1: ['+5', '2%'], l5: ['+16', '10%'], l10: ['+32', '20%'] },
  { name: 'Dirge', stats: ['Atk Rating', 'Add Phys Dmg'], l1: ['+12', '+8'], l5: ['+110', '+128'], l10: ['+475', '+1896'] },
  { name: 'Doom Flute', stats: ['Strength', 'Dexterity'], l1: ['+4', '+4'], l5: ['+12', '+12'], l10: ['+22', '+22'] },
  { name: 'Fortune Card', stats: ['Extra Gold', 'Magic Find'], l1: ['3%', '3%'], l5: ['15%', '15%'], l10: ['30%', '30%'] },
  { name: 'Half Eaten Mochi', stats: ['Life After Kill', 'Mana After Kill'], l1: ['+3', '+3'], l5: ['+11', '+11'], l10: ['+21', '+21'] },
  { name: 'Hand of Midas', stats: ['Extra Gold'], l1: ['+4%'], l5: ['+20%'], l10: ['+40%'] },
  { name: 'Hand Scythe', stats: ['Atk Speed', 'Atk Rating'], l1: ['+3%', '+2%'], l5: ['+15%', '+10%'], l10: ['+30%', '+20%'] },
  { name: 'Hellscream Axe', stats: ['Add Phys Dmg', 'Add Fire Dmg'], l1: ['+8', '+8'], l5: ['+128', '+128'], l10: ['+1696', '+1696'] },
  { name: 'Horned Mask', stats: ['Dmg Returned', 'Phys Dmg Reduct'], l1: ['2%', '1%'], l5: ['10%', '5%'], l10: ['20%', '10%'] },
  { name: "Jefre's Subscription", img: 'https://herosiege.wiki.gg/images/Relics_Jefre%27s_Subscription.png', stats: ['Light Radius', 'Magic Find'], l1: ['+1', '3%'], l5: ['+5', '15%'], l10: ['+10', '30%'] },
  { name: "King's Crown", img: 'https://herosiege.wiki.gg/images/Relics_King%27s_Crown.png', stats: ['Extra Gold'], l1: ['3%'], l5: ['18%'], l10: ['35%'] },
  { name: 'Light Katana', stats: ['Atk Speed'], l1: ['+4%'], l5: ['+20%'], l10: ['+40%'] },
  { name: 'Lost Wand', stats: ['Cast Rate', 'Energy'], l1: ['+4%', '+5'], l5: ['+20%', '+25'], l10: ['+40%', '+50'] },
  { name: 'Magic Mushroom', stats: ['All Attributes'], l1: ['+3'], l5: ['+15'], l10: ['+30'] },
  { name: "Mayo's Old Sock", img: 'https://herosiege.wiki.gg/images/Relics_Mayo%27s_Old_Sock.png', stats: ['Vitality', 'Life'], l1: ['+2', '+10'], l5: ['+10', '+110'], l10: ['+20', '+600'] },
  { name: 'Monkey King Bar', stats: ['Move Speed', 'Atk Damage'], l1: ['3%', '2%'], l5: ['+15%', '10%'], l10: ['+30%', '20%'] },
  { name: 'Newt Tail', stats: ['Move Speed', 'Magic Find'], l1: ['3%', '2%'], l5: ['15%', '10%'], l10: ['30%', '20%'] },
  { name: 'Nunchucks', stats: ['Atk Speed', 'Crit Dmg'], l1: ['3%', '3%'], l5: ['15%', '15%'], l10: ['30%', '30%'] },
  { name: 'Odd Book of Spells', stats: ['Magic Skill Dmg'], l1: ['1%'], l5: ['5%'], l10: ['10%'] },
  { name: 'Razer Blade', stats: ['Crit Dmg'], l1: ['+5%'], l5: ['+25%'], l10: ['+50%'] },
  { name: 'Rock Belt', stats: ['Move Speed', 'Strength'], l1: ['3%', '+3'], l5: ['15%', '+15'], l10: ['30%', '+30'] },
  { name: 'Sausage', stats: ['Life Inc.', 'Mana Inc.'], l1: ['1%', '1%'], l5: ['5%', '5%'], l10: ['10%', '10%'] },
  { name: 'Skull Axe', stats: ['Atk Rating', 'Strength'], l1: ['+10', '+4'], l5: ['+80', '+20'], l10: ['+250', '+40'] },
  { name: 'Spirit Skull', stats: ['Strength', 'Vitality'], l1: ['+3', '+3'], l5: ['+15', '+15'], l10: ['+30', '+30'] },
  { name: 'Steam Sale', stats: ['Merchant Prices Reduced'], l1: ['1%'], l5: ['5%'], l10: ['10%'] },
  { name: 'Stigmata', stats: ['Mana Costs', 'Replenish Mana'], l1: ['3%', '1%'], l5: ['15%', '5%'], l10: ['30%', '10%'] },
  { name: 'The Amputation Kit', stats: ['Move Speed'], l1: ['+5%'], l5: ['+25%'], l10: ['+50%'] },
  { name: 'The Holy Bible', stats: ['All Attributes', 'All Skills'], l1: ['+1', '+1'], l5: ['+5', '+2'], l10: ['+10', '---'] },
  { name: 'The Spoon', stats: ['Replenish Mana', 'Mana'], l1: ['3%', '+5'], l5: ['15%', '+25'], l10: ['30%', '+50'] },
  { name: 'Token of Luck', stats: ['Magic Find'], l1: ['2%'], l5: ['18%'], l10: ['50%'] },
  { name: 'Triforce', stats: ['All Stats', 'All Resistances'], l1: ['+3', '+3%'], l5: ['+15', '+15%'], l10: ['+30', '+30%'] },
  { name: 'Twin Blade', stats: ['Crit Chance', 'Crit Dmg'], l1: ['1%', '3%'], l5: ['5%', '15%'], l10: ['10%', '30%'] },
  { name: 'Whip', stats: ['Atk Speed', 'Add Phys Dmg'], l1: ['3%', '+5'], l5: ['15%', '+25'], l10: ['30%', '+50'] }
];

export const EXTRA_RELICS = [
  // Orbitais
  { name: 'Demon Sheep' },
  { name: 'F.E.T.U.S' },
  { name: 'Guardian Angel' },
  { name: 'Shredder' },
  { name: "Steve's Dirty Head" },
  { name: 'Templar Shield' },
  // Seguidores
  { name: 'Ancient Rock' },
  { name: 'Honey Bee' },
  { name: 'Karp Head' },
  { name: 'Minisect' },
  { name: 'Shrunken Head' },
  { name: 'Skullbat' },
  { name: 'The Allmighty Fedora' },
  { name: 'The Eye' },
  { name: 'War Zeppelin' },
  // Ao Morrer
  { name: 'Lottery Ticket' },
  // Ao Atacar / Ao Ser Atingido
  { name: "Assassin's Shuriken" },
  { name: 'Devil Skull' },
  { name: 'Razor Leaf' },
  { name: 'Witch Claw' },
  { name: 'Hungering Blade of Frost' },
  { name: "Odin's Sword" },
  { name: "Amazon's Spears" },
  { name: "Basilisk's Tooth" },
  { name: "Butcher's Knife" },
  { name: "Death's Scythe Relic" },
  { name: 'Fire & Ice', img: 'https://herosiege.wiki.gg/images/Relics_Fire_%26_Ice.png' },
  { name: 'Frozen Orb' },
  { name: 'Ogre Club' },
  { name: 'Razorwire' },
  { name: 'Rice & Chopsticks', img: 'https://herosiege.wiki.gg/images/Relics_Rice_%26_Chopsticks.png' },
  { name: 'Storm Dagger' },
  // Ao Castar
  { name: 'Cactus' },
  { name: "DaPlayer's Dislocated Head" },
  { name: 'Mana Dice' },
  { name: 'The Holy Grail' },
  { name: "Winner's Drug" },
  // Outros
  { name: 'Breath of Ice' },
  { name: 'Burst of Rage' },
  { name: 'Chilling Strike' },
  { name: 'Disarming Strike' },
  { name: 'Divine Scorch' },
  { name: 'Frostburn' },
  { name: 'Heavens Light' },
  { name: 'Hexing Strike' },
  { name: 'Lightning Strike' },
  { name: 'Lucky Numbers' },
  { name: 'Mana Recovery' },
  { name: 'Manastream' },
  { name: 'Meat Bomb' },
  { name: 'Poisonous Hit' },
  { name: 'Razor Leaves' },
  { name: 'Reaping' },
  { name: 'Rotting Carcas' },
  { name: 'Rupture' },
  { name: 'Shruken Strike' },
  { name: 'Spiky Plant' },
  { name: 'Stoned' },
];

export const normalizeRelicImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  return url.replace(/^http:/i, 'https:');
};

const passiveRelics = PASSIVE_RELICS.slice().sort((a, b) =>
  a.name.localeCompare(b.name)
);

const handleRelicError = (e, name) => {
  const target = e.target;
  const originalName = String(name || '');
  const safeName = originalName.replace(/ /g, '_').replace(/'/g, '%27');
  const noApostrophe = originalName.replace(/'/g, '').replace(/ /g, '_');
  const src = target.src;
  
  if (src.includes('Relics_') && !src.includes(noApostrophe)) {
     target.src = `https://herosiege.wiki.gg/images/Relic_${safeName}.png`;
  } else if (src.includes('Relic_') && !src.includes(noApostrophe)) {
     target.src = `https://herosiege.wiki.gg/images/${safeName}.png`;
  } else if (!src.includes(noApostrophe) && originalName.includes("'")) {
     target.src = `https://herosiege.wiki.gg/images/Relics_${noApostrophe}.png`;
  } else {
     target.style.display = 'none';
  }
};

const RelicsView = () => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return passiveRelics;
    return passiveRelics.filter((r) => {
      const base = (r.name || '').toLowerCase();
      const stats = (r.stats || []).join(' ').toLowerCase();
      return base.includes(q) || stats.includes(q);
    });
  }, [search]);

  const valueClass = (v) => {
    if (!v) return 'text-gray-300';
    const t = String(v).trim();
    if (t === '---') return 'text-gray-400';
    if (t.startsWith('-')) return 'text-red-400';
    return 'text-green-400';
  };

  const renderLevelCells = (rel, key) => {
    const names = rel.stats || [];
    const vals = rel[key] || [];
    return names.map((label, idx) => {
      const val = vals[idx] || '---';
      return (
        <div key={`${rel.name}-${key}-${idx}`} className="text-xs">
          <span className="text-[10px] text-gray-400 mr-1">{label}:</span>
          <span className={valueClass(val)}>{val}</span>
        </div>
      );
    });
  };

  const imgFor = (rel) => {
    if (rel.img) return normalizeRelicImageUrl(rel.img);
    const safeName = String(rel.name || '')
      .replace(/ /g, '_')
      .replace(/'/g, '%27');
    return `https://herosiege.wiki.gg/images/Relics_${safeName}.png`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-xs uppercase tracking-widest text-gray-400">
          Relíquias Passivas · {filtered.length} itens
        </div>
        <div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar relíquia..."
            className="w-full md:w-80 bg-[#1c1c21] border border-white/10 px-3 py-2 text-sm text-white rounded focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>
      <div className="overflow-x-auto border border-white/10 bg-[#151923] rounded">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#1c1c21] border-b border-white/10">
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">
                Relíquia
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">
                Level 1
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">
                Level 5
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">
                Level 10
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx) => (
              <tr
                key={r.name}
                className={`border-t border-black/40 ${
                  idx % 2 === 0 ? 'bg-black/40' : 'bg-black/20'
                } hover:bg-black/60`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={imgFor(r)}
                      alt={r.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => handleRelicError(e, r.name)}
                    />
                    <span className="text-sm font-bold text-white">{r.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  {renderLevelCells(r, 'l1')}
                </td>
                <td className="px-4 py-3 align-top">
                  {renderLevelCells(r, 'l5')}
                </td>
                <td className="px-4 py-3 align-top">
                  {renderLevelCells(r, 'l10')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-4 py-3 text-xs text-gray-400">
            Nenhuma relíquia encontrada para esse termo.
          </div>
        )}
      </div>
      <div className="border border-white/10 bg-[#151923] rounded">
        <div className="px-4 py-3 bg-[#1c1c21] border-b border-white/10">
          <div className="text-[11px] font-bold uppercase tracking-widest text-yellow-300">
            Relíquias Orbitais
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="text-sm" style={{ minWidth: 800 }}>
            <thead>
              <tr className="bg-[#1c1c21] border-b border-white/10">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Ability Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 1</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 5</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 10</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Demon Sheep"
                        src="https://herosiege.wiki.gg/images/Relics_Demon_Sheep.png"
                        width="30"
                        height="26"
                        className="object-contain"
                      />
                    </div>
                    <div>Demon Sheep</div>
                  </div>
                </td>
                <td className="px-4 py-3">Demon Sheep</td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">33</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">6301</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">89087</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics F.E.T.U.S"
                        src="https://herosiege.wiki.gg/images/Relics_F.E.T.U.S.png"
                        width="19"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>F.E.T.U.S</div>
                  </div>
                </td>
                <td className="px-4 py-3">F.E.T.U.S</td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">33</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">6301</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">89087</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Guardian Angel"
                        src="https://herosiege.wiki.gg/images/Relics_Guardian_Angel.png"
                        width="30"
                        height="27"
                        className="object-contain"
                      />
                    </div>
                    <div>Guardian Angel</div>
                  </div>
                </td>
                <td className="px-4 py-3">Guardian Angel</td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">33</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">6301</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">89087</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Shredder"
                        src="https://herosiege.wiki.gg/images/Relics_Shredder.png"
                        width="30"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Shredder</div>
                  </div>
                </td>
                <td className="px-4 py-3">Shredder</td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">33</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">6301</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">89087</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Steve's Dirty Head"
                        src="https://herosiege.wiki.gg/images/Relics_Steve%27s_Dirty_Head.png"
                        width="30"
                        height="27"
                        className="object-contain"
                      />
                    </div>
                    <div>Steve's Dirty Head</div>
                  </div>
                </td>
                <td className="px-4 py-3">Steves Dirty Head</td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">33</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">6301</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">89087</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Templar Shield"
                        src="https://herosiege.wiki.gg/images/Relics_Templar_Shield.png"
                        width="23"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Templar Shield</div>
                  </div>
                </td>
                <td className="px-4 py-3">Templar Shield</td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">33</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">6301</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">89087</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="border border-white/10 bg-[#151923] rounded">
        <div className="px-4 py-3 bg-[#1c1c21] border-b border-white/10">
          <div className="text-[11px] font-bold uppercase tracking-widest text-yellow-300">
            Relíquias Seguidores
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="text-sm" style={{ minWidth: 800 }}>
            <thead>
              <tr className="bg-[#1c1c21] border-b border-white/10">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Ability Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 1</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 5</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 10</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Ancient Rock"
                        src="https://herosiege.wiki.gg/images/Relics_Ancient_Rock.png"
                        width="29"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Ancient Rock</div>
                  </div>
                </td>
                <td className="px-4 py-3">Ancient Rock</td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">33</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">6301</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">89087</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Honey Bee"
                        src="https://herosiege.wiki.gg/images/Relics_Honey_Bee.png"
                        width="30"
                        height="20"
                        className="object-contain"
                      />
                    </div>
                    <div>Honey Bee</div>
                  </div>
                </td>
                <td className="px-4 py-3">Honey Bee</td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">33</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">6301</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">89087</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Karp Head"
                        src="https://herosiege.wiki.gg/images/Relics_Karp_Head.png"
                        width="23"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Karp Head</div>
                  </div>
                </td>
                <td className="px-4 py-3">Karp Head</td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Cold Damage: </span>
                    <span className="text-green-400">33</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Cold Damage: </span>
                    <span className="text-green-400">6301</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Cold Damage: </span>
                    <span className="text-green-400">89087</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Minisect"
                        src="https://herosiege.wiki.gg/images/Relics_Minisect.png"
                        width="30"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Minisect</div>
                  </div>
                </td>
                <td className="px-4 py-3">Minisect</td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">33</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">6301</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">89087</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Shrunken Head"
                        src="https://herosiege.wiki.gg/images/Relics_Shrunken_Head.png"
                        width="13"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Shrunken Head</div>
                  </div>
                </td>
                <td className="px-4 py-3">Shrunken Head</td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Poison Damage: </span>
                    <span className="text-green-400">33</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Poison Damage: </span>
                    <span className="text-green-400">6301</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Poison Damage: </span>
                    <span className="text-green-400">89087</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Skullbat"
                        src="https://herosiege.wiki.gg/images/Relics_Skullbat.png"
                        width="30"
                        height="14"
                        className="object-contain"
                      />
                    </div>
                    <div>Skullbat</div>
                  </div>
                </td>
                <td className="px-4 py-3">Skull Bat</td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">33</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">6301</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">89087</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics The Allmighty Fedora"
                        src="https://herosiege.wiki.gg/images/Relics_The_Allmighty_Fedora.png"
                        width="30"
                        height="26"
                        className="object-contain"
                      />
                    </div>
                    <div>The Allmighty Fedora</div>
                  </div>
                </td>
                <td className="px-4 py-3">The Almighty Fedora</td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">33</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">6301</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">89087</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics The Eye"
                        src="https://herosiege.wiki.gg/images/Relics_The_Eye.png"
                        width="19"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>The Eye</div>
                  </div>
                </td>
                <td className="px-4 py-3">The Eye</td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">33</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">6301</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">89087</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics War Zeppelin"
                        src="https://herosiege.wiki.gg/images/Relics_War_Zeppelin.png"
                        width="30"
                        height="21"
                        className="object-contain"
                      />
                    </div>
                    <div>War Zeppelin</div>
                  </div>
                </td>
                <td className="px-4 py-3">War Zeppelin</td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">33</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">6301</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">89087</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="border border-white/10 bg-[#151923] rounded">
        <div className="px-4 py-3 bg-[#1c1c21] border-b border-white/10">
          <div className="text-[11px] font-bold uppercase tracking-widest text-yellow-300">
            Relíquias Após Cada Morte
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="text-sm" style={{ minWidth: 800 }}>
            <thead>
              <tr className="bg-[#1c1c21] border-b border-white/10">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Ability Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Ability Description</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Chance Level 1</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 1</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Chance Level 5</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 5</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Chance Level 10</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 10</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Lottery Ticket"
                        src="https://herosiege.wiki.gg/images/Relics_Lottery_Ticket.png"
                        width="24"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Lottery Ticket</div>
                  </div>
                </td>
                <td className="px-4 py-3">Lucky Numbers</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">2%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Gold Amount: </span>
                    <span className="text-green-400">2</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">2%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Gold Amount: </span>
                    <span className="text-green-400">10</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">2%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Gold Amount: </span>
                    <span className="text-green-400">20</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="border border-white/10 bg-[#151923] rounded">
        <div className="px-4 py-3 bg-[#1c1c21] border-b border-white/10">
          <div className="text-[11px] font-bold uppercase tracking-widest text-yellow-300">
            Relíquias com Chance ao Atacar
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="text-sm" style={{ minWidth: 800 }}>
            <thead>
              <tr className="bg-[#1c1c21] border-b border-white/10">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Ability Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Ability Description</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Chance Level 1</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 1</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Chance Level 5</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 5</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Chance Level 10</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 10</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Assassin's Shuriken"
                        src="https://herosiege.wiki.gg/images/Relics_Assassin%27s_Shuriken.png"
                        width="30"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Assassin's Shuriken</div>
                  </div>
                </td>
                <td className="px-4 py-3">Shruken Strike</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">135</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">5242</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">48000</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Devil Skull"
                        src="https://herosiege.wiki.gg/images/Relics_Devil_Skull.png"
                        width="30"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Devil Skull</div>
                  </div>
                </td>
                <td className="px-4 py-3">Burst of Rage</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Arcane Damage: </span>
                      <span className="text-green-400">138</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Projectiles: </span>
                      <span className="text-green-400">9</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Arcane Damage: </span>
                      <span className="text-green-400">5265</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Projectiles: </span>
                      <span className="text-green-400">23</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Arcane Damage: </span>
                      <span className="text-green-400">48072</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Projectiles: </span>
                      <span className="text-green-400">57</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Razor Leaf"
                        src="https://herosiege.wiki.gg/images/Relics_Razor_Leaf.png"
                        width="29"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Razor Leaf</div>
                  </div>
                </td>
                <td className="px-4 py-3">Razor Leaves</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">138</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">5265</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">48072</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Witch Claw"
                        src="https://herosiege.wiki.gg/images/Relics_Witch_Claw.png"
                        width="23"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Witch Claw</div>
                  </div>
                </td>
                <td className="px-4 py-3">Hexing Strike</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">3%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Hex Duration: </span>
                    <span className="text-green-400">2s</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">3%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Hex Duration: </span>
                    <span className="text-green-400">3s</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">3%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Hex Duration: </span>
                    <span className="text-green-400">4.25s</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Hungering Blade of Frost"
                        src="https://herosiege.wiki.gg/images/Relics_Hungering_Blade_of_Frost.png"
                        width="9"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Hungering Blade of Frost</div>
                  </div>
                </td>
                <td className="px-4 py-3">Breath of Ice</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }}>
                    Breathe glacial air Freezing and dealing Cold Damage to enemies.
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Cold Damage: </span>
                      <span className="text-green-400">14</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">1.20s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Cold Damage: </span>
                      <span className="text-green-400">398</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">4s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Cold Damage: </span>
                      <span className="text-green-400">3410</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">10.80s</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Odin's Sword"
                        src="https://herosiege.wiki.gg/images/Relics_Odin%27s_Sword.png"
                        width="15"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Odin's Sword</div>
                  </div>
                </td>
                <td className="px-4 py-3">Divine Scorch</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }}>
                    Perform a fiery attack setting enemies on fire.
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Fire Damage: </span>
                    <span className="text-green-400">51</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Fire Damage: </span>
                    <span className="text-green-400">623</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Fire Damage: </span>
                    <span className="text-green-400">2175</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Amazon's Spears"
                        src="https://herosiege.wiki.gg/images/Relics_Amazon%27s_Spears.png"
                        width="30"
                        height="12"
                        className="object-contain"
                      />
                    </div>
                    <div>Amazon's Spears</div>
                  </div>
                </td>
                <td className="px-4 py-3">Poisonous Hit</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Poison Damage: </span>
                    <span className="text-green-400">51</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Poison Damage: </span>
                    <span className="text-green-400">623</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Poison Damage: </span>
                    <span className="text-green-400">2175</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Basilisk's Tooth"
                        src="https://herosiege.wiki.gg/images/Relics_Basilisk%27s_Tooth.png"
                        width="12"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Basilisk's Tooth</div>
                  </div>
                </td>
                <td className="px-4 py-3">Stoned</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">1%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">10%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">3%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">10%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">6%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">10%</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Butcher's Knife"
                        src="https://herosiege.wiki.gg/images/Relics_Butcher%27s_Knife.png"
                        width="28"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Butcher's Knife</div>
                  </div>
                </td>
                <td className="px-4 py-3">Meat Bomb</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }}>
                    Throw a huge lump of Meat that explodes on impact dealing Arcane Damage and leaving corpses on the ground.
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">42</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">1274</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">11152</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Death's Scythe Relic"
                        src="https://herosiege.wiki.gg/images/Relics_Death%27s_Scythe_Relic.png"
                        width="30"
                        height="27"
                        className="object-contain"
                      />
                    </div>
                    <div>Death's Scythe Relic</div>
                  </div>
                </td>
                <td className="px-4 py-3">Reaping</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">138</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">5265</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">48072</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Fire & Ice"
                        src="https://herosiege.wiki.gg/images/Relics_Fire_%26_Ice.png"
                        width="30"
                        height="27"
                        className="object-contain"
                      />
                    </div>
                    <div>Fire &amp; Ice</div>
                  </div>
                </td>
                <td className="px-4 py-3">Frostburn</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">5%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Fire Damage: </span>
                      <span className="text-green-400">138</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">1.1s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">5%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Fire Damage: </span>
                      <span className="text-green-400">5265</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">2.5s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">5%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Fire Damage: </span>
                      <span className="text-green-400">48072</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">5.90s</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Frozen Orb"
                        src="https://herosiege.wiki.gg/images/Relics_Frozen_Orb.png"
                        width="28"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Frozen Orb</div>
                  </div>
                </td>
                <td className="px-4 py-3">Chilling Strike</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }}>
                    Perform a chilling AOE strike dealing extra damage and freezing enemies.
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Cold Damage: </span>
                      <span className="text-green-400">138</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">1.10s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Cold Damage: </span>
                      <span className="text-green-400">5265</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">2.5s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Cold Damage: </span>
                      <span className="text-green-400">48072</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">5.90s</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Hungering Blade of Frost"
                        src="https://herosiege.wiki.gg/images/Relics_Hungering_Blade_of_Frost.png"
                        width="9"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Hungering Blade of Frost</div>
                  </div>
                </td>
                <td className="px-4 py-3">Breath of Ice</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }}>
                    Breathe glacial air Freezing and dealing Cold Damage to enemies.
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Cold Damage: </span>
                      <span className="text-green-400">14</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">1.20s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Cold Damage: </span>
                      <span className="text-green-400">398</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">4s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Cold Damage: </span>
                      <span className="text-green-400">3410</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">10.80s</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Odin's Sword"
                        src="https://herosiege.wiki.gg/images/Relics_Odin%27s_Sword.png"
                        width="15"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Odin's Sword</div>
                  </div>
                </td>
                <td className="px-4 py-3">Divine Scorch</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }}>
                    Perform a fiery attack setting enemies on fire.
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Fire Damage: </span>
                    <span className="text-green-400">51</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Fire Damage: </span>
                    <span className="text-green-400">623</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Fire Damage: </span>
                    <span className="text-green-400">2175</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Ogre Club"
                        src="https://herosiege.wiki.gg/images/Relics_Ogre_Club.png"
                        width="25"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Ogre Club</div>
                  </div>
                </td>
                <td className="px-4 py-3">Me Smash!</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Attack Damage: </span>
                      <span className="text-green-400">20%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Stun Duration: </span>
                      <span className="text-green-400">1s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Attack Damage: </span>
                      <span className="text-green-400">100%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Stun Duration: </span>
                      <span className="text-green-400">2s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Attack Damage: </span>
                      <span className="text-green-400">200%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Stun Duration: </span>
                      <span className="text-green-400">3.25s</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Razorwire"
                        src="https://herosiege.wiki.gg/images/Relics_Razorwire.png"
                        width="30"
                        height="19"
                        className="object-contain"
                      />
                    </div>
                    <div>Razorwire</div>
                  </div>
                </td>
                <td className="px-4 py-3">Rupture</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Bleeding Damage: </span>
                      <span className="text-green-400">117.25%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Attack Rating: </span>
                      <span className="text-green-400">5%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Area of Effect: </span>
                      <span className="text-green-400">10%</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Bleeding Damage: </span>
                      <span className="text-green-400">276.25%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Attack Rating: </span>
                      <span className="text-green-400">25%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Area of Effect: </span>
                      <span className="text-green-400">20%</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Bleeding Damage: </span>
                      <span className="text-green-400">475%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Attack Rating: </span>
                      <span className="text-green-400">50%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Area of Effect: </span>
                      <span className="text-green-400">32.50%</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Rice & Chopsticks"
                        src="https://herosiege.wiki.gg/images/Relics_Rice_%26_Chopsticks.png"
                        width="24"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Rice &amp; Chopsticks</div>
                  </div>
                </td>
                <td className="px-4 py-3">Disarming Strike</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Disarm Duration: </span>
                    <span className="text-green-400">2.50s</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Disarm Duration: </span>
                    <span className="text-green-400">9.50s</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Disarm Duration: </span>
                    <span className="text-green-400">26.50s</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Storm Dagger"
                        src="https://herosiege.wiki.gg/images/Relics_Storm_Dagger.png"
                        width="30"
                        height="27"
                        className="object-contain"
                      />
                    </div>
                    <div>Storm Dagger</div>
                  </div>
                </td>
                <td className="px-4 py-3">Lightning Strike</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }}>
                    Perform a charged attack striking enemies with thunder bolts.
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Lightning Damage: </span>
                    <span className="text-green-400">138</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Lightning Damage: </span>
                    <span className="text-green-400">5265</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Lightning Damage: </span>
                    <span className="text-green-400">48072</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="border border-white/10 bg-[#151923] rounded">
        <div className="px-4 py-3 bg-[#1c1c21] border-b border-white/10">
          <div className="text-[11px] font-bold uppercase tracking-widest text-yellow-300">
            Relíquias com Chance ao Ser Atingido
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="text-sm" style={{ minWidth: 800 }}>
            <thead>
              <tr className="bg-[#1c1c21] border-b border-white/10">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Ability Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Ability Description</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Chance Level 1</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 1</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Chance Level 5</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 5</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Chance Level 10</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 10</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Amazon's Spears"
                        src="https://herosiege.wiki.gg/images/Relics_Amazon%27s_Spears.png"
                        width="30"
                        height="12"
                        className="object-contain"
                      />
                    </div>
                    <div>Amazon's Spears</div>
                  </div>
                </td>
                <td className="px-4 py-3">Poisonous Hit</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Poison Damage: </span>
                    <span className="text-green-400">51</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Poison Damage: </span>
                    <span className="text-green-400">623</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Poison Damage: </span>
                    <span className="text-green-400">2175</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Basilisk's Tooth"
                        src="https://herosiege.wiki.gg/images/Relics_Basilisk%27s_Tooth.png"
                        width="12"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Basilisk's Tooth</div>
                  </div>
                </td>
                <td className="px-4 py-3">Stoned</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">1%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">10%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">3%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">10%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">6%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">10%</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Butcher's Knife"
                        src="https://herosiege.wiki.gg/images/Relics_Butcher%27s_Knife.png"
                        width="28"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Butcher's Knife</div>
                  </div>
                </td>
                <td className="px-4 py-3">Meat Bomb</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }}>
                    Throw a huge lump of Meat that explodes on impact dealing Arcane Damage and leaving corpses on the ground.
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">42</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">1274</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">11152</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Death's Scythe Relic"
                        src="https://herosiege.wiki.gg/images/Relics_Death%27s_Scythe_Relic.png"
                        width="30"
                        height="27"
                        className="object-contain"
                      />
                    </div>
                    <div>Death's Scythe Relic</div>
                  </div>
                </td>
                <td className="px-4 py-3">Reaping</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">138</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">5265</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Arcane Damage: </span>
                    <span className="text-green-400">48072</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Fire & Ice"
                        src="https://herosiege.wiki.gg/images/Relics_Fire_%26_Ice.png"
                        width="30"
                        height="27"
                        className="object-contain"
                      />
                    </div>
                    <div>Fire &amp; Ice</div>
                  </div>
                </td>
                <td className="px-4 py-3">Frostburn</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">5%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Fire Damage: </span>
                      <span className="text-green-400">138</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">1.1s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">5%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Fire Damage: </span>
                      <span className="text-green-400">5265</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">2.5s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">5%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Fire Damage: </span>
                      <span className="text-green-400">48072</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">5.90s</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Frozen Orb"
                        src="https://herosiege.wiki.gg/images/Relics_Frozen_Orb.png"
                        width="28"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Frozen Orb</div>
                  </div>
                </td>
                <td className="px-4 py-3">Chilling Strike</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }}>
                    Perform a chilling AOE strike dealing extra damage and freezing enemies.
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Cold Damage: </span>
                      <span className="text-green-400">138</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">1.10s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Cold Damage: </span>
                      <span className="text-green-400">5265</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">2.5s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Cold Damage: </span>
                      <span className="text-green-400">48072</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">5.90s</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Hungering Blade of Frost"
                        src="https://herosiege.wiki.gg/images/Relics_Hungering_Blade_of_Frost.png"
                        width="9"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Hungering Blade of Frost</div>
                  </div>
                </td>
                <td className="px-4 py-3">Breath of Ice</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }}>
                    Breathe glacial air Freezing and dealing Cold Damage to enemies.
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Cold Damage: </span>
                      <span className="text-green-400">14</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">1.20s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Cold Damage: </span>
                      <span className="text-green-400">398</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">4s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Cold Damage: </span>
                      <span className="text-green-400">3410</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Freeze Duration: </span>
                      <span className="text-green-400">10.80s</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Odin's Sword"
                        src="https://herosiege.wiki.gg/images/Relics_Odin%27s_Sword.png"
                        width="15"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Odin's Sword</div>
                  </div>
                </td>
                <td className="px-4 py-3">Divine Scorch</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }}>
                    Perform a fiery attack setting enemies on fire.
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Fire Damage: </span>
                    <span className="text-green-400">51</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Fire Damage: </span>
                    <span className="text-green-400">623</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Fire Damage: </span>
                    <span className="text-green-400">2175</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Ogre Club"
                        src="https://herosiege.wiki.gg/images/Relics_Ogre_Club.png"
                        width="25"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Ogre Club</div>
                  </div>
                </td>
                <td className="px-4 py-3">Me Smash!</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Attack Damage: </span>
                      <span className="text-green-400">20%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Stun Duration: </span>
                      <span className="text-green-400">1s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Attack Damage: </span>
                      <span className="text-green-400">100%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Stun Duration: </span>
                      <span className="text-green-400">2s</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Attack Damage: </span>
                      <span className="text-green-400">200%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Stun Duration: </span>
                      <span className="text-green-400">3.25s</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Razorwire"
                        src="https://herosiege.wiki.gg/images/Relics_Razorwire.png"
                        width="30"
                        height="19"
                        className="object-contain"
                      />
                    </div>
                    <div>Razorwire</div>
                  </div>
                </td>
                <td className="px-4 py-3">Rupture</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Bleeding Damage: </span>
                      <span className="text-green-400">117.25%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Attack Rating: </span>
                      <span className="text-green-400">5%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Area of Effect: </span>
                      <span className="text-green-400">10%</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Bleeding Damage: </span>
                      <span className="text-green-400">276.25%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Attack Rating: </span>
                      <span className="text-green-400">25%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Area of Effect: </span>
                      <span className="text-green-400">20%</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Bleeding Damage: </span>
                      <span className="text-green-400">475%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Attack Rating: </span>
                      <span className="text-green-400">50%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Area of Effect: </span>
                      <span className="text-green-400">32.50%</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Rice & Chopsticks"
                        src="https://herosiege.wiki.gg/images/Relics_Rice_%26_Chopsticks.png"
                        width="24"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Rice &amp; Chopsticks</div>
                  </div>
                </td>
                <td className="px-4 py-3">Disarming Strike</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Disarm Duration: </span>
                    <span className="text-green-400">2.50s</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Disarm Duration: </span>
                    <span className="text-green-400">9.50s</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Disarm Duration: </span>
                    <span className="text-green-400">26.50s</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Storm Dagger"
                        src="https://herosiege.wiki.gg/images/Relics_Storm_Dagger.png"
                        width="30"
                        height="27"
                        className="object-contain"
                      />
                    </div>
                    <div>Storm Dagger</div>
                  </div>
                </td>
                <td className="px-4 py-3">Lightning Strike</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }}>
                    Perform a charged attack striking enemies with thunder bolts.
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Lightning Damage: </span>
                    <span className="text-green-400">138</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Lightning Damage: </span>
                    <span className="text-green-400">5265</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Lightning Damage: </span>
                    <span className="text-green-400">48072</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="border border-white/10 bg-[#151923] rounded">
        <div className="px-4 py-3 bg-[#1c1c21] border-b border-white/10">
          <div className="text-[11px] font-bold uppercase tracking-widest text-yellow-300">
            Relíquias com Chance ao Castar
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="text-sm" style={{ minWidth: 800 }}>
            <thead>
              <tr className="bg-[#1c1c21] border-b border-white/10">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Ability Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Ability Description</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Chance Level 1</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 1</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Chance Level 5</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 5</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Chance Level 10</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-yellow-300">Value Level 10</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Cactus"
                        src="https://herosiege.wiki.gg/images/Relics_Cactus.png"
                        width="14"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Cactus</div>
                  </div>
                </td>
                <td className="px-4 py-3">Spiky Plant</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">12%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Poison Damage: </span>
                    <span className="text-green-400">138</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">12%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Poison Damage: </span>
                    <span className="text-green-400">5265</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">12%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Poison Damage: </span>
                    <span className="text-green-400">48072</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics DaPlayer's Dislocated Head"
                        src="https://herosiege.wiki.gg/images/Relics_DaPlayer%27s_Dislocated_Head.png"
                        width="27"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>DaPlayer's Dislocated Head</div>
                  </div>
                </td>
                <td className="px-4 py-3">Rotting Carcas</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">12%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Fire Damage: </span>
                      <span className="text-green-400">70</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Projectiles: </span>
                      <span className="text-green-400">4</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">12%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Fire Damage: </span>
                      <span className="text-green-400">933</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Projectiles: </span>
                      <span className="text-green-400">18</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">12%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Fire Damage: </span>
                      <span className="text-green-400">5772</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Projectiles: </span>
                      <span className="text-green-400">52</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Mana Dice"
                        src="https://herosiege.wiki.gg/images/Relics_Mana_Dice.png"
                        width="25"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Mana Dice</div>
                  </div>
                </td>
                <td className="px-4 py-3">Mana Recovery</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">5%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Mana Replenish: </span>
                    <span className="text-green-400">5%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">5%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Mana Replenish: </span>
                    <span className="text-green-400">25%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">5%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <span className="text-gray-300">Mana Replenish: </span>
                    <span className="text-green-400">50%</span>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/40 hover:bg-black/60">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics The Holy Grail"
                        src="https://herosiege.wiki.gg/images/Relics_The_Holy_Grail.png"
                        width="21"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>The Holy Grail</div>
                  </div>
                </td>
                <td className="px-4 py-3">Heavens Light</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Healing: </span>
                      <span className="text-green-400">3%</span>
                    </div>
                    <div>
                      <span className="text-green-400">+1</span>
                      <span className="text-gray-300"> to All Attributes</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Healing: </span>
                      <span className="text-green-400">5%</span>
                    </div>
                    <div>
                      <span className="text-green-400">+5</span>
                      <span className="text-gray-300"> to All Attributes</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Healing: </span>
                      <span className="text-green-400">7.5%</span>
                    </div>
                    <div>
                      <span className="text-green-400">+10</span>
                      <span className="text-gray-300"> to All Attributes</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-black/40 bg-black/20 hover:bg-black/40">
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <img
                        alt="Relics Winner's Drug"
                        src="https://herosiege.wiki.gg/images/Relics_Winner%27s_Drug.png"
                        width="30"
                        height="30"
                        className="object-contain"
                      />
                    </div>
                    <div>Winner's Drug</div>
                  </div>
                </td>
                <td className="px-4 py-3">Manastream</td>
                <td className="px-4 py-3">
                  <div style={{ maxWidth: 400, wordWrap: 'break-word' }} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Arcane Damage: </span>
                      <span className="text-green-400">2%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Healing </span>
                      <span className="text-green-400">2%</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Arcane Damage: </span>
                      <span className="text-green-400">10%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Healing </span>
                      <span className="text-green-400">10%</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center text-green-400">8%</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-center">
                    <div>
                      <span className="text-gray-300">Arcane Damage: </span>
                      <span className="text-green-400">20%</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Healing </span>
                      <span className="text-green-400">20%</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RelicsView;
