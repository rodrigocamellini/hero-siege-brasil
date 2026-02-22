import React from 'react';

const GemasJoiasPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-widest text-center mb-6 border-b border-white/10 pb-3">
          Gemas e Jóias
        </h2>

        <style>
          {`
     /* PADRONIZAÇÃO DO FUNDO E SEÇÕES */ 
     .wiki-container { 
         background-color: #0a0a0a; 
         color: white; 
         font-family: sans-serif; 
         padding: 20px; 
     } 
     
     .wiki-grid { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; margin-top: 20px; } 
     
     .wiki-card { 
         background: #151515; border-radius: 10px; padding: 15px; flex: 1; 
         min-width: 320px; max-width: 420px; border: 1px solid #333; box-shadow: 0 4px 15px rgba(0,0,0,0.5); 
     } 
     
     .wiki-card h3 { 
         display: flex; align-items: center; justify-content: center; gap: 10px; 
         text-transform: uppercase; margin-top: 0; letter-spacing: 1px; margin-bottom: 15px; 
     } 
 
     /* DIVISÓRIA */ 
     .section-divider { 
         border: 0; height: 2px; 
         background-image: linear-gradient(to right, transparent, #444, #888, #444, transparent); 
         margin: 60px 0; 
     } 
 
     /* MOLDURAS */ 
     .pristine-frame { border-top: 5px solid #e74c3c; } 
     .unique-gem-frame { border-top: 5px solid #9b59b6; } 
     .bronze-frame { border-top: 5px solid #cd7f32; } 
     .silver-frame { border-top: 5px solid #c0c0c0; } 
     .golden-frame { border-top: 5px solid #ffd700; } 
 
     .wiki-table { width: 100%; border-collapse: collapse; font-size: 13px; } 
     .wiki-table tr { border-bottom: 1px solid #222; } 
     .wiki-table td { padding: 10px 5px; vertical-align: middle; } 
     
     .item-wrapper { display: flex; align-items: center; gap: 10px; } 
     .item-icon { width: 30px; height: 30px; object-fit: contain; } 
     .socket-icon { width: 24px; height: 24px; object-fit: contain; } 
     .item-name { color: #fff; font-weight: bold; } 
     
     /* ESTATÍSTICAS */ 
     .stat-blue { color: #5dade2; text-align: right; font-family: 'Courier New', Courier, monospace; font-weight: bold; } 
     .stat-pure { color: #f39c12; text-align: right; font-family: 'Courier New', Courier, monospace; font-weight: bold; } 
     
     .desc-text { display: block; font-size: 10px; color: #888; font-style: italic; margin-top: 3px; line-height: 1.2; } 
     .unique-tag { display: block; font-size: 10px; color: #e74c3c; text-transform: uppercase; font-weight: bold; margin-top: 3px; } 
          `}
        </style>

        <div className="wiki-container">
          <h1
            style={{
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            Gems
          </h1>

          <div className="wiki-grid">
            <div className="wiki-card pristine-frame">
              <h3 style={{ color: '#e74c3c' }}>Pristine Gems</h3>
              <table className="wiki-table">
                <tbody>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/3/3f/Pristine_ruby.png"
                          className="item-icon"
                          alt="Pristine Ruby"
                        />
                        <span className="item-name">Pristine Ruby</span>
                      </div>
                    </td>
                    <td className="stat-blue">+750 Fire Dmg</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/a/a2/Pristine_sapphire.png"
                          className="item-icon"
                          alt="Pristine Sapphire"
                        />
                        <span className="item-name">Pristine Sapphire</span>
                      </div>
                    </td>
                    <td className="stat-blue">+750 Cold Dmg</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/0/0a/Pristine_topaz.png"
                          className="item-icon"
                          alt="Pristine Topaz"
                        />
                        <span className="item-name">Pristine Topaz</span>
                      </div>
                    </td>
                    <td className="stat-blue">+750 Light Dmg</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/f/f0/Pristine_emerald.png"
                          className="item-icon"
                          alt="Pristine Emerald"
                        />
                        <span className="item-name">Pristine Emerald</span>
                      </div>
                    </td>
                    <td className="stat-blue">+750 Pois Dmg</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/0/08/Pristine_amethyst.png"
                          className="item-icon"
                          alt="Pristine Amethyst"
                        />
                        <span className="item-name">Pristine Amethyst</span>
                      </div>
                    </td>
                    <td className="stat-blue">+750 Magic Dmg</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/4/4b/Pristine_citrine.png"
                          className="item-icon"
                          alt="Pristine Citrine"
                        />
                        <span className="item-name">Pristine Citrine</span>
                      </div>
                    </td>
                    <td className="stat-blue">+750 Wind Dmg</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/6/64/Pristine_skull.png"
                          className="item-icon"
                          alt="Pristine Skull"
                        />
                        <span className="item-name">Pristine Skull</span>
                      </div>
                    </td>
                    <td className="stat-blue">+750 Phys Dmg</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="wiki-card unique-gem-frame">
              <h3 style={{ color: '#9b59b6' }}>Unique Gems</h3>
              <table className="wiki-table">
                <tbody>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/5/50/Elemental_Gem.gif"
                          className="item-icon"
                          alt="Elemental Gem"
                        />
                        <div>
                          <span className="item-name">Elemental Gem</span>
                          <span className="desc-text">[Doesn&apos;t convert the weapon damage type]</span>
                        </div>
                      </div>
                    </td>
                    <td className="stat-blue">800 Elem Dmg</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/1/12/Chaos_Gem.gif"
                          className="item-icon"
                          alt="Chaos Gem"
                        />
                        <div>
                          <span className="item-name">Chaos Gem</span>
                          <span className="desc-text">[Currently doesn&apos;t increase Armor]</span>
                        </div>
                      </div>
                    </td>
                    <td className="stat-blue">5% All Stats</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/f/f7/Angelic_gem.gif"
                          className="item-icon"
                          alt="Angelic Gem"
                        />
                        <span className="item-name">Angelic Gem</span>
                      </div>
                    </td>
                    <td className="stat-blue">2 All Talents</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/2/2a/Moonstone.gif"
                          className="item-icon"
                          alt="Moonstone Gem"
                        />
                        <div>
                          <span className="item-name">Moonstone Gem</span>
                          <span className="desc-text">[Works when a weapon is equipped]</span>
                        </div>
                      </div>
                    </td>
                    <td className="stat-blue">10% ATK Speed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr className="section-divider" />

          <h1
            style={{
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            Jewels
          </h1>

          <div className="wiki-grid">
            <div className="wiki-card bronze-frame">
              <h3 style={{ color: '#cd7f32' }}>
                <img
                  src="https://static.wikia.nocookie.net/herosiege/images/5/52/Jewel_Socket_Low_spr.png"
                  className="socket-icon"
                  alt="Bronze socket"
                />
                Bronze Flaming
              </h3>
              <table className="wiki-table">
                <tbody>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/c/c0/Jewel_Exan_spr.png"
                          className="item-icon"
                          alt="Exan Jewel"
                        />
                        <span className="item-name">Exan Jewel</span>
                      </div>
                    </td>
                    <td className="stat-blue">+10 Energy</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/b/bf/Jewel_Wilrden_spr.png"
                          className="item-icon"
                          alt="Wildren Jewel"
                        />
                        <span className="item-name">Wildren Jewel</span>
                      </div>
                    </td>
                    <td className="stat-blue">+10 Armor</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/7/7b/Jewel_Volcon_spr.png"
                          className="item-icon"
                          alt="Volcon Jewel"
                        />
                        <span className="item-name">Volcon Jewel</span>
                      </div>
                    </td>
                    <td className="stat-blue">+10 Strength</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/d/dd/Jewel_Aether_spr.png"
                          className="item-icon"
                          alt="Aether Jewel"
                        />
                        <span className="item-name">Aether Jewel</span>
                      </div>
                    </td>
                    <td className="stat-blue">1.50% All Res</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/3/3a/Jewel_Helmon_spr.png"
                          className="item-icon"
                          alt="Helmon Jewel"
                        />
                        <span className="item-name">Helmon Jewel</span>
                      </div>
                    </td>
                    <td className="stat-blue">+5% Max Health</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/7/7c/Jewel_Mariane_spr.png"
                          className="item-icon"
                          alt="Mariane Jewel"
                        />
                        <span className="item-name">Mariane Jewel</span>
                      </div>
                    </td>
                    <td className="stat-blue">+3% Max Mana</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/d/dd/Jewel_Lyrcon_spr.png"
                          className="item-icon"
                          alt="Lyrcon Jewel"
                        />
                        <span className="item-name">Lyrcon Jewel</span>
                      </div>
                    </td>
                    <td className="stat-blue">2% Dodge</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/0/05/Jewel_Fieryzen_spr.png"
                          className="item-icon"
                          alt="Fieryzen Jewel"
                        />
                        <span className="item-name">Fieryzen Jewel</span>
                      </div>
                    </td>
                    <td className="stat-blue">2% Block</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="wiki-card silver-frame">
              <h3 style={{ color: '#c0c0c0' }}>
                <img
                  src="https://static.wikia.nocookie.net/herosiege/images/3/31/Jewel_Socket_Mid_spr.png"
                  className="socket-icon"
                  alt="Silver socket"
                />
                Silver Flaming
              </h3>
              <table className="wiki-table">
                <tbody>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/1/14/Lapis.gif"
                          className="item-icon"
                          alt="Lapis-Lazuli Jewel"
                        />
                        <span className="item-name">Lapis-Lazuli Jewel</span>
                      </div>
                    </td>
                    <td className="stat-blue">+2.5% AP</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/b/b0/Omnipearl.gif"
                          className="item-icon"
                          alt="Omnipearl Jewel"
                        />
                        <span className="item-name">Omnipearl Jewel</span>
                      </div>
                    </td>
                    <td className="stat-blue">+2.5% ATK</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/f/f7/Agathetheum.gif"
                          className="item-icon"
                          alt="Agathetheum Jewel"
                        />
                        <span className="item-name">Agathetheum Jewel</span>
                      </div>
                    </td>
                    <td className="stat-blue">+10% Dmg Ret</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/f/f2/Tramal.gif"
                          className="item-icon"
                          alt="Tramal Jewel"
                        />
                        <span className="item-name">Tramal Jewel</span>
                      </div>
                    </td>
                    <td className="stat-blue">+10% Dmg Red</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="wiki-card golden-frame">
              <h3 style={{ color: '#ffd700' }}>
                <img
                  src="https://static.wikia.nocookie.net/herosiege/images/3/3f/Jewel_Socket_High_spr.png"
                  className="socket-icon"
                  alt="Golden socket"
                />
                Golden Flaming
              </h3>
              <table className="wiki-table">
                <tbody>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/4/4b/Pearlescento.gif"
                          className="item-icon"
                          alt="Pearlescento Jewel"
                        />
                        <div>
                          <span className="item-name">Pearlescento Jewel</span>
                          <span className="unique-tag">[Unique Gem Status]</span>
                        </div>
                      </div>
                    </td>
                    <td className="stat-pure">5% Pure All Res</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item-wrapper">
                        <img
                          src="https://static.wikia.nocookie.net/herosiege/images/c/c2/Mythgonlion.gif"
                          className="item-icon"
                          alt="Mythgonlion Jewel"
                        />
                        <div>
                          <span className="item-name">Mythgonlion Jewel</span>
                          <span className="unique-tag">[Unique Gem Status]</span>
                        </div>
                      </div>
                    </td>
                    <td className="stat-pure">5% Pure Elem Dmg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GemasJoiasPage;

