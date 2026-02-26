import React from 'react';

const ChavesPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-widest text-center mb-6 border-b border-white/10 pb-3">
          Chaves
        </h2>

        <style>
          {`
            .keys-wiki-wrapper {
              max-width: 1100px;
              margin: 0 auto;
            }
            .keys-wikitable {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 50px;
              background-color: #1a1a1a;
              border: 1px solid #333;
            }
            .keys-wikitable th {
              background-color: #252525;
              color: #fff;
              padding: 12px;
              border: 1px solid #444;
              text-align: left;
              text-transform: uppercase;
              font-size: 11px;
              letter-spacing: 1px;
            }
            .keys-wikitable td {
              border: 1px solid #2a2a2a;
              padding: 8px 12px;
              vertical-align: middle;
            }
            .keys-key-box {
              display: flex;
              align-items: center;
              gap: 15px;
              font-weight: bold;
              color: #f1c40f;
            }
            .keys-icon-container {
              width: 35px;
              height: 35px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              background: rgba(255, 255, 255, 0.03);
              border-radius: 4px;
            }
            .keys-icon-container img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
              filter: drop-shadow(0 0 2px #000);
            }
            .keys-zone-tag {
              color: #5dade2;
              font-weight: bold;
              text-align: center;
            }
            .keys-location-text {
              color: #888;
              font-size: 0.9em;
            }
            .keys-unique-title {
              color: #3498db;
            }
            .keys-chest-title {
              color: #ffffff;
            }
            .keys-unique-key {
              color: #3498db;
            }
            .keys-chest-key {
              color: #ffffff;
            }
          `}
        </style>

        <div className="keys-wiki-wrapper text-sm md:text-base">
          <h3 className="font-black text-yellow-400 text-lg md:text-xl mb-4">
            Challenge Dungeon Keys
          </h3>
          <table className="keys-wikitable">
            <thead>
              <tr>
                <th>Key Name</th>
                <th>Dungeon</th>
                <th>Location</th>
                <th style={{ textAlign: 'center' }}>Zone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Smelly_Cheese.png" alt="Smelly Cheese" />
                    </div>
                    Smelly Cheese
                  </div>
                </td>
                <td>Rat Den</td>
                <td className="keys-location-text">Outskirts of Inoya</td>
                <td className="keys-zone-tag">1-1</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Cellar_Key.png" alt="Cellar Key" />
                    </div>
                    Cellar Key
                  </div>
                </td>
                <td>Pumpkin Cellar</td>
                <td className="keys-location-text">The Pumpkin Patch</td>
                <td className="keys-zone-tag">1-3</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Tower_Key.png" alt="Tower Key" />
                    </div>
                    Tower Key
                  </div>
                </td>
                <td>Black Tower</td>
                <td className="keys-location-text">Woodhill Plains</td>
                <td className="keys-zone-tag">1-4</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Frosted_Key.png" alt="Frosted Key" />
                    </div>
                    Frosted Key
                  </div>
                </td>
                <td>Frozen Cellar</td>
                <td className="keys-location-text">Crystal Village</td>
                <td className="keys-zone-tag">2-1</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Ancient_Key.png" alt="Ancient Key" />
                    </div>
                    Ancient Key
                  </div>
                </td>
                <td>Ancient City</td>
                <td className="keys-location-text">The Glacial Trail</td>
                <td className="keys-zone-tag">2-5</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Shovel_Key.png" alt="Shovel Key" />
                    </div>
                    Shovel Key
                  </div>
                </td>
                <td>Sand Cave</td>
                <td className="keys-location-text">Dry Hills</td>
                <td className="keys-zone-tag">3-2</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Mystic_Key.png" alt="Mystic Key" />
                    </div>
                    Mystic Key
                  </div>
                </td>
                <td>Forgotten City</td>
                <td className="keys-location-text">Mos'Arathim Desert</td>
                <td className="keys-zone-tag">3-3</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Tomb_Key.png" alt="Tomb Key" />
                    </div>
                    Tomb Key
                  </div>
                </td>
                <td>Cauflax Tomb</td>
                <td className="keys-location-text">Pyramid Level 2</td>
                <td className="keys-zone-tag">3-5</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Copper_Key.png" alt="Copper Key" />
                    </div>
                    Copper Key
                  </div>
                </td>
                <td>Old Copper Mine</td>
                <td className="keys-location-text">Old Mining Village</td>
                <td className="keys-zone-tag">4-1</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Rusted_Key.png" alt="Rusted Key" />
                    </div>
                    Rusted Key
                  </div>
                </td>
                <td>Abandoned Mine</td>
                <td className="keys-location-text">The Highland Mines</td>
                <td className="keys-zone-tag">4-2</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Devils_Key.png" alt="Devil's Key" />
                    </div>
                    Devil's Key
                  </div>
                </td>
                <td>Devil's Hole</td>
                <td className="keys-location-text">The Devil's Breach</td>
                <td className="keys-zone-tag">4-5</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Pickaxe_Key.png" alt="Pickaxe Key" />
                    </div>
                    Pickaxe Key
                  </div>
                </td>
                <td>Fuji Crater</td>
                <td className="keys-location-text">Mt. Fuji</td>
                <td className="keys-zone-tag">5-1</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Garden_Key.png" alt="Garden Key" />
                    </div>
                    Garden Key
                  </div>
                </td>
                <td>Underground Garden</td>
                <td className="keys-location-text">Misty Swamp</td>
                <td className="keys-zone-tag">5-2</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Battle_Key.png" alt="Battle Key" />
                    </div>
                    Battle Key
                  </div>
                </td>
                <td>Kaojin Temple</td>
                <td className="keys-location-text">Fuji Coast</td>
                <td className="keys-zone-tag">5-3</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Golden_Key.png" alt="Golden Key" />
                    </div>
                    Golden Key
                  </div>
                </td>
                <td>Temple Trapdoor</td>
                <td className="keys-location-text">Temple of Zamjo</td>
                <td className="keys-zone-tag">5-5</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Axe_Key.png" alt="Axe Key" />
                    </div>
                    Axe Key
                  </div>
                </td>
                <td>Unmarked Grave</td>
                <td className="keys-location-text">Highland Graveyard</td>
                <td className="keys-zone-tag">6-1</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Storage_Key.png" alt="Storage Key" />
                    </div>
                    Storage Key
                  </div>
                </td>
                <td>Arms Storage</td>
                <td className="keys-location-text">Steam Train</td>
                <td className="keys-zone-tag">6-4</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Warp_Key.png" alt="Warp Key" />
                    </div>
                    Warp Key
                  </div>
                </td>
                <td>Distorted Horizon</td>
                <td className="keys-location-text">Event Horizon</td>
                <td className="keys-zone-tag">7-2</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Valor_Key.png" alt="Valor Key" />
                    </div>
                    Valor Key
                  </div>
                </td>
                <td>Gladsheim Halls</td>
                <td className="keys-location-text">Forest of the Slain</td>
                <td className="keys-zone-tag">8-1</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Naga_Scale_Key.png" alt="Naga Scale Key" />
                    </div>
                    Naga Scale Key
                  </div>
                </td>
                <td>Naga Temple</td>
                <td className="keys-location-text">Flooded Plains</td>
                <td className="keys-zone-tag">8-2</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Magma_Key.png" alt="Magma Key" />
                    </div>
                    Magma Key
                  </div>
                </td>
                <td>Muspelheim</td>
                <td className="keys-location-text">Forgotten Caves</td>
                <td className="keys-zone-tag">8-3</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Helflame_Torch.png" alt="Helflame Torch" />
                    </div>
                    Helflame Torch
                  </div>
                </td>
                <td>Niflhel</td>
                <td className="keys-location-text">Helheim</td>
                <td className="keys-zone-tag">8-5</td>
              </tr>
            </tbody>
          </table>

          <h3 className="keys-unique-title font-black text-blue-400 text-lg md:text-xl mb-4">
            Unique Zone Keys
          </h3>
          <table className="keys-wikitable">
            <thead>
              <tr>
                <th>Key Name</th>
                <th>Unique Zone</th>
                <th>Location</th>
                <th style={{ textAlign: 'center' }}>Zone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="keys-key-box keys-unique-key">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Angelic_Key.png" alt="Angelic Key" />
                    </div>
                    Angelic Key
                  </div>
                </td>
                <td>Angelic Realm</td>
                <td className="keys-location-text">Dawn&apos;s Chapel</td>
                <td className="keys-zone-tag">6-1</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box keys-unique-key">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Ruby_Key.png" alt="Ruby Key" />
                    </div>
                    Ruby Key
                  </div>
                </td>
                <td>Ruby Garden</td>
                <td className="keys-location-text">Dawn&apos;s Chapel</td>
                <td className="keys-zone-tag">6-1</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box keys-unique-key">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Bifr%C3%B6st_Key.png" alt="Bifröst Key" />
                    </div>
                    Bifröst Key
                  </div>
                </td>
                <td>Bifröst</td>
                <td className="keys-location-text">Astral Encampment</td>
                <td className="keys-zone-tag">7-1</td>
              </tr>
            </tbody>
          </table>

          <h3 className="keys-chest-title font-black text-white text-lg md:text-xl mb-4">
            Chest Keys
          </h3>
          <table className="keys-wikitable" style={{ maxWidth: 600 }}>
            <thead>
              <tr>
                <th>Key Name</th>
                <th>Chest Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="keys-key-box keys-chest-key">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Key.png" alt="Common Key" />
                    </div>
                    Common Key
                  </div>
                </td>
                <td>Golden Chest</td>
              </tr>
              <tr>
                <td>
                  <div className="keys-key-box keys-chest-key">
                    <div className="keys-icon-container">
                      <img onError={(e) => e.target.style.display = 'none'} src="https://herosiege.wiki.gg/images/Keys_Crystal_Key.png" alt="Crystal Key" />
                    </div>
                    Crystal Key
                  </div>
                </td>
                <td>Crystal Chest</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChavesPage;

