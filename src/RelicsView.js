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

export const normalizeRelicImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  return url.replace(/^http:/i, 'https:');
};

const passiveRelics = PASSIVE_RELICS.slice().sort((a, b) =>
  a.name.localeCompare(b.name)
);

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
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/32?text=?';
                      }}
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
    </div>
  );
};

export default RelicsView;
