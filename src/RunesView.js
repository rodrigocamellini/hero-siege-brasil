import React, { useMemo, useState } from 'react';

const runesData = [
  { name: 'Old', tier: 'D', lvl: 11, stats: '+25% Enhanced Damage' },
  { name: 'Ol', tier: 'D', lvl: 11, stats: '+50 to Attack Rating' },
  { name: 'Tor', tier: 'D', lvl: 13, stats: '+2 Mana After each Kill' },
  { name: 'Naf', tier: 'D', lvl: 13, stats: '+15% Defense vs Missiles' },
  { name: 'Uth', tier: 'D', lvl: 15, stats: '+15% of Damage Taken goes to Mana' },
  { name: 'Eth', tier: 'D', lvl: 15, stats: '+5% of target Defense ignored' },
  { name: 'Tul', tier: 'D', lvl: 17, stats: 'Poison Skill Damage +5%' },
  { name: 'Rex', tier: 'C', lvl: 19, stats: 'Fire Skill Damage +5%' },
  { name: 'Ert', tier: 'C', lvl: 21, stats: 'Lightning Skill Damage +5%' },
  { name: 'Thal', tier: 'C', lvl: 23, stats: 'Cold Skill Damage +5%' },
  { name: 'Ymn', tier: 'C', lvl: 25, stats: '+7% Life stolen per Hit' },
  { name: 'Nut', tier: 'C', lvl: 29, stats: '+4% Increased Attack Speed' },
  { name: 'Del', tier: 'C', lvl: 31, stats: 'Arcane Skill Damage +5%' },
  { name: 'Hel', tier: 'C', lvl: 33, stats: 'Cooldown Recovery +4%' },
  { name: 'Io', tier: 'C', lvl: 35, stats: '+10 Vitality' },
  { name: 'Lum', tier: 'C', lvl: 37, stats: '+10 Energy' },
  { name: 'Co', tier: 'C', lvl: 39, stats: '+10 Dexterity' },
  { name: 'Fel', tier: 'C', lvl: 41, stats: '+10 Strength' },
  { name: 'Lem', tier: 'A', lvl: 43, stats: '+5% Extra Gold Dropped' },
  { name: 'Pul', tier: 'A', lvl: 45, stats: 'Mana Costs decreased by 3%' },
  { name: 'Um', tier: 'A', lvl: 47, stats: '+8% to All Resistances' },
  { name: 'Mal', tier: 'A', lvl: 49, stats: 'Magic Damage Taken Reduced by 4%' },
  { name: 'Ist', tier: 'A', lvl: 51, stats: '+15% Increased Magic Find' },
  { name: 'Gul', tier: 'A', lvl: 53, stats: '+15% Increased Attack Rating' },
  { name: 'Vex', tier: 'A', lvl: 55, stats: '+7% Mana stolen per Hit' },
  { name: 'Qi', tier: 'S', lvl: 57, stats: 'Attack Damage increased by 20%' },
  { name: 'Xo', tier: 'S', lvl: 59, stats: '+25% Chance for a Deadly Blow' },
  { name: 'Sur', tier: 'S', lvl: 61, stats: 'Mana Increased by 10%' },
  { name: 'Ber', tier: 'S', lvl: 63, stats: '+8% Chance for a Crushing Blow' },
  { name: 'Jah', tier: 'S', lvl: 65, stats: 'Life Increased by 10%' },
  { name: 'Drax', tier: 'S', lvl: 67, stats: 'Cannot be Frozen' },
  { name: 'Zed', tier: 'S', lvl: 69, stats: 'Magic Skill Damage +13%' },
  { name: 'Fawn', tier: 'ANG', lvl: 100, stats: 'All Damage Taken Reduced by 3%' },
  { name: 'Flo', tier: 'ANG', lvl: 100, stats: '+2% to Maximum All Resists' },
  { name: 'Nju', tier: 'ANG', lvl: 100, stats: '-3% to All Enemy Resistances' },
  { name: 'Jol', tier: 'ANG', lvl: 100, stats: '+1 to Projectile Speed' }
];

const normalizeImageUrl = (name) => {
  if (!name) return 'https://via.placeholder.com/32?text=R';
  const safe = String(name).trim();
  return `https://herosiege.wiki.gg/images/Rune_${safe}.png`;
};

const tierClass = (tier) => {
  const t = (tier || '').toUpperCase();
  if (t === 'D') return 'bg-gray-600 text-white';
  if (t === 'C') return 'bg-blue-700 text-white';
  if (t === 'A') return 'bg-red-700 text-white';
  if (t === 'S') return 'bg-purple-700 text-white';
  if (t === 'ANG') return 'bg-yellow-300 text-black shadow-[0_0_8px_rgba(250,204,21,0.8)]';
  return 'bg-gray-700 text-white';
};

const RunesView = () => {
  const [search, setSearch] = useState('');

  const filteredRunes = useMemo(() => {
    const q = search.trim().toUpperCase();
    if (!q) return runesData;
    return runesData.filter((r) => {
      const text = `${r.name} ${r.tier}${r.lvl} ${r.stats}`.toUpperCase();
      return text.includes(q);
    });
  }, [search]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-end justify-between mb-4 border-b border-white/10 pb-4">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
          Runas
        </h2>
        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
          {filteredRunes.length} runas
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Buscar por nome, tier ou efeito..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl bg-[#1c1c21] border border-white/10 text-white text-sm px-4 py-3 rounded-sm outline-none focus:border-amber-400"
        />
      </div>

      <div className="overflow-x-auto border border-white/10 bg-[#151518]">
        <table className="min-w-full divide-y divide-white/10">
          <thead>
            <tr className="bg-[#1c1c21]">
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-amber-400 border-b border-amber-400">
                Runa
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-amber-400 border-b border-amber-400">
                Tier/Lvl
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-amber-400 border-b border-amber-400">
                Efeito
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRunes.map((rune) => (
              <tr
                key={`${rune.name}-${rune.lvl}`}
                className="hover:bg-[#1a1a1f] border-b border-white/5"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={normalizeImageUrl(rune.name)}
                      alt={rune.name}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/32?text=R';
                      }}
                      className="w-7 h-7 object-contain"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <span className="text-white font-bold text-sm">{rune.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-1 rounded ${tierClass(
                      rune.tier
                    )}`}
                  >
                    {rune.tier}
                    {rune.lvl}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-amber-400 font-semibold text-sm">{rune.stats}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RunesView;

