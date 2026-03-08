import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import EtherTree from './EtherTree';

const Ether = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDbOpen, setIsDbOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const TagS9 = () => (
    <span className="text-[9px] bg-gradient-to-r from-green-400 to-emerald-600 text-black px-1.5 py-0.5 rounded-sm font-black ml-2 leading-none shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse">
      S9
    </span>
  );

  return (
    <div className="h-screen bg-[#0f111a] text-gray-200 font-sans flex flex-col overflow-hidden">
      {/* Navbar similar to HeroLevelTree/HeroSkills */}
      <nav className="sticky top-0 z-50 bg-[#0b0d14]/95 backdrop-blur-md border-b border-white/5 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/images/herosiege.png" alt="Hero Siege Brasil" className="h-8 sm:h-9 w-auto" />
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-gray-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>

            <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
              <button onClick={() => navigate('/')} className="hover:text-white transition">Home</button>
              
              <div className="relative" onMouseEnter={() => setIsDbOpen(true)} onMouseLeave={() => setIsDbOpen(false)}>
                <button className={`hover:text-white transition ${isDbOpen ? 'text-white' : ''}`}>Database</button>
                {isDbOpen && (
                  <div className="absolute top-full left-0 w-48 bg-[#0b0d14] border border-white/10 py-2 rounded shadow-xl">
                    <button onClick={() => navigate('/classes')} className="block w-full text-left px-4 py-2 hover:bg-white/5 hover:text-white">Classes</button>
                    <button onClick={() => navigate('/items')} className="block w-full text-left px-4 py-2 hover:bg-white/5 hover:text-white">Items</button>
                    <button onClick={() => navigate('/runes')} className="block w-full text-left px-4 py-2 hover:bg-white/5 hover:text-white">Runas</button>
                  </div>
                )}
              </div>

              <button onClick={() => navigate('/blog')} className="hover:text-white transition">Blog</button>

              <div className="relative" onMouseEnter={() => setIsBuilderOpen(true)} onMouseLeave={() => setIsBuilderOpen(false)}>
                <button className="text-orange-500">Builder</button>
                {isBuilderOpen && (
                  <div className="absolute top-full left-0 w-48 bg-[#0b0d14] border border-white/10 py-2 rounded shadow-xl text-[11px]">
                    <button onClick={() => navigate('/forum')} className="block w-full text-left px-4 py-2 hover:bg-white/5 hover:text-white uppercase tracking-widest font-bold text-gray-400">Forum</button>
                    <button onClick={() => navigate('/hero-skills')} className="block w-full text-left px-4 py-2 hover:bg-white/5 hover:text-white uppercase tracking-widest font-bold text-gray-400">Hero Skills</button>
                    <button onClick={() => navigate('/hero-level-tree')} className="block w-full text-left px-4 py-2 hover:bg-white/5 hover:text-white uppercase tracking-widest font-bold text-gray-400">Hero Level Tree</button>
                    <button onClick={() => navigate('/ether')} className="flex items-center justify-between w-full text-left px-4 py-2 bg-white/5 text-orange-500 uppercase tracking-widest font-bold">
                      Ether <TagS9 />
                    </button>
                    <button onClick={() => navigate('/incarnation')} className="flex items-center justify-between w-full text-left px-4 py-2 hover:bg-white/5 hover:text-white uppercase tracking-widest font-bold text-gray-400">
                      Incarnation <TagS9 />
                    </button>
                  </div>
                )}
              </div>
              
              <button onClick={() => navigate('/equipe')} className="hover:text-white transition">Equipe</button>
              <button onClick={() => navigate('/contato')} className="hover:text-white transition">Contato</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        <EtherTree />
      </main>
      <Footer />
    </div>
  );
};

export default Ether;
