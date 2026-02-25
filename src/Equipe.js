import React, { useEffect } from 'react';
import './Equipe.css';

const Equipe = () => {
  useEffect(() => {
    // Adiciona o link do FontAwesome dinamicamente se não estiver presente
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="equipe-body">
      <div className="equipe-container">
        <header className="equipe-header">
            <h1>Colaboradores</h1>
            <p>Hero Siege Brasil</p>
        </header>

        <div className="equipe-main-layout">
            
            <div className="cyber-card legendary admin-main">
                <span className="tier-label">— Desenvolvedor</span>
                <div className="profile-header">
                    <div className="img-frame" style={{ width: '120px', height: '120px' }}>
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Steve" alt="Steve" />
                    </div>
                    <div className="name-box"><h2>Pickles</h2></div>
                </div>
                <div className="inner-box">
                    Desenvolvedor do projeto Hero Siege Brasil. Responsável pela arquitetura técnica e curadoria absoluta do banco de dados e configurações de Hero Siege Brasil.
                </div>
                <div className="card-footer">
                    <a href="#"><i className="fab fa-discord"></i></a>
                    <a href="#"><i className="fab fa-twitch"></i></a>
                    <a href="#"><i className="fab fa-youtube"></i></a>
                    <a href="#"><i className="fas fa-globe"></i></a>
                    <a href="#"><i className="fab fa-github"></i></a>
                </div>
            </div>

            <div className="colaboradores-grid">
                
                <div className="cyber-card angelic">
                    <span className="tier-label">— Colaborador</span>
                    <div className="profile-header">
                        <div className="img-frame"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Luna" alt="Colab" /></div>
                        <div className="name-box"><h3>Luna</h3></div>
                    </div>
                    <div className="inner-box">Colaborador do Projeto Hero Siege Brasil.</div>
                    <div className="card-footer">
                        <a href="#"><i className="fab fa-discord"></i></a>
                        <a href="#"><i className="fab fa-github"></i></a>
                        <a href="#"><i className="fas fa-globe"></i></a>
                    </div>
                </div>

                <div className="cyber-card satanic">
                    <span className="tier-label">— Colaborador</span>
                    <div className="profile-header">
                        <div className="img-frame"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kael" alt="Colab" /></div>
                        <div className="name-box"><h3>Kael</h3></div>
                    </div>
                    <div className="inner-box">Colaborador do Projeto Hero Siege Brasil.</div>
                    <div className="card-footer">
                        <a href="#"><i className="fab fa-discord"></i></a>
                        <a href="#"><i className="fab fa-twitch"></i></a>
                    </div>
                </div>

                <div className="cyber-card heroic">
                    <span className="tier-label">— Colaborador</span>
                    <div className="profile-header">
                        <div className="img-frame"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rex" alt="Colab" /></div>
                        <div className="name-box"><h3>Rex</h3></div>
                    </div>
                    <div className="inner-box">Colaborador do Projeto Hero Siege Brasil.</div>
                    <div className="card-footer">
                        <a href="#"><i className="fab fa-discord"></i></a>
                        <a href="#"><i className="fab fa-youtube"></i></a>
                    </div>
                </div>

                <div className="cyber-card set">
                    <span className="tier-label">— Colaborador</span>
                    <div className="profile-header">
                        <div className="img-frame"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Borg" alt="Colab" /></div>
                        <div className="name-box"><h3>Borg</h3></div>
                    </div>
                    <div className="inner-box">Colaborador do Projeto Hero Siege Brasil.</div>
                    <div className="card-footer">
                        <a href="#"><i className="fab fa-discord"></i></a>
                        <a href="#"><i className="fas fa-globe"></i></a>
                    </div>
                </div>

                <div className="cyber-card mythic">
                    <span className="tier-label">— Colaboradora</span>
                    <div className="profile-header">
                        <div className="img-frame"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zora" alt="Colab" /></div>
                        <div className="name-box"><h3>Zora</h3></div>
                    </div>
                    <div className="inner-box">Colaboradora do Projeto Hero Siege Brasil.</div>
                    <div className="card-footer">
                        <a href="#"><i className="fab fa-discord"></i></a>
                        <a href="#"><i className="fab fa-twitch"></i></a>
                    </div>
                </div>

                <div className="cyber-card common">
                    <span className="tier-label">— Colaborador</span>
                    <div className="profile-header">
                        <div className="img-frame"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pippin" alt="Colab" /></div>
                        <div className="name-box"><h3>Pippin</h3></div>
                    </div>
                    <div className="inner-box">Colaborador do Projeto Hero Siege Brasil.</div>
                    <div className="card-footer">
                        <a href="#"><i className="fab fa-github"></i></a>
                        <a href="#"><i className="fab fa-discord"></i></a>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default Equipe;
