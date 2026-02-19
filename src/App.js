import React from 'react';
import LegacyApp from './LegacyApp';
import PainelApp from './PainelApp';
import NewDesign from './NewDesign';

function App() {
  const path = window.location.pathname || '';
  const hash = window.location.hash || '';
  const isPainel =
    path.startsWith('/painel') || hash.startsWith('#painel');

  if (isPainel) {
    return <PainelApp />;
  }

  // Novo layout como padrão. Acesse o legado via /legacy ou #legacy
  const isLegacy = path.startsWith('/legacy') || hash.startsWith('#legacy');
  if (isLegacy) {
    return <LegacyApp />;
  }
  return <NewDesign />;
}

export default App;
