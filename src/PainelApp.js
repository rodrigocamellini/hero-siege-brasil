import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import app, { db } from './firebase';
import { PASSIVE_RELICS, EXTRA_RELICS, normalizeRelicImageUrl } from './RelicsView';
import { AUGMENTS_DATA } from './AugmentsPage';
import { CHARM_DB } from './CharmsPage';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

const ALLOWED_EMAIL = 'rodrigo@dev.com';
const ALLOWED_UID = 'hfsHCehqYgen7OAfXUYl58fEPo02';

const KNOWN_CLASSES = [
  'Prophet',
  'Viking',
  'Pyromancer',
  'Marksman',
  'Pirate',
  'Nomad',
  'Redneck',
  'Necromancer',
  'Samurai',
  'Paladin',
  'Amazon',
  'Demon Slayer',
  'Demonspawn',
  'Shaman',
  'White Mage',
  'Marauder',
  'Plague Doctor',
  'Shield Lancer',
  'Jötunn',
  'Illusionist',
  'Exo',
  'Butcher',
  'Stormweaver',
  'Bard',
];

function parseViewFromHash() {
  const hash = window.location.hash || '';
  if (hash.startsWith('#painel/blog')) return 'blog';
  if (hash.startsWith('#painel/comentarios')) return 'comments';
  if (hash.startsWith('#painel/mensagens')) return 'messages';
  if (hash.startsWith('#painel/login')) return 'login';
  if (hash.startsWith('#painel/forum')) return 'forum';
  if (hash.startsWith('#painel/homepage')) return 'homepage';
  if (hash.startsWith('#painel/configuracoes')) return 'settings';
  return 'dashboard';
}

function PainelStyles() {
  const css = `
    :root { --bg:#f8fafc; --panel:#ffffff; --card:#ffffff; --muted:#6b7280; --fg:#0f172a; --accent:#b91c1c; }
    html,body { height:100%; margin:0; }
    body { background: radial-gradient(circle at top, #e5e7eb 0, #f8fafc 45%, #e5e7eb 100%); color: var(--fg); font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; min-height:100vh; }
    header { display:flex; align-items:center; justify-content:space-between; padding:18px 32px; border-bottom:1px solid rgba(15,23,42,.08); background:linear-gradient(90deg,#020617,#111827); color:#f9fafb; }
    .painel-brand { display:flex; align-items:center; gap:12px; }
    .painel-logo { width: 40px; height: 40px; display:grid; place-items:center; background: linear-gradient(135deg,#b91c1c,#f97316); border-radius: 12px; border: 1px solid rgba(248,113,113,.6); font-size:20px; }
    .painel-button { background: rgba(15,23,42,.85); color: #e5e7eb; border: 1px solid rgba(248,250,252,.12); padding: 10px 16px; cursor:pointer; font-size:11px; text-transform:uppercase; letter-spacing:.18em; border-radius:999px; }
    .painel-button:hover { border-color: #f97316; background:#0b1120; }
    .painel-layout { max-width: 1280px; margin: 32px auto; padding: 0 24px 32px; display:flex; gap:24px; align-items:stretch; min-height:calc(100vh - 120px); }
    .painel-sidebar { width: 240px; background:#ffffff; border-radius:24px; border:1px solid #e5e7eb; padding:20px 18px; box-shadow:0 18px 40px rgba(15,23,42,.08); color:#0f172a; }
    .painel-sidebar-title { font-size:11px; text-transform:uppercase; letter-spacing:.18em; color:#9ca3af; margin-bottom:14px; }
    .painel-sidebar-nav { display:flex; flex-direction:column; gap:8px; }
    .painel-nav-item { font-size:12px; padding:10px 12px; border-radius:999px; color:#4b5563; text-decoration:none; display:flex; justify-content:space-between; align-items:center; background:transparent; transition:all .2s ease; cursor:pointer; }
    .painel-nav-item span { font-size:10px; text-transform:uppercase; letter-spacing:.18em; }
    .painel-nav-item:hover { background:#f3f4f6; color:#111827; }
    .painel-nav-item.active { background:linear-gradient(135deg,#b91c1c,#f97316); color:#ffffff; box-shadow:0 18px 40px rgba(248,113,113,.35); }
    .painel-nav-badge { font-size:9px; background:#f9fafb; padding:2px 8px; border-radius:999px; border:1px solid #e5e7eb; color:#111827; }
    .painel-main { flex:1; display:flex; flex-direction:column; gap:24px; }
    .painel-page-header { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; }
    .painel-page-title { font-size:24px; font-weight:900; text-transform:uppercase; letter-spacing:.16em; }
    .painel-page-sub { font-size:13px; color:var(--muted); margin-top:6px; max-width:460px; }
    .painel-badge-live { display:inline-flex; align-items:center; gap:6px; font-size:10px; text-transform:uppercase; letter-spacing:.18em; color:#16a34a; padding:4px 10px; border-radius:999px; background:#dcfce7; border:1px solid #bbf7d0; }
    .painel-badge { display:inline-flex; align-items:center; gap:6px; font-size:10px; text-transform:uppercase; letter-spacing:.18em; color:#334155; padding:4px 10px; border-radius:999px; background:#f1f5f9; border:1px solid #e5e7eb; }
    .painel-badge-live-dot { width:7px; height:7px; border-radius:999px; background:#16a34a; box-shadow:0 0 10px rgba(34,197,94,.9); }
    .painel-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); gap: 20px; }
    .painel-card { background: var(--card); border:1px solid #e5e7eb; padding:20px; border-radius:24px; min-height:120px; box-shadow:0 20px 40px rgba(15,23,42,.08); position:relative; overflow:hidden; }
    .painel-card::before { content:''; position:absolute; inset:-40%; background:radial-gradient(circle at top left,rgba(248,113,113,.12),transparent 55%); opacity:1; filter:blur(0); }
    .painel-card-inner { position:relative; z-index:1; }
    .painel-card h2 { margin: 0 0 8px; font-size: 14px; font-weight: 800; letter-spacing: .18em; text-transform:uppercase; color:#6b7280; }
    .painel-card p { margin: 0; color: var(--muted); font-size: 13px; }
    .painel-stat { font-size: 30px; font-weight: 900; margin-top:10px; color:#0f172a; }
    .painel-stat-detail { margin-top:6px; font-size:12px; color:#6b7280; }
    .painel-metrics { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:12px; }
    .painel-metric-card { display:flex; align-items:center; gap:10px; padding:12px 14px; border-radius:18px; border:1px solid rgba(15,23,42,.08); box-shadow:0 14px 30px rgba(15,23,42,.06); }
    @keyframes pulse-alert {
      0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); transform: scale(1); }
      70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); transform: scale(1.02); }
      100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); transform: scale(1); }
    }
    .painel-pulse-alert { animation: pulse-alert 2s infinite; border-color: #ef4444 !important; }
    .painel-metric-icon { font-size:28px; line-height:1; }
    .painel-metric-data .value { font-size:22px; font-weight:900; line-height:1; }
    .painel-metric-data .label { margin-top:4px; font-size:11px; letter-spacing:.12em; text-transform:uppercase; opacity:.9; }
    :root {
      --posts-dark-bg:#f59e0b; --posts-light-bg:#ffedd5;
      --comments-dark-bg:#10b981; --comments-light-bg:#d1fae5;
      --messages-dark-bg:#3b82f6; --messages-light-bg:#dbeafe;
      --builds-dark-bg:#8b5cf6; --builds-light-bg:#ede9fe;
    }
    .metric-posts-dark { background: var(--posts-dark-bg); color:#0b0f19; }
    .metric-posts-light { background: var(--posts-light-bg); color:#7c2d12; }
    .metric-comments-dark { background: var(--comments-dark-bg); color:#052e1c; }
    .metric-comments-light { background: var(--comments-light-bg); color:#065f46; }
    .metric-messages-dark { background: var(--messages-dark-bg); color:#06102b; }
    .metric-messages-light { background: var(--messages-light-bg); color:#1e3a8a; }
    .metric-builds-dark { background: var(--builds-dark-bg); color:#1c1917; }
    .metric-builds-light { background: var(--builds-light-bg); color:#312e81; }
    .painel-activity { display:grid; grid-template-columns: minmax(0,2fr) minmax(0,1.5fr); gap:20px; }
    .painel-activity-list { background:var(--card); border-radius:24px; border:1px solid #e5e7eb; padding:18px 20px; box-shadow:0 18px 40px rgba(15,23,42,.04); }
    .painel-activity-title { font-size:11px; text-transform:uppercase; letter-spacing:.2em; color:#9ca3af; margin-bottom:12px; }
    .painel-activity-item { font-size:13px; padding:10px 0; border-bottom:1px solid #e5e7eb; display:flex; justify-content:space-between; align-items:center; }
    .painel-activity-item:last-child { border-bottom:none; }
    .painel-chip { font-size:10px; text-transform:uppercase; letter-spacing:.18em; padding:4px 8px; border-radius:999px; border:1px solid #e5e7eb; color:#6b7280; background:#f9fafb; }
    .painel-table-wrapper { margin-top:12px; overflow:auto; max-height:380px; }
    table.painel-table { width:100%; border-collapse:collapse; font-size:13px; }
    table.painel-table th, table.painel-table td { padding:8px 6px; border-bottom:1px solid #e5e7eb; text-align:left; }
    table.painel-table th { font-size:11px; text-transform:uppercase; letter-spacing:.12em; color:#9ca3af; }
    table.painel-table tbody tr:hover { background:#f9fafb; }
    .painel-tag { font-size:10px; padding:2px 6px; border:1px solid #e5e7eb; text-transform:uppercase; letter-spacing:.12em; border-radius:999px; color:#6b7280; background:#ffffff; }
    .painel-row { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
    .painel-homepage-grid { display:grid; grid-template-columns: repeat(auto-fit,minmax(80px,1fr)); gap:10px; margin-top:16px; }
    .painel-homepage-thumb { position:relative; border-radius:12px; border:2px solid transparent; overflow:hidden; cursor:pointer; background:#0f172a; }
    .painel-homepage-thumb img { width:100%; height:80px; object-fit:contain; display:block; background:#020617; }
    .painel-homepage-thumb span { position:absolute; inset:auto 0 0 0; padding:4px 6px; font-size:9px; text-transform:uppercase; letter-spacing:.14em; background:linear-gradient(to top,rgba(15,23,42,.9),transparent); color:#e5e7eb; text-align:center; }
    .painel-homepage-thumb.active { border-color:#f97316; box-shadow:0 0 0 1px rgba(249,115,22,.4); }
    .painel-homepage-thumb.random { border-style:dashed; }
    .painel-homepage-preview { margin-top:20px; display:flex; gap:18px; align-items:center; }
    .painel-homepage-preview-img { width:180px; height:180px; border-radius:24px; overflow:hidden; border:1px solid #e5e7eb; background:#020617; display:flex; align-items:center; justify-content:center; }
    .painel-homepage-preview-img img { width:100%; height:100%; object-fit:contain; }
    .painel-homepage-preview-info { font-size:13px; color:#4b5563; max-width:420px; }
    .painel-input, .painel-select, .painel-textarea { width:100%; box-sizing:border-box; padding:10px; background:#f9fafb; color:#0f172a; border:1px solid #e5e7eb; }
    .painel-textarea { min-height: 140px; resize:vertical; }
    .painel-muted { color:var(--muted); font-size:12px; }
    .painel-list { display:flex; flex-direction:column; gap:10px; max-height:380px; overflow:auto; }
    .painel-list-item { border:1px solid #e5e7eb; padding:10px; display:flex; justify-content:space-between; align-items:flex-start; gap:10px; background:#f9fafb; border-radius:12px; }
    .painel-danger-text { color:#b91c1c; }
    .painel-actions-cell { display:flex; gap:6px; justify-content:flex-end; }
    .painel-action-btn { width:28px; height:28px; border-radius:999px; display:grid; place-items:center; padding:0; font-size:15px; border:none; cursor:pointer; }
    .painel-action-edit { background:#eef2ff; color:#4338ca; }
    .painel-action-edit:hover { background:#e0e7ff; }
    .painel-action-view { background:#e0f2fe; color:#0369a1; }
    .painel-action-view:hover { background:#bae6fd; }
    .painel-action-toggle-published { background:#dcfce7; color:#15803d; }
    .painel-action-toggle-published:hover { background:#bbf7d0; }
    .painel-action-toggle-draft { background:#fee2e2; color:#b91c1c; }
    .painel-action-toggle-draft:hover { background:#fecaca; }
    .painel-action-delete { background:#fee2e2; color:#b91c1c; }
    .painel-action-delete:hover { background:#fecaca; }
    .painel-modal { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:40; padding:16px; box-sizing:border-box; }
    .painel-modal.hidden { display:none; }
    .painel-modal-backdrop { position:absolute; inset:0; background:rgba(15,23,42,.6); backdrop-filter:blur(10px); }
    .painel-modal-content { position:relative; z-index:1; width:100%; max-width:520px; max-height:80vh; background:#ffffff; border-radius:20px; border:1px solid #e5e7eb; padding:16px 18px; box-shadow:0 24px 70px rgba(15,23,42,.25); display:flex; flex-direction:column; }
    .painel-modal-content.small { max-width:420px; }
    .painel-modal-content.wide { max-width:1200px; }
    .painel-modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
    .painel-modal-title { font-size:13px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; color:#6b7280; }
    .painel-modal-close { border-radius:999px; width:26px; height:26px; display:grid; place-items:center; border:1px solid #e5e7eb; background:#f9fafb; color:#374151; cursor:pointer; }
    .painel-modal-body { margin-top:4px; overflow:auto; }
    .painel-build-modal-grid { display:grid; grid-template-columns:minmax(0,1fr) 320px; gap:16px; align-items:start; }
    .painel-build-form { min-width:0; }
    .painel-build-preview { background:#ffffff; border:1px solid #e5e7eb; border-radius:16px; padding:14px; overflow:auto; max-height:65vh; }
    .painel-build-preview-header { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:6px; }
    .painel-build-preview-title { font-size:16px; font-weight:900; letter-spacing:.04em; color:#0f172a; }
    .painel-build-preview-meta { font-size:11px; color:#6b7280; margin-bottom:10px; }
    .painel-build-type-tag { display:inline-flex; align-items:center; gap:6px; font-size:10px; text-transform:uppercase; letter-spacing:.12em; color:#334155; padding:4px 8px; border-radius:999px; background:#f1f5f9; border:1px solid #e5e7eb; }
    .painel-build-preview-content { font-size:13px; color:#334155; line-height:1.5; }
    @media (max-width: 900px) {
      .painel-build-modal-grid { grid-template-columns: 1fr; }
    }
    .painel-login-container { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; }
    .painel-login-card { width:100%; max-width: 420px; background:#151923; border: 1px solid rgba(255,255,255,.06); padding: 28px; box-sizing: border-box; color:#e5e7eb; }
    .painel-login-brand { display:flex; align-items:center; gap:10px; margin-bottom: 18px; }
    .painel-login-logo { width: 36px; height: 36px; display:grid; place-items:center; background: rgba(239,68,68,.12); border: 1px solid rgba(239,68,68,.35); }
    .painel-login-badge { display:inline-block; margin-top: 8px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.14em; color:#f59e0b; }
    .painel-login-title { margin: 0 0 8px; font-size: 22px; font-weight: 800; letter-spacing: .02em; }
    .painel-login-sub { margin: 0; color: #9aa4b2; font-size: 13px; }
    .painel-login-label { display:block; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #9ca3af; margin-bottom: 8px; }
    .painel-login-input { width:100%; padding: 12px; background: rgba(0,0,0,.35); color: #e5e7eb; border: 1px solid rgba(255,255,255,.08); outline: none; }
    .painel-login-input:focus { border-color: var(--accent); }
    .painel-login-button { width:100%; padding: 12px; border: 1px solid rgba(255,255,255,.12); background: #fff; color:#000; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; cursor: pointer; }
    .painel-login-button[disabled] { opacity:.6; cursor: not-allowed; }
    .painel-login-error { margin-top: 12px; padding: 10px; background: rgba(239,68,68,.12); border: 1px solid rgba(239,68,68,.35); color: #fecaca; font-size: 12px; }
    .painel-login-hint { margin-top: 12px; font-size: 12px; color: #9aa4b2; }
    @media (max-width: 900px) {
      .painel-layout { flex-direction:column; padding:16px 16px 32px; margin-top:16px; }
      .painel-sidebar { width:100%; display:flex; overflow-x:auto; border-radius:20px; }
      .painel-sidebar-nav { flex-direction:row; }
      .painel-nav-item { min-width:150px; }
      .painel-activity { grid-template-columns: 1fr; }
    }
  `;
  return <style>{css}</style>;
}

function PainelLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const trimmedEmail = (email || '').trim();
    if (!trimmedEmail || !password) {
      setError('Informe e-mail e senha.');
      return;
    }
    setBusy(true);
    try {
      const auth = getAuth(app);
      const cred = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const user = cred.user;
      if (!user || (user.email || '').toLowerCase() !== ALLOWED_EMAIL || user.uid !== ALLOWED_UID) {
        await signOut(auth);
        setError('Usuário não autorizado para o painel.');
        return;
      }
      window.location.hash = '#painel';
    } catch (e2) {
      const code = e2 && e2.code ? e2.code : '';
      if (code === 'auth/operation-not-allowed') {
        setError('Método Email/Senha desativado no Firebase Auth. Ative-o nas configurações.');
      } else if (code === 'auth/unauthorized-domain') {
        setError('Domínio não autorizado no Firebase Auth. Adicione este domínio em “Authorized domains”.');
      } else if (code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials' || code === 'auth/wrong-password') {
        setError('E-mail ou senha inválidos.');
      } else {
        setError(e2.message || 'Falha na autenticação.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PainelStyles />
      <div className="painel-login-container">
        <div className="painel-login-card">
          <div className="painel-login-brand">
            <div className="painel-login-logo">🔥</div>
            <div>
              <h1 className="painel-login-title">Hero Siege Brasil — Painel</h1>
              <p className="painel-login-sub">Acesso restrito ao administrador</p>
            </div>
          </div>
          <div className="painel-login-badge">Season 9</div>
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mt-6">
              <label className="painel-login-label" htmlFor="painel-email">
                E-mail
              </label>
              <input
                id="painel-email"
                type="email"
                className="painel-login-input"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-6">
              <label className="painel-login-label" htmlFor="painel-password">
                Senha
              </label>
              <input
                id="painel-password"
                type="password"
                className="painel-login-input"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-6">
              <button type="submit" className="painel-login-button" disabled={busy}>
                {busy ? 'Autenticando...' : 'Entrar'}
              </button>
              {error && <div className="painel-login-error">{error}</div>}
              <div className="painel-login-hint">
                Segurança: autenticação por Firebase. Tentativas são registradas.
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function PainelHeader({ onLogout }) {
  return (
    <header>
      <div className="painel-brand">
        <div className="painel-logo">⚙️</div>
        <div>
          <div
            style={{
              fontWeight: 900,
              letterSpacing: '.18em',
              fontSize: 11,
              textTransform: 'uppercase',
            }}
          >
            Painel — Hero Siege Brasil
          </div>
          <div style={{ fontSize: 12, color: '#9aa4b2' }}>
            Área de administração · Acesso restrito
          </div>
        </div>
      </div>
      <button type="button" className="painel-button" title="Encerrar sessão" onClick={onLogout}>
        Sair
      </button>
    </header>
  );
}

function PainelSidebar({ view, onChange }) {
  const go = (target) => {
    if (target === 'dashboard') {
      window.location.hash = '#painel';
    } else if (target === 'blog') {
      window.location.hash = '#painel/blog';
    } else if (target === 'comments') {
      window.location.hash = '#painel/comentarios';
    } else if (target === 'messages') {
      window.location.hash = '#painel/mensagens';
    } else if (target === 'forum') {
      window.location.hash = '#painel/forum';
    } else if (target === 'homepage') {
      window.location.hash = '#painel/homepage';
    } else if (target === 'settings') {
      window.location.hash = '#painel/configuracoes';
    }
    onChange(target);
  };
  return (
    <aside className="painel-sidebar">
      <div className="painel-sidebar-title">Navegação</div>
      <div className="painel-sidebar-nav">
        <div
          className={`painel-nav-item ${view === 'dashboard' ? 'active' : ''}`}
          onClick={() => go('dashboard')}
        >
          <span>Dashboard</span>
          {view === 'dashboard' && <span className="painel-nav-badge">Atual</span>}
        </div>
        <div
          className={`painel-nav-item ${view === 'blog' ? 'active' : ''}`}
          onClick={() => go('blog')}
        >
          <span>Blog</span>
          {view === 'blog' && <span className="painel-nav-badge">Atual</span>}
        </div>
        <div
          className={`painel-nav-item ${view === 'comments' ? 'active' : ''}`}
          onClick={() => go('comments')}
        >
          <span>Comentários</span>
          {view === 'comments' && <span className="painel-nav-badge">Atual</span>}
        </div>
        <div
          className={`painel-nav-item ${view === 'messages' ? 'active' : ''}`}
          onClick={() => go('messages')}
        >
          <span>Mensagens</span>
          {view === 'messages' && <span className="painel-nav-badge">Atual</span>}
        </div>
        <div
          className={`painel-nav-item ${view === 'forum' ? 'active' : ''}`}
          onClick={() => go('forum')}
        >
          <span>Forum</span>
          {view === 'forum' && <span className="painel-nav-badge">Atual</span>}
        </div>
        <div
          className={`painel-nav-item ${view === 'homepage' ? 'active' : ''}`}
          onClick={() => go('homepage')}
        >
          <span>Homepage</span>
          {view === 'homepage' && <span className="painel-nav-badge">Atual</span>}
        </div>
        <div
          className={`painel-nav-item ${view === 'settings' ? 'active' : ''}`}
          onClick={() => go('settings')}
        >
          <span>Configurações</span>
          {view === 'settings' && <span className="painel-nav-badge">Atual</span>}
        </div>
      </div>
    </aside>
  );
}

function PainelDashboard() {
  const [catCount, setCatCount] = useState('–');
  const [classCount, setClassCount] = useState('–');
  const [publishedCount, setPublishedCount] = useState('–');
  const [draftCount, setDraftCount] = useState('–');
  const [buildsPublishedCount, setBuildsPublishedCount] = useState('–');
  const [buildsPendingCount, setBuildsPendingCount] = useState('–');
  const [approvedComments, setApprovedComments] = useState('–');
  const [pendingComments, setPendingComments] = useState('–');
  const [readMessages, setReadMessages] = useState('–');
  const [unreadMessages, setUnreadMessages] = useState('–');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'item_categories'));
        if (!alive) return;
        setCatCount(String(snap.size));
        snap.forEach(() => {});
      } catch {
        if (!alive) return;
      }
      try {
        await getDocs(collection(db, 'classes'));
        if (!alive) return;
        setClassCount(String(KNOWN_CLASSES.length));
      } catch {
        if (!alive) return;
        setClassCount(String(KNOWN_CLASSES.length));
      }
      try {
        const snapPosts = await getDocs(collection(db, 'posts'));
        if (!alive) return;
        let published = 0;
        let drafts = 0;
        snapPosts.forEach((d) => {
          const data = d.data() || {};
          const status = data.status || 'draft';
          if (status === 'published') {
            published += 1;
          } else if (status === 'draft') {
            drafts += 1;
          }
        });
        setPublishedCount(String(published));
        setDraftCount(String(drafts));
      } catch {
        if (!alive) return;
        setPublishedCount('0');
        setDraftCount('0');
      }
      try {
        const snapBuilds = await getDocs(collection(db, 'builds'));
        if (!alive) return;
        let bPublished = 0;
        let bPending = 0;
        snapBuilds.forEach((d) => {
          const data = d.data() || {};
          const status = data.status || 'draft';
          if (status === 'published') {
            bPublished += 1;
          } else {
            bPending += 1;
          }
        });
        setBuildsPublishedCount(String(bPublished));
        setBuildsPendingCount(String(bPending));
      } catch {
        if (!alive) return;
        setBuildsPublishedCount('0');
        setBuildsPendingCount('0');
      }
      try {
        const snapComments = await getDocs(collectionGroup(db, 'comments'));
        if (!alive) return;
        let approved = 0;
        let pending = 0;
        snapComments.forEach((d) => {
          const data = d.data() || {};
          if (data.approved === true) {
            approved += 1;
          } else {
            pending += 1;
          }
        });
        setApprovedComments(String(approved));
        setPendingComments(String(pending));
      } catch {
        if (!alive) return;
        setApprovedComments('0');
        setPendingComments('0');
      }
      try {
        const snapMessages = await getDocs(collection(db, 'messages'));
        if (!alive) return;
        let read = 0;
        let unread = 0;
        snapMessages.forEach((d) => {
          const data = d.data() || {};
          if (data.read === true) {
            read += 1;
          } else {
            unread += 1;
          }
        });
        setReadMessages(String(read));
        setUnreadMessages(String(unread));
      } catch {
        if (!alive) return;
        setReadMessages('0');
        setUnreadMessages('0');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="painel-main">
      <div className="painel-page-header">
        <div>
          <div className="painel-page-title">Dashboard</div>
          <div className="painel-page-sub">
            Resumo rápido das entidades que alimentam o site (categorias, classes e blog).
          </div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
          <div className="painel-badge-live">
            <span className="painel-badge-live-dot" />
            <span>Online</span>
          </div>
          <div className="painel-badge">🗃 <span>Categorias: {catCount}</span></div>
          <div className="painel-badge">🧩 <span>Classes: {classCount}</span></div>
        </div>
      </div>
      <div className="painel-metrics">
        <div className="painel-metric-card metric-posts-dark">
          <div className="painel-metric-icon">📢</div>
          <div className="painel-metric-data">
            <div className="value">{publishedCount}</div>
            <div className="label">Posts publicados</div>
          </div>
        </div>
        <div className="painel-metric-card metric-comments-dark">
          <div className="painel-metric-icon">💬</div>
          <div className="painel-metric-data">
            <div className="value">{approvedComments}</div>
            <div className="label">Comentários aprovados</div>
          </div>
        </div>
        <div className="painel-metric-card metric-messages-dark">
          <div className="painel-metric-icon">✉️</div>
          <div className="painel-metric-data">
            <div className="value">{readMessages}</div>
            <div className="label">Mensagens lidas</div>
          </div>
        </div>
        <div className="painel-metric-card metric-builds-dark">
          <div className="painel-metric-icon">🗡️</div>
          <div className="painel-metric-data">
            <div className="value">{buildsPublishedCount}</div>
            <div className="label">Builds publicadas</div>
          </div>
        </div>
      </div>
      <div className="painel-metrics" style={{ marginTop: 12 }}>
        <div className={`painel-metric-card metric-posts-light ${(parseInt(draftCount) || 0) > 0 ? 'painel-pulse-alert' : ''}`}>
          <div className="painel-metric-icon">📝</div>
          <div className="painel-metric-data">
            <div className="value">{draftCount}</div>
            <div className="label">Posts em rascunho</div>
          </div>
        </div>
        <div className={`painel-metric-card metric-comments-light ${(parseInt(pendingComments) || 0) > 0 ? 'painel-pulse-alert' : ''}`}>
          <div className="painel-metric-icon">⏳</div>
          <div className="painel-metric-data">
            <div className="value">{pendingComments}</div>
            <div className="label">Comentários pendentes</div>
          </div>
        </div>
        <div className={`painel-metric-card metric-messages-light ${(parseInt(unreadMessages) || 0) > 0 ? 'painel-pulse-alert' : ''}`}>
          <div className="painel-metric-icon">⏳</div>
          <div className="painel-metric-data">
            <div className="value">{unreadMessages}</div>
            <div className="label">Mensagens não lidas</div>
          </div>
        </div>
        <div className={`painel-metric-card metric-builds-light ${(parseInt(buildsPendingCount) || 0) > 0 ? 'painel-pulse-alert' : ''}`}>
          <div className="painel-metric-icon">⏳</div>
          <div className="painel-metric-data">
            <div className="value">{buildsPendingCount}</div>
            <div className="label">Builds pendentes</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function slugifyClass(name) {
  return String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const handleRelicError = (e, name) => {
  const target = e.target;
  const originalName = String(name || '');
  const safeName = originalName.replace(/ /g, '_').replace(/'/g, '%27');
  const noApostrophe = originalName.replace(/'/g, '').replace(/ /g, '_');
  const src = target.src;
  
  if (src.includes('Relics_') && !src.includes(noApostrophe)) {
     target.src = `https://herosiege.wiki.gg/images/Relic_${safeName}.png`;
  } else if (src.includes('Relic_') && !src.includes(noApostrophe)) {
     target.src = `https://herosiege.wiki.gg/images/${safeName}.png`;
  } else if (!src.includes(noApostrophe) && originalName.includes("'")) {
     target.src = `https://herosiege.wiki.gg/images/Relics_${noApostrophe}.png`;
  } else {
     target.style.display = 'none';
  }
};

function PainelForum() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [className, setClassName] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [tags, setTags] = useState('');
  const [buildType, setBuildType] = useState('');
  const [status, setStatus] = useState('draft');
  const [msg, setMsg] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [confirmLabel, setConfirmLabel] = useState('');
  const [relics, setRelics] = useState([null, null, null, null, null]);
  const [relicPickerIndex, setRelicPickerIndex] = useState(null);
  const [potions, setPotions] = useState([null, null, null, null]);
  const [potionPickerIndex, setPotionPickerIndex] = useState(null);
  const [potionOptions, setPotionOptions] = useState([]);
  const [charms, setCharms] = useState([]);
  const [charmPickerIndex, setCharmPickerIndex] = useState(null);
  const [mercenary, setMercenary] = useState('');
  const [augments, setAugments] = useState([null, null, null]);
  const [augmentPickerIndex, setAugmentPickerIndex] = useState(null);

  const augmentOptions = useMemo(() => {
    return AUGMENTS_DATA.sort((a, b) => (a.pt || a.en || '').localeCompare(b.pt || b.en || ''));
  }, []);

  const relicOptions = useMemo(() => {
    const base = [...PASSIVE_RELICS, ...EXTRA_RELICS];
    const seen = new Set();
    const merged = [];
    base.forEach((r) => {
      const name = r && r.name;
      if (!name || seen.has(name)) return;
      seen.add(name);
      const imgUrl = r.img
        ? normalizeRelicImageUrl(r.img)
        : normalizeRelicImageUrl(
            `https://herosiege.wiki.gg/images/Relics_${String(name || '')
              .replace(/ /g, '_')
              .replace(/'/g, '%27')}.png`
          );
      merged.push({ name, img: imgUrl });
    });
    merged.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return merged;
  }, []);

  useEffect(() => {
    const loadPotions = async () => {
      try {
        const colRef = collection(db, 'item_categories', 'potions', 'items');
        const snap = await getDocs(colRef);
        const list = [];
        snap.forEach((s) => list.push({ id: s.id, ...s.data() }));
        list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        setPotionOptions(list);
      } catch (e) {
        setPotionOptions([]);
      }
    };
    loadPotions();
  }, []);

  const statusLabel = (rawStatus) => {
    const s = rawStatus || 'draft';
    if (s === 'published') return 'Publicado';
    if (s === 'pending') return 'Pendente';
    if (s === 'draft') return 'Rascunho';
    return s;
  };

  const loadBuilds = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'builds'));
      const arr = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      arr.sort((a, b) => {
        const at = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0;
        const bt = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0;
        return bt - at;
      });
      setItems(arr);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuilds();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter(i => (i.status || 'draft') === filter);
  }, [items, filter]);

  const clearForm = () => {
    setEditDoc(null);
    setTitle('');
    setAuthor('');
    setClassName('');
    setContentHtml('');
    setTags('');
    setBuildType('');
    setStatus('draft');
    setMsg('');
    setRelics([null, null, null, null, null]);
    setPotions([null, null, null, null]);
    setCharms([]);
    setMercenary('');
    setAugments([null, null, null]);
  };

  const openNew = () => {
    clearForm();
    setModalOpen(true);
  };

  const openEdit = (docObj) => {
    setEditDoc(docObj);
    setTitle(docObj.title || '');
    setAuthor(docObj.author || '');
    setClassName(docObj.className || docObj.heroClass || '');
    setContentHtml(docObj.content_html || '');
    const tagsArr = Array.isArray(docObj.tags) ? docObj.tags : [];
    setTags(tagsArr.join(', '));
    const normTags = tagsArr.map((t) =>
      String(t || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    );
    if (normTags.includes('final')) {
      setBuildType('final');
    } else if (normTags.includes('iniciante')) {
      setBuildType('iniciante');
    } else if (normTags.includes('avancada') || normTags.includes('atualizada')) {
      setBuildType('avançada');
    } else {
      setBuildType('');
    }
    const docRelics = Array.isArray(docObj.relics) ? docObj.relics : [];
    const nextRelics = [null, null, null, null, null];
    for (let i = 0; i < nextRelics.length; i += 1) {
      nextRelics[i] = docRelics[i] || null;
    }
    setRelics(nextRelics);
    const docPotions = Array.isArray(docObj.potions) ? docObj.potions : [];
    const nextPotions = [null, null, null, null];
    for (let i = 0; i < nextPotions.length; i += 1) {
      nextPotions[i] = docPotions[i] || null;
    }
    setPotions(nextPotions);
    setCharms(Array.isArray(docObj.charms) ? docObj.charms : []);
    setMercenary(docObj.mercenary || '');
    const docAugs = Array.isArray(docObj.augments) ? docObj.augments : [];
    const nextAugs = [null, null, null];
    for (let i = 0; i < nextAugs.length; i += 1) {
      nextAugs[i] = docAugs[i] || null;
    }
    setAugments(nextAugs);
    setStatus(docObj.status || 'draft');
    setMsg(`Editando: ${docObj.title || docObj.id}`);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setMsg('Salvando...');
    const rawTags = (tags || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    const uniqTags = Array.from(new Set(rawTags));
    const filteredTags = uniqTags.filter((t) => {
      const n = String(t || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      if (n === 'iniciante') return false;
      if (n === 'final') return false;
      if (n === 'avancada') return false;
      if (n === 'atualizada') return false;
      return true;
    });
    const nextTags = [...filteredTags];
    if (buildType === 'iniciante') nextTags.push('iniciante');
    if (buildType === 'avançada') nextTags.push('avançada');
    if (buildType === 'final') nextTags.push('final');
    const baseClass = className || (editDoc && (editDoc.className || editDoc.heroClass)) || '';
    const forum = baseClass ? slugifyClass(baseClass) : '';
    const data = {
      title: title || '',
      author: author || '',
      className: baseClass || '',
      heroClass: baseClass || '',
      classSlug: forum || '',
      forum: forum || '',
      content_html: contentHtml || '',
      tags: nextTags,
      status: status || 'draft',
      updatedAt: serverTimestamp(),
      relics: Array.isArray(relics) ? relics.map((r) => (r || null)) : [null, null, null, null, null],
      potions: Array.isArray(potions) ? potions.map((p) => (p || null)) : [null, null, null, null],
      charms: Array.isArray(charms) ? charms : [],
      mercenary: mercenary || null,
      augments: Array.isArray(augments) ? augments.map((a) => (a || null)) : [null, null, null],
    };
    try {
      if (editDoc && editDoc.id) {
        await setDoc(doc(db, 'builds', editDoc.id), data, { merge: true });
        setMsg('Build atualizada.');
      } else {
        await addDoc(collection(db, 'builds'), {
          ...data,
          createdAt: serverTimestamp(),
        });
        setMsg('Build criada.');
      }
      setModalOpen(false);
      clearForm();
      loadBuilds();
    } catch (e) {
      const code = e && e.code ? e.code : '';
      setMsg(`Falha ao salvar build (${code || 'erro'}).`);
    }
  };

  const confirmDelete = (docObj) => {
    setPendingDelete(docObj);
    setConfirmLabel(docObj.title || '(sem título)');
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!pendingDelete) {
      setConfirmOpen(false);
      return;
    }
    try {
      await deleteDoc(doc(db, 'builds', pendingDelete.id));
    } finally {
      setConfirmOpen(false);
      setPendingDelete(null);
      loadBuilds();
    }
  };

  const approveOrToggle = async (docObj) => {
    let nextStatus = 'published';
    if (docObj.status === 'published') nextStatus = 'draft';
    if (docObj.status === 'draft') nextStatus = 'published';
    if (docObj.status === 'pending') nextStatus = 'published';
    const baseClass = docObj.className || docObj.heroClass || '';
    const forum = baseClass ? slugifyClass(baseClass) : (docObj.classSlug || '');
    await setDoc(doc(db, 'builds', docObj.id), {
      status: nextStatus,
      forum: forum,
      classSlug: forum,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    loadBuilds();
  };

  return (
    <>
      <div className="painel-main">
        <div className="painel-page-header">
          <div>
            <div className="painel-page-title">Forum — Builds</div>
            <div className="painel-page-sub">
              Modere, edite, publique ou exclua builds enviadas pelo botão “Nova Build”.
            </div>
          </div>
          <div>
            <button type="button" className="painel-button" onClick={openNew}>Nova Build</button>
          </div>
        </div>
        <div className="painel-grid">
          <div className="painel-card">
            <div className="painel-card-inner">
              <h2>Builds</h2>
              <div className="painel-row">
                <label style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: '#9ca3af' }}>
                  Filtro
                </label>
                <select className="painel-select" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 220 }}>
                  <option value="all">Todas</option>
                  <option value="published">Publicadas</option>
                  <option value="pending">Pendentes</option>
                  <option value="draft">Rascunhos</option>
                </select>
                <button type="button" className="painel-button" onClick={loadBuilds}>
                  {loading ? 'Carregando...' : 'Recarregar'}
                </button>
              </div>
              <div className="painel-table-wrapper">
                <table className="painel-table">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Classe</th>
                      <th>Autor</th>
                      <th>Forum</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="painel-muted">Nenhuma build encontrada.</td>
                      </tr>
                    ) : (
                      filtered.map((b) => {
                        const rowClassName = b.className || b.heroClass || '';
                        const rowForum = b.forum || b.classSlug || (rowClassName ? slugifyClass(rowClassName) : '');
                        return (
                          <tr key={b.id}>
                            <td>
                              <Link to={`/build/${b.id}`} target="_blank" style={{ color: 'inherit', textDecoration: 'none' }}>
                                <strong>{b.title || '(sem título)'}</strong>
                              </Link>
                            </td>
                            <td>{rowClassName}</td>
                            <td>{b.author || ''}</td>
                            <td>{rowForum}</td>
                            <td><span className="painel-tag">{statusLabel(b.status)}</span></td>
                            <td className="painel-actions-cell">
                              <Link
                                to={`/build/${b.id}`}
                                target="_blank"
                                className="painel-action-btn painel-action-view"
                                title="Visualizar build"
                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                              >
                                👁️
                              </Link>
                              <button type="button" className="painel-action-btn painel-action-edit" title="Editar build" onClick={() => openEdit(b)}>✏️</button>
                              <button
                                type="button"
                                className={`painel-action-btn ${b.status === 'published' ? 'painel-action-toggle-published' : 'painel-action-toggle-draft'}`}
                                title={b.status === 'published' ? 'Mover para rascunho' : (b.status === 'pending' ? 'Aprovar e publicar' : 'Publicar')}
                                onClick={() => approveOrToggle(b)}
                              >
                                {b.status === 'published' ? '☁️' : '📤'}
                              </button>
                              <button type="button" className="painel-action-btn painel-action-delete" title="Excluir build" onClick={() => confirmDelete(b)}>🗑️</button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`painel-modal ${modalOpen ? '' : 'hidden'}`}>
        <div className="painel-modal-backdrop" onClick={() => setModalOpen(false)} />
        <div className="painel-modal-content wide">
          <div className="painel-modal-header">
            <div className="painel-modal-title">{editDoc ? 'Editar Build' : 'Nova Build'}</div>
            <button type="button" className="painel-modal-close" onClick={() => setModalOpen(false)}>×</button>
          </div>
          <div className="painel-modal-body">
            <div className="painel-build-modal-grid">
              <div className="painel-build-form">
                <label className="painel-login-label">Título</label>
                <input className="painel-input" value={title} onChange={(e) => setTitle(e.target.value)} />
                <label className="painel-login-label" style={{ marginTop: 8 }}>Autor</label>
                <input className="painel-input" value={author} onChange={(e) => setAuthor(e.target.value)} />
                <label className="painel-login-label" style={{ marginTop: 8 }}>Classe</label>
                <select className="painel-select" value={className} onChange={(e) => setClassName(e.target.value)}>
                  <option value="">Selecione</option>
                  {KNOWN_CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <label className="painel-login-label" style={{ marginTop: 8 }}>Tipo da Build</label>
                <select className="painel-select" value={buildType} onChange={(e) => setBuildType(e.target.value)}>
                  <option value="">(nenhum / manual nas tags)</option>
                  <option value="iniciante">Iniciante</option>
                  <option value="avançada">Avançada</option>
                  <option value="final">Final</option>
                </select>
                <label className="painel-login-label" style={{ marginTop: 8 }}>Conteúdo (HTML)</label>
                <textarea className="painel-textarea" value={contentHtml} onChange={(e) => setContentHtml(e.target.value)} placeholder="<p>...</p>" />
                <label className="painel-login-label" style={{ marginTop: 8 }}>Tags (separadas por vírgula)</label>
                <input className="painel-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ex.: season 9, viking, endgame" />
                <label className="painel-login-label" style={{ marginTop: 8 }}>Status</label>
                <select className="painel-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="draft">Rascunho</option>
                  <option value="pending">Pendente</option>
                  <option value="published">Publicado</option>
                </select>
                <div style={{ marginTop: 8 }}>
                  <label className="painel-login-label">Relíquias</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {relics.map((name, idx) => {
                      const isQuestSlot = idx === 4;
                      const opt = name ? relicOptions.find((r) => r.name === name) : null;
                      const border = isQuestSlot ? '1px solid rgba(239,68,68,.6)' : '1px solid #e5e7eb';
                      const bg = isQuestSlot ? 'rgba(239,68,68,.08)' : '#f9fafb';
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setRelicPickerIndex(idx)}
                          style={{
                            width: 90, height: 90, border, background: bg, display: 'flex',
                            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: 6, cursor: 'pointer'
                          }}
                          title={isQuestSlot ? 'Slot de relíquia via quest' : 'Selecionar relíquia'}
                        >
                          {opt ? (
                            <>
                              <img src={opt.img} alt={opt.name} style={{ width: 28, height: 28, objectFit: 'contain', marginBottom: 6 }} onError={(e) => handleRelicError(e, opt.name)} />
                              <span style={{ fontSize: 10, textAlign: 'center', color: '#374151' }}>{opt.name}</span>
                            </>
                          ) : (
                            <span style={{ fontSize: 11, color: '#6b7280', textAlign: 'center' }}>
                              {isQuestSlot ? 'Relíquia (Quest)' : 'Selecionar'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {relicPickerIndex !== null && (
                    <div style={{ marginTop: 8, border: '1px solid #e5e7eb', background: '#ffffff', maxHeight: 240, overflow: 'auto' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderBottom: '1px solid #e5e7eb', fontSize: 12, color: '#6b7280' }}>
                        <span>Selecionar relíquia para o slot {relicPickerIndex + 1}</span>
                        <button type="button" className="painel-modal-close" onClick={() => setRelicPickerIndex(null)}>×</button>
                      </div>
                      <button
                        type="button"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', fontSize: 12, color: '#374151', borderBottom: '1px solid #f3f4f6' }}
                        onClick={() => {
                          setRelics((prev) => {
                            const next = prev.slice();
                            next[relicPickerIndex] = null;
                            return next;
                          });
                          setRelicPickerIndex(null);
                        }}
                      >
                        <div style={{ width: 24, height: 24, display: 'grid', placeItems: 'center', border: '1px solid #e5e7eb' }}>×</div>
                        <span>Nenhuma relíquia</span>
                      </button>
                      {relicOptions.map((r) => (
                        <button
                          key={r.name}
                          type="button"
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', fontSize: 12, color: '#111827', borderBottom: '1px solid #f3f4f6' }}
                          onClick={() => {
                            setRelics((prev) => {
                              const next = prev.slice();
                              next[relicPickerIndex] = r.name;
                              return next;
                            });
                            setRelicPickerIndex(null);
                          }}
                        >
                          <img src={r.img} alt={r.name} style={{ width: 24, height: 24, objectFit: 'contain' }} onError={(e) => handleRelicError(e, r.name)} />
                          <span>{r.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <div style={{ marginTop: 16 }}>
                    <label className="painel-login-label">Poções</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {potions.map((name, idx) => {
                        const opt = name ? potionOptions.find((p) => p.name === name) : null;
                        const border = '1px solid #e5e7eb';
                        const bg = '#f9fafb';
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPotionPickerIndex(idx)}
                            style={{
                              width: 90, height: 90, border, background: bg, display: 'flex',
                              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              padding: 6, cursor: 'pointer'
                            }}
                            title="Selecionar poção"
                          >
                            {opt ? (
                              <>
                                <img src={opt.image || opt.img} alt={opt.name} style={{ width: 28, height: 28, objectFit: 'contain', marginBottom: 6 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                <span style={{ fontSize: 10, textAlign: 'center', color: '#374151' }}>{opt.name}</span>
                              </>
                            ) : (
                              <span style={{ fontSize: 11, color: '#6b7280', textAlign: 'center' }}>
                                Selecionar
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {potionPickerIndex !== null && (
                      <div style={{ marginTop: 8, border: '1px solid #e5e7eb', background: '#ffffff', maxHeight: 240, overflow: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderBottom: '1px solid #e5e7eb', fontSize: 12, color: '#6b7280' }}>
                          <span>Selecionar poção para o slot {potionPickerIndex + 1}</span>
                          <button type="button" className="painel-modal-close" onClick={() => setPotionPickerIndex(null)}>×</button>
                        </div>
                        <button
                          type="button"
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', fontSize: 12, color: '#374151', borderBottom: '1px solid #f3f4f6' }}
                          onClick={() => {
                            setPotions((prev) => {
                              const next = prev.slice();
                              next[potionPickerIndex] = null;
                              return next;
                            });
                            setPotionPickerIndex(null);
                          }}
                        >
                          <div style={{ width: 24, height: 24, display: 'grid', placeItems: 'center', border: '1px solid #e5e7eb' }}>×</div>
                          <span>Nenhuma poção</span>
                        </button>
                        {potionOptions.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', fontSize: 12, color: '#111827', borderBottom: '1px solid #f3f4f6' }}
                            onClick={() => {
                              setPotions((prev) => {
                                const next = prev.slice();
                                next[potionPickerIndex] = p.name;
                                return next;
                              });
                              setPotionPickerIndex(null);
                            }}
                          >
                            {(p.image || p.img) && (
                              <img src={p.image || p.img} alt={p.name} style={{ width: 24, height: 24, objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            )}
                            <span>{p.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label className="painel-login-label">Charms</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {[...charms, null].map((name, idx) => {
                        const isAddSlot = !name;
                        const charm = (name && Array.isArray(CHARM_DB)) ? CHARM_DB.find((c) => c.name === name) : null;
                        
                        let borderColor = '#e5e7eb';
                        let bgColor = '#f9fafb';
                        
                        if (charm) {
                          const r = (charm.rarity || '').toUpperCase();
                          if (r === 'SATANIC') { borderColor = '#dc2626'; bgColor = '#fef2f2'; }
                          else if (r.includes('SET')) { borderColor = '#16a34a'; bgColor = '#f0fdf4'; }
                          else if (r === 'ANGELIC') { borderColor = '#0ea5e9'; bgColor = '#f0f9ff'; }
                          else if (r === 'MYTHIC') { borderColor = '#9333ea'; bgColor = '#faf5ff'; }
                          else if (r === 'LEGENDARY') { borderColor = '#d97706'; bgColor = '#fffbeb'; }
                          else if (r === 'RARE') { borderColor = '#ca8a04'; bgColor = '#fefce8'; }
                          else if (r === 'MAGIC') { borderColor = '#2563eb'; bgColor = '#eff6ff'; }
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCharmPickerIndex(idx)}
                            style={{
                              width: 90, height: 90, border: isAddSlot ? '1px dashed #e5e7eb' : `1px solid ${borderColor}`, background: bgColor, display: 'flex',
                              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              padding: 6, cursor: 'pointer', position: 'relative'
                            }}
                            title={isAddSlot ? 'Adicionar Charm' : charm?.name}
                          >
                            {charm ? (
                              <>
                                <img 
                                  src={`https://herosiege.wiki.gg/images/${charm.file}`} 
                                  alt={charm.name} 
                                  style={{ width: 28, height: 28, objectFit: 'contain', marginBottom: 6 }} 
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                                <span style={{ fontSize: 10, textAlign: 'center', color: '#374151', lineHeight: 1.1 }}>{charm.name}</span>
                              </>
                            ) : (
                              <span style={{ fontSize: 18, color: '#9ca3af', fontWeight: 'bold' }}>+</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {charmPickerIndex !== null && (
                      <div style={{ marginTop: 8, border: '1px solid #e5e7eb', background: '#ffffff', maxHeight: 240, overflow: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderBottom: '1px solid #e5e7eb', fontSize: 12, color: '#6b7280' }}>
                          <span>{charmPickerIndex < charms.length ? 'Trocar Charm' : 'Adicionar Charm'}</span>
                          <button type="button" className="painel-modal-close" onClick={() => setCharmPickerIndex(null)}>×</button>
                        </div>
                        {charmPickerIndex < charms.length && (
                          <button
                            type="button"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', fontSize: 12, color: '#ef4444', borderBottom: '1px solid #f3f4f6' }}
                            onClick={() => {
                              setCharms((prev) => {
                                const next = [...prev];
                                next.splice(charmPickerIndex, 1);
                                return next;
                              });
                              setCharmPickerIndex(null);
                            }}
                          >
                            <div style={{ width: 24, height: 24, display: 'grid', placeItems: 'center', border: '1px solid #e5e7eb' }}>×</div>
                            <span>Remover Charm</span>
                          </button>
                        )}
                        {(Array.isArray(CHARM_DB) ? CHARM_DB : []).map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', fontSize: 12, color: '#111827', borderBottom: '1px solid #f3f4f6' }}
                            onClick={() => {
                              setCharms((prev) => {
                                const next = [...prev];
                                if (charmPickerIndex < next.length) {
                                  next[charmPickerIndex] = c.name;
                                } else {
                                  next.push(c.name);
                                }
                                return next;
                              });
                              setCharmPickerIndex(null);
                            }}
                          >
                            <img src={`https://herosiege.wiki.gg/images/${c.file}`} alt={c.name} style={{ width: 24, height: 24, objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label className="painel-login-label">Mercenário</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {[
                        {
                          id: 'knight',
                          name: 'Knight',
                          image: 'https://static.wikia.nocookie.net/herosiege/images/f/f0/Melee_Mercenary.gif'
                        },
                        {
                          id: 'archer',
                          name: 'Archer',
                          image: 'https://static.wikia.nocookie.net/herosiege/images/d/d9/Ranged_Mercenary.gif'
                        },
                        {
                          id: 'magister',
                          name: 'Magister',
                          image: 'https://static.wikia.nocookie.net/herosiege/images/b/be/Spell_Mercenary.gif'
                        }
                      ].map((m) => {
                        const selected = mercenary === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setMercenary(selected ? '' : m.id)}
                            style={{
                              width: 110,
                              height: 90,
                              border: selected ? '1px solid #f59e0b' : '1px solid #e5e7eb',
                              background: selected ? '#fff7ed' : '#f9fafb',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 6,
                              cursor: 'pointer'
                            }}
                            title={m.name}
                          >
                            <img src={m.image} alt={m.name} style={{ width: 32, height: 32, objectFit: 'contain', marginBottom: 6 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            <span style={{ fontSize: 11, textAlign: 'center', color: '#374151' }}>{m.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label className="painel-login-label">Augments</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {augments.map((augName, idx) => {
                        const opt = augName ? augmentOptions.find((a) => a.en === augName || a.name === augName) : null;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAugmentPickerIndex(idx)}
                            style={{
                              width: 90, height: 90, border: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex',
                              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              padding: 6, cursor: 'pointer'
                            }}
                            title="Selecionar Augment"
                          >
                            {opt ? (
                              <>
                                <i className={`fa-solid ${opt.icon}`} style={{ fontSize: 24, marginBottom: 6, color: '#374151' }}></i>
                                <span style={{ fontSize: 10, textAlign: 'center', color: '#374151' }}>{opt.pt || opt.en}</span>
                              </>
                            ) : (
                              <span style={{ fontSize: 11, color: '#6b7280', textAlign: 'center' }}>
                                Selecionar
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {augmentPickerIndex !== null && (
                      <div style={{ marginTop: 8, border: '1px solid #e5e7eb', background: '#ffffff', maxHeight: 240, overflow: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderBottom: '1px solid #e5e7eb', fontSize: 12, color: '#6b7280' }}>
                          <span>Selecionar Augment para o slot {augmentPickerIndex + 1}</span>
                          <button type="button" className="painel-modal-close" onClick={() => setAugmentPickerIndex(null)}>×</button>
                        </div>
                        <button
                          type="button"
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', fontSize: 12, color: '#374151', borderBottom: '1px solid #f3f4f6' }}
                          onClick={() => {
                            setAugments((prev) => {
                              const next = prev.slice();
                              next[augmentPickerIndex] = null;
                              return next;
                            });
                            setAugmentPickerIndex(null);
                          }}
                        >
                          <div style={{ width: 24, height: 24, display: 'grid', placeItems: 'center', border: '1px solid #e5e7eb' }}>×</div>
                          <span>Nenhum Augment</span>
                        </button>
                        {augmentOptions.map((a) => (
                          <button
                            key={a.en}
                            type="button"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', fontSize: 12, color: '#111827', borderBottom: '1px solid #f3f4f6' }}
                            onClick={() => {
                              setAugments((prev) => {
                                const next = prev.slice();
                                next[augmentPickerIndex] = a.en;
                                return next;
                              });
                              setAugmentPickerIndex(null);
                            }}
                          >
                            <i className={`fa-solid ${a.icon}`} style={{ width: 24, textAlign: 'center' }}></i>
                            <span>{a.pt || a.en}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="painel-row" style={{ marginTop: 12, justifyContent: 'flex-end' }}>
                  <button type="button" className="painel-button" onClick={clearForm}>Limpar</button>
                  <button type="button" className="painel-button" onClick={handleSave}>Salvar</button>
                </div>
                <div className="painel-muted" style={{ marginTop: 6 }}>{msg}</div>
              </div>
              <div className="painel-build-preview">
                <div className="painel-build-preview-header">
                  <div className="painel-build-preview-title">{title || '(sem título)'}</div>
                  {buildType ? <span className="painel-build-type-tag">{buildType}</span> : null}
                </div>
                <div className="painel-build-preview-meta">
                  {(className || '(classe)')} • {(author || '(autor)')}
                </div>
                <div className="painel-build-preview-content" dangerouslySetInnerHTML={{ __html: contentHtml || '' }} />
                {relics.some((r) => r) ? (
                  <div style={{ marginTop: 8 }}>
                    <div className="painel-login-label" style={{ marginBottom: 6 }}>Relíquias</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {relics.map((name, idx) => {
                        if (!name) return null;
                        const opt = relicOptions.find((r) => r.name === name);
                        const isQuest = idx === 4;
                        return (
                          <div key={`${name}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 6, border: isQuest ? '1px solid rgba(239,68,68,.6)' : '1px solid #e5e7eb', padding: '4px 6px', background: isQuest ? 'rgba(239,68,68,.06)' : '#f9fafb' }}>
                            <img src={opt?.img} alt={name} style={{ width: 18, height: 18, objectFit: 'contain' }} onError={(e) => handleRelicError(e, name)} />
                            <span style={{ fontSize: 11 }}>{name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
                {potions.some((p) => p) ? (
                  <div style={{ marginTop: 8 }}>
                    <div className="painel-login-label" style={{ marginBottom: 6 }}>Poções</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {potions.map((name, idx) => {
                        if (!name) return null;
                        const opt = potionOptions.find((p) => p.name === name);
                        return (
                          <div key={`${name}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #e5e7eb', padding: '4px 6px', background: '#f9fafb' }}>
                            {(opt?.image || opt?.img) && (
                              <img src={opt.image || opt.img} alt={name} style={{ width: 18, height: 18, objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            )}
                            <span style={{ fontSize: 11 }}>{name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
                {charms.length > 0 ? (
                  <div style={{ marginTop: 8 }}>
                    <div className="painel-login-label" style={{ marginBottom: 6 }}>Charms</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {charms.map((name, idx) => {
                        const charm = CHARM_DB.find((c) => c.name === name);
                        if (!charm) return null;
                        
                        let borderColor = '#e5e7eb';
                        let bgColor = '#f9fafb';
                        const r = (charm.rarity || '').toUpperCase();
                        if (r === 'SATANIC') { borderColor = '#dc2626'; bgColor = '#fef2f2'; }
                        else if (r.includes('SET')) { borderColor = '#16a34a'; bgColor = '#f0fdf4'; }
                        else if (r === 'ANGELIC') { borderColor = '#0ea5e9'; bgColor = '#f0f9ff'; }
                        else if (r === 'MYTHIC') { borderColor = '#9333ea'; bgColor = '#faf5ff'; }
                        else if (r === 'LEGENDARY') { borderColor = '#d97706'; bgColor = '#fffbeb'; }
                        else if (r === 'RARE') { borderColor = '#ca8a04'; bgColor = '#fefce8'; }
                        else if (r === 'MAGIC') { borderColor = '#2563eb'; bgColor = '#eff6ff'; }

                        return (
                          <div key={`${name}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${borderColor}`, padding: '4px 6px', background: bgColor }}>
                            <img src={`https://herosiege.wiki.gg/images/${charm.file}`} alt={name} style={{ width: 18, height: 18, objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            <span style={{ fontSize: 11 }}>{name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
                {mercenary ? (
                  <div style={{ marginTop: 8 }}>
                    <div className="painel-login-label" style={{ marginBottom: 6 }}>Mercenário</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {(() => {
                        const all = [
                          {
                            id: 'knight',
                            name: 'Knight',
                            image: 'https://static.wikia.nocookie.net/herosiege/images/f/f0/Melee_Mercenary.gif'
                          },
                          {
                            id: 'archer',
                            name: 'Archer',
                            image: 'https://static.wikia.nocookie.net/herosiege/images/d/d9/Ranged_Mercenary.gif'
                          },
                          {
                            id: 'magister',
                            name: 'Magister',
                            image: 'https://static.wikia.nocookie.net/herosiege/images/b/be/Spell_Mercenary.gif'
                          }
                        ];
                        const info = all.find((m) => m.id === mercenary);
                        if (!info) return null;
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #e5e7eb', padding: '4px 6px', background: '#f9fafb' }}>
                            <img src={info.image} alt={info.name} style={{ width: 18, height: 18, objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            <span style={{ fontSize: 11 }}>{info.name}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ) : null}
                {augments && augments.some(a => a) ? (
                  <div style={{ marginTop: 8 }}>
                    <div className="painel-login-label" style={{ marginBottom: 6 }}>Augments</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {augments.map((augName, idx) => {
                        if (!augName) return null;
                        const opt = augmentOptions.find((a) => a.en === augName || a.name === augName);
                        return (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #e5e7eb', padding: '4px 6px', background: '#f9fafb' }}>
                            {opt ? <i className={`fa-solid ${opt.icon}`} style={{ fontSize: 14, color: '#374151' }}></i> : null}
                            <span style={{ fontSize: 11 }}>{opt ? (opt.pt || opt.en) : augName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`painel-modal ${confirmOpen ? '' : 'hidden'}`}>
        <div className="painel-modal-backdrop" onClick={() => setConfirmOpen(false)} />
        <div className="painel-modal-content small">
          <div className="painel-modal-header">
            <div className="painel-modal-title">Confirmar exclusão</div>
          </div>
          <div className="painel-modal-body">
            <p className="painel-muted">Tem certeza que deseja excluir a build &quot;{confirmLabel}&quot;?</p>
            <div className="painel-row" style={{ marginTop: 16, justifyContent: 'flex-end' }}>
              <button type="button" className="painel-button" onClick={() => setConfirmOpen(false)}>Cancelar</button>
              <button type="button" className="painel-button painel-danger-text" onClick={handleDelete}>Excluir</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PainelHomepage() {
  const classes = KNOWN_CLASSES;
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState('fixed');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [tiers, setTiers] = useState({
    S: ['Necromancer', 'Pyromancer', 'Viking'],
    A: ['Samurai', 'Paladin', 'Marksman', 'Nomad'],
    B: ['Redneck', 'Pirate', 'Shield Lancer'],
    C: [],
    D: [],
    E: [],
  });
  const [tierSaving, setTierSaving] = useState(false);
  const [tierMsg, setTierMsg] = useState('');
  const [fullOpen, setFullOpen] = useState(false);
  const [randomPreviewIndex, setRandomPreviewIndex] = useState(() => (classes.length ? Math.floor(Math.random() * classes.length) : 0));
  const [rotationSeconds, setRotationSeconds] = useState(15);

  useEffect(() => {
    const ref = doc(db, 'config', 'homepage');
    const unsub = onSnapshot(ref, (snap) => {
      const d = snap.data() || {};
      setSelected(d.featuredClass || null);
      setMode(d.mode || 'fixed');
       if (typeof d.rotationSeconds === 'number' && d.rotationSeconds > 0) {
         setRotationSeconds(d.rotationSeconds);
       } else {
         setRotationSeconds(15);
       }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (mode !== 'random') return;
    if (!classes.length) return;
    const computeIndex = () => {
      const intervalMs = Math.max(5, rotationSeconds || 15) * 1000;
      const bucket = Math.floor(Date.now() / intervalMs);
      const idx = bucket % classes.length;
      setRandomPreviewIndex(idx);
    };
    computeIndex();
    const intervalMs = Math.max(5, rotationSeconds || 15) * 1000;
    const id = setInterval(computeIndex, intervalMs);
    return () => clearInterval(id);
  }, [mode, classes.length, rotationSeconds]);

  useEffect(() => {
    const ref = doc(db, 'config', 'tierlist');
    const unsub = onSnapshot(ref, (snap) => {
      const d = snap.data() || {};
      const next = {
        S: Array.isArray(d.S) ? d.S : ['Necromancer', 'Pyromancer', 'Viking'],
        A: Array.isArray(d.A) ? d.A : ['Samurai', 'Paladin', 'Marksman', 'Nomad'],
        B: Array.isArray(d.B) ? d.B : ['Redneck', 'Pirate', 'Shield Lancer'],
        C: Array.isArray(d.C) ? d.C : [],
        D: Array.isArray(d.D) ? d.D : [],
        E: Array.isArray(d.E) ? d.E : [],
      };
      setTiers(next);
    });
    return () => unsub();
  }, []);

  const save = async (nextSelected, nextMode, prevSelected, prevMode, nextRotationSeconds) => {
    const ref = doc(db, 'config', 'homepage');
    setSaving(true);
    setStatus('Salvando...');
    try {
      const rotation = typeof nextRotationSeconds === 'number' && nextRotationSeconds > 0
        ? nextRotationSeconds
        : rotationSeconds;
      await setDoc(ref, {
        featuredClass: nextMode === 'fixed' ? nextSelected : null,
        mode: nextMode,
        rotationSeconds: rotation,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setStatus('Configuração salva.');
      return true;
    } catch (e) {
      const code = e && e.code ? e.code : 'erro';
      try {
        // Log detalhado para o console do navegador
        // eslint-disable-next-line no-console
        console.error('Erro ao salvar config homepage:', e);
      } catch (_) {}
      setStatus(`Falha ao salvar (${code}).`);
      setSelected(prevSelected);
      setMode(prevMode);
      return false;
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const selectFixed = (cls) => {
    const prevSel = selected;
    const prevMode = mode;
    setMode('fixed');
    setSelected(cls);
    save(cls, 'fixed', prevSel, prevMode);
  };

  const activateRandom = () => {
    const prevSel = selected;
    const prevMode = mode;
    setMode('random');
    setSelected(null);
    save(null, 'random', prevSel, prevMode);
  };

  const imageFor = (name) => {
    const base = String(name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '');
    const pub = process.env.PUBLIC_URL || '';
    return `${pub}/images/${base}.webp`;
  };

  const allPlaced = useMemo(() => {
    return new Set([...(tiers.S||[]), ...(tiers.A||[]), ...(tiers.B||[]), ...(tiers.C||[]), ...(tiers.D||[]), ...(tiers.E||[])]);
  }, [tiers]);

  const available = useMemo(() => {
    return classes.filter(c => !allPlaced.has(c));
  }, [classes, allPlaced]);

  const saveTiers = async (next) => {
    setTierSaving(true);
    setTierMsg('Salvando tierlist...');
    try {
      await setDoc(doc(db, 'config', 'tierlist'), {
        S: next.S || [],
        A: next.A || [],
        B: next.B || [],
        C: next.C || [],
        D: next.D || [],
        E: next.E || [],
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setTierMsg('Tierlist salva.');
    } catch (e) {
      const code = e && e.code ? e.code : 'erro';
      setTierMsg(`Falha ao salvar tierlist (${code}).`);
    } finally {
      setTierSaving(false);
      setTimeout(() => setTierMsg(''), 3000);
    }
  };

  const onDragStartClass = (e, cls, from) => {
    try {
      e.dataTransfer.setData('text/plain', JSON.stringify({ cls, from }));
    } catch {
      e.dataTransfer.setData('text/plain', cls);
    }
  };

  const onDropToTier = (e, target) => {
    e.preventDefault();
    let data = null;
    try {
      data = JSON.parse(e.dataTransfer.getData('text/plain'));
    } catch {
      const cls = e.dataTransfer.getData('text/plain');
      data = { cls, from: null };
    }
    const cls = data && data.cls ? data.cls : null;
    if (!cls) return;
    const next = { ...tiers, S:[...tiers.S], A:[...tiers.A], B:[...tiers.B], C:[...tiers.C], D:[...tiers.D], E:[...tiers.E] };
    ['S','A','B','C','D','E'].forEach(k => {
      const idx = next[k].indexOf(cls);
      if (idx >= 0) next[k].splice(idx, 1);
    });
    next[target] = [...next[target], cls];
    setTiers(next);
    saveTiers(next);
  };

  const onDropToAvailable = (e) => {
    e.preventDefault();
    let data = null;
    try {
      data = JSON.parse(e.dataTransfer.getData('text/plain'));
    } catch {
      const cls = e.dataTransfer.getData('text/plain');
      data = { cls, from: null };
    }
    const cls = data && data.cls ? data.cls : null;
    if (!cls) return;
    const next = { ...tiers, S:[...tiers.S], A:[...tiers.A], B:[...tiers.B], C:[...tiers.C], D:[...tiers.D], E:[...tiers.E] };
    ['S','A','B','C','D','E'].forEach(k => {
      const idx = next[k].indexOf(cls);
      if (idx >= 0) next[k].splice(idx, 1);
    });
    setTiers(next);
    saveTiers(next);
  };

  const downloadFullTierlistImage = async () => {
    const rowKeys = ['S','A','B','C','D','E'];
    const colors = {
      S: '#dc2626',
      A: '#f97316',
      B: '#eab308',
      C: '#84cc16',
      D: '#22c55e',
      E: '#6b7280',
    };
    const w = 1024;
    const pad = 24;
    const labelSize = 48;
    const iconSize = 40;
    const gap = 8;
    const rowGap = 16;
    let height = pad;
    const rows = [];
    rowKeys.forEach(k => {
      const rowH = Math.max(labelSize, iconSize) + pad;
      rows.push({ key:k, y: height, h: rowH });
      height += rowH + rowGap;
    });
    height += pad;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#151923';
    ctx.fillRect(0, 0, w, height);
    ctx.font = 'bold 20px Segoe UI, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    const loadImg = (src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
      img.crossOrigin = 'anonymous';
    });
    const tasks = [];
    rows.forEach(row => {
      const k = row.key;
      const y = row.y;
      ctx.fillStyle = colors[k] || '#6b7280';
      ctx.fillRect(pad, y, labelSize, labelSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(k, pad + labelSize/2, y + labelSize/2);
      let x = pad + labelSize + 16;
      (tiers[k] || []).forEach(cls => {
        const src = imageFor(cls);
        tasks.push({ x, y: y + Math.max(0, (labelSize - iconSize)/2), src });
        x += iconSize + gap;
      });
    });
    for (let i=0;i<tasks.length;i++) {
      const t = tasks[i];
      // eslint-disable-next-line no-await-in-loop
      const img = await loadImg(t.src);
      if (img) ctx.drawImage(img, t.x, t.y, iconSize, iconSize);
    }
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tierlist.png';
    a.click();
  };

  const activeLabel = mode === 'random'
    ? 'Rotação aleatória entre as classes'
    : (selected ? `Classe destacada: ${selected}` : 'Nenhuma classe selecionada');

  const previewImage = mode === 'random'
    ? imageFor(classes[randomPreviewIndex] || classes[0])
    : (selected ? imageFor(selected) : imageFor(classes[0]));

  return (
    <div className="painel-main">
      <div className="painel-page-header">
        <div>
          <div className="painel-page-title">Homepage</div>
          <div className="painel-page-sub">
            Defina qual classe aparece na imagem principal da homepage ou ative rotação aleatória.
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="painel-badge">Homepage</div>
          {status && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{status}</div>}
        </div>
      </div>
      <div className="painel-card">
        <div className="painel-card-inner">
          <h2>Visualização atual</h2>
          <div className="painel-homepage-preview">
            <div className="painel-homepage-preview-img">
              <img src={previewImage} alt={selected || classes[0]} onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
            <div className="painel-homepage-preview-info">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{activeLabel}</div>
              <div>
                Quando o modo aleatório estiver ativo, a homepage irá alternar automaticamente entre as classes.
              </div>
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="painel-button"
              onClick={() => setMode('fixed')}
              style={mode === 'fixed' ? { background: '#0b1120', borderColor: '#f97316' } : {}}
              disabled={saving}
            >
              Modo fixo
            </button>
            <button
              type="button"
              className="painel-button"
              onClick={activateRandom}
              style={mode === 'random' ? { background: '#0b1120', borderColor: '#22c55e' } : {}}
              disabled={saving}
            >
              Modo aleatório
            </button>
          </div>
          <div style={{ marginTop: 16, fontSize: 11, color: '#9ca3af' }}>
            Tempo de rotação (segundos)
          </div>
          <div style={{ marginTop: 4 }}>
            <input
              type="number"
              min={5}
              max={300}
              step={5}
              value={rotationSeconds}
              onChange={(e) => {
                const raw = parseInt(e.target.value, 10);
                const next = Number.isNaN(raw) ? 15 : Math.min(300, Math.max(5, raw));
                setRotationSeconds(next);
                save(selected, mode, selected, mode, next);
              }}
              style={{
                width: 120,
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid #4b5563',
                background: '#020617',
                color: '#e5e7eb',
                fontSize: 13,
              }}
              disabled={saving}
            />
          </div>
          <div style={{ marginTop: 24, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.18em', color: '#9ca3af' }}>
            Selecione a classe destacada
          </div>
          <div className="painel-homepage-grid">
            {classes.map((c) => {
              const img = imageFor(c);
              const isActive = mode === 'fixed' && selected === c;
              return (
                <button
                  key={c}
                  type="button"
                  className={`painel-homepage-thumb ${isActive ? 'active' : ''}`}
                  onClick={() => selectFixed(c)}
                  disabled={saving}
                >
                  <img src={img} alt={c} onError={(e) => e.currentTarget.style.display = 'none'} />
                  <span>{c}</span>
                </button>
              );
            })}
            <button
              type="button"
              className={`painel-homepage-thumb random ${mode === 'random' ? 'active' : ''}`}
              onClick={activateRandom}
              disabled={saving}
            >
              <span>Modo aleatório</span>
            </button>
          </div>
        </div>
      </div>
      <div className="painel-card">
        <div className="painel-card-inner">
          <h2>Season 9 Tier List</h2>
          <div className="painel-page-sub" style={{ marginBottom: 16 }}>
            Arraste as classes para as categorias desejadas. As mudanças são salvas automaticamente.
          </div>
          {tierMsg && <div className="painel-muted" style={{ fontSize: 11, marginBottom: 8 }}>{tierMsg}</div>}
          <div style={{ display: 'grid', gap: 12 }}>
            {['S', 'A', 'B', 'C', 'D', 'E'].map((k) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 900,
                    color: '#fff',
                    background:
                      k === 'S'
                        ? '#dc2626'
                        : k === 'A'
                          ? '#f97316'
                          : k === 'B'
                            ? '#eab308'
                            : k === 'C'
                              ? '#84cc16'
                              : k === 'D'
                                ? '#22c55e'
                                : '#6b7280',
                    boxShadow:
                      k === 'S'
                        ? '0 0 15px rgba(220,38,38,.5)'
                        : k === 'A'
                          ? '0 0 15px rgba(249,115,22,.5)'
                          : k === 'B'
                            ? '0 0 15px rgba(234,179,8,.5)'
                            : 'none',
                  }}
                >
                  {k}
                </div>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDropToTier(e, k)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    minHeight: 48,
                    border: '1px dashed #e5e7eb',
                    padding: 8,
                    borderRadius: 8,
                  }}
                >
                  {(tiers[k] || []).map((cls) => (
                    <img
                      key={cls}
                      draggable
                      onDragStart={(e) => onDragStartClass(e, cls, k)}
                      src={imageFor(cls)}
                      alt={cls}
                      title={cls}
                      onError={(e) => e.currentTarget.style.display = 'none'}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.4))',
                        background: '#0b0f19',
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="painel-page-sub" style={{ marginBottom: 8 }}>
              Disponíveis (não atribuídas a nenhuma tier):
            </div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDropToAvailable}
              style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
                border: '1px dashed #e5e7eb',
                padding: 8,
                borderRadius: 8,
                minHeight: 48,
              }}
            >
              {available.map((cls) => (
                <img
                  key={cls}
                  draggable
                  onDragStart={(e) => onDragStartClass(e, cls, 'pool')}
                  src={imageFor(cls)}
                  alt={cls}
                  title={cls}
                  onError={(e) => e.currentTarget.style.display = 'none'}
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.4))',
                    background: '#0b0f19',
                  }}
                />
              ))}
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="painel-button"
              onClick={() => setFullOpen(true)}
            >
              Ver tierlist completa
            </button>
            <button
              type="button"
              className="painel-button"
              onClick={downloadFullTierlistImage}
              disabled={tierSaving}
            >
              Baixar imagem
            </button>
          </div>
        </div>
      </div>
      <div className={`painel-modal ${fullOpen ? '' : 'hidden'}`}>
        <div className="painel-modal-backdrop" onClick={() => setFullOpen(false)} />
        <div className="painel-modal-content">
          <div className="painel-modal-header">
            <div className="painel-modal-title">Tier List Completa</div>
            <button type="button" className="painel-modal-close" onClick={() => setFullOpen(false)}>✕</button>
          </div>
          <div className="painel-modal-body">
            <div style={{ display:'grid', gap:12 }}>
              {['S','A','B','C','D','E'].map((k) => (
                <div key={k} style={{ display:'flex', alignItems:'center', gap:16 }}>
                  <div style={{
                    width:48, height:48, display:'grid', placeItems:'center',
                    fontWeight:900, color:'#fff',
                    background: k==='S' ? '#dc2626' : k==='A' ? '#f97316' : k==='B' ? '#eab308' : k==='C' ? '#84cc16' : k==='D' ? '#22c55e' : '#6b7280',
                    boxShadow: k==='S' ? '0 0 15px rgba(220,38,38,.5)' : k==='A' ? '0 0 15px rgba(249,115,22,.5)' : k==='B' ? '0 0 15px rgba(234,179,8,.5)' : 'none'
                  }}>{k}</div>
                  <div style={{ flex:1, display:'flex', gap:8, flexWrap:'wrap', minHeight:48 }}>
                    {(tiers[k]||[]).map(cls => (
                      <img
                        key={cls}
                        src={imageFor(cls)}
                        alt={cls}
                        title={cls}
                        onError={(e) => e.currentTarget.style.display = 'none'}
                        style={{ width:40, height:40, objectFit:'contain', filter:'drop-shadow(0 2px 4px rgba(0,0,0,.4))', background:'#0b0f19' }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="painel-row" style={{ marginTop:16, justifyContent:'flex-end' }}>
              <button type="button" className="painel-button" onClick={downloadFullTierlistImage}>Baixar imagem</button>
              <button type="button" className="painel-button" onClick={() => setFullOpen(false)}>Fechar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PainelBlog() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
  );
  const [image, setImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const [msg, setMsg] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLabel, setConfirmLabel] = useState('');

  const filteredPosts = useMemo(() => {
    let arr = posts;
    if (filter !== 'all') {
      arr = arr.filter((p) => (p.status || 'draft') === filter);
    }
    return arr;
  }, [posts, filter]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const qs = await getDocs(collection(db, 'posts'));
      const arr = [];
      qs.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      arr.sort((a, b) => {
        const at = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0;
        const bt = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0;
        return bt - at;
      });
      setPosts(arr);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const clearForm = () => {
    setEditPost(null);
    setAuthor('');
    setTitle('');
    setImage('');
    setExcerpt('');
    setContentHtml('');
    setTags('');
    setStatus('draft');
    setDate(
      new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
    );
    setMsg('');
  };

  const openNewPost = () => {
    clearForm();
    setModalOpen(true);
  };

  const openEditPost = (p) => {
    setEditPost(p);
    setAuthor(p.author || '');
    setTitle(p.title || '');
    setDate(p.date || '');
    setImage(p.image || '');
    setExcerpt(p.excerpt || '');
    setContentHtml(p.content_html || '');
    setTags(Array.isArray(p.tags) ? p.tags.join(', ') : '');
    setStatus(p.status || 'draft');
    setMsg(`Editando: ${p.title || p.id}`);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setMsg('Salvando...');
    const rawTags = (tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const uniqTags = Array.from(new Set(rawTags));
    const data = {
      author: author || '',
      title: title || '',
      date: date || '',
      image: image || '',
      excerpt: excerpt || '',
      content_html: contentHtml || '',
      tags: uniqTags,
      status: status || 'draft',
      updatedAt: serverTimestamp(),
    };
    try {
      if (editPost && editPost.id) {
        await setDoc(doc(db, 'posts', editPost.id), data, { merge: true });
        setMsg('Post atualizado.');
      } else {
        await addDoc(collection(db, 'posts'), {
          ...data,
          createdAt: serverTimestamp(),
        });
        setMsg('Post criado.');
      }
      clearForm();
      setModalOpen(false);
      loadPosts();
    } catch (e) {
      const code = e && e.code ? e.code : '';
      if (code === 'permission-denied') {
        setMsg('Permissão negada: verifique as Regras do Firestore para o projeto.');
      } else {
        setMsg(`Falha ao salvar post (erro: ${code || 'desconhecido'}).`);
      }
    }
  };

  const handleToggleStatus = async (p) => {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    await setDoc(
      doc(db, 'posts', p.id),
      { status: newStatus, updatedAt: serverTimestamp() },
      { merge: true },
    );
    loadPosts();
  };

  const confirmDeletePost = (p) => {
    setPendingDelete(p);
    setConfirmLabel(p.title || '(sem título)');
    setConfirmOpen(true);
  };

  const handleDeletePost = async () => {
    if (!pendingDelete) {
      setConfirmOpen(false);
      return;
    }
    try {
      await deleteDoc(doc(db, 'posts', pendingDelete.id));
    } finally {
      setConfirmOpen(false);
      setPendingDelete(null);
      loadPosts();
    }
  };

  return (
    <>
      <div className="painel-main">
        <div className="painel-page-header">
          <div>
            <div className="painel-page-title">Gerenciar Blog</div>
            <div className="painel-page-sub">
              Crie, edite e publique notícias para o site Hero Siege Brasil.
            </div>
          </div>
          <div>
            <button
              type="button"
              className="painel-button"
              onClick={openNewPost}
            >
              Nova Postagem
            </button>
          </div>
        </div>
        <div className="painel-grid">
          <div className="painel-card">
            <div className="painel-card-inner">
              <h2>Posts</h2>
              <div className="painel-row">
                <label
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '.12em',
                    color: '#9ca3af',
                  }}
                >
                  Filtro
                </label>
                <select
                  className="painel-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ maxWidth: 180 }}
                >
                  <option value="all">Todos</option>
                  <option value="published">Publicados</option>
                  <option value="draft">Rascunhos</option>
                </select>
                <button
                  type="button"
                  className="painel-button"
                  onClick={loadPosts}
                >
                  {loading ? 'Carregando...' : 'Recarregar'}
                </button>
              </div>
              <div className="painel-table-wrapper">
                <table className="painel-table">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Data</th>
                      <th>Autor</th>
                      <th>Tags</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="painel-muted">
                          Nenhum post encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredPosts.map((p) => {
                        const tagList = Array.isArray(p.tags) ? p.tags : [];
                        const statusClass =
                          p.status === 'published'
                            ? 'painel-tag'
                            : 'painel-tag';
                        return (
                          <tr key={p.id}>
                            <td>
                              <strong>{p.title || '(sem título)'}</strong>
                            </td>
                            <td>{p.date || ''}</td>
                            <td>{p.author || ''}</td>
                            <td>
                              {tagList.map((t) => (
                                <span key={t} className="painel-tag">
                                  {t}
                                </span>
                              ))}
                            </td>
                            <td>
                              <span className={statusClass}>
                                {p.status || 'draft'}
                              </span>
                            </td>
                            <td className="painel-actions-cell">
                              <button
                                type="button"
                                className="painel-action-btn painel-action-edit"
                                title="Editar post"
                                onClick={() => openEditPost(p)}
                              >
                                ✏️
                              </button>
                              <button
                                type="button"
                                className={`painel-action-btn ${
                                  p.status === 'published'
                                    ? 'painel-action-toggle-published'
                                    : 'painel-action-toggle-draft'
                                }`}
                                title={
                                  p.status === 'published'
                                    ? 'Mover para rascunho'
                                    : 'Publicar post'
                                }
                                onClick={() => handleToggleStatus(p)}
                              >
                                {p.status === 'published' ? '☁️' : '📤'}
                              </button>
                              <button
                                type="button"
                                className="painel-action-btn painel-action-delete"
                                title="Excluir post"
                                onClick={() => confirmDeletePost(p)}
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`painel-modal ${modalOpen ? '' : 'hidden'}`}>
        <div className="painel-modal-backdrop" onClick={() => setModalOpen(false)} />
        <div className="painel-modal-content">
          <div className="painel-modal-header">
            <div className="painel-modal-title">
              {editPost ? 'Editar Postagem' : 'Nova Postagem'}
            </div>
            <button
              type="button"
              className="painel-modal-close"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="painel-modal-body">
            <label className="painel-login-label" htmlFor="painel-author">
              Autor
            </label>
            <input
              id="painel-author"
              className="painel-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nome do autor"
            />
            <label className="painel-login-label" htmlFor="painel-title">
              Título
            </label>
            <input
              id="painel-title"
              className="painel-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da notícia"
            />
            <label className="painel-login-label" htmlFor="painel-date">
              Data (exibição)
            </label>
            <input
              id="painel-date"
              className="painel-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Ex.: Mar 10, 2026"
            />
            <label className="painel-login-label" htmlFor="painel-image">
              Imagem (URL)
            </label>
            <input
              id="painel-image"
              className="painel-input"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
            />
            <label className="painel-login-label" htmlFor="painel-excerpt">
              Resumo
            </label>
            <input
              id="painel-excerpt"
              className="painel-input"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Resumo curto"
            />
            <label className="painel-login-label" htmlFor="painel-content">
              Conteúdo (HTML)
            </label>
            <textarea
              id="painel-content"
              className="painel-textarea"
              value={contentHtml}
              onChange={(e) => setContentHtml(e.target.value)}
              placeholder="<p>...</p>"
            />
            <label className="painel-login-label" htmlFor="painel-tags">
              Tags (separadas por vírgula)
            </label>
            <input
              id="painel-tags"
              className="painel-input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ex.: season 9, prophet, patch"
            />
            <label className="painel-login-label" htmlFor="painel-status">
              Status
            </label>
            <select
              id="painel-status"
              className="painel-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
            <div
              className="painel-row"
              style={{ marginTop: 12, justifyContent: 'flex-end' }}
            >
              <button
                type="button"
                className="painel-button"
                onClick={clearForm}
              >
                Limpar
              </button>
              <button
                type="button"
                className="painel-button"
                onClick={handleSave}
              >
                Salvar
              </button>
            </div>
            <div
              className="painel-muted"
              style={{ marginTop: 6 }}
            >
              {msg}
            </div>
          </div>
        </div>
      </div>

      <div className={`painel-modal ${confirmOpen ? '' : 'hidden'}`}>
        <div className="painel-modal-backdrop" onClick={() => setConfirmOpen(false)} />
        <div className="painel-modal-content small">
          <div className="painel-modal-header">
            <div className="painel-modal-title">Confirmar exclusão</div>
          </div>
          <div className="painel-modal-body">
            <p className="painel-muted">
              Tem certeza que deseja excluir o post &quot;{confirmLabel}&quot;?
            </p>
            <div
              className="painel-row"
              style={{ marginTop: 16, justifyContent: 'flex-end' }}
            >
              <button
                type="button"
                className="painel-button"
                onClick={() => setConfirmOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="painel-button painel-danger-text"
                onClick={handleDeletePost}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PainelComments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editAuthor, setEditAuthor] = useState('');
  const [editText, setEditText] = useState('');
  const [editApproved, setEditApproved] = useState(false);
  const [confirmDelOpen, setConfirmDelOpen] = useState(false);
  const [delItem, setDelItem] = useState(null);
  const [delLabel, setDelLabel] = useState('');

  const loadComments = async () => {
    setLoading(true);
    setMessage('');
    const results = [];
    try {
      const qs = await getDocs(collectionGroup(db, 'comments'));
      if (qs.empty) {
        setItems([]);
        setMessage('Sem comentários.');
        setLoading(false);
        return;
      }
      const promises = [];
      qs.forEach((d) => {
        const c = d.data();
        const parentRef = d.ref.parent.parent;
        promises.push(
          (async () => {
            let postTitle = '(post)';
            let postId = '';
            if (parentRef) {
              const postDoc = await getDoc(parentRef);
              postTitle =
                postDoc && postDoc.exists()
                  ? (postDoc.data().title || postDoc.id)
                  : '(post)';
              postId = parentRef.id;
            }
            results.push({
              id: d.id,
              ref: d.ref,
              author: c && c.author ? c.author : 'Anônimo',
              text: c && c.text ? c.text : '',
              approved: c && c.approved === true,
              postTitle,
              postId,
            });
          })(),
        );
      });
      await Promise.all(promises);
      if (results.length === 0) {
        setItems([]);
        setMessage('Sem comentários.');
      } else {
        setItems(results);
      }
    } catch (e) {
      const code = e && e.code ? e.code : 'erro';
      setItems([]);
      setMessage(`Falha ao carregar comentários (${code}).`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleToggleApprove = async (item) => {
    const next = item.approved ? false : true;
    await setDoc(item.ref, { approved: next, updatedAt: serverTimestamp() }, { merge: true });
    loadComments();
  };

  const askDelete = (item) => {
    setDelItem(item);
    setDelLabel((item && item.text) ? (item.text.length > 60 ? item.text.slice(0, 60) + '…' : item.text) : item?.id || '');
    setConfirmDelOpen(true);
  };
  const confirmDelete = async () => {
    if (!delItem) {
      setConfirmDelOpen(false);
      return;
    }
    try {
      await deleteDoc(delItem.ref);
    } finally {
      setConfirmDelOpen(false);
      setDelItem(null);
      loadComments();
    }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setEditAuthor(item.author || '');
    setEditText(item.text || '');
    setEditApproved(!!item.approved);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editItem) {
      setEditOpen(false);
      return;
    }
    await setDoc(editItem.ref, {
      author: editAuthor || 'Anônimo',
      text: editText || '',
      approved: !!editApproved,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    setEditOpen(false);
    setEditItem(null);
    loadComments();
  };

  const filtered = useMemo(() => {
    if (filter === 'pending') return items.filter(i => !i.approved);
    if (filter === 'approved') return items.filter(i => i.approved);
    return items;
  }, [items, filter]);

  return (
    <div className="painel-main">
      <div className="painel-page-header">
        <div>
          <div className="painel-page-title">Moderar Comentários</div>
          <div className="painel-page-sub">
            Aprove, edite ou exclua comentários nas páginas de classes e posts.
          </div>
        </div>
        <div className="painel-row">
          <select className="painel-select" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 180 }}>
            <option value="all">Todos</option>
            <option value="pending">Pendentes</option>
            <option value="approved">Aprovados</option>
          </select>
          <button type="button" className="painel-button" onClick={loadComments}>
            {loading ? 'Atualizando...' : 'Recarregar'}
          </button>
        </div>
      </div>
      <div className="painel-card">
        <div className="painel-card-inner">
          <h2>Comentários</h2>
          {message && (
            <div className="painel-muted" style={{ marginTop: 8 }}>
              {message}
            </div>
          )}
          <div className="painel-list" style={{ marginTop: 10 }}>
            {filtered.map((item) => (
              <div key={item.id} className="painel-list-item">
                <div>
                  <div>
                    <strong>{item.author}</strong> em <em>{item.postTitle}</em>
                    <span className="painel-tag" style={{ marginLeft: 8 }}>{item.approved ? 'Aprovado' : 'Pendente'}</span>
                  </div>
                  <div className="painel-muted">{item.text}</div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <button type="button" className="painel-button" onClick={() => handleToggleApprove(item)} title={item.approved ? 'Marcar como pendente' : 'Aprovar'}>
                    {item.approved ? '⏳ Pendente' : '✅ Aprovar'}
                  </button>
                  <button type="button" className="painel-button" onClick={() => openEdit(item)} title="Editar">
                    ✏️ Editar
                  </button>
                  <button
                    type="button"
                    className="painel-button painel-danger-text"
                    onClick={() => askDelete(item)}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`painel-modal ${confirmDelOpen ? '' : 'hidden'}`}>
        <div className="painel-modal-backdrop" onClick={() => setConfirmDelOpen(false)} />
        <div className="painel-modal-content small">
          <div className="painel-modal-header">
            <div className="painel-modal-title">Confirmar exclusão</div>
          </div>
          <div className="painel-modal-body">
            <p className="painel-muted">
              Tem certeza que deseja excluir este comentário?
            </p>
            <div className="painel-muted" style={{ marginTop: 6 }}>
              {delLabel}
            </div>
            <div className="painel-row" style={{ marginTop: 16, justifyContent: 'flex-end' }}>
              <button type="button" className="painel-button" onClick={() => setConfirmDelOpen(false)}>Cancelar</button>
              <button type="button" className="painel-button painel-danger-text" onClick={confirmDelete}>Excluir</button>
            </div>
          </div>
        </div>
      </div>
      <div className={`painel-modal ${editOpen ? '' : 'hidden'}`}>
        <div className="painel-modal-backdrop" onClick={() => setEditOpen(false)} />
        <div className="painel-modal-content small">
          <div className="painel-modal-header">
            <div className="painel-modal-title">Editar comentário</div>
          </div>
          <div className="painel-modal-body">
            <label className="painel-login-label">Autor</label>
            <input className="painel-input" value={editAuthor} onChange={(e) => setEditAuthor(e.target.value)} />
            <label className="painel-login-label" style={{ marginTop: 8 }}>Texto</label>
            <textarea className="painel-textarea" value={editText} onChange={(e) => setEditText(e.target.value)} />
            <label className="painel-login-label" style={{ marginTop: 8 }}>Status</label>
            <select className="painel-select" value={editApproved ? 'approved' : 'pending'} onChange={(e) => setEditApproved(e.target.value === 'approved')}>
              <option value="pending">Pendente</option>
              <option value="approved">Aprovado</option>
            </select>
            <div className="painel-row" style={{ marginTop: 12, justifyContent: 'flex-end' }}>
              <button type="button" className="painel-button" onClick={() => setEditOpen(false)}>Cancelar</button>
              <button type="button" className="painel-button" onClick={saveEdit}>Salvar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PainelMessages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewOpen, setViewOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editRead, setEditRead] = useState(false);
  const [confirmDelOpen, setConfirmDelOpen] = useState(false);
  const [delItem, setDelItem] = useState(null);
  const [delLabel, setDelLabel] = useState('');

  const loadMessages = async () => {
    setLoading(true);
    setMessage('');
    const results = [];
    try {
      const snap = await getDocs(collection(db, 'messages'));
      if (snap.empty) {
        setItems([]);
        setMessage('Sem mensagens.');
        setLoading(false);
        return;
      }
      snap.forEach((d) => {
        const data = d.data() || {};
        results.push({
          id: d.id,
          ref: d.ref,
          name: data.name || '',
          email: data.email || '',
          category: data.category || '',
          text: data.message || '',
          imageUrl: data.imageUrl || '',
          read: data.read === true,
          createdAt: data.createdAt || null,
        });
      });
      results.sort((a, b) => {
        const at = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0;
        const bt = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0;
        return bt - at;
      });
      setItems(results);
    } catch (e) {
      const code = e && e.code ? e.code : 'erro';
      setItems([]);
      setMessage(`Falha ao carregar mensagens (${code}).`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const toggleRead = async (item) => {
    const next = item.read ? false : true;
    await setDoc(item.ref, { read: next, updatedAt: serverTimestamp() }, { merge: true });
    loadMessages();
  };

  const askDelete = (item) => {
    setDelItem(item);
    const base = item.text || '';
    setDelLabel(base.length > 60 ? `${base.slice(0, 60)}…` : base || item.id);
    setConfirmDelOpen(true);
  };

  const confirmDelete = async () => {
    if (!delItem) {
      setConfirmDelOpen(false);
      return;
    }
    try {
      await deleteDoc(delItem.ref);
    } finally {
      setConfirmDelOpen(false);
      setDelItem(null);
      loadMessages();
    }
  };

  const openView = async (item) => {
    setViewItem(item);
    setViewOpen(true);
    if (!item.read) {
      await setDoc(item.ref, { read: true, updatedAt: serverTimestamp() }, { merge: true });
      loadMessages();
    }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setEditName(item.name || '');
    setEditEmail(item.email || '');
    setEditCategory(item.category || '');
    setEditMessage(item.text || '');
    setEditImageUrl(item.imageUrl || '');
    setEditRead(!!item.read);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editItem) {
      setEditOpen(false);
      return;
    }
    await setDoc(editItem.ref, {
      name: editName || '',
      email: editEmail || '',
      category: editCategory || '',
      message: editMessage || '',
      imageUrl: editImageUrl || '',
      read: !!editRead,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    setEditOpen(false);
    setEditItem(null);
    loadMessages();
  };

  const formatCreatedAt = (it) => {
    const ts = it.createdAt && it.createdAt.seconds ? it.createdAt.seconds : null;
    if (!ts) return '';
    const d = new Date(ts * 1000);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear());
    const hh = String(d.getHours()).padStart(2, '0');
    const mn = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yy} ${hh}:${mn}`;
  };

  const filtered = useMemo(() => {
    if (filter === 'unread') return items.filter((i) => !i.read);
    if (filter === 'read') return items.filter((i) => i.read);
    return items;
  }, [items, filter]);

  return (
    <div className="painel-main">
      <div className="painel-page-header">
        <div>
          <div className="painel-page-title">Mensagens</div>
          <div className="painel-page-sub">
            Leia, edite e modere as mensagens recebidas pelo formulário de contato.
          </div>
        </div>
        <div className="painel-row">
          <select
            className="painel-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ maxWidth: 200 }}
          >
            <option value="all">Todas</option>
            <option value="unread">Não lidas</option>
            <option value="read">Lidas</option>
          </select>
          <button type="button" className="painel-button" onClick={loadMessages}>
            {loading ? 'Atualizando...' : 'Recarregar'}
          </button>
        </div>
      </div>
      <div className="painel-card">
        <div className="painel-card-inner">
          <h2>Caixa de entrada</h2>
          {message && (
            <div className="painel-muted" style={{ marginTop: 8 }}>
              {message}
            </div>
          )}
          <div className="painel-list" style={{ marginTop: 10 }}>
            {filtered.map((item) => (
              <div key={item.id} className="painel-list-item">
                <div onClick={() => openView(item)} style={{ cursor: 'pointer' }}>
                  <div>
                    <strong>{item.name || 'Sem nome'}</strong>
                    {item.email && (
                      <span style={{ marginLeft: 6, fontSize: 11, color: '#6b7280' }}>
                        {item.email}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                    {item.category || 'Sem categoria'} · {formatCreatedAt(item)}
                  </div>
                  <div className="painel-muted">
                    {(item.text || '').length > 120 ? `${item.text.slice(0, 120)}…` : item.text}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <span
                    className="painel-tag"
                    style={{
                      background: item.read ? '#dcfce7' : '#fee2e2',
                      color: item.read ? '#166534' : '#991b1b',
                    }}
                  >
                    {item.read ? 'Lida' : 'Não lida'}
                  </span>
                  <button
                    type="button"
                    className="painel-button"
                    onClick={() => toggleRead(item)}
                  >
                    {item.read ? 'Marcar como não lida' : 'Marcar como lida'}
                  </button>
                  <button
                    type="button"
                    className="painel-button"
                    onClick={() => openEdit(item)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    type="button"
                    className="painel-button painel-danger-text"
                    onClick={() => askDelete(item)}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`painel-modal ${viewOpen ? '' : 'hidden'}`}>
        <div className="painel-modal-backdrop" onClick={() => setViewOpen(false)} />
        <div className="painel-modal-content small">
          <div className="painel-modal-header">
            <div className="painel-modal-title">Detalhes da mensagem</div>
          </div>
          <div className="painel-modal-body">
            {viewItem && (
              <>
                <div className="painel-muted" style={{ marginBottom: 8 }}>
                  {formatCreatedAt(viewItem)} · {viewItem.category || 'Sem categoria'}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>{viewItem.name || 'Sem nome'}</strong>
                  {viewItem.email && (
                    <div className="painel-muted">{viewItem.email}</div>
                  )}
                </div>
                <div style={{ marginBottom: 8 }}>
                  {viewItem.text}
                </div>
                {viewItem.imageUrl && (
                  <div className="painel-muted">
                    Link de imagem: {viewItem.imageUrl}
                  </div>
                )}
              </>
            )}
            <div className="painel-row" style={{ marginTop: 16, justifyContent: 'flex-end' }}>
              <button type="button" className="painel-button" onClick={() => setViewOpen(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`painel-modal ${confirmDelOpen ? '' : 'hidden'}`}>
        <div className="painel-modal-backdrop" onClick={() => setConfirmDelOpen(false)} />
        <div className="painel-modal-content small">
          <div className="painel-modal-header">
            <div className="painel-modal-title">Confirmar exclusão</div>
          </div>
          <div className="painel-modal-body">
            <p className="painel-muted">
              Tem certeza que deseja excluir esta mensagem?
            </p>
            <div className="painel-muted" style={{ marginTop: 6 }}>
              {delLabel}
            </div>
            <div className="painel-row" style={{ marginTop: 16, justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="painel-button"
                onClick={() => setConfirmDelOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="painel-button painel-danger-text"
                onClick={confirmDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`painel-modal ${editOpen ? '' : 'hidden'}`}>
        <div className="painel-modal-backdrop" onClick={() => setEditOpen(false)} />
        <div className="painel-modal-content small">
          <div className="painel-modal-header">
            <div className="painel-modal-title">Editar mensagem</div>
          </div>
          <div className="painel-modal-body">
            <label className="painel-login-label">Nome</label>
            <input
              className="painel-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <label className="painel-login-label" style={{ marginTop: 8 }}>
              E-mail
            </label>
            <input
              className="painel-input"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <label className="painel-login-label" style={{ marginTop: 8 }}>
              Categoria
            </label>
            <input
              className="painel-input"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            />
            <label className="painel-login-label" style={{ marginTop: 8 }}>
              Mensagem
            </label>
            <textarea
              className="painel-textarea"
              value={editMessage}
              onChange={(e) => setEditMessage(e.target.value)}
            />
            <label className="painel-login-label" style={{ marginTop: 8 }}>
              Link de imagem
            </label>
            <input
              className="painel-input"
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
            />
            <label className="painel-login-label" style={{ marginTop: 8 }}>
              Status
            </label>
            <select
              className="painel-select"
              value={editRead ? 'read' : 'unread'}
              onChange={(e) => setEditRead(e.target.value === 'read')}
            >
              <option value="unread">Não lida</option>
              <option value="read">Lida</option>
            </select>
            <div className="painel-row" style={{ marginTop: 12, justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="painel-button"
                onClick={() => setEditOpen(false)}
              >
                Cancelar
              </button>
              <button type="button" className="painel-button" onClick={saveEdit}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PainelApp() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);
  const [view, setView] = useState(() => parseViewFromHash());

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && u.email && u.email.toLowerCase() === ALLOWED_EMAIL && u.uid === ALLOWED_UID) {
        setUser(u);
      } else {
        setUser(null);
      }
      setAuthReady(true);
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setView(parseViewFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleLogout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    window.location.hash = '#painel/login';
  };

  const effectiveView = useMemo(() => {
    if (!user) return 'login';
    if (view === 'login') return 'dashboard';
    return view;
  }, [user, view]);

  if (!authReady) {
    return (
      <>
        <PainelStyles />
        <div className="painel-login-container">
          <div className="painel-login-card">
            <p className="painel-login-sub">Carregando painel...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return <PainelLogin />;
  }

  return (
    <>
      <PainelStyles />
      <PainelHeader onLogout={handleLogout} />
      <div className="painel-layout">
        <PainelSidebar view={effectiveView} onChange={setView} />
        {effectiveView === 'dashboard' && <PainelDashboard />}
        {effectiveView === 'blog' && <PainelBlog />}
        {effectiveView === 'comments' && <PainelComments />}
        {effectiveView === 'messages' && <PainelMessages />}
        {effectiveView === 'forum' && <PainelForum />}
        {effectiveView === 'homepage' && <PainelHomepage />}
        {effectiveView === 'settings' && <PainelSettings />}
      </div>
    </>
  );
}

function PainelSettings() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [nick, setNick] = useState('');
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [role, setRole] = useState('common'); // default
  const [desc, setDesc] = useState('');
  const [discord, setDiscord] = useState('');
  const [twitch, setTwitch] = useState('');
  const [youtube, setYoutube] = useState('');
  const [site, setSite] = useState('');
  const [github, setGithub] = useState('');

  const [confirmDelOpen, setConfirmDelOpen] = useState(false);
  const [delId, setDelId] = useState(null);
  const [delName, setDelName] = useState('');

  const ROLES = [
    { label: 'Desenvolvedor (Laranja)', value: 'legendary admin-main' },
    { label: 'Moderador (Angelic)', value: 'angelic' },
    { label: 'Colaborador (Satanic)', value: 'satanic' },
    { label: 'Parceiro (Heroic)', value: 'heroic' },
    { label: 'Designer (Set)', value: 'set' },
    { label: 'Editor (Mythic)', value: 'mythic' },
    { label: 'Suporte (Common)', value: 'common' },
  ];

  useEffect(() => {
    const q = collection(db, 'team');
    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      // Sort by something? Maybe role priority? Or name?
      // Let's sort by nick for now
      list.sort((a, b) => (a.nick || '').localeCompare(b.nick || ''));
      setMembers(list);
    });
    return () => unsub();
  }, []);

  const clearForm = () => {
    setEditingId(null);
    setNick('');
    setName('');
    setPhoto('');
    setRole('common');
    setDesc('');
    setDiscord('');
    setTwitch('');
    setYoutube('');
    setSite('');
    setGithub('');
  };

  const openNew = () => {
    clearForm();
    setEditOpen(true);
  };

  const openEdit = (m) => {
    setEditingId(m.id);
    setNick(m.nick || '');
    setName(m.name || '');
    setPhoto(m.photo || '');
    setRole(m.role || 'common');
    setDesc(m.description || '');
    setDiscord(m.socials?.discord || '');
    setTwitch(m.socials?.twitch || '');
    setYoutube(m.socials?.youtube || '');
    setSite(m.socials?.site || '');
    setGithub(m.socials?.github || '');
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!nick) return alert('Nick é obrigatório');
    setLoading(true);
    try {
      const data = {
        nick,
        name,
        photo,
        role,
        description: desc,
        socials: {
          discord,
          twitch,
          youtube,
          site,
          github,
        },
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await setDoc(doc(db, 'team', editingId), data, { merge: true });
      } else {
        await addDoc(collection(db, 'team'), data);
      }
      setEditOpen(false);
      clearForm();
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  const askDelete = (m) => {
    setDelId(m.id);
    setDelName(m.nick);
    setConfirmDelOpen(true);
  };

  const confirmDelete = async () => {
    if (!delId) return;
    try {
      await deleteDoc(doc(db, 'team', delId));
      setConfirmDelOpen(false);
      setDelId(null);
    } catch (e) {
      console.error(e);
      alert('Erro ao excluir');
    }
  };

  return (
    <div className="painel-main">
      <div className="painel-page-header">
        <div>
          <div className="painel-page-title">Configurações</div>
          <div className="painel-page-sub">Gerenciamento geral do site e equipe</div>
        </div>
        <button type="button" className="painel-button" onClick={openNew}>
          + Novo Membro
        </button>
      </div>

      <div className="painel-card">
        <div className="painel-card-inner">
          <h2>Equipe</h2>
          <div className="painel-list" style={{ marginTop: 16 }}>
            {members.length === 0 && <div className="painel-muted">Nenhum membro cadastrado.</div>}
            {members.map((m) => (
              <div key={m.id} className="painel-list-item" style={{ alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <img
                    src={m.photo || 'https://via.placeholder.com/48'}
                    alt={m.nick}
                    style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', background: '#333' }}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: 14 }}>
                      {m.nick} <span style={{ fontWeight: 'normal', fontSize: 12, color: '#9ca3af' }}>({m.name})</span>
                    </div>
                    <div style={{ fontSize: 11, marginTop: 2, display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span className="painel-tag">{ROLES.find(r => r.value === m.role)?.label || m.role}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{m.description}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="painel-button" onClick={() => openEdit(m)}>✏️</button>
                  <button type="button" className="painel-button painel-danger-text" onClick={() => askDelete(m)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Edição/Criação */}
      <div className={`painel-modal ${editOpen ? '' : 'hidden'}`}>
        <div className="painel-modal-backdrop" onClick={() => setEditOpen(false)} />
        <div className="painel-modal-content">
          <div className="painel-modal-header">
            <div className="painel-modal-title">{editingId ? 'Editar Membro' : 'Novo Membro'}</div>
            <button type="button" className="painel-modal-close" onClick={() => setEditOpen(false)}>×</button>
          </div>
          <div className="painel-modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="painel-login-label">Nick</label>
                <input className="painel-input" value={nick} onChange={(e) => setNick(e.target.value)} />
              </div>
              <div>
                <label className="painel-login-label">Nome Real</label>
                <input className="painel-input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            
            <div style={{ marginTop: 12 }}>
              <label className="painel-login-label">Foto (URL)</label>
              <input className="painel-input" value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="https://..." />
            </div>

            <div style={{ marginTop: 12 }}>
              <label className="painel-login-label">Função / Cor</label>
              <select className="painel-select" value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: 12 }}>
              <label className="painel-login-label">Descrição</label>
              <textarea className="painel-textarea" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
            </div>

            <div style={{ marginTop: 16 }}>
              <label className="painel-login-label" style={{ marginBottom: 8, display: 'block' }}>Redes Sociais (Links)</label>
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fab fa-discord" style={{ width: 20 }}></i>
                  <input className="painel-input" placeholder="Discord URL" value={discord} onChange={(e) => setDiscord(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fab fa-twitch" style={{ width: 20 }}></i>
                  <input className="painel-input" placeholder="Twitch URL" value={twitch} onChange={(e) => setTwitch(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fab fa-youtube" style={{ width: 20 }}></i>
                  <input className="painel-input" placeholder="YouTube URL" value={youtube} onChange={(e) => setYoutube(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-globe" style={{ width: 20 }}></i>
                  <input className="painel-input" placeholder="Site/Outro URL" value={site} onChange={(e) => setSite(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fab fa-github" style={{ width: 20 }}></i>
                  <input className="painel-input" placeholder="GitHub URL" value={github} onChange={(e) => setGithub(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="painel-row" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
              <button type="button" className="painel-button" onClick={() => setEditOpen(false)}>Cancelar</button>
              <button type="button" className="painel-button" onClick={handleSave} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Delete */}
      <div className={`painel-modal ${confirmDelOpen ? '' : 'hidden'}`}>
        <div className="painel-modal-backdrop" onClick={() => setConfirmDelOpen(false)} />
        <div className="painel-modal-content small">
          <div className="painel-modal-header">
            <div className="painel-modal-title">Confirmar exclusão</div>
          </div>
          <div className="painel-modal-body">
            <p className="painel-muted">Tem certeza que deseja remover {delName} da equipe?</p>
            <div className="painel-row" style={{ marginTop: 16, justifyContent: 'flex-end' }}>
              <button type="button" className="painel-button" onClick={() => setConfirmDelOpen(false)}>Cancelar</button>
              <button type="button" className="painel-button painel-danger-text" onClick={confirmDelete}>Excluir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PainelApp;
