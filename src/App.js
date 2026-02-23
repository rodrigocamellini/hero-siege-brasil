import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PainelApp from './PainelApp';
import NewDesign from './NewDesign';

function App() {
  return (
    <Routes>
      <Route path="/painel/*" element={<PainelApp />} />

      <Route path="/" element={<NewDesign initialView="home" />} />
      <Route path="/classes" element={<NewDesign initialView="classes" />} />
      <Route path="/items" element={<NewDesign initialView="items" />} />
      <Route path="/runes" element={<NewDesign initialView="runes" />} />
      <Route path="/relics" element={<NewDesign initialView="relics" />} />
      <Route path="/quests" element={<NewDesign initialView="quests" />} />
      <Route path="/chaos-tower" element={<NewDesign initialView="chaosTower" />} />
      <Route path="/mercenarios" element={<NewDesign initialView="mercenaries" />} />
      <Route path="/mineracao" element={<NewDesign initialView="mining" />} />
      <Route path="/chaves" element={<NewDesign initialView="keys" />} />
      <Route path="/gems" element={<NewDesign initialView="gems" />} />
      <Route path="/charms" element={<NewDesign initialView="charms" />} />
      <Route path="/builder" element={<NewDesign initialView="builder" />} />
      <Route path="/contato" element={<NewDesign initialView="contact" />} />
      <Route path="/blog" element={<NewDesign initialView="blog" />} />
      <Route path="/blog/:postId" element={<NewDesign initialView="blog" />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
