import React from 'react';
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

  return <NewDesign />;
}

export default App;
