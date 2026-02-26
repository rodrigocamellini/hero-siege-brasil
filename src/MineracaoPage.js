import React from 'react';

const nodes = [
  {
    name: 'Copper Vein',
    level: 0,
    difficulty: 'Normal',
    nodeImg: 'https://herosiege.wiki.gg/images/Nodes_Copper.png',
    ore: {
      name: 'Copper Ore',
      img: 'https://herosiege.wiki.gg/images/Material_Copper_Ore.png',
    },
    prospects: [
      {
        name: 'Liquate',
        img: 'https://herosiege.wiki.gg/images/Material_Liquate.png',
        chance: '25%',
      },
      {
        name: 'Copperstone',
        img: 'https://herosiege.wiki.gg/images/Material_Copperstone.png',
        chance: '15%',
      },
      {
        name: 'Snake Tooth',
        img: 'https://herosiege.wiki.gg/images/Material_Snake_Tooth.png',
        chance: '7%',
      },
      {
        name: 'Bloodstone',
        img: 'https://herosiege.wiki.gg/images/Material_Bloodstone.png',
        chance: '1%',
      },
    ],
  },
  {
    name: 'Iron Vein',
    level: 125,
    difficulty: 'Normal, Night',
    nodeImg: 'https://herosiege.wiki.gg/images/Nodes_Iron.png',
    ore: {
      name: 'Iron Ore',
      img: 'https://herosiege.wiki.gg/images/Material_Iron_Ore.png',
    },
    prospects: [
      {
        name: 'Shadow Stone',
        img: 'https://herosiege.wiki.gg/images/Material_Shadow_Stone.png',
        chance: '25%',
      },
      {
        name: 'Iron Opal',
        img: 'https://herosiege.wiki.gg/images/Material_Iron_Opal.png',
        chance: '15%',
      },
      {
        name: 'Lesser Impstone',
        img: 'https://herosiege.wiki.gg/images/Material_Lesser_Impstone.png',
        chance: '7%',
      },
      {
        name: 'Darkstone',
        img: 'https://herosiege.wiki.gg/images/Material_Darkstone.png',
        chance: '1%',
      },
    ],
  },
  {
    name: 'Gold Vein',
    level: 225,
    difficulty: 'All',
    nodeImg: 'https://herosiege.wiki.gg/images/Nodes_Gold.png',
    ore: {
      name: 'Gold Ore',
      img: 'https://herosiege.wiki.gg/images/Material_Gold_Ore.png',
    },
    prospects: [
      {
        name: 'Huge Spessarite',
        img: 'https://herosiege.wiki.gg/images/Material_Huge_Spessarite.png',
        chance: '25%',
      },
      {
        name: 'Greater Impstone',
        img: 'https://herosiege.wiki.gg/images/Material_Greater_Impstone.png',
        chance: '15%',
      },
      {
        name: 'Ocean Agate',
        img: 'https://herosiege.wiki.gg/images/Material_Ocean_Agate.png',
        chance: '7%',
      },
      {
        name: 'Twilight Citrine',
        img: 'https://herosiege.wiki.gg/images/Material_Twilight_Citrine.png',
        chance: '1%',
      },
    ],
  },
  {
    name: 'Ruby Vein',
    level: 500,
    difficulty: 'Night, Hell',
    nodeImg: 'https://herosiege.wiki.gg/images/Nodes_Ruby.png',
    ore: {
      name: 'Ruby Ore',
      img: 'https://herosiege.wiki.gg/images/Material_Ruby_Ore.png',
    },
    prospects: [
      {
        name: 'Ketamineral',
        img: 'https://herosiege.wiki.gg/images/Material_Ketamineral.png',
        chance: '25%',
      },
      {
        name: 'Demon Tooth',
        img: 'https://herosiege.wiki.gg/images/Material_Demon_Tooth.png',
        chance: '15%',
      },
      {
        name: 'Flaming Core',
        img: 'https://herosiege.wiki.gg/images/Material_Flaming_Core.png',
        chance: '7%',
      },
      {
        name: 'Cardinal Ruby',
        img: 'https://herosiege.wiki.gg/images/Material_Cardinal_Ruby.png',
        chance: '1%',
      },
    ],
  },
  {
    name: 'Jade Vein',
    level: 750,
    difficulty: 'Night, Hell',
    nodeImg: 'https://herosiege.wiki.gg/images/Nodes_Jade.png',
    ore: {
      name: 'Jade Ore',
      img: 'https://herosiege.wiki.gg/images/Material_Jade_Ore.png',
    },
    prospects: [
      {
        name: 'Hellstar',
        img: 'https://herosiege.wiki.gg/images/Material_Hellstar.png',
        chance: '25%',
      },
      {
        name: 'Inferno Stone',
        img: 'https://herosiege.wiki.gg/images/Materials_Inferno_Stone.png',
        chance: '15%',
      },
      {
        name: 'Satans Nail',
        img: 'https://herosiege.wiki.gg/images/Materials_Satans_Nail.png',
        chance: '7%',
      },
      {
        name: 'Jadenium Powder',
        img: 'https://herosiege.wiki.gg/images/Materials_Jadenium_Powder.png',
        chance: '1%',
      },
    ],
  },
  {
    name: 'Tarethium Vein',
    level: 1000,
    difficulty: 'Hell',
    nodeImg: 'https://herosiege.wiki.gg/images/Nodes_Tarethium.png',
    ore: {
      name: 'Tarethium Ore',
      img: 'https://herosiege.wiki.gg/images/Material_Tarethium_Ore.png',
    },
    prospects: [
      {
        name: 'Storm Opal',
        img: 'https://herosiege.wiki.gg/images/Materials_Storm_Opal.png',
        chance: '25%',
      },
      {
        name: 'Demon Soulstone',
        img: 'https://herosiege.wiki.gg/images/Material_Demon_Soulstone.png',
        chance: '15%',
      },
      {
        name: 'Dark Matter',
        img: 'https://herosiege.wiki.gg/images/Material_Dark_Matter.png',
        chance: '7%',
      },
      {
        name: 'Tarethium Core',
        img: 'https://herosiege.wiki.gg/images/Material_Tarethium_Core.png',
        chance: '1%',
      },
    ],
  },
];

const MineracaoPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-widest text-center mb-6 border-b border-white/10 pb-3">
          Mineração
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-[#1a1a1a] border border-[#333333] text-sm">
            <thead>
              <tr>
                <th className="bg-[#252525] text-left text-[#f1c40f] px-3 py-2 border border-[#444444]">
                  Mining Node
                </th>
                <th className="bg-[#252525] text-left text-[#f1c40f] px-3 py-2 border border-[#444444]">
                  LV
                </th>
                <th className="bg-[#252525] text-left text-[#f1c40f] px-3 py-2 border border-[#444444]">
                  Difficulty
                </th>
                <th className="bg-[#252525] text-left text-[#f1c40f] px-3 py-2 border border-[#444444]">
                  Ore Type
                </th>
                <th className="bg-[#252525] text-left text-[#f1c40f] px-3 py-2 border border-[#444444]">
                  Prospecting Results (Odds)
                </th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((node) => (
                <tr key={node.name}>
                  <td className="border border-[#2a2a2a] px-3 py-2 align-middle">
                    <div className="flex items-center gap-2 font-semibold text-gray-100">
                      <img onError={(e) => e.target.style.display = 'none'}
                        src={node.nodeImg}
                        alt={node.name}
                        className="w-9 h-9 object-contain"
                      />
                      <span>{node.name}</span>
                    </div>
                  </td>
                  <td className="border border-[#2a2a2a] px-3 py-2 align-middle">
                    {node.level}
                  </td>
                  <td className="border border-[#2a2a2a] px-3 py-2 align-middle">
                    {node.difficulty}
                  </td>
                  <td className="border border-[#2a2a2a] px-3 py-2 align-middle">
                    <div className="flex items-center gap-2 font-semibold text-gray-100">
                      <img onError={(e) => e.target.style.display = 'none'}
                        src={node.ore.img}
                        alt={node.ore.name}
                        className="w-6 h-6 object-contain"
                      />
                      <span>{node.ore.name}</span>
                    </div>
                  </td>
                  <td className="border border-[#2a2a2a] px-3 py-2 align-middle">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {node.prospects.map((p) => (
                        <div
                          key={p.name}
                          className="flex items-center justify-between gap-2 text-[12px] bg-[#222222] px-2 py-1 rounded border border-[#333333]"
                        >
                          <span className="flex items-center gap-2">
                            <img onError={(e) => e.target.style.display = 'none'}
                              src={p.img}
                              alt={p.name}
                              className="w-5 h-5 object-contain"
                            />
                            <span>{p.name}</span>
                          </span>
                          <span className="text-[#2ecc71] font-mono font-bold">
                            {p.chance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MineracaoPage;
