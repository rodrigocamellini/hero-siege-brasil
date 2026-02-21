import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore/lite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const blogDir = path.join(publicDir, 'blog');

const BASE_URL = 'https://herosiegebrasil.com.br';

const firebaseConfig = {
  apiKey: 'AIzaSyDCgl4dbGTJUH-0bsGsisO9KbWYoIN3KU4',
  authDomain: 'herosiege-ef56f.firebaseapp.com',
  projectId: 'herosiege-ef56f',
  storageBucket: 'herosiege-ef56f.firebasestorage.app',
  messagingSenderId: '147989943940',
  appId: '1:147989943940:web:3b107b85598b7033fd94d1'
};

function fmtDateUTC(d) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function escXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function loadPublishedPosts() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const postsRef = collection(db, 'posts');
    // Tenta consulta com filtro simples (sem orderBy para evitar índice composto)
    let snap;
    try {
      const qSimple = query(postsRef, where('status', '==', 'published'));
      snap = await getDocs(qSimple);
    } catch {
      // Fallback: sem filtros (filtra client-side)
      snap = await getDocs(postsRef);
    }
    const posts = [];
    snap.forEach(docSnap => {
      const d = docSnap.data();
      const status = d?.status || 'draft';
      if (status === 'published') {
        posts.push({
          id: docSnap.id,
          title: d?.title || '',
          createdAt: d?.createdAt?.seconds ? new Date(d.createdAt.seconds * 1000) : null,
          updatedAt: d?.updatedAt?.seconds ? new Date(d.updatedAt.seconds * 1000) : null
        });
      }
    });
    posts.sort((a, b) => {
      const at = a.createdAt ? a.createdAt.getTime() : 0;
      const bt = b.createdAt ? b.createdAt.getTime() : 0;
      return bt - at;
    });
    return posts;
  } catch (e) {
    console.warn('[sitemap] Falha ao consultar Firestore. Gerando sitemap básico.', e?.message || e);
    return [];
  }
}

function ensureDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
}

function writeFile(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content, 'utf8');
}

function blogIndexHtml() {
  return [
    '<!doctype html>',
    '<html lang="pt-BR"><head>',
    '<meta charset="utf-8" />',
    '<meta http-equiv="refresh" content="0; url=/blog" />',
    `<link rel="canonical" href="${BASE_URL}/blog" />`,
    '<title>Blog | Hero Siege Brasil</title>',
    '</head><body>',
    '<noscript>Redirecionando para o Blog...</noscript>',
    '<script>location.replace("/#blog");</script>',
    '</body></html>'
  ].join('');
}

function blogPostHtml(id, title) {
  const safeTitle = escXml(title || 'Post | Hero Siege Brasil');
  return [
    '<!doctype html>',
    '<html lang="pt-BR"><head>',
    '<meta charset="utf-8" />',
    `<meta http-equiv="refresh" content="0; url=/blog/${encodeURIComponent(id)}" />`,
    `<link rel="canonical" href="${BASE_URL}/blog/${encodeURIComponent(id)}" />`,
    `<title>${safeTitle}</title>`,
    '</head><body>',
    '<noscript>Redirecionando para o post...</noscript>',
    `<script>location.replace("/blog/${id}");</script>`,
    '</body></html>'
  ].join('');
}

function buildSitemapXml(entries) {
  const urlset = entries.map(e => {
    const lastmodTag = e.lastmod ? `<lastmod>${fmtDateUTC(e.lastmod)}</lastmod>` : '';
    const changefreqTag = e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : '';
    const priorityTag = e.priority != null ? `<priority>${e.priority}</priority>` : '';
    return [
      '<url>',
      `<loc>${escXml(e.loc)}</loc>`,
      lastmodTag,
      changefreqTag,
      priorityTag,
      '</url>'
    ].filter(Boolean).join('');
  }).join('');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlset,
    '</urlset>'
  ].join('');
}

async function main() {
  const posts = await loadPublishedPosts();

  ensureDir(blogDir);
  for (const p of posts) {
    const html = blogPostHtml(p.id, p.title);
    writeFile(path.join(blogDir, `${p.id}.html`), html);
  }

  // Sitemap entries
  const today = new Date();
  const entries = [
    { loc: `${BASE_URL}/`, lastmod: today, changefreq: 'daily', priority: 1.0 },
    { loc: `${BASE_URL}/classes`, lastmod: today, changefreq: 'weekly', priority: 0.9 },
    { loc: `${BASE_URL}/items`, lastmod: today, changefreq: 'weekly', priority: 0.9 },
    { loc: `${BASE_URL}/runes`, lastmod: today, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE_URL}/relics`, lastmod: today, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE_URL}/quests`, lastmod: today, changefreq: 'weekly', priority: 0.5 },
    { loc: `${BASE_URL}/builder`, lastmod: today, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE_URL}/contato`, lastmod: today, changefreq: 'weekly', priority: 0.6 },
    { loc: `${BASE_URL}/blog`, lastmod: today, changefreq: 'daily', priority: 0.8 }
  ];
  for (const p of posts) {
    const last = p.updatedAt || p.createdAt || today;
    entries.push({
      loc: `${BASE_URL}/blog/${encodeURIComponent(p.id)}`,
      lastmod: last,
      changefreq: 'weekly',
      priority: 0.7
    });
  }

  const xml = buildSitemapXml(entries);
  writeFile(path.join(publicDir, 'sitemap.xml'), xml);

  console.log(`[sitemap] Gerado com ${entries.length} URLs (posts: ${posts.length}).`);
}

main().catch(err => {
  console.error('[sitemap] Erro fatal:', err);
  process.exitCode = 1;
});
