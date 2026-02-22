import React from 'react';

const ChaosTowerPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8 items-start">
          <div>
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">
              Chaos <span className="text-red-600">Tower</span>
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
              <span className="font-semibold">Chaos Tower</span> é uma Dungeon de Evento em Hero Siege. Ela foi adicionada com o patch da Season 11 em 28 de outubro de 2020.
            </p>

            <section className="mb-8">
              <h3 className="text-xl font-black text-yellow-400 uppercase tracking-widest mb-3 border-l-4 border-red-600 pl-4">
                Como Acessar
              </h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-3">
                As Chaos Towers podem ser encontradas vagando em qualquer ato em <span className="font-semibold text-white">Tarethiel</span>. Ao se aproximar, ela se senta, permitindo que você entre.
              </p>
              <ul className="list-disc list-inside text-gray-300 text-sm md:text-base space-y-1">
                <li>
                  Cada mapa tem <span className="font-semibold text-white">10% de chance</span> de gerar uma Chaos Tower.
                </li>
                <li>
                  Cada mapa totalmente limpo aumenta a chance de geração em <span className="font-semibold text-white">1%</span> até que o lobby seja resetado.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-black text-yellow-400 uppercase tracking-widest mb-3 border-l-4 border-red-600 pl-4">
                Mecânicas
              </h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-3">
                Acesse a torre falando com o <span className="font-semibold text-white">Tower Master</span> e suba as escadas. Enfrente as ondas de monstros e avance até o topo da torre.
              </p>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
                No total existem <span className="font-semibold text-white">10 andares</span>, onde 8 contêm ondas de monstros e 2 contêm mini-chefes. Após completar todos os andares, você será enviado de volta para a cidade de Inoya. Cada andar aumenta o nível dos monstros em 2, aumentando a dificuldade. Qualquer morte dentro da torre faz você perder todo o progresso.
              </p>
              <div className="bg-red-600/10 border-l-4 border-red-600 px-4 py-3 rounded-r mb-3 text-sm md:text-base text-gray-200">
                <span className="font-semibold">Coliseu do King Rakhul:</span> Após completar 10 torres completas, ao entrar na sua 11ª torre você será levado ao coliseu do <span className="font-semibold">King Rakhul</span>. Ative as plataformas de pressão em cada lado da entrada e entre na sala do chefe. Derrote-o para ter chance de receber itens exclusivos da sua tabela de drops.
              </div>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                Observação: na dificuldade <span className="font-semibold text-white">Nightmare</span> há um total de 5 andares e você não enfrentará o King Rakhul. A Chaos Tower <span className="font-semibold text-white">não é afetada</span> pelo seletor de dificuldade.
              </p>
            </section>
          </div>

          <aside className="w-full lg:w-80 justify-self-center lg:justify-self-end">
            <div className="bg-[#1a1a1a] border border-red-600 rounded shadow-xl overflow-hidden">
              <div className="bg-red-600 text-white text-center text-sm font-bold uppercase tracking-widest py-2">
                Chaos Tower
              </div>
              <div className="p-2">
                <div className="relative w-full overflow-hidden rounded">
                  <img
                    src="https://static.wikia.nocookie.net/herosiege/images/2/2c/Ct1.gif"
                    alt="Chaos Tower Gameplay"
                    className="w-full h-auto block"
                  />
                </div>
                <p className="text-[11px] text-center text-gray-400 mt-2">Gameplay da Chaos Tower</p>
              </div>
            </div>
          </aside>
        </div>

        <section className="mb-8">
          <h3 className="text-xl font-black text-yellow-400 uppercase tracking-widest mb-3 border-l-4 border-red-600 pl-4">
            Recompensas do Baú da Chaos Tower
          </h3>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-3">
            <span className="font-semibold">Garantido:</span> 5000 Rubies e 6000 Gold por torre concluída.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm border border-gray-700 bg-[#151515]">
              <thead>
                <tr className="bg-black/60">
                  <th className="px-3 py-2 border border-gray-700 text-left text-yellow-400">Marco (Abates de Rakhul / Torres)</th>
                  <th className="px-3 py-2 border border-gray-700 text-left text-yellow-400">Runas</th>
                  <th className="px-3 py-2 border border-gray-700 text-left text-yellow-400">Itens</th>
                  <th className="px-3 py-2 border border-gray-700 text-left text-yellow-400">Chaves / Drops Especiais</th>
                </tr>
              </thead>
              <tbody>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">0 abates (≤10 torres)</td>
                  <td className="px-3 py-2 border border-gray-800">1x Runa Normal</td>
                  <td className="px-3 py-2 border border-gray-800">1x Item B-Tier OU 1x Item A-Tier</td>
                  <td className="px-3 py-2 border border-gray-800">Nenhum</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">1 abate (11–20 torres)</td>
                  <td className="px-3 py-2 border border-gray-800">2x Runas Normais</td>
                  <td className="px-3 py-2 border border-gray-800">
                    B/A-Tier + <span className="font-semibold text-cyan-300">10% chance de CT Heroic</span>
                  </td>
                  <td className="px-3 py-2 border border-gray-800">1x Dungeon Key</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">2 abates (21–30 torres)</td>
                  <td className="px-3 py-2 border border-gray-800">1x Runa Nightmare</td>
                  <td className="px-3 py-2 border border-gray-800">
                    B/A-Tier + <span className="font-semibold text-cyan-300">15% chance de CT Heroic</span>
                  </td>
                  <td className="px-3 py-2 border border-gray-800">2x Dungeon Key</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">3 abates (31–40 torres)</td>
                  <td className="px-3 py-2 border border-gray-800">2x Runas Nightmare</td>
                  <td className="px-3 py-2 border border-gray-800">
                    B/A-Tier + <span className="font-semibold text-cyan-300">20% chance de CT Heroic</span>
                  </td>
                  <td className="px-3 py-2 border border-gray-800">2x Dungeon Key</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">4 abates (41–50 torres)</td>
                  <td className="px-3 py-2 border border-gray-800">2x Runas Nightmare OU 1x Runa Hell</td>
                  <td className="px-3 py-2 border border-gray-800">
                    B/A-Tier + <span className="font-semibold text-cyan-300">25% chance de CT Heroic</span>
                  </td>
                  <td className="px-3 py-2 border border-gray-800">3x Dungeon Key</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">5 abates (51–60 torres)</td>
                  <td className="px-3 py-2 border border-gray-800">3x Runas Nightmare OU 2x Runas Hell</td>
                  <td className="px-3 py-2 border border-gray-800">
                    1x B/A-Tier OU <span className="font-semibold text-fuchsia-300">1x S-Tier</span> + 30% chance Heroic
                  </td>
                  <td className="px-3 py-2 border border-gray-800">3x Key OU 3x Dim. Shard</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">6 abates (61–70 torres)</td>
                  <td className="px-3 py-2 border border-gray-800">2x Runas Hell</td>
                  <td className="px-3 py-2 border border-gray-800">
                    1x B/A-Tier OU <span className="font-semibold text-fuchsia-300">1x S-Tier</span> + 35% chance Heroic
                  </td>
                  <td className="px-3 py-2 border border-gray-800">4x Key / 5x Shard / 1x Cloud</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">7 abates (71–80 torres)</td>
                  <td className="px-3 py-2 border border-gray-800">3x Runas Hell OU 1x Runa High</td>
                  <td className="px-3 py-2 border border-gray-800">
                    1x A-Tier OU <span className="font-semibold text-fuchsia-300">1x S-Tier</span> + 40% chance Heroic
                  </td>
                  <td className="px-3 py-2 border border-gray-800">5x Key / 8x Shard / 2x Cloud</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">8 abates (81–90 torres)</td>
                  <td className="px-3 py-2 border border-gray-800">4x Runas Hell OU 2x Runas High</td>
                  <td className="px-3 py-2 border border-gray-800">
                    1x A-Tier OU <span className="font-semibold text-fuchsia-300">1x S-Tier</span> + 45% chance Heroic
                  </td>
                  <td className="px-3 py-2 border border-gray-800">5x Key / 10x Shard / 2x Cloud / 1x Ruby</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">9 abates (91–100 torres)</td>
                  <td className="px-3 py-2 border border-gray-800">2x Runas High</td>
                  <td className="px-3 py-2 border border-gray-800">S-Tier / Boss Set / Uber Item + 50% chance Heroic</td>
                  <td className="px-3 py-2 border border-gray-800">Ruby / Angelic / 10x Shard / 3x Cloud</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">10 abates (101+ torres)</td>
                  <td className="px-3 py-2 border border-gray-800">3x Runas High</td>
                  <td className="px-3 py-2 border border-gray-800">
                    Boss Set / Uber / <span className="font-semibold text-yellow-300">CHASE ITEM</span> + 55% chance Heroic
                  </td>
                  <td className="px-3 py-2 border border-gray-800">7x Key / 15x Shard / Ruby / Angelic</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-black text-yellow-400 uppercase tracking-widest mb-3 border-l-4 border-red-600 pl-4">
            Escalonamento da Chaos Tower
          </h3>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-3">
            Cada andar concluído aumenta o nível dos monstros. <span className="font-semibold text-white">King Rakhul</span> estará <span className="font-semibold text-white">+75 níveis</span> acima desses valores.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-[260px] max-w-md text-xs md:text-sm border border-gray-700 bg-[#151515]">
              <thead>
                <tr className="bg-black/60">
                  <th className="px-3 py-2 border border-gray-700 text-left text-yellow-400">Torres Completadas</th>
                  <th className="px-3 py-2 border border-gray-700 text-left text-yellow-400">Nível dos Monstros</th>
                </tr>
              </thead>
              <tbody>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">1</td>
                  <td className="px-3 py-2 border border-gray-800 text-red-400 font-semibold text-center">215</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">5</td>
                  <td className="px-3 py-2 border border-gray-800 text-red-400 font-semibold text-center">1053</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">10</td>
                  <td className="px-3 py-2 border border-gray-800 text-red-400 font-semibold text-center">2088</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">20</td>
                  <td className="px-3 py-2 border border-gray-800 text-red-400 font-semibold text-center">880</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">30</td>
                  <td className="px-3 py-2 border border-gray-800 text-red-400 font-semibold text-center">1230</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">40</td>
                  <td className="px-3 py-2 border border-gray-800 text-red-400 font-semibold text-center">1580</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">50</td>
                  <td className="px-3 py-2 border border-gray-800 text-red-400 font-semibold text-center">1930</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">60</td>
                  <td className="px-3 py-2 border border-gray-800 text-red-400 font-semibold text-center">2280</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">70</td>
                  <td className="px-3 py-2 border border-gray-800 text-red-400 font-semibold text-center">2630</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">80</td>
                  <td className="px-3 py-2 border border-gray-800 text-red-400 font-semibold text-center">2980</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">90</td>
                  <td className="px-3 py-2 border border-gray-800 text-red-400 font-semibold text-center">3330</td>
                </tr>
                <tr className="odd:bg-[#1a1a1a]">
                  <td className="px-3 py-2 border border-gray-800">100</td>
                  <td className="px-3 py-2 border border-gray-800 text-red-400 font-semibold text-center">3680</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChaosTowerPage;
