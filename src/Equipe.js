import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Equipe.css';

const Equipe = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Adiciona o link do FontAwesome dinamicamente se não estiver presente
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const snap = await getDocs(collection(db, 'team'));
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        // Sort by role importance? Or name?
        // Let's ensure developer comes first if needed, but we will filter manually below
        setMembers(list);
      } catch (e) {
        console.error("Erro ao carregar equipe:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const ROLES_MAP = {
    'legendary admin-main': 'Desenvolvedor',
    'angelic': 'Moderador',
    'satanic': 'Colaborador',
    'heroic': 'Parceiro',
    'set': 'Designer',
    'mythic': 'Editor',
    'common': 'Suporte',
  };

  const developers = members.filter(m => m.role === 'legendary admin-main');
  const others = members.filter(m => m.role !== 'legendary admin-main');

  // Helper to render social links
  const renderSocials = (socials) => {
    if (!socials) return null;
    return (
      <div className="card-footer">
        {socials.discord && <a href={socials.discord} target="_blank" rel="noreferrer"><i className="fab fa-discord"></i></a>}
        {socials.twitch && <a href={socials.twitch} target="_blank" rel="noreferrer"><i className="fab fa-twitch"></i></a>}
        {socials.youtube && <a href={socials.youtube} target="_blank" rel="noreferrer"><i className="fab fa-youtube"></i></a>}
        {socials.site && <a href={socials.site} target="_blank" rel="noreferrer"><i className="fas fa-globe"></i></a>}
        {socials.github && <a href={socials.github} target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="equipe-body">
        <div className="equipe-container">
          <header className="equipe-header">
            <h1>Carregando...</h1>
          </header>
        </div>
      </div>
    );
  }

  return (
    <div className="equipe-body">
      <div className="equipe-container">
        <header className="equipe-header">
            <h1>Colaboradores</h1>
            <p>Hero Siege Brasil</p>
        </header>

        <div className="equipe-main-layout">
            
            {/* Developers Section (Main Cards) */}
            {developers.map((dev) => (
              <div key={dev.id} className={`cyber-card ${dev.role || 'legendary admin-main'}`}>
                  <span className="tier-label">— {ROLES_MAP[dev.role] || 'Desenvolvedor'}</span>
                  <div className="profile-header">
                      <div className="img-frame" style={{ width: '120px', height: '120px' }}>
                          <img onError={(e) => e.target.style.display = 'none'} src={dev.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.nick}`} alt={dev.nick} />
                      </div>
                      <div className="name-box">
                        <div><h2>{dev.nick}</h2></div>
                        {dev.name && <div><h3>{dev.name}</h3></div>}
                      </div>                    
                  </div>
                  <div className="inner-box">
                      {dev.description || 'Desenvolvedor do projeto Hero Siege Brasil.'}
                  </div>
                  {renderSocials(dev.socials)}
              </div>
            ))}

            {/* If no developer found, maybe show a fallback or nothing */}

            <div className="colaboradores-grid">
                {others.map((member) => (
                  <div key={member.id} className={`cyber-card ${member.role || 'common'}`}>
                      <span className="tier-label">— {ROLES_MAP[member.role] || 'Membro'}</span>
                      <div className="profile-header">
                          <div className="img-frame">
                            <img onError={(e) => e.target.style.display = 'none'} src={member.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.nick}`} alt={member.nick} />
                          </div>
                          <div className="name-box"><h3>{member.nick}</h3></div>
                      </div>
                      <div className="inner-box">{member.description || 'Colaborador do Projeto Hero Siege Brasil.'}</div>
                      {renderSocials(member.socials)}
                  </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Equipe;
