import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="w-full border-t border-white/10 bg-[#0b0d14] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Hero Siege Brasil. Todos os direitos reservados.</p>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/termos')} className="hover:text-white transition-colors">Termos de Uso</button>
          <button onClick={() => navigate('/privacidade')} className="hover:text-white transition-colors">Política de Privacidade</button>
          <button onClick={() => navigate('/contato')} className="hover:text-white transition-colors">Contato</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
