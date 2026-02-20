import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db } from './firebase';
import { doc, getDoc, collection, getDocs, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import BlogComments from './BlogComments';
import RelicsView from './RelicsView';
import ClassesView from './ClassesView';
import ItemsView from './ItemsView';
import RunesView from './RunesView';

const NewDesign = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('home');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isDbOpen, setIsDbOpen] = useState(false);
  const dbMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dbMenuRef && dbMenuRef.current && !dbMenuRef.current.contains(e.target)) {
        setIsDbOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Close dropdown when navigating to another view
    setIsDbOpen(false);
  }, [currentView]);
  
  const CLASS_DATA = [
      { name: "Viking", type: "MELEE" },
      { name: "Pyromancer", type: "MAGIC" },
      { name: "Marksman", type: "RANGED" },
      { name: "Pirate", type: "RANGED" },
      { name: "Nomad", type: "MELEE" },
      { name: "Redneck", type: "MELEE" },
      { name: "Necromancer", type: "MAGIC" },
      { name: "Samurai", type: "MELEE" },
      { name: "Paladin", type: "MELEE" },
      { name: "Amazon", type: "RANGED" },
      { name: "Demon Slayer", type: "RANGED" },
      { name: "Demonspawn", type: "MELEE" },
      { name: "Shaman", type: "MAGIC" },
      { name: "White Mage", type: "MAGIC" },
      { name: "Marauder", type: "MELEE" },
      { name: "Plague Doctor", type: "MAGIC" },
      { name: "Shield Lancer", type: "MELEE" },
      { name: "Jötunn", type: "MELEE" },
      { name: "Illusionist", type: "MAGIC" },
      { name: "Exo", type: "MELEE" },
      { name: "Butcher", type: "MELEE" },
      { name: "Stormweaver", type: "MAGIC" },
      { name: "Bard", type: "MAGIC" }
  ];

  const filteredClasses = activeFilter === 'ALL' 
    ? CLASS_DATA 
    : CLASS_DATA.filter(c => c.type === activeFilter);

  const [selectedClass, setSelectedClass] = useState(null);
  const [builderClass, setBuilderClass] = useState('Viking');
  const [wikiData, setWikiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [itemCategories, setItemCategories] = useState([]);
  const [selectedItemCategory, setSelectedItemCategory] = useState(null);
  const [itemsList, setItemsList] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);
  const postsUnsubRef = useRef(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Contato');
  const [contactMessage, setContactMessage] = useState('');
  const [contactImageUrl, setContactImageUrl] = useState('');
  const [contactCaptchaAnswer, setContactCaptchaAnswer] = useState('');
  const [contactCaptchaA, setContactCaptchaA] = useState(0);
  const [contactCaptchaB, setContactCaptchaB] = useState(0);
  const [contactCaptchaOp, setContactCaptchaOp] = useState('+');
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState('');
  const [tiers, setTiers] = useState({ S: [], A: [], B: [], C: [], D: [], E: [] });
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [forumSelectedClass, setForumSelectedClass] = useState(null);
  const [buildCountsByForum, setBuildCountsByForum] = useState({});
  const [buildsByForum, setBuildsByForum] = useState({});
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [buildModalOpen, setBuildModalOpen] = useState(false);
  const [newBuildOpen, setNewBuildOpen] = useState(false);
  const [nbTitle, setNbTitle] = useState('');
  const [nbAuthor, setNbAuthor] = useState('');
  const [nbClass, setNbClass] = useState('');
  const [nbType, setNbType] = useState('iniciante');
  const [nbContent, setNbContent] = useState('');
  const nbContentRef = useRef(null);
  const [nbStats, setNbStats] = useState({
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    energy: 0,
    armor: 0,
    vitality: 0,
  });
  const NB_TOTAL = 400;

  const resetContactCaptcha = () => {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    const useSub = Math.random() < 0.5;
    if (useSub) {
      const max = Math.max(a, b);
      const min = Math.min(a, b);
      setContactCaptchaA(max);
      setContactCaptchaB(min);
      setContactCaptchaOp('-');
    } else {
      setContactCaptchaA(a);
      setContactCaptchaB(b);
      setContactCaptchaOp('+');
    }
    setContactCaptchaAnswer('');
  };

  useEffect(() => {
    if (currentView === 'contact') {
      resetContactCaptcha();
    }
  }, [currentView]);

  const submitContact = async () => {
    setContactError('');
    setContactSent(false);
    if (!contactName || !contactEmail || !contactMessage || !contactSubject) {
      setContactError('Preencha todos os campos.');
      return;
    }
    const a = contactCaptchaA;
    const b = contactCaptchaB;
    const expected = contactCaptchaOp === '+' ? a + b : a - b;
    const given = parseInt(String(contactCaptchaAnswer).trim(), 10);
    if (Number.isNaN(given) || given !== expected) {
      setContactError('Verificação incorreta. Tente novamente.');
      resetContactCaptcha();
      return;
    }
    try {
      setContactSending(true);
      await addDoc(collection(db, 'messages'), {
        name: contactName,
        email: contactEmail,
        category: contactSubject,
        message: contactMessage,
        imageUrl: contactImageUrl || '',
        read: false,
        createdAt: serverTimestamp()
      });
      setContactName('');
      setContactEmail('');
      setContactSubject('Contato');
      setContactMessage('');
      setContactImageUrl('');
      setContactCaptchaAnswer('');
      resetContactCaptcha();
      setContactSent(true);
    } catch (e) {
      setContactError('Erro ao enviar. Tente novamente.');
    } finally {
      setContactSending(false);
    }
  };

  useEffect(() => {
    const ref = doc(db, 'config', 'tierlist');
    const unsub = onSnapshot(ref, (snap) => {
      const d = snap.data() || {};
      const next = {
        S: Array.isArray(d.S) ? d.S : [],
        A: Array.isArray(d.A) ? d.A : [],
        B: Array.isArray(d.B) ? d.B : [],
        C: Array.isArray(d.C) ? d.C : [],
        D: Array.isArray(d.D) ? d.D : [],
        E: Array.isArray(d.E) ? d.E : [],
      };
      setTiers(next);
    });
    return () => unsub();
  }, []);

  const sanitizeAndNormalizeHtml = (html) => {
    if (!html) return '';
    if (typeof html !== 'string') return '';
    return html.replace(/http:/g, 'https:');
  };

  const buildModalContentHtml = useMemo(() => {
    if (!selectedBuild || !selectedBuild.content_html) return '';
    return sanitizeAndNormalizeHtml(selectedBuild.content_html);
  }, [selectedBuild]);

  useEffect(() => {
    const ref = collection(db, 'builds');
    const unsub = onSnapshot(ref, (snap) => {
      const counts = {};
      const byForum = {};
      snap.forEach((docSnap) => {
        const data = docSnap.data() || {};
        const status = data.status || 'draft';
        if (status !== 'published') return;
        const baseClass = data.className || data.heroClass || '';
        const forum = data.forum || data.classSlug || (baseClass ? slugifyClass(baseClass) : '');
        if (!forum) return;
        counts[forum] = (counts[forum] || 0) + 1;
        if (!byForum[forum]) byForum[forum] = [];
        byForum[forum].push({ id: docSnap.id, ...data });
      });
      Object.keys(byForum).forEach((f) => {
        byForum[f].sort((a, b) => {
          const at = a.createdAt && typeof a.createdAt.seconds === 'number' ? a.createdAt.seconds : 0;
          const bt = b.createdAt && typeof b.createdAt.seconds === 'number' ? b.createdAt.seconds : 0;
          return bt - at;
        });
      });
      setBuildCountsByForum(counts);
      setBuildsByForum(byForum);
    });
    return () => unsub();
  }, []);

  const imageFor = (name) => {
    const base = String(name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '');
    const pub = process.env.PUBLIC_URL || '';
    const basePath = pub ? `${pub}/images` : `images`;
    return `${basePath}/${base}.webp`;
  };

  const downloadTierImage = async () => {
    const rowKeys = ['S','A','B','C','D','E'];
    const colors = { S:'#dc2626', A:'#f97316', B:'#eab308', C:'#84cc16', D:'#22c55e', E:'#6b7280' };
    const bgColors = { S:'rgba(220,38,38,0.12)', A:'rgba(249,115,22,0.12)', B:'rgba(234,179,8,0.12)', C:'rgba(132,204,22,0.12)', D:'rgba(34,197,94,0.12)', E:'rgba(107,114,128,0.12)' };
    const w = 1024;
    const pad = 24;
    const headerH = 56;
    const labelSize = 48;
    const iconSize = 40;
    const gap = 8;
    const rowGap = 16;
    let height = pad + headerH + pad;
    const rows = [];
    rowKeys.forEach(k => {
      const rowH = Math.max(labelSize, iconSize) + pad;
      rows.push({ key:k, y: height, h: rowH });
      height += rowH + rowGap;
    });
    height += pad + 40;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#151923';
    ctx.fillRect(0, 0, w, height);
    const loadImg = (src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.crossOrigin = 'anonymous';
      img.src = src;
    });
    // Header with logo and title
    const logoBase = (process.env.PUBLIC_URL || '') ? `${process.env.PUBLIC_URL}/images` : `images`;
    const logo = await loadImg(`${logoBase}/herosiege.png`);
    if (logo) {
      const lw = 160;
      const lh = 40;
      const ly = pad + Math.max(0, (headerH - lh) / 2);
      ctx.drawImage(logo, pad, ly, lw, lh);
      ctx.font = 'bold 22px Segoe UI, sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Tier List Completa', pad + lw + 12, pad + headerH / 2);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(pad, pad + headerH, w - pad * 2, 1); // bottom border of header
    // Rows
    ctx.font = 'bold 20px Segoe UI, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    const tasks = [];
    rows.forEach(row => {
      const k = row.key;
      const y = row.y;
      // Row background (lighter) and left border
      ctx.fillStyle = bgColors[k] || 'rgba(255,255,255,0.06)';
      ctx.fillRect(pad, y, w - pad*2, row.h - rowGap + 4);
      ctx.fillStyle = colors[k] || '#6b7280';
      ctx.fillRect(pad, y, 4, row.h - rowGap + 4);
      // Tier square
      ctx.fillStyle = colors[k] || '#6b7280';
      ctx.fillRect(pad + 8, y + Math.max(0, ((row.h - rowGap) - labelSize)/2), labelSize, labelSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(k, pad + 8 + labelSize/2, y + Math.max(0, ((row.h - rowGap) - labelSize)/2) + labelSize/2);
      // Icons
      let x = pad + 8 + labelSize + 16;
      (tiers[k] || []).forEach(cls => {
        const src = imageFor(cls);
        tasks.push({
          x,
          y: y + Math.max(0, ((row.h - rowGap) - iconSize)/2),
          src
        });
        x += iconSize + gap;
      });
    });
    for (let i=0;i<tasks.length;i++) {
      const t = tasks[i];
      // eslint-disable-next-line no-await-in-loop
      const img = await loadImg(t.src);
      if (img) ctx.drawImage(img, t.x, t.y, iconSize, iconSize);
    }
    // Timestamp bottom-right
    const now = new Date();
    const dd = String(now.getDate()).padStart(2,'0');
    const mm = String(now.getMonth()+1).padStart(2,'0');
    const yyyy = String(now.getFullYear());
    const hh = String(now.getHours()).padStart(2,'0');
    const min = String(now.getMinutes()).padStart(2,'0');
    const stamp = `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    ctx.font = 'bold 18px Segoe UI, sans-serif';
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#e5e7eb';
    ctx.fillText(stamp, w - pad, height - 12);
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `tierlist_${yyyy}${mm}${dd}_${hh}${min}.png`;
    a.click();
  };

  const tierRowStyle = (k) => {
    if (k === 'S') return { backgroundColor: 'rgba(220,38,38,0.12)', borderLeft: '4px solid #dc2626' };
    if (k === 'A') return { backgroundColor: 'rgba(249,115,22,0.12)', borderLeft: '4px solid #f97316' };
    if (k === 'B') return { backgroundColor: 'rgba(234,179,8,0.12)', borderLeft: '4px solid #eab308' };
    if (k === 'C') return { backgroundColor: 'rgba(132,204,22,0.12)', borderLeft: '4px solid #84cc16' };
    if (k === 'D') return { backgroundColor: 'rgba(34,197,94,0.12)', borderLeft: '4px solid #22c55e' };
    return { backgroundColor: 'rgba(107,114,128,0.12)', borderLeft: '4px solid #6b7280' };
  };

  const [steamPlayers, setSteamPlayers] = useState(null);
  const [builderReady, setBuilderReady] = useState(false);
  const iconCacheRef = useRef({});
  const sectionsCacheRef = useRef({});
  const specTitleFor = (cls, idx) => {
    const n = (cls || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_')
      .trim();
    const map = {
      viking: ['Berserker', 'Shield Bearer'],
      pyromancer: ['Fire Mage', 'Burning Soul'],
      marksman: ['Hunter', 'Marksman'],
      pirate: ['Shipmaster', 'Cannoneer'],
      nomad: ['Sand Walker', 'Desert Blade'],
      redneck: ['Hillbilly', 'Moonshiner'],
      necromancer: ['Summoner', 'Lich'],
      samurai: ['Bushido', 'Ronin'],
      paladin: ['Holy Knight', 'Crusader'],
      amazon: ['Spear Maiden', 'Huntress'],
      demon_slayer: ['Executioner', 'Inquisitor'],
      demonspawn: ['Hellfire', 'Demonic'],
      shaman: ['Elemental', 'Totemic'],
      white_mage: ['Holy Beam', 'Benediction'],
      marauder: ['Bombardier', 'Wrecker'],
      plague_doctor: ['Infection', 'Medicine'],
      illusionist: ['Phantasm', 'Mirror'],
      exo: ['Gravity', 'Force'],
      butcher: ['Meat', 'Blood'],
      stormweaver: ['Thunder', 'Storm'],
      bard: ['Minstrel', 'Troubadour']
    };
    const arr = map[n];
    if (arr && idx < arr.length) return arr[idx];
    return `Especialização ${idx + 1}`;
  };

  const normalizeImageUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    return url.replace(/^http:/i, 'https:');
  };
  const imageOrFallback = (url) => normalizeImageUrl(url) || 'https://herosiege.wiki.gg/images/Item_Chest.png';
  const classSlug = (name) =>
    String(name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '');
  const classImagePath = (name, ext = 'webp') => {
    const base = classSlug(name);
    const pub = process.env.PUBLIC_URL || '';
    const basePath = pub ? `${pub}/images` : `images`;
    return `${basePath}/${base}.${ext}`;
  };
  const slugifyClass = (name) =>
    String(name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  const totalNbStats = (stats) =>
    Object.values(stats || {}).reduce((sum, v) => sum + (Number(v) || 0), 0);
  const formatDateTime = (post) => {
    let d = null;
    if (post?.createdAt?.seconds) {
      d = new Date(post.createdAt.seconds * 1000);
    } else if (post?.date) {
      const tryD = new Date(post.date);
      if (!isNaN(tryD.getTime())) d = tryD;
    }
    if (!d) return post?.date || '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const HH = String(d.getHours()).padStart(2, '0');
    const MN = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${HH}:${MN}`;
  };
  const formatBuildTimestamp = (build) => {
    const ts = build?.createdAt;
    let d = null;
    if (ts && typeof ts === 'object' && typeof ts.seconds === 'number') {
      d = new Date(ts.seconds * 1000);
    } else if (typeof ts === 'string') {
      const tryD = new Date(ts);
      if (!Number.isNaN(tryD.getTime())) d = tryD;
    }
    if (!d) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const HH = String(d.getHours()).padStart(2, '0');
    const MN = String(d.getMinutes()).padStart(2, '0');
    const SS = String(d.getSeconds()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} • ${HH}:${MN}:${SS}`;
  };
  const contentHtml = useMemo(
    () => sanitizeAndNormalizeHtml(selectedBlogPost?.content_html || ''),
    [selectedBlogPost?.content_html]
  );
  const contentRef = useRef(null);
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = contentHtml;
      try {
        const imgs = contentRef.current.querySelectorAll('img');
        imgs.forEach((img) => {
          if (img.src.startsWith('http:')) img.src = img.src.replace(/^http:/i, 'https:');
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          img.onerror = () => { img.src = 'https://herosiege.wiki.gg/images/Item_Chest.png'; };
        });
        const ifr = contentRef.current.querySelectorAll('iframe');
        ifr.forEach((f) => {
          if (f.src && f.src.startsWith('http:')) f.src = f.src.replace(/^http:/i, 'https:');
          f.style.width = '100%';
          f.style.height = 'auto';
        });
      } catch {}
    }
  }, [contentHtml]);
  useEffect(() => {
    let stop = false;
    const loadPlayers = async () => {
      try {
        const viaCustom = async () => {
          const u = typeof window !== 'undefined' && window.STEAM_ENDPOINT_URL ? window.STEAM_ENDPOINT_URL : '';
          if (!u) throw new Error('No custom endpoint');
          const r = await fetch(u, { cache: 'no-store' });
          if (!r.ok) throw new Error('Custom endpoint error');
          return r.json();
        };
        const direct = async () => {
          const r = await fetch('https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=269210', { cache: 'no-store', mode: 'cors' });
          if (!r.ok) throw new Error('Steam API error');
          return r.json();
        };
        const viaProxy = async () => {
          const url = 'https://cors.isomorphic-git.org/https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=269210';
          const r = await fetch(url, { cache: 'no-store' });
          if (!r.ok) throw new Error('Proxy API error');
          return r.json();
        };
        let j = null;
        try {
          j = await viaCustom();
        } catch {
          try {
            j = await direct();
          } catch {
            j = await viaProxy();
          }
        }
        if (!stop) {
          const count = (j && typeof j.player_count === 'number')
            ? j.player_count
            : (j && j.response && typeof j.response.player_count === 'number')
              ? j.response.player_count
              : null;
          setSteamPlayers(count);
        }
      } catch {
        if (!stop) setSteamPlayers(null);
      }
    };
    loadPlayers();
    const id = setInterval(loadPlayers, 60 * 1000);
    return () => { stop = true; clearInterval(id); };
  }, []);

  useEffect(() => {
    if (currentView !== 'home') return;
    const targetDate = new Date('2026-04-03T00:00:00');
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate - now;
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentView]);

  const loadBlogPosts = async () => {
    try {
      const postsRef = collection(db, 'posts');
      // Prefer server-side filtering and ordering for published posts
      let q;
      try {
        q = query(postsRef, where('status', '==', 'published'), orderBy('createdAt', 'desc'));
      } catch (_) {
        // Fallback without query helpers if something goes wrong
        q = postsRef;
      }
      const snap = await getDocs(q || postsRef);
      const arr = [];
      snap.forEach(s => {
        const d = s.data();
        if (!q) {
          if ((d.status || 'draft') === 'published') {
            arr.push({ id: s.id, ...d });
          }
        } else {
          arr.push({ id: s.id, ...d });
        }
      });
      if (!q) {
        arr.sort((a, b) => {
          const at = (a.createdAt && a.createdAt.seconds) ? a.createdAt.seconds : 0;
          const bt = (b.createdAt && b.createdAt.seconds) ? b.createdAt.seconds : 0;
          return bt - at;
        });
      }
      setBlogPosts(arr);
    } catch (e) {
      console.error('Erro carregando posts do blog', e);
      setBlogPosts([]);
    }
  };

  useEffect(() => {
    if (currentView === 'home' || currentView === 'blog') {
      const postsRef = collection(db, 'posts');
      let q;
      try {
        q = query(postsRef, where('status', '==', 'published'), orderBy('createdAt', 'desc'));
      } catch {
        q = postsRef;
      }
      const unsub = onSnapshot(q, (snap) => {
        const arr = [];
        snap.forEach(s => {
          const d = s.data();
          if (!q) {
            if ((d.status || 'draft') === 'published') arr.push({ id: s.id, ...d });
          } else {
            arr.push({ id: s.id, ...d });
          }
        });
        if (!q) {
          arr.sort((a, b) => {
            const at = (a.createdAt && a.createdAt.seconds) ? a.createdAt.seconds : 0;
            const bt = (b.createdAt && b.createdAt.seconds) ? b.createdAt.seconds : 0;
            return bt - at;
          });
        }
        setBlogPosts(arr);
      }, (err) => {
        console.error('Erro assinando posts do blog', err);
        (async () => {
          try {
            const raw = await getDocs(collection(db, 'posts'));
            const arr = [];
            raw.forEach(s => {
              const d = s.data();
              if ((d.status || 'draft') === 'published') {
                arr.push({ id: s.id, ...d });
              }
            });
            arr.sort((a, b) => {
              const at = (a.createdAt && a.createdAt.seconds) ? a.createdAt.seconds : 0;
              const bt = (b.createdAt && b.createdAt.seconds) ? b.createdAt.seconds : 0;
              return bt - at;
            });
            setBlogPosts(arr);
          } catch (e2) {
            console.error('Fallback de leitura de posts falhou', e2);
            setBlogPosts([]);
          }
        })();
      });
      postsUnsubRef.current = unsub;
      return () => {
        if (postsUnsubRef.current) {
          postsUnsubRef.current();
          postsUnsubRef.current = null;
        }
      };
    } else {
      if (postsUnsubRef.current) {
        postsUnsubRef.current();
        postsUnsubRef.current = null;
      }
    }
  }, [currentView]);

  useEffect(() => {
    const openFromHash = async () => {
      const h = window.location.hash || '';
      const m = h.match(/^#blog\/(.+)$/);
      if (m && m[1]) {
        if (blogPosts.length === 0) await loadBlogPosts();
        const post = blogPosts.find(p => p.id === m[1]);
        if (post) {
          setSelectedBlogPost(post);
          setCurrentView('blog');
        }
      }
    };
    openFromHash();
    const onHash = () => openFromHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [blogPosts]);
  useEffect(() => {
    if (currentView !== 'builder') return;
    const onCtx = (e) => { e.preventDefault(); };
    document.addEventListener('contextmenu', onCtx);
    setBuilderReady(true);
    return () => {
      document.removeEventListener('contextmenu', onCtx);
      setBuilderReady(false);
    };
  }, [currentView]);
  useEffect(() => {
    if (currentView !== 'builder' || !builderReady) return;
    let mainPts = 100;
    let subPts = 20;
    const spent = {};
    const sSpent = {};

    const normalizeKey = (s) => (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const ensureIconCacheFor = async (displayName) => {
      if (!displayName) return;
      const clsKey = normalizeKey(displayName).replace(/\s+/g, '_');
      const cache = iconCacheRef.current || {};
      cache.__loading = cache.__loading || {};
      if (cache[clsKey] || cache.__loading[clsKey]) return;
      cache.__loading[clsKey] = true;
      iconCacheRef.current = cache;
      try {
        const baseId = displayName.toLowerCase().replace(/\s+/g, '-').replace(/ö/g, 'o');
        const alternates = [];
        if (baseId === 'bard') alternates.push('monk');
        const tryIds = [baseId, ...alternates];
        let data = null;
        for (const id of tryIds) {
          const docRef = doc(db, 'classes', id);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            data = snap.data();
            break;
          }
        }
        if (!data) return;
        const sections = [
          ...(data.especializacoes || []),
          ...((data.extra_info || []))
        ];
        const map = {};
        const perSection = {};
        sections.forEach(sec => {
          const container = document.createElement('div');
          container.innerHTML = sec.html || '';
          const rows = container.querySelectorAll('tr');
          const list = [];
          rows.forEach(tr => {
            const img = tr.querySelector('img');
            const tds = tr.querySelectorAll('td');
            let titleRaw = '';
            if (tds[1]) {
              const b = tds[1].querySelector('b');
              titleRaw = (b && b.textContent) ? b.textContent : tds[1].textContent;
            }
            const key = normalizeKey(titleRaw);
            if (img && img.src && key) {
              map[key] = img.src.replace(/^http:/i, 'https:');
            }
            if (key) {
              list.push(titleRaw.trim());
            }
          });
          const secKey = normalizeKey(sec?.title || '');
          if (secKey && list.length) {
            perSection[secKey] = list;
          }
        });
        cache[clsKey] = map;
        iconCacheRef.current = cache;
        const secCache = sectionsCacheRef.current || {};
        secCache[clsKey] = perSection;
        sectionsCacheRef.current = secCache;
      } catch {}
      finally {
        const cache2 = iconCacheRef.current || {};
        if (cache2.__loading) cache2.__loading[clsKey] = false;
        iconCacheRef.current = cache2;
      }
    };

    const builderDb = {
      viking: {
        t1: 'Berserker',
        t2: 'Shield Bearer',
        s1: [
          { id: 'vk1', n: 'Seismic Slam', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'vk2', n: 'Brute Force', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'vk3', n: 'Throw!', r: 2, c: 1, req: 'vk1', hasPlus: true },
          { id: 'vk4', n: 'Zeal', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'vk5', n: "Ymir's Champion", r: 3, c: 2, req: 'vk4', hasPlus: true },
          { id: 'vk6', n: 'Whirlwind', r: 3, c: 3, req: 'vk2', hasPlus: true },
          { id: 'vk7', n: 'Shockwave', r: 4, c: 1, req: 'vk3', hasPlus: true },
          { id: 'vk8', n: 'Berserk', r: 4, c: 2, req: 'vk5', hasPlus: true },
          { id: 'vk9', n: 'Demolishing Winds', r: 5, c: 3, req: 'vk6', hasPlus: false }
        ],
        s2: [
          { id: 'vk10', n: 'Weapon Master', r: 1, c: 2, req: null, hasPlus: false },
          { id: 'vk11', n: 'Charge', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'vk12', n: 'Stoneskin', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'vk13', n: 'Devastating Charge', r: 2, c: 3, req: 'vk11', hasPlus: false },
          { id: 'vk14', n: 'Norse Resistance', r: 3, c: 1, req: 'vk12', hasPlus: false },
          { id: 'vk15', n: 'Defensive Shout', r: 3, c: 2, req: null, hasPlus: false },
          { id: 'vk16', n: "Odin's Fury", r: 4, c: 2, req: 'vk15', hasPlus: true },
          { id: 'vk17', n: 'Battle Agility', r: 4, c: 3, req: 'vk13', hasPlus: false },
          { id: 'vk18', n: 'Combat Orders', r: 5, c: 2, req: 'vk16', hasPlus: false }
        ]
      },
      pyromancer: {
        t1: 'Fire Mage',
        t2: 'Burning Soul',
        s1: [
          { id: 'py1', n: 'Fireball', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'py2', n: 'Phoenix Spirits', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'py3', n: 'Fire Nova', r: 2, c: 1, req: 'py1', hasPlus: true },
          { id: 'py4', n: 'Burning Ground', r: 2, c: 2, req: null, hasPlus: false },
          { id: 'py5', n: 'Magma Orb', r: 3, c: 2, req: 'py4', hasPlus: true },
          { id: 'py6', n: 'Blazing Path', r: 3, c: 3, req: 'py2', hasPlus: true },
          { id: 'py7', n: 'Fire Hydra', r: 4, c: 1, req: 'py3', hasPlus: true },
          { id: 'py8', n: 'Comet', r: 4, c: 2, req: 'py5', hasPlus: true },
          { id: 'py9', n: 'Meteor Shower', r: 5, c: 3, req: 'py6', hasPlus: false }
        ],
        s2: [
          { id: 'py10', n: 'Inferno', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'py11', n: 'Caldarium', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'py12', n: 'Fire Shield', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'py13', n: 'Armageddon', r: 3, c: 2, req: 'py12', hasPlus: true },
          { id: 'py14', n: 'Flame Master', r: 4, c: 1, req: null, hasPlus: false },
          { id: 'py15', n: 'Splitter', r: 4, c: 3, req: 'py11', hasPlus: true },
          { id: 'py16', n: 'Fires of Hell', r: 5, c: 1, req: 'py14', hasPlus: false },
          { id: 'py17', n: 'Meltdown', r: 5, c: 2, req: null, hasPlus: false },
          { id: 'py18', n: 'Apocalypse', r: 5, c: 3, req: 'py13', hasPlus: true }
        ]
      },
      marksman: {
        t1: 'Hunter',
        t2: 'Marksman',
        s1: [
          { id: 'mk1', n: 'Arrow Rain', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'mk2', n: 'Agility', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'mk3', n: 'Multishot', r: 2, c: 1, req: 'mk1', hasPlus: true },
          { id: 'mk4', n: 'Homing Rocket', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'mk5', n: 'Explosive Shot', r: 3, c: 2, req: 'mk4', hasPlus: true },
          { id: 'mk6', n: 'Critical Shot', r: 3, c: 3, req: 'mk2', hasPlus: false },
          { id: 'mk7', n: 'Turret', r: 4, c: 1, req: 'mk3', hasPlus: true },
          { id: 'mk8', n: 'Guided Arrow', r: 4, c: 2, req: 'mk5', hasPlus: true },
          { id: 'mk9', n: 'Master Marksman', r: 5, c: 3, req: 'mk6', hasPlus: false }
        ],
        s2: [
          { id: 'mk10', n: 'Weapon Mastery', r: 1, c: 2, req: null, hasPlus: false },
          { id: 'mk11', n: 'Barrage', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'mk12', n: 'Sniper', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'mk13', n: 'Explosives Master', r: 2, c: 3, req: 'mk11', hasPlus: false },
          { id: 'mk14', n: 'Windwalker', r: 3, c: 1, req: 'mk12', hasPlus: false },
          { id: 'mk15', n: 'Frost Shot', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'mk16', n: 'Ice Arrow', r: 4, c: 2, req: 'mk15', hasPlus: true },
          { id: 'mk17', n: 'Power Shot', r: 4, c: 3, req: 'mk13', hasPlus: false },
          { id: 'mk18', n: 'Executioner', r: 5, c: 2, req: 'mk16', hasPlus: false }
        ]
      },
      pirate: {
        t1: 'Shipmaster',
        t2: 'Cannoneer',
        s1: [
          { id: 'pi1', n: 'Anchor Smash', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'pi2', n: 'Plunder', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'pi3', n: 'Parrot', r: 2, c: 1, req: 'pi1', hasPlus: true },
          { id: 'pi4', n: 'Drunken Sailor', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'pi5', n: 'Rum Flask', r: 3, c: 2, req: 'pi4', hasPlus: true },
          { id: 'pi6', n: 'Cutlass Master', r: 3, c: 3, req: 'pi2', hasPlus: false },
          { id: 'pi7', n: 'Grappling Hook', r: 4, c: 1, req: 'pi3', hasPlus: true },
          { id: 'pi8', n: 'Blackbeard', r: 4, c: 2, req: 'pi5', hasPlus: true },
          { id: 'pi9', n: 'Treasure Hunt', r: 5, c: 3, req: 'pi6', hasPlus: false }
        ],
        s2: [
          { id: 'pi10', n: 'Cannonball', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'pi11', n: 'Bombardment', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'pi12', n: 'Naval Strike', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'pi13', n: 'Gunpowder', r: 2, c: 3, req: 'pi11', hasPlus: false },
          { id: 'pi14', n: 'Heavy Metal', r: 3, c: 1, req: 'pi12', hasPlus: false },
          { id: 'pi15', n: 'Kraken', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'pi16', n: 'Maelstrom', r: 4, c: 2, req: 'pi15', hasPlus: true },
          { id: 'pi17', n: 'Rapid Fire', r: 4, c: 3, req: 'pi13', hasPlus: false },
          { id: 'pi18', n: 'Ghost Ship', r: 5, c: 2, req: 'pi16', hasPlus: false }
        ]
      },
      nomad: {
        t1: 'Sand Walker',
        t2: 'Desert Blade',
        s1: [
          { id: 'no1', n: 'Sandstorm', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'no2', n: 'Mirage', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'no3', n: 'Sun Ray', r: 2, c: 1, req: 'no1', hasPlus: true },
          { id: 'no4', n: 'Desert Wind', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'no5', n: 'Sand Blast', r: 3, c: 2, req: 'no4', hasPlus: true },
          { id: 'no6', n: 'Scimitar Master', r: 3, c: 3, req: 'no2', hasPlus: false },
          { id: 'no7', n: 'Tornado', r: 4, c: 1, req: 'no3', hasPlus: true },
          { id: 'no8', n: 'Sun Strike', r: 4, c: 2, req: 'no5', hasPlus: true },
          { id: 'no9', n: 'Sand Guardian', r: 5, c: 3, req: 'no6', hasPlus: false }
        ],
        s2: [
          { id: 'no10', n: 'Eye of Ra', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'no11', n: 'Vanish', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'no12', n: 'Golden Armor', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'no13', n: 'Shadow Step', r: 2, c: 3, req: 'no11', hasPlus: false },
          { id: 'no14', n: 'Heatwave', r: 3, c: 1, req: 'no12', hasPlus: false },
          { id: 'no15', n: 'Falconer', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'no16', n: 'Golden Eagle', r: 4, c: 2, req: 'no15', hasPlus: true },
          { id: 'no17', n: 'Desert Agility', r: 4, c: 3, req: 'no13', hasPlus: false },
          { id: 'no18', n: "Pharaoh's Curse", r: 5, c: 2, req: 'no16', hasPlus: false }
        ]
      },
      redneck: {
        t1: 'Hillbilly',
        t2: 'Moonshiner',
        s1: [
          { id: 'rn1', n: 'Chainsaw Slash', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'rn2', n: 'Sturdy', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'rn3', n: 'Oil Spill', r: 2, c: 1, req: 'rn1', hasPlus: true },
          { id: 'rn4', n: 'Beer Jug', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'rn5', n: 'Moonshine Blast', r: 3, c: 2, req: 'rn4', hasPlus: true },
          { id: 'rn6', n: 'Axeman', r: 3, c: 3, req: 'rn2', hasPlus: false },
          { id: 'rn7', n: 'Fire in the Hole', r: 4, c: 1, req: 'rn3', hasPlus: true },
          { id: 'rn8', n: 'Hillbilly Rage', r: 4, c: 2, req: 'rn5', hasPlus: true },
          { id: 'rn9', n: 'Truck Driver', r: 5, c: 3, req: 'rn6', hasPlus: false }
        ],
        s2: [
          { id: 'rn10', n: 'Tire Toss', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'rn11', n: 'Shotgun', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'rn12', n: 'Redneck Resilience', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'rn13', n: 'Buckshot', r: 2, c: 3, req: 'rn11', hasPlus: false },
          { id: 'rn14', n: 'Moonlight', r: 3, c: 1, req: 'rn12', hasPlus: false },
          { id: 'rn15', n: 'Bear Trap', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'rn16', n: 'Steel Trap', r: 4, c: 2, req: 'rn15', hasPlus: true },
          { id: 'rn17', n: 'Quick Loader', r: 4, c: 3, req: 'rn13', hasPlus: false },
          { id: 'rn18', n: "Grandfather's Jug", r: 5, c: 2, req: 'rn16', hasPlus: false }
        ]
      },
      necromancer: {
        t1: 'Summoner',
        t2: 'Lich',
        s1: [
          { id: 'ne1', n: 'Raise Skeleton', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'ne2', n: 'Soul Feast', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'ne3', n: 'Skeleton Mage', r: 2, c: 1, req: 'ne1', hasPlus: true },
          { id: 'ne4', n: 'Blood Burst', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'ne5', n: 'Corpse Explosion', r: 3, c: 2, req: 'ne4', hasPlus: true },
          { id: 'ne6', n: 'Command Undead', r: 3, c: 3, req: 'ne2', hasPlus: false },
          { id: 'ne7', n: 'Raise Golem', r: 4, c: 1, req: 'ne3', hasPlus: true },
          { id: 'ne8', n: 'Desecration', r: 4, c: 2, req: 'ne5', hasPlus: true },
          { id: 'ne9', n: 'Army of Dead', r: 5, c: 3, req: 'ne6', hasPlus: false }
        ],
        s2: [
          { id: 'ne10', n: 'Poison Nova', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'ne11', n: 'Bone Spear', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'ne12', n: 'Grim Reaper', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'ne13', n: 'Bone Armor', r: 2, c: 3, req: 'ne11', hasPlus: false },
          { id: 'ne14', n: "Death's Reach", r: 3, c: 1, req: 'ne12', hasPlus: false },
          { id: 'ne15', n: 'Curse of Weakness', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'ne16', n: 'Life Tap', r: 4, c: 2, req: 'ne15', hasPlus: true },
          { id: 'ne17', n: 'Soul Sacrifise', r: 4, c: 3, req: 'ne13', hasPlus: false },
          { id: 'ne18', n: 'Lich Form', r: 5, c: 2, req: 'ne16', hasPlus: false }
        ]
      },
      samurai: {
        t1: 'Bushido',
        t2: 'Ronin',
        s1: [
          { id: 'sa1', n: 'Bushido Blade', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'sa2', n: 'Evasion', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'sa3', n: 'Shuriken Toss', r: 2, c: 1, req: 'sa1', hasPlus: true },
          { id: 'sa4', n: "Warrior's Spirit", r: 2, c: 2, req: null, hasPlus: true },
          { id: 'sa5', n: 'Focus', r: 3, c: 2, req: 'sa4', hasPlus: true },
          { id: 'sa6', n: 'Kendo Master', r: 3, c: 3, req: 'sa2', hasPlus: false },
          { id: 'sa7', n: 'Katana Slice', r: 4, c: 1, req: 'sa3', hasPlus: true },
          { id: 'sa8', n: 'Ancestral Spirits', r: 4, c: 2, req: 'sa5', hasPlus: true },
          { id: 'sa9', n: 'Last Stand', r: 5, c: 3, req: 'sa6', hasPlus: false }
        ],
        s2: [
          { id: 'sa10', n: 'Way of the Sword', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'sa11', n: 'Dash', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'sa12', n: 'Shadow Strike', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'sa13', n: 'Quick Draw', r: 2, c: 3, req: 'sa11', hasPlus: false },
          { id: 'sa14', n: 'Honor', r: 3, c: 1, req: 'sa12', hasPlus: false },
          { id: 'sa15', n: 'Dragon Spirit', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'sa16', n: 'Omnislash', r: 4, c: 2, req: 'sa15', hasPlus: true },
          { id: 'sa17', n: 'Wind Blade', r: 4, c: 3, req: 'sa13', hasPlus: false },
          { id: 'sa18', n: "Emperor's Will", r: 5, c: 2, req: 'sa16', hasPlus: false }
        ]
      },
      paladin: {
        t1: 'Holy Knight',
        t2: 'Crusader',
        s1: [
          { id: 'pa1', n: 'Holy Hammer', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'pa2', n: 'Righteousness', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'pa3', n: 'Lightning Bolt', r: 2, c: 1, req: 'pa1', hasPlus: true },
          { id: 'pa4', n: 'Holy Shield', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'pa5', n: 'Divine Light', r: 3, c: 2, req: 'pa4', hasPlus: true },
          { id: 'pa6', n: 'Aura of Purity', r: 3, c: 3, req: 'pa2', hasPlus: false },
          { id: 'pa7', n: 'Judgement', r: 4, c: 1, req: 'pa3', hasPlus: true },
          { id: 'pa8', n: 'Consecration', r: 4, c: 2, req: 'pa5', hasPlus: true },
          { id: 'pa9', n: "God's Wrath", r: 5, c: 3, req: 'pa6', hasPlus: false }
        ],
        s2: [
          { id: 'pa10', n: 'Charge', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'pa11', n: 'Smite', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'pa12', n: 'Devotion', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'pa13', n: 'Blessed Hammer', r: 2, c: 3, req: 'pa11', hasPlus: false },
          { id: 'pa14', n: 'Vengeance', r: 3, c: 1, req: 'pa12', hasPlus: false },
          { id: 'pa15', n: 'Holy Nova', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'pa16', n: 'Hand of God', r: 4, c: 2, req: 'pa15', hasPlus: true },
          { id: 'pa17', n: 'Zealot', r: 4, c: 3, req: 'pa13', hasPlus: false },
          { id: 'pa18', n: 'Heavenly Strength', r: 5, c: 2, req: 'pa16', hasPlus: false }
        ]
      },
      amazon: {
        t1: 'Spear Maiden',
        t2: 'Huntress',
        s1: [
          { id: 'am1', n: 'Javelin Toss', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'am2', n: 'Evasive', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'am3', n: 'Thunder Spear', r: 2, c: 1, req: 'am1', hasPlus: true },
          { id: 'am4', n: 'Battle Cry', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'am5', n: 'Grace', r: 3, c: 2, req: 'am4', hasPlus: true },
          { id: 'am6', n: 'Spear Master', r: 3, c: 3, req: 'am2', hasPlus: false },
          { id: 'am7', n: 'Lightning Strike', r: 4, c: 1, req: 'am3', hasPlus: true },
          { id: 'am8', n: 'Enrage', r: 4, c: 2, req: 'am5', hasPlus: true },
          { id: 'am9', n: 'Valkyrie', r: 5, c: 3, req: 'am6', hasPlus: false }
        ],
        s2: [
          { id: 'am10', n: 'Multi Javelin', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'am11', n: 'Dash Strike', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'am12', n: 'Natural Resistance', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'am13', n: 'Power Throw', r: 2, c: 3, req: 'am11', hasPlus: false },
          { id: 'am14', n: 'Amazonian Will', r: 3, c: 1, req: 'am12', hasPlus: false },
          { id: 'am15', n: 'Poison Spear', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'am16', n: 'Toxic Cloud', r: 4, c: 2, req: 'am15', hasPlus: true },
          { id: 'am17', n: 'Critical Pierce', r: 4, c: 3, req: 'am13', hasPlus: false },
          { id: 'am18', n: 'Queen of Jungle', r: 5, c: 2, req: 'am16', hasPlus: false }
        ]
      },
      demon_slayer: {
        t1: 'Executioner',
        t2: 'Inquisitor',
        s1: [
          { id: 'ds1', n: 'Bullet Rain', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'ds2', n: 'Agility', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'ds3', n: 'Silver Shot', r: 2, c: 1, req: 'ds1', hasPlus: true },
          { id: 'ds4', n: 'Reload', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'ds5', n: 'Holy Water', r: 3, c: 2, req: 'ds4', hasPlus: true },
          { id: 'ds6', n: 'Gun Master', r: 3, c: 3, req: 'ds2', hasPlus: false },
          { id: 'ds7', n: 'Crossbow Trap', r: 4, c: 1, req: 'ds3', hasPlus: true },
          { id: 'ds8', n: 'Exorcism', r: 4, c: 2, req: 'ds5', hasPlus: true },
          { id: 'ds9', n: "Slayer's Focus", r: 5, c: 3, req: 'ds6', hasPlus: false }
        ],
        s2: [
          { id: 'ds10', n: 'Double Tap', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'ds11', n: 'Dash', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'ds12', n: 'Shadow Armor', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'ds13', n: 'Headshot', r: 2, c: 3, req: 'ds11', hasPlus: false },
          { id: 'ds14', n: "Hunter's Mark", r: 3, c: 1, req: 'ds12', hasPlus: false },
          { id: 'ds15', n: 'Holy Grenade', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'ds16', n: 'Purification', r: 4, c: 2, req: 'ds15', hasPlus: true },
          { id: 'ds17', n: 'Execution', r: 4, c: 3, req: 'ds13', hasPlus: false },
          { id: 'ds18', n: 'Vengeance', r: 5, c: 2, req: 'ds16', hasPlus: false }
        ]
      },
      demonspawn: {
        t1: 'Hellfire',
        t2: 'Demonic',
        s1: [
          { id: 'dp1', n: 'Blood Bolt', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'dp2', n: 'Toughness', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'dp3', n: 'Flame Breath', r: 2, c: 1, req: 'dp1', hasPlus: true },
          { id: 'dp4', n: 'Demon Skin', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'dp5', n: 'Spike Shield', r: 3, c: 2, req: 'dp4', hasPlus: true },
          { id: 'dp6', n: 'Chaos Master', r: 3, c: 3, req: 'dp2', hasPlus: false },
          { id: 'dp7', n: 'Fire Nova', r: 4, c: 1, req: 'dp3', hasPlus: true },
          { id: 'dp8', n: 'Infernal Soul', r: 4, c: 2, req: 'dp5', hasPlus: true },
          { id: 'dp9', n: "Hell's Gate", r: 5, c: 3, req: 'dp6', hasPlus: false }
        ],
        s2: [
          { id: 'dp10', n: 'Blood Surge', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'dp11', n: 'Shadow Step', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'dp12', n: 'Demonic Might', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'dp13', n: 'Drain Life', r: 2, c: 3, req: 'dp11', hasPlus: false },
          { id: 'dp14', n: 'Corruption', r: 3, c: 1, req: 'dp12', hasPlus: false },
          { id: 'dp15', n: 'Bone Spikes', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'dp16', n: 'Soul Eater', r: 4, c: 2, req: 'dp15', hasPlus: true },
          { id: 'dp17', n: 'Darkness', r: 4, c: 3, req: 'dp13', hasPlus: false },
          { id: 'dp18', n: 'Avatar of Chaos', r: 5, c: 2, req: 'dp16', hasPlus: false }
        ]
      },
      shaman: {
        t1: 'Elemental',
        t2: 'Totemic',
        s1: [
          { id: 'sh1', n: 'Fire Totem', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'sh2', n: 'Ancestral Guidance', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'sh3', n: 'Earth Bind', r: 2, c: 1, req: 'sh1', hasPlus: true },
          { id: 'sh4', n: 'Storm Spirit', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'sh5', n: 'Lightning Shield', r: 3, c: 2, req: 'sh4', hasPlus: true },
          { id: 'sh6', n: "Nature's Ally", r: 3, c: 3, req: 'sh2', hasPlus: false },
          { id: 'sh7', n: 'Chain Lightning', r: 4, c: 1, req: 'sh3', hasPlus: true },
          { id: 'sh8', n: 'Volcano', r: 4, c: 2, req: 'sh5', hasPlus: true },
          { id: 'sh9', n: 'Elemental Overload', r: 5, c: 3, req: 'sh6', hasPlus: false }
        ],
        s2: [
          { id: 'sh10', n: 'Wolf Spirit', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'sh11', n: 'Healing Rain', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'sh12', n: 'Static Field', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'sh13', n: 'Bloodlust', r: 2, c: 3, req: 'sh11', hasPlus: false },
          { id: 'sh14', n: 'Earthquake', r: 3, c: 1, req: 'sh12', hasPlus: false },
          { id: 'sh15', n: 'Windfury', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'sh16', n: 'Storm Totem', r: 4, c: 2, req: 'sh15', hasPlus: true },
          { id: 'sh17', n: 'Thunderstrike', r: 4, c: 3, req: 'sh13', hasPlus: false },
          { id: 'sh18', n: 'Spirit Walk', r: 5, c: 2, req: 'sh16', hasPlus: false }
        ]
      },
      white_mage: {
        t1: 'Holy Beam',
        t2: 'Benediction',
        s1: [
          { id: 'wm1', n: 'Holy Bolt', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'wm2', n: 'Mana Flow', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'wm3', n: 'Divine Armor', r: 2, c: 1, req: 'wm1', hasPlus: true },
          { id: 'wm4', n: 'Inner Fire', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'wm5', n: 'Holy Fire', r: 3, c: 2, req: 'wm4', hasPlus: true },
          { id: 'wm6', n: 'Light Master', r: 3, c: 3, req: 'wm2', hasPlus: false },
          { id: 'wm7', n: 'Heavenly Beam', r: 4, c: 1, req: 'wm3', hasPlus: true },
          { id: 'wm8', n: 'Purify', r: 4, c: 2, req: 'wm5', hasPlus: true },
          { id: 'wm9', n: 'Angel Form', r: 5, c: 3, req: 'wm6', hasPlus: false }
        ],
        s2: [
          { id: 'wm10', n: 'Heal', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'wm11', n: 'Sanctuary', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'wm12', n: 'Resurrection', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'wm13', n: 'Benediction', r: 2, c: 3, req: 'wm11', hasPlus: false },
          { id: 'wm14', n: 'Divine Aura', r: 3, c: 1, req: 'wm12', hasPlus: false },
          { id: 'wm15', n: 'Holy Nova', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'wm16', n: "God's Grace", r: 4, c: 2, req: 'wm15', hasPlus: true },
          { id: 'wm17', n: 'Faith', r: 4, c: 3, req: 'wm13', hasPlus: false },
          { id: 'wm18', n: 'Archangel', r: 5, c: 2, req: 'wm16', hasPlus: false }
        ]
      },
      marauder: {
        t1: 'Bombardier',
        t2: 'Wrecker',
        s1: [
          { id: 'ma1', n: 'Unstable Bomb', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'ma2', n: 'Armor Piercing', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'ma3', n: 'Shrapnel', r: 2, c: 1, req: 'ma1', hasPlus: true },
          { id: 'ma4', n: 'Heavy Weights', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'ma5', n: 'Concussion', r: 3, c: 2, req: 'ma4', hasPlus: true },
          { id: 'ma6', n: 'Madness', r: 3, c: 3, req: 'ma2', hasPlus: false },
          { id: 'ma7', n: 'Grenade Toss', r: 4, c: 1, req: 'ma3', hasPlus: true },
          { id: 'ma8', n: 'Cluster Bomb', r: 4, c: 2, req: 'ma5', hasPlus: true },
          { id: 'ma9', n: 'Big Bertha', r: 5, c: 3, req: 'ma6', hasPlus: false }
        ],
        s2: [
          { id: 'ma10', n: 'Chain Hook', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'ma11', n: 'Iron Ball', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'ma12', n: 'Steel Skin', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'ma13', n: 'Wrecking Ball', r: 2, c: 3, req: 'ma11', hasPlus: false },
          { id: 'ma14', n: 'Spiked Armor', r: 3, c: 1, req: 'ma12', hasPlus: false },
          { id: 'ma15', n: 'Battle Cry', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'ma16', n: 'Juggernaut', r: 4, c: 2, req: 'ma15', hasPlus: true },
          { id: 'ma17', n: 'Rage', r: 4, c: 3, req: 'ma13', hasPlus: false },
          { id: 'ma18', n: 'Dreadnought', r: 5, c: 2, req: 'ma16', hasPlus: false }
        ]
      },
      plague_doctor: {
        t1: 'Infection',
        t2: 'Medicine',
        s1: [
          { id: 'pd1', n: 'Plague Rat', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'pd2', n: 'Contagion', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'pd3', n: 'Toxic Cloud', r: 2, c: 1, req: 'pd1', hasPlus: true },
          { id: 'pd4', n: 'Acid Blast', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'pd5', n: 'Biohazard', r: 3, c: 2, req: 'pd4', hasPlus: true },
          { id: 'pd6', n: 'Virulence', r: 3, c: 3, req: 'pd2', hasPlus: false },
          { id: 'pd7', n: 'Corrosive Slop', r: 4, c: 1, req: 'pd3', hasPlus: true },
          { id: 'pd8', n: 'Epidemic', r: 4, c: 2, req: 'pd5', hasPlus: true },
          { id: 'pd9', n: 'Plague Lord', r: 5, c: 3, req: 'pd6', hasPlus: false }
        ],
        s2: [
          { id: 'pd10', n: 'Healing Vial', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'pd11', n: 'Antidote', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'pd12', n: 'Sterilize', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'pd13', n: 'Tincture', r: 2, c: 3, req: 'pd11', hasPlus: false },
          { id: 'pd14', n: 'Medical Kit', r: 3, c: 1, req: 'pd12', hasPlus: false },
          { id: 'pd15', n: 'Field Practice', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'pd16', n: 'Panacea', r: 4, c: 2, req: 'pd15', hasPlus: true },
          { id: 'pd17', n: 'Preservation', r: 4, c: 3, req: 'pd13', hasPlus: false },
          { id: 'pd18', n: 'Life Support', r: 5, c: 2, req: 'pd16', hasPlus: false }
        ]
      },
      illusionist: {
        t1: 'Phantasm',
        t2: 'Mirror',
        s1: [
          { id: 'il1', n: 'Clone Strike', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'il2', n: 'Mind Trick', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'il3', n: 'Spectral Blade', r: 2, c: 1, req: 'il1', hasPlus: true },
          { id: 'il4', n: 'Confusion', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'il5', n: 'Hallucination', r: 3, c: 2, req: 'il4', hasPlus: true },
          { id: 'il6', n: 'Illusion Mastery', r: 3, c: 3, req: 'il2', hasPlus: false },
          { id: 'il7', n: 'Phantasmagoria', r: 4, c: 1, req: 'il3', hasPlus: true },
          { id: 'il8', n: 'Terror', r: 4, c: 2, req: 'il5', hasPlus: true },
          { id: 'il9', n: 'Mirror Realm', r: 5, c: 3, req: 'il6', hasPlus: false }
        ],
        s2: [
          { id: 'il10', n: 'Mirror Image', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'il11', n: 'Teleport', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'il12', n: 'Prismatic Spray', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'il13', n: 'Arcane Shift', r: 2, c: 3, req: 'il11', hasPlus: false },
          { id: 'il14', n: 'Vortex', r: 3, c: 1, req: 'il12', hasPlus: false },
          { id: 'il15', n: 'Light Show', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'il16', n: 'Dazzle', r: 4, c: 2, req: 'il15', hasPlus: true },
          { id: 'il17', n: 'Refraction', r: 4, c: 3, req: 'il13', hasPlus: false },
          { id: 'il18', n: 'Grand Finale', r: 5, c: 2, req: 'il16', hasPlus: false }
        ]
      },
      exo: {
        t1: 'Gravity',
        t2: 'Force',
        s1: [
          { id: 'ex1', n: 'Force Field', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'ex2', n: 'Kinetic Energy', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'ex3', n: 'Gravity Well', r: 2, c: 1, req: 'ex1', hasPlus: true },
          { id: 'ex4', n: 'Push', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'ex5', n: 'Repel', r: 3, c: 2, req: 'ex4', hasPlus: true },
          { id: 'ex6', n: 'Momentum', r: 3, c: 3, req: 'ex2', hasPlus: false },
          { id: 'ex7', n: 'Singularity', r: 4, c: 1, req: 'ex3', hasPlus: true },
          { id: 'ex8', n: 'Collapse', r: 4, c: 2, req: 'ex5', hasPlus: true },
          { id: 'ex9', n: 'Event Horizon', r: 5, c: 3, req: 'ex6', hasPlus: false }
        ],
        s2: [
          { id: 'ex10', n: 'Exo Strike', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'ex11', n: 'Jetpack', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'ex12', n: 'Laser Beam', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'ex13', n: 'Charge Shot', r: 2, c: 3, req: 'ex11', hasPlus: false },
          { id: 'ex14', n: 'Plasma Shield', r: 3, c: 1, req: 'ex12', hasPlus: false },
          { id: 'ex15', n: 'Overload', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'ex16', n: 'Battery Drain', r: 4, c: 2, req: 'ex15', hasPlus: true },
          { id: 'ex17', n: 'Photon Blast', r: 4, c: 3, req: 'ex13', hasPlus: false },
          { id: 'ex18', n: 'Supernova', r: 5, c: 2, req: 'ex16', hasPlus: false }
        ]
      },
      butcher: {
        t1: 'Meat',
        t2: 'Blood',
        s1: [
          { id: 'bu1', n: 'Meat Hook', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'bu2', n: 'Fresh Meat', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'bu3', n: 'Cleave', r: 2, c: 1, req: 'bu1', hasPlus: true },
          { id: 'bu4', n: 'Rot', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'bu5', n: 'Infection', r: 3, c: 2, req: 'bu4', hasPlus: true },
          { id: 'bu6', n: "Butcher's Grip", r: 3, c: 3, req: 'bu2', hasPlus: false },
          { id: 'bu7', n: 'Carve', r: 4, c: 1, req: 'bu3', hasPlus: true },
          { id: 'bu8', n: 'Mutilate', r: 4, c: 2, req: 'bu5', hasPlus: true },
          { id: 'bu9', n: 'The Slaughter', r: 5, c: 3, req: 'bu6', hasPlus: false }
        ],
        s2: [
          { id: 'bu10', n: 'Chop', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'bu11', n: 'Charge', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'bu12', n: 'Bloodbath', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'bu13', n: 'Heavy Blade', r: 2, c: 3, req: 'bu11', hasPlus: false },
          { id: 'bu14', n: 'Savage', r: 3, c: 1, req: 'bu12', hasPlus: false },
          { id: 'bu15', n: 'Frenzy', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'bu16', n: 'Rage', r: 4, c: 2, req: 'bu15', hasPlus: true },
          { id: 'bu17', n: 'Executioner', r: 4, c: 3, req: 'bu13', hasPlus: false },
          { id: 'bu18', n: 'Butcher Shop', r: 5, c: 2, req: 'bu16', hasPlus: false }
        ]
      },
      stormweaver: {
        t1: 'Thunder',
        t2: 'Storm',
        s1: [
          { id: 'st1', n: 'Lightning Bolt', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'st2', n: 'Conductivity', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'st3', n: 'Static Shock', r: 2, c: 1, req: 'st1', hasPlus: true },
          { id: 'st4', n: 'Thunderclap', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'st5', n: 'Electric Field', r: 3, c: 2, req: 'st4', hasPlus: true },
          { id: 'st6', n: 'Volt Mastery', r: 3, c: 3, req: 'st2', hasPlus: false },
          { id: 'st7', n: 'Chain Lightning', r: 4, c: 1, req: 'st3', hasPlus: true },
          { id: 'st8', n: 'Ion Storm', r: 4, c: 2, req: 'st5', hasPlus: true },
          { id: 'st9', n: 'God of Thunder', r: 5, c: 3, req: 'st6', hasPlus: false }
        ],
        s2: [
          { id: 'st10', n: 'Storm Cloud', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'st11', n: 'Flash Dash', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'st12', n: 'Rain of Sparks', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'st13', n: 'Thunderstrike', r: 2, c: 3, req: 'st11', hasPlus: false },
          { id: 'st14', n: 'Windfury', r: 3, c: 1, req: 'st12', hasPlus: false },
          { id: 'st15', n: 'Hurricane', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'st16', n: 'Tornado', r: 4, c: 2, req: 'st15', hasPlus: true },
          { id: 'st17', n: 'Cyclone', r: 4, c: 3, req: 'st13', hasPlus: false },
          { id: 'st18', n: 'Maelstrom', r: 5, c: 2, req: 'st16', hasPlus: false }
        ]
      },
      bard: {
        t1: 'Minstrel',
        t2: 'Troubadour',
        s1: [
          { id: 'ba1', n: 'Melodic Chord', r: 1, c: 1, req: null, hasPlus: true },
          { id: 'ba2', n: 'Harmony', r: 1, c: 3, req: null, hasPlus: false },
          { id: 'ba3', n: 'Sound Wave', r: 2, c: 1, req: 'ba1', hasPlus: true },
          { id: 'ba4', n: 'Discord', r: 2, c: 2, req: null, hasPlus: true },
          { id: 'ba5', n: 'Vibrant Echo', r: 3, c: 2, req: 'ba4', hasPlus: true },
          { id: 'ba6', n: 'Rhythm', r: 3, c: 3, req: 'ba2', hasPlus: false },
          { id: 'ba7', n: 'Symphony', r: 4, c: 1, req: 'ba3', hasPlus: true },
          { id: 'ba8', n: 'Resonance', r: 4, c: 2, req: 'ba5', hasPlus: true },
          { id: 'ba9', n: 'Masterpiece', r: 5, c: 3, req: 'ba6', hasPlus: false }
        ],
        s2: [
          { id: 'ba10', n: 'Inspiring Tune', r: 1, c: 2, req: null, hasPlus: true },
          { id: 'ba11', n: 'Dancing Step', r: 1, c: 3, req: null, hasPlus: true },
          { id: 'ba12', n: 'Lullaby', r: 2, c: 1, req: null, hasPlus: false },
          { id: 'ba13', n: 'Power Ballad', r: 2, c: 3, req: 'ba11', hasPlus: false },
          { id: 'ba14', n: 'Chorus', r: 3, c: 1, req: 'ba12', hasPlus: false },
          { id: 'ba15', n: 'Battle Song', r: 3, c: 2, req: null, hasPlus: true },
          { id: 'ba16', n: 'Heroic Anthem', r: 4, c: 2, req: 'ba15', hasPlus: true },
          { id: 'ba17', n: 'Crescendo', r: 4, c: 3, req: 'ba13', hasPlus: false },
          { id: 'ba18', n: 'Final Encore', r: 5, c: 2, req: 'ba16', hasPlus: false }
        ]
      }
    };

    const classKeyFromName = (name) => {
      if (!name) return 'viking';
      return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_');
    };

    const update = () => {
      const m = document.getElementById('main-pts');
      const s = document.getElementById('sub-pts');
      if (m) m.innerText = String(mainPts);
      if (s) s.innerText = String(subPts);

      const key = classKeyFromName(builderClass);
      const data = builderDb[key] || builderDb.viking;

      ensureIconCacheFor(builderClass).then(() => {
        const again = classKeyFromName(builderClass);
        if (again !== key) return;
        if (!data.s2 || data.s2.length <= 1) {
          const clsKey = (builderClass || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '_');
          const per = (sectionsCacheRef.current && sectionsCacheRef.current[clsKey]) || null;
          if (per) {
            const secKey = normalizeKey(data.t2 || '');
            const names = per[secKey];
            if (names && names.length) {
              const gen = names.slice(0, 9).map((titleRaw, idx) => {
                const r = Math.floor(idx / 3) + 1;
                const c = (idx % 3) + 1;
                return {
                  id: `pd${10 + idx}`,
                  n: String(titleRaw).trim(),
                  r, c,
                  req: null,
                  hasPlus: false
                };
              });
              data.s2 = gen;
            }
          }
        }
        const t1 = document.getElementById('tree-title-1');
        const t2 = document.getElementById('tree-title-2');
        if (t1 && data.t1) t1.textContent = data.t1;
        if (t2 && data.t2) t2.textContent = data.t2;
        renderTree(data.s1, 'grid-berserker');
        renderTree(data.s2, 'grid-shield');
      });
    };

    const renderTree = (skills, gridId) => {
      const grid = document.getElementById(gridId);
      if (!grid) return;
      grid.innerHTML = '';

      if (!skills || skills.length === 0) {
        grid.innerHTML =
          '<div style="grid-column: 1 / span 3; text-align: center; color: #9ca3af; margin-top: 40px; font-size: 12px;">Aguardando preenchimento manual das skills...</div>';
        return;
      }

      const cache = iconCacheRef.current || {};
      const clsKey = (builderClass || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_');
      const iconMap = cache[clsKey] || {};
      skills.forEach(sk => {
        const iconCandidates = [];
        const raw = (sk.n || '').trim();
        const base = raw.replace(/\s+/g, '_').replace(/'/g, '%27');
        const nameKey = raw
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        if (iconMap[nameKey]) {
          iconCandidates.push(iconMap[nameKey]);
        }
        let cls = (builderClass || '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '_');
        if (cls.toLowerCase() === 'bard') cls = 'Monk';
        if (cls.toLowerCase() === 'jötunn' || cls.toLowerCase() === 'jotunn') cls = 'Jotunn';
        iconCandidates.push(`https://herosiege.wiki.gg/images/${cls}_${base}.png`);
        iconCandidates.push(`https://herosiege.wiki.gg/images/Icon_${cls}_${base}.png`);
        iconCandidates.push(`https://herosiege.wiki.gg/images/${cls}_${base}.jpg`);
        iconCandidates.push(`https://herosiege.wiki.gg/images/Icon_${cls}_${base}.jpg`);
        const vikingName = 'Viking_' + raw.replace(/['’!]/g, '').replace(/\s+/g, '_');
        iconCandidates.push(`https://herosiege.wiki.gg/images/${vikingName}.png`);
        iconCandidates.push(`https://herosiege.wiki.gg/images/${base}.png`);
        iconCandidates.push(`https://herosiege.wiki.gg/images/Icon_${base}.png`);
        iconCandidates.push(`https://herosiege.wiki.gg/images/${base}.jpg`);
        iconCandidates.push(`https://herosiege.wiki.gg/images/Icon_${base}.jpg`);
        iconCandidates.push(`https://herosiege.wiki.gg/images/Item_Chest.png`);
        const pts = spent[sk.id] || 0;
        const locked = sk.req && (spent[sk.req] || 0) === 0;
        const div = document.createElement('div');
        div.className = `skill${locked ? ' locked' : ''}${pts > 0 ? ' has-points' : ''}`;
        div.style.gridRow = String(sk.r);
        div.style.gridColumn = String(sk.c);
        const img = document.createElement('img');
        img.dataset.idx = '0';
        img.src = iconCandidates[0];
        img.onerror = () => {
          const i = Number(img.dataset.idx || '0') + 1;
          if (i < iconCandidates.length) {
            img.dataset.idx = String(i);
            img.src = iconCandidates[i];
          } else {
            img.remove();
          }
        };
        const nameDiv = document.createElement('div');
        nameDiv.className = 'name-label';
        nameDiv.textContent = sk.n;
        const lvl = document.createElement('div');
        lvl.className = 'lvl-badge';
        lvl.textContent = `${pts}/20`;
        div.appendChild(img);
        div.appendChild(nameDiv);
        div.appendChild(lvl);
        if (sk.hasPlus) {
          const plus = document.createElement('button');
          plus.className = `plus-btn${pts > 0 ? ' active-plus' : ''}`;
          plus.textContent = '+';
          plus.addEventListener('click', (e) => {
            e.stopPropagation();
            openSub(e, sk.id, sk.n);
          });
          div.appendChild(plus);
        }
        div.onmousedown = (e) => {
          if (locked) return;
          if (e.button === 0 && mainPts > 0 && pts < 20) {
            spent[sk.id] = pts + 1;
            mainPts--;
          } else if (e.button === 2 && pts > 0) {
            spent[sk.id] = pts - 1;
            mainPts++;
          }
          update();
        };
        grid.appendChild(div);
      });
    };
    const openSub = (e, id, name) => {
      e.stopPropagation();
      const base = spent[id] || 0;
      if (base === 0) {
        alert('Ative a skill com pelo menos 1 ponto antes!');
        return;
      }
      const ov = document.getElementById('overlay');
      const sw = document.getElementById('sub-window');
      const st = document.getElementById('sub-title');
      const sc = document.getElementById('sub-content');
      if (!ov || !sw || !st || !sc) return;
      ov.style.display = 'block';
      sw.style.display = 'block';
      st.innerText = 'Sub-skills: ' + name;
      sc.innerHTML = '';
      [1, 2, 3].forEach((i) => {
        const sid = id + '_s' + i;
        const slvl = sSpent[sid] || 0;
        const item = document.createElement('div');
        item.className = 'sub-skill-card';
        const span = document.createElement('span');
        span.textContent = 'Talento ' + i;
        const bold = document.createElement('b');
        bold.textContent = `${slvl}/5`;
        item.appendChild(span);
        item.appendChild(bold);
        item.onmousedown = (ev) => {
          if (ev.button === 0 && subPts > 0 && slvl < 5) {
            sSpent[sid] = slvl + 1;
            subPts--;
          } else if (ev.button === 2 && slvl > 0) {
            sSpent[sid] = slvl - 1;
            subPts++;
          }
          openSub(e, id, name);
          update();
        };
        sc.appendChild(item);
      });
    };
    const closeSub = () => {
      const ov = document.getElementById('overlay');
      const sw = document.getElementById('sub-window');
      if (ov) ov.style.display = 'none';
      if (sw) sw.style.display = 'none';
    };
    const btn = document.querySelector('#sub-window button');
    if (btn) btn.addEventListener('click', closeSub);
    update();
    return () => {
      const grid1 = document.getElementById('grid-berserker');
      const grid2 = document.getElementById('grid-shield');
      if (grid1) grid1.innerHTML = '';
      if (grid2) grid2.innerHTML = '';
      const ov = document.getElementById('overlay');
      const sw = document.getElementById('sub-window');
      if (ov) ov.style.display = 'none';
      if (sw) sw.style.display = 'none';
      if (btn) btn.removeEventListener('click', closeSub);
    };
  }, [currentView, builderReady, builderClass]);

  const loadItemCategories = async () => {
    setItemsLoading(true);
    try {
      const colRef = collection(db, 'item_categories');
      const snap = await getDocs(colRef);
      const cats = [];
      snap.forEach(s => cats.push({ id: s.id, ...s.data() }));
      cats.sort((a, b) => {
        const ao = a.order ?? 999;
        const bo = b.order ?? 999;
        if (ao !== bo) return ao - bo;
        return (a.title || '').localeCompare(b.title || '');
      });
      setItemCategories(cats);
    } catch (e) {
      console.error('Erro carregando categorias de itens', e);
      setItemCategories([]);
    } finally {
      setItemsLoading(false);
    }
  };

  const loadItemsForCategory = async (cat) => {
    setItemsLoading(true);
    setSelectedItemCategory(cat);
    try {
      const candidates = (() => {
        const id = String(cat.id || '').trim();
        const arr = [id];
        if (id.toLowerCase().endsWith('s')) arr.push(id.slice(0, -1));
        else arr.push(id + 's');
        return Array.from(new Set(arr.map(s => s.toLowerCase())));
      })();

      let pickedItems = [];
      for (const cid of candidates) {
        const colRef = collection(db, 'item_categories', cid, 'items');
        const snap = await getDocs(colRef);
        const items = [];
        snap.forEach(s => items.push({ id: s.id, ...s.data() }));
        if (items.length > 0) {
          pickedItems = items;
          break;
        }
      }

      const catIdLc = String(cat.id || '').trim().toLowerCase();
      const cleaned = pickedItems.filter(it => {
        const n = String(it.name || '').trim().toLowerCase();
        const idn = String(it.id || '').trim().toLowerCase();
        if (!n && idn === catIdLc) return false;
        if (n && (n === catIdLc || n === 'shield')) return false;
        return true;
      });

      cleaned.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setItemsList(cleaned);
    } catch (e) {
      console.error('Erro carregando itens da categoria', cat.id, e);
      setItemsList([]);
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === 'items') {
      setSelectedItemCategory(null);
      setSelectedItem(null);
      setItemsList([]);
      loadItemCategories();
    }
  }, [currentView]);

  const fetchClassData = async (nome) => {
    setLoading(true);
    setSelectedClass(nome);
    setWikiData(null);
    setActiveTab(0);
    
    const baseId = nome.toLowerCase().replace(/\s+/g, '-').replace(/ö/g, 'o');
    const alternates = [];
    if (baseId === 'bard') alternates.push('monk');

    const tryIds = [baseId, ...alternates];

    try {
      let data = null;
      for (const id of tryIds) {
        const docRef = doc(db, 'classes', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          data = docSnap.data();
          break;
        }
      }

      if (data) {
        let mainSections = data.especializacoes || [{ title: "Geral", html: "<div>Sem dados de especialização.</div>" }];
        const extraSections = (data.extra_info || []).map(s => ({ ...s, isExtra: true }));
        if (nome === 'Bard') {
          const chest = 'https://herosiege.wiki.gg/images/Item_Chest.png';
          const iconPrimary = (base) => `https://herosiege.wiki.gg/images/Monk_${base}.png`;
          const iconAlt = (base) => `https://herosiege.wiki.gg/images/Icon_Monk_${base}.png`;
          const row = (n, r, l) => {
            const base = String(n).trim().replace(/['’!]/g, '').replace(/\s+/g, '_');
            return `
              <tr>
                <td><img src="${iconPrimary(base)}" alt="${n}" onerror="this.onerror=function(){this.onerror=null;this.src='${chest}'};this.src='${iconAlt(base)}'"/></td>
                <td>${n}</td>
                <td>${r}</td>
                <td>${l}</td>
              </tr>`;
          };
          const tableWrap = (rows) => `
            <table>
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Required Skill(s)</th>
                  <th>Required Level</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>`;
          const minstrel = tableWrap([
            row('Melodic Chord', 'None', '1'),
            row('Harmony', 'None', '1'),
            row('Sound Wave', 'Melodic Chord', '6'),
            row('Discord', 'None', '6'),
            row('Vibrant Echo', 'Discord', '12'),
            row('Rhythm', 'Harmony', '12'),
            row('Symphony', 'Sound Wave', '18'),
            row('Resonance', 'Vibrant Echo', '18'),
            row('Masterpiece', 'Rhythm', '24')
          ].join(''));
          const troubadour = tableWrap([
            row('Inspiring Tune', 'None', '1'),
            row('Dancing Step', 'None', '1'),
            row('Lullaby', 'None', '6'),
            row('Power Ballad', 'Dancing Step', '6'),
            row('Chorus', 'Lullaby', '12'),
            row('Battle Song', 'None', '12'),
            row('Heroic Anthem', 'Battle Song', '18'),
            row('Crescendo', 'Power Ballad', '18'),
            row('Final Encore', 'Heroic Anthem', '24')
          ].join(''));
          const augments = `
            <div class="wiki-data">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Special Effect from Augment</th>
                    <th>Gained per Augment Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Requiem</td>
                    <td>Masterpiece now releases homing Soul Notes from defeated enemies.</td>
                    <td>10% Soul Note Damage 2% Extra Note Chance</td>
                  </tr>
                  <tr>
                    <td>Cacophony</td>
                    <td>Discord leaves a chaotic sound trail that shreds enemy armor.</td>
                    <td>1.5s Trail Duration 3% Armor Reduction</td>
                  </tr>
                  <tr>
                    <td>Allegro</td>
                    <td>Dancing Step grants Haste and nullifies the first instance of damage.</td>
                    <td>5% Cast Speed -0.5s Internal Cooldown</td>
                  </tr>
                  <tr>
                    <td>Fortissimo</td>
                    <td>Heroic Anthem pulses healing waves to allies based on damage dealt.</td>
                    <td>1% Damage-to-Heal Conversion 5% Aura Radius</td>
                  </tr>
                </tbody>
              </table>
            </div>`;
          const section4 = `
            <div class="wiki-data">
              <table>
                <thead>
                  <tr>
                    <th>Classes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>● Viking ● Pyromancer ● Marksman ● Pirate ● Nomad ● Redneck ● Necromancer ● Samurai ● Paladin ● Amazon ● Demon Slayer ● Demonspawn ● Shaman ● White Mage ● Marauder ● Plague Doctor ● Shield Lancer ● Illusionist ● Jötunn ● Exo ● Butcher ● Stormweaver</td>
                  </tr>
                </tbody>
              </table>
            </div>`;
          mainSections = [
            { title: 'Minstrel', html: minstrel },
            { title: 'Troubadour', html: troubadour },
            { title: 'Class Augments', html: augments },
            { title: 'Classes', html: section4 }
          ];
        }
        setWikiData({
          weapon: data.weapon,
          sections: [...mainSections, ...extraSections]
        });
      } else {
        console.error("Documento não encontrado para:", tryIds.join(', '));
        if (nome === 'Bard') {
          const chest = 'https://herosiege.wiki.gg/images/Item_Chest.png';
          const iconPrimary = (base) => `https://herosiege.wiki.gg/images/Monk_${base}.png`;
          const iconAlt = (base) => `https://herosiege.wiki.gg/images/Icon_Monk_${base}.png`;
          const row = (n, r, l) => {
            const base = String(n).trim().replace(/['’!]/g, '').replace(/\s+/g, '_');
            return `
              <tr>
                <td><img src="${iconPrimary(base)}" alt="${n}" onerror="this.onerror=function(){this.onerror=null;this.src='${chest}'};this.src='${iconAlt(base)}'"/></td>
                <td>${n}</td>
                <td>${r}</td>
                <td>${l}</td>
              </tr>`;
          };
          const tableWrap = (rows) => `
            <table>
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Required Skill(s)</th>
                  <th>Required Level</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>`;
          const minstrel = tableWrap([
            row('Melodic Chord', 'None', '1'),
            row('Harmony', 'None', '1'),
            row('Sound Wave', 'Melodic Chord', '6'),
            row('Discord', 'None', '6'),
            row('Vibrant Echo', 'Discord', '12'),
            row('Rhythm', 'Harmony', '12'),
            row('Symphony', 'Sound Wave', '18'),
            row('Resonance', 'Vibrant Echo', '18'),
            row('Masterpiece', 'Rhythm', '24')
          ].join(''));
          const troubadour = tableWrap([
            row('Inspiring Tune', 'None', '1'),
            row('Dancing Step', 'None', '1'),
            row('Lullaby', 'None', '6'),
            row('Power Ballad', 'Dancing Step', '6'),
            row('Chorus', 'Lullaby', '12'),
            row('Battle Song', 'None', '12'),
            row('Heroic Anthem', 'Battle Song', '18'),
            row('Crescendo', 'Power Ballad', '18'),
            row('Final Encore', 'Heroic Anthem', '24')
          ].join(''));
          const augments = `
            <div class="wiki-data">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Special Effect from Augment</th>
                    <th>Gained per Augment Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Requiem</td>
                    <td>Masterpiece now releases homing Soul Notes from defeated enemies.</td>
                    <td>10% Soul Note Damage 2% Extra Note Chance</td>
                  </tr>
                  <tr>
                    <td>Cacophony</td>
                    <td>Discord leaves a chaotic sound trail that shreds enemy armor.</td>
                    <td>1.5s Trail Duration 3% Armor Reduction</td>
                  </tr>
                  <tr>
                    <td>Allegro</td>
                    <td>Dancing Step grants Haste and nullifies the first instance of damage.</td>
                    <td>5% Cast Speed -0.5s Internal Cooldown</td>
                  </tr>
                  <tr>
                    <td>Fortissimo</td>
                    <td>Heroic Anthem pulses healing waves to allies based on damage dealt.</td>
                    <td>1% Damage-to-Heal Conversion 5% Aura Radius</td>
                  </tr>
                </tbody>
              </table>
            </div>`;
          const section4 = `
            <div class="wiki-data">
              <table>
                <thead>
                  <tr>
                    <th>Classes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>● Viking ● Pyromancer ● Marksman ● Pirate ● Nomad ● Redneck ● Necromancer ● Samurai ● Paladin ● Amazon ● Demon Slayer ● Demonspawn ● Shaman ● White Mage ● Marauder ● Plague Doctor ● Shield Lancer ● Illusionist ● Jötunn ● Exo ● Butcher ● Stormweaver</td>
                  </tr>
                </tbody>
              </table>
            </div>`;
          setWikiData({
            weapon: 'Instrumentos',
            sections: [
              { title: 'Minstrel', html: minstrel },
              { title: 'Troubadour', html: troubadour },
              { title: 'Class Augments', html: augments },
              { title: 'Classes', html: section4 }
            ]
          });
        }
      }
    } catch (e) {
      console.error("Erro ao buscar dados:", e);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedClass(null);
    setWikiData(null);
  };

  

  return (
    <div className="bg-[#0f111a] min-h-screen text-gray-200 font-sans selection:bg-red-500 selection:text-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#0b0d14]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setSelectedBlogPost(null);
              setCurrentView('home');
              try {
                window.history.replaceState(null, '', window.location.pathname);
              } catch {
                window.location.hash = '';
              }
            }}
          >
            <img
              src="/images/herosiege.png"
              alt="Hero Siege Brasil"
              className="block h-8 sm:h-9 w-auto"
              style={{ imageRendering: 'auto' }}
            />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
            <button onClick={() => setCurrentView('home')} className={`transition-colors ${currentView === 'home' ? 'text-orange-500' : 'hover:text-white'}`}>Home</button>
            <div
              className="relative"
              ref={dbMenuRef}
              onMouseEnter={() => setIsDbOpen(true)}
              onMouseLeave={() => setIsDbOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsDbOpen(v => !v)}
                className={`transition-colors ${['classes','items','relics','quests'].includes(currentView) || isDbOpen ? 'text-orange-500' : 'hover:text-white'}`}
              >
                DataBase
              </button>
              <div className={`absolute left-0 top-full w-44 bg-[#0b0d14] border border-white/10 rounded shadow-xl py-2 ${isDbOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition`}>
                <button
                  onClick={() => { setCurrentView('classes'); setIsDbOpen(false); }}
                  className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white/5 ${currentView === 'classes' ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
                >
                  Classes
                </button>
                <button
                  onClick={() => { setCurrentView('items'); setIsDbOpen(false); }}
                  className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white/5 ${currentView === 'items' ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
                >
                  Items
                </button>
                <button
                  onClick={() => { setCurrentView('runes'); setIsDbOpen(false); }}
                  className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white/5 ${currentView === 'runes' ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
                >
                  Runas
                </button>
                <button
                  onClick={() => { setCurrentView('relics'); setIsDbOpen(false); }}
                  className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white/5 ${currentView === 'relics' ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
                >
                  Relíquias
                </button>
                <button
                  onClick={() => { setCurrentView('quests'); setIsDbOpen(false); }}
                  className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white/5 ${currentView === 'quests' ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
                >
                  Quests
                </button>
              </div>
            </div>
            <button onClick={() => { setCurrentView('blog'); setSelectedBlogPost(null); }} className={`transition-colors ${currentView === 'blog' ? 'text-orange-500' : 'hover:text-white'}`}>Blog</button>
            <button onClick={() => setCurrentView('builder')} className={`transition-colors ${currentView === 'builder' ? 'text-orange-500' : 'hover:text-white'}`}>Builder</button>
            <button onClick={() => setCurrentView('contact')} className={`transition-colors ${currentView === 'contact' ? 'text-orange-500' : 'hover:text-white'}`}>Contatos</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {currentView === 'home' && (
        <header className="relative h-[600px] overflow-hidden flex items-center">
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://herosiege.wiki.gg/images/c/c5/Viking_SkinID_1.png" 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-20 scale-110 blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-[#0f111a]/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f111a] via-transparent to-[#0f111a]"></div>
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <span className="inline-block py-1 px-3 border border-orange-500/30 bg-orange-500/10 text-orange-500 text-xs font-bold uppercase tracking-widest mb-6 rounded-sm">
                        Season 9 Updated
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black text-white italic leading-[0.9] mb-6 tracking-tighter">
                        ESCOLHA <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600 pr-2">SEU HERÓI</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-md leading-relaxed mb-10 border-l-2 border-red-600 pl-6">
                        Explore todas as classes, builds e segredos de Hero Siege. A base de dados definitiva para a comunidade brasileira.
                    </p>
                    <div className="flex gap-4">
                        <button className="bg-white text-black font-black uppercase px-8 py-4 text-sm hover:bg-gray-200 transition-colors">
                            Ver Tier List
                        </button>
                        <button className="border border-white/20 text-white font-black uppercase px-8 py-4 text-sm hover:bg-white/5 transition-colors">
                            Patch Notes
                        </button>
                    </div>
                </div>
                
                {/* Featured Hero Image (Floating) */}
                <div className="hidden md:block relative">
                     <div className="absolute inset-0 bg-red-500/20 blur-[100px] rounded-full"></div>
                     <img 
                        src="https://herosiege.wiki.gg/images/Samurai.png" 
                        alt="Featured Hero" 
                        className="relative z-10 w-full max-w-lg mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-700"
                     />
                </div>
            </div>
        </header>
      )}

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row gap-16">
            
            {/* Left Column: Classes Grid */}
            <div className="flex-1">
                {/* Home View: News Section */}
                {currentView === 'home' && (
                    <div className="space-y-16">
                        {/* Additional Content: Spotlight & Tier List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* New Class Spotlight */}
                            <div className="relative bg-[#151923] border border-white/5 overflow-hidden group h-96">
                                <div className="absolute inset-0 bg-[url('https://herosiege.wiki.gg/images/c/c5/Viking_SkinID_1.png')] bg-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
                                
                                <div className="relative z-20 p-8 h-full flex flex-col justify-center items-start">
                                    <span className="inline-block py-1 px-3 bg-red-600/20 border border-red-600/50 text-red-500 text-[10px] font-bold uppercase tracking-widest mb-4 rounded-sm">
                                        New Class Spotlight
                                    </span>
                                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">
                                        The <span className="text-red-600">Prophet</span>
                                    </h2>
                                    <p className="text-gray-400 text-sm max-w-xs mb-8 leading-relaxed">
                                        Dominando os elementos e invocando espíritos ancestrais, o Prophet traz uma nova mecânica de shapeshifting para o campo de batalha.
                                    </p>
                                    <button 
                                        onClick={() => {
                                            setActiveFilter('MAGIC');
                                            setCurrentView('classes');
                                        }}
                                        className="bg-white text-black font-bold uppercase px-6 py-3 text-xs tracking-widest hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1"
                                    >
                                        Ver Detalhes
                                    </button>
                                </div>

                                <img 
                                    src="https://www.mmorpgs.com.br/wp-content/uploads/2025/12/imgi_40_d4eed0645666589a854db663f8000c261191c940.webp" 
                                    alt="New Class Spotlight" 
                                    className="absolute inset-0 w-full h-full object-cover object-center z-10 drop-shadow-[0_0_50px_rgba(220,38,38,0.3)] scale-125 group-hover:scale-[1.3] transition-transform duration-700"
                                />
                            </div>

                            {/* Tier List Preview */}
                            <div className="bg-[#151923] border border-white/5 p-8 flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                                        Season 9 <span className="text-orange-500">Tier List</span>
                                    </h3>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Updated: Today</span>
                                </div>

                                <div className="space-y-4 flex-1">
                                    {/* S Tier */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-red-600 flex items-center justify-center font-black text-white text-xl shadow-[0_0_15px_rgba(220,38,38,0.5)]">S</div>
                                    <div className="flex-1 flex gap-2 flex-wrap">
                                            {(tiers.S || []).map(c => (
                                                <div key={c} className="relative group/icon cursor-pointer" onClick={() => {fetchClassData(c); setCurrentView('classes');}}>
                                                    <img 
                                                        src={imageFor(c)} 
                                                        alt={c} 
                                                        className="w-10 h-10 object-contain drop-shadow-md hover:scale-110 transition-transform"
                                                    />
                                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap z-50 border border-white/10 pointer-events-none">
                                                        {c}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* A Tier */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-500 flex items-center justify-center font-black text-white text-xl shadow-[0_0_15px_rgba(249,115,22,0.5)]">A</div>
                                        <div className="flex-1 flex gap-2 flex-wrap">
                                            {(tiers.A || []).map(c => (
                                                <div key={c} className="relative group/icon cursor-pointer" onClick={() => {fetchClassData(c); setCurrentView('classes');}}>
                                                    <img 
                                                        src={imageFor(c)} 
                                                        alt={c} 
                                                        className="w-10 h-10 object-contain drop-shadow-md hover:scale-110 transition-transform"
                                                    />
                                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap z-50 border border-white/10 pointer-events-none">
                                                        {c}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* B Tier */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-yellow-500 flex items-center justify-center font-black text-white text-xl shadow-[0_0_15px_rgba(234,179,8,0.5)]">B</div>
                                        <div className="flex-1 flex gap-2 flex-wrap">
                                            {(tiers.B || []).map(c => (
                                                <div key={c} className="relative group/icon cursor-pointer" onClick={() => {fetchClassData(c); setCurrentView('classes');}}>
                                                    <img 
                                                        src={imageFor(c)} 
                                                        alt={c} 
                                                        className="w-10 h-10 object-contain drop-shadow-md hover:scale-110 transition-transform"
                                                    />
                                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap z-50 border border-white/10 pointer-events-none">
                                                        {c}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => setTierModalOpen(true)} className="w-full mt-6 py-3 border border-white/10 text-gray-400 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                                    Ver Tier List Completa
                                </button>
                            </div>
                        </div>

                        {tierModalOpen && (
                          <div className="fixed inset-0 z-50">
                            <div className="absolute inset-0 bg-black/80" onClick={() => setTierModalOpen(false)} />
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                              <div className="bg-[#151923] border border-white/10 rounded-sm shadow-xl max-w-5xl w-[92vw] md:w-[80vw]">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                                  <div className="flex items-center gap-3">
                                    <img src="/images/herosiege.png" alt="Hero Siege Brasil" className="h-6 w-auto" />
                                    <div className="text-lg font-black text-white uppercase italic tracking-widest">Tier List Completa</div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button onClick={downloadTierImage} className="px-3 py-2 text-xs font-bold uppercase tracking-widest border border-white/10 text-gray-300 hover:bg-white hover:text-black">Baixar imagem</button>
                                    <button onClick={() => setTierModalOpen(false)} className="px-3 py-2 text-xs font-bold uppercase tracking-widest border border-white/10 text-gray-300 hover:bg-white hover:text-black">Fechar</button>
                                  </div>
                                </div>
                                <div className="p-5 space-y-4 overflow-y-auto" style={{ maxHeight: '75vh' }}>
                                  {['S','A','B','C','D','E'].map((k) => (
                                    <div key={k} className="flex items-center gap-4 rounded-sm border-l pl-4" style={tierRowStyle(k)}>
                                      <div className="w-12 h-12 flex items-center justify-center font-black text-white text-xl" style={{ backgroundColor: k==='S'?'#dc2626':k==='A'?'#f97316':k==='B'?'#eab308':k==='C'?'#84cc16':k==='D'?'#22c55e':'#6b7280' }}>{k}</div>
                                      <div className="flex-1 flex gap-2 flex-wrap">
                                        {(tiers[k] || []).map((c) => (
                                          <div key={`${k}-${c}`} className="relative group/icon">
                                            <img src={imageFor(c)} alt={c} className="w-10 h-10 object-contain drop-shadow-md" />
                                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap z-50 border border-white/10 pointer-events-none">
                                              {c}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* News Grid (from Blog posts) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {(blogPosts.slice(0,6)).map((post) => (
                            <div key={post.id} onClick={() => { setSelectedBlogPost(post); setCurrentView('blog'); window.location.hash = `#blog/${post.id}`; }} className="group relative bg-[#151923] border border-white/5 overflow-hidden cursor-pointer hover:border-orange-500/50 transition-all">
                              <div className="h-40 overflow-hidden relative flex items-center justify-center bg-black/50">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#151923] to-transparent z-10"></div>
                                <img
                                  src={imageOrFallback(post.image)}
                                  alt={post.title}
                                  onError={(e) => { e.currentTarget.src = 'https://herosiege.wiki.gg/images/Item_Chest.png'; }}
                                  className="h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                />
                              </div>
                              <div className="p-5 relative z-20 -mt-2">
                                <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">{formatDateTime(post)}</span>
                                <h4 className="text-white font-bold text-lg mt-1 leading-tight group-hover:text-orange-500 transition-colors">
                                  {post.title}
                                </h4>
                                {post.excerpt && (
                                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                                    {post.excerpt}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                    </div>
                )}

                {/* Classes View: Filter & Grid */}
                {currentView === 'classes' && (
                  <ClassesView
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    filteredClasses={filteredClasses}
                    onSelectClass={fetchClassData}
                    classImagePath={classImagePath}
                  />
                )}

                {/* Items View */}
                {currentView === 'items' && (
                  <ItemsView
                    itemCategories={itemCategories}
                    selectedItemCategory={selectedItemCategory}
                    itemsList={itemsList}
                    itemsLoading={itemsLoading}
                    selectedItem={selectedItem}
                    onSelectCategory={loadItemsForCategory}
                    onBackToCategories={() => {
                      setSelectedItemCategory(null);
                      setItemsList([]);
                    }}
                    onSelectItem={setSelectedItem}
                    onCloseItem={() => setSelectedItem(null)}
                  />
                )}

                {currentView === 'runes' && (
                  <RunesView />
                )}

                {currentView === 'builder' && (
                  <div className="animate-fade-in">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div>
                          <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">
                            Forum de <span className="text-orange-500">Builds</span>
                          </h2>
                          <p className="text-xs md:text-sm text-gray-400 mt-1">
                            Escolha uma classe para ver builds da comunidade. Em breve você poderá publicar as suas.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                          onClick={() => {
                            setNbTitle('');
                            setNbAuthor('');
                            setNbContent('');
                            const baseClass = forumSelectedClass || '';
                            setNbClass(baseClass);
                            setNbType('iniciante');
                            setNbStats({
                              strength: 0,
                              dexterity: 0,
                              intelligence: 0,
                              energy: 0,
                              armor: 0,
                              vitality: 0,
                            });
                            setNewBuildOpen(true);
                          }}
                        >
                          Nova Build
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {CLASS_DATA.map((c) => {
                          const selected = forumSelectedClass === c.name;
                          const slug = slugifyClass(c.name);
                          const count = buildCountsByForum[slug] || 0;
                          const countLabel = count === 1 ? '1 build' : `${count} builds`;
                          return (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() =>
                                setForumSelectedClass((prev) => (prev === c.name ? null : c.name))
                              }
                              className={`relative flex flex-col items-stretch px-3 py-3 border text-left bg-gradient-to-b from-[#181b25] to-[#0c0e17] hover:from-[#1f2431] hover:to-[#10131d] transition-colors shadow-[0_0_0_1px_rgba(255,255,255,0.03),inset_0_0_0_1px_rgba(15,23,42,0.9)] ${
                                selected
                                  ? 'border-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.5)]'
                                  : 'border-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center">
                                  <img
                                    src={classImagePath(c.name)}
                                    onError={(e) => {
                                      const t = e.currentTarget;
                                      if (!t.dataset.fallback) {
                                        t.dataset.fallback = '1';
                                        t.src = classImagePath(c.name, 'png');
                                      }
                                    }}
                                    alt={c.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs font-bold text-white uppercase tracking-widest">
                                    {c.name}
                                  </div>
                                  <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                                    {countLabel}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2 flex items-end justify-end text-[10px] text-gray-500">
                                {selected && (
                                  <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-semibold">
                                    Aberto
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-4 border border-dashed border-white/15 rounded-sm bg-[#0f111a] p-4">
                        {forumSelectedClass ? (
                          (() => {
                            const selectedSlug = slugifyClass(forumSelectedClass);
                            const list = buildsByForum[selectedSlug] || [];
                            const count = list.length;
                            return (
                              <div>
                                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                                  Builds para
                                </div>
                                <div className="text-sm font-bold text-white mb-1">
                                  {forumSelectedClass}
                                </div>
                                <div className="text-[11px] text-gray-400 mb-3">
                                  {count === 0
                                    ? 'Nenhuma build publicada ainda nesta área.'
                                    : count === 1
                                    ? '1 build publicada nesta área.'
                                    : `${count} builds publicadas nesta área.`}
                                </div>
                                {count > 0 && (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                                    {list.map((b) => {
                                      const tagsArr = Array.isArray(b.tags) ? b.tags : [];
                                      const normTags = tagsArr.map((t) =>
                                        String(t || '')
                                          .normalize('NFD')
                                          .replace(/[\u0300-\u036f]/g, '')
                                          .toLowerCase()
                                      );
                                      let tierType = null;
                                      if (normTags.includes('final')) tierType = 'final';
                                      else if (normTags.includes('atualizada') || normTags.includes('avancada')) tierType = 'avancada';
                                      else if (normTags.includes('iniciante')) tierType = 'iniciante';
                                      let badgeClass = 'bg-gray-500/20 text-gray-300';
                                      let badgeLabel = '';
                                      let badgeIcon = '';
                                      if (tierType === 'iniciante') {
                                        badgeClass = 'bg-emerald-500/20 text-emerald-400';
                                        badgeLabel = 'Iniciante';
                                        badgeIcon = '🌱';
                                      } else if (tierType === 'avancada') {
                                        badgeClass = 'bg-amber-500/20 text-amber-400';
                                        badgeLabel = 'Avançada';
                                        badgeIcon = '🛠️';
                                      } else if (tierType === 'final') {
                                        badgeClass = 'bg-red-500/20 text-red-400';
                                        badgeLabel = 'Final';
                                        badgeIcon = '🏁';
                                      }
                                      const clsName = b.className || b.heroClass || forumSelectedClass || '';
                                      const createdLabel = formatBuildTimestamp(b);
                                      return (
                                        <button
                                          key={b.id}
                                          type="button"
                                          onClick={() => {
                                            setSelectedBuild(b);
                                            setBuildModalOpen(true);
                                          }}
                                          className="w-full text-left border border-white/10 bg-gradient-to-b from-[#181b25] to-[#0c0e17] hover:from-[#1f2431] hover:to-[#10131d] px-3 py-2 text-[11px] flex flex-col gap-1 shadow-[0_0_0_1px_rgba(255,255,255,0.03),inset_0_0_0_1px_rgba(15,23,42,0.9)]"
                                        >
                                          <div className="flex items-center justify-between mb-1">
                                            <div className="font-semibold text-white truncate">
                                              {clsName}
                                            </div>
                                            {badgeLabel && (
                                              <div className="flex flex-col items-end">
                                                <span className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">
                                                  Build
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-widest ${badgeClass}`}>
                                                  <span className="mr-1">{badgeIcon}</span>
                                                  {badgeLabel}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                          {clsName && (
                                            <div className="text-[10px] text-gray-400 mb-1 truncate">
                                              Área para discussão sobre builds de {clsName}
                                            </div>
                                          )}
                                          <div className="font-semibold text-gray-100 truncate">
                                            {b.title || '(sem título)'}
                                          </div>
                                          <div className="text-[10px] text-gray-400 mt-1 truncate">
                                            {(b.author || createdLabel) && (
                                              <>
                                                {b.author && <span>Autor: {b.author}</span>}
                                                {b.author && createdLabel && <span> • </span>}
                                                {createdLabel && <span>{createdLabel}</span>}
                                              </>
                                            )}
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })()
                        ) : (
                          <div className="text-xs text-gray-500">
                            Selecione uma classe acima para ver as builds da comunidade.
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border-t border-white/10 mb-6" />
                    <style>{`
                      :root {
                        --bg: #0a0a0c; --panel: #16161e; --primary: #ca8a04;
                        --skill-slot: #22222b; --border: #3f3f46; --text: #e4e4e7;
                        --slot: 96px; --gap: 16px; --pad: 20px; --class-icon: 60px;
                      }
                      .builder-wrapper { background: transparent; color: var(--text); font-family: 'Segoe UI', sans-serif; user-select: none; }
                      .builder-wrapper .class-menu {
                        display: flex; align-items: flex-start; gap: 12px; padding: 8px 12px;
                        background: var(--panel); border-radius: 12px; border: 1px solid var(--border);
                        margin-bottom: 18px;
                      }
                      .builder-wrapper .class-menu-title {
                        font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em;
                        color: #9ca3af; font-weight: 700; margin-right: 10px; white-space: nowrap;
                      }
                      .builder-wrapper .class-menu-grid {
                        display: grid; grid-template-columns: repeat(11, var(--class-icon));
                        grid-auto-rows: var(--class-icon); gap: 10px 10px;
                      }
                      .builder-wrapper .class-icon {
                        width: var(--class-icon); height: var(--class-icon); border-radius: 999px;
                        border: 1px solid #1f2937; display: flex; align-items: center; justify-content: center;
                        background: #020617; cursor: pointer; flex-shrink: 0;
                        transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease;
                      }
                      .builder-wrapper .class-icon img {
                        width: 100%; height: 100%; object-fit: contain; border-radius: inherit; display: block;
                      }
                      .builder-wrapper .class-icon:hover {
                        box-shadow: 0 0 14px rgba(249, 115, 22, 0.8);
                        border-color: #f97316;
                      }
                      .builder-wrapper .class-icon.selected {
                        box-shadow: 0 0 18px rgba(249, 115, 22, 0.95);
                        border-color: #f97316;
                        background: rgba(251, 146, 60, 0.25);
                      }
                      .builder-wrapper .dashboard {
                        display: flex; justify-content: center; gap: 28px; background: var(--panel);
                        padding: 12px 16px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--border);
                      }
                      .builder-wrapper .stat-box { text-align: center; }
                      .builder-wrapper .stat-box span { font-size: 18px; font-weight: bold; color: var(--primary); display: block; }
                      .builder-wrapper .tree-wrapper { display: flex; justify-content: center; gap: 32px; flex-wrap: nowrap; overflow-x: hidden; padding-bottom: 4px; }
                      .builder-wrapper .specialization-box { background: var(--panel); padding: var(--pad); border-radius: 15px; border: 1px solid var(--border); width: max-content; flex: 0 0 auto; }
                      .builder-wrapper .specialization-box h3 { margin: 0 0 12px; text-align: center; color: var(--primary); }
                      .builder-wrapper .grid { display: grid; grid-template-columns: repeat(3, var(--slot)); grid-template-rows: repeat(5, var(--slot)); gap: var(--gap); margin-top: 12px; }
                      .builder-wrapper .skill { width: var(--slot); height: var(--slot); background: var(--skill-slot); border: 2px solid #444; border-radius: 10px; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                      .builder-wrapper .skill.locked { opacity: 0.3; filter: grayscale(1); cursor: not-allowed; }
                      .builder-wrapper .skill.has-points { border-color: var(--primary); }
                      .builder-wrapper .skill img { width: 100%; height: 100%; object-fit: contain; border-radius: 8px; display: block; }
                      .builder-wrapper .skill .name-label { position: absolute; top: 4px; left: 4px; right: 4px; font-size: 9px; text-align: center; color: #e4e4e7; text-shadow: 0 1px 1px rgba(0,0,0,.8); pointer-events: none; }
                      .builder-wrapper .lvl-badge { position: absolute; bottom: -5px; right: -5px; background: #000; border: 1px solid var(--primary); padding: 1px 5px; font-size: 11px; }
                      .builder-wrapper .plus-btn { position: absolute; top: -10px; right: -10px; background: #333; color: #fff; border: 1px solid #555; width: 24px; height: 24px; border-radius: 50%; font-weight: bold; cursor: pointer; z-index: 10; }
                      .builder-wrapper .active-plus { background: var(--primary) !important; color: #000 !important; box-shadow: 0 0 8px var(--primary); }
                      .builder-wrapper #sub-window { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 350px; background: #1a1a20; border: 2px solid var(--primary); border-radius: 15px; padding: 20px; z-index: 1000; display: none; }
                      .builder-wrapper .overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:none; z-index: 999; }
                      .builder-wrapper .sub-skill-card { background: #25252b; margin: 8px 0; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; border: 1px solid #444; }
                      @media (max-width: 1200px) {
                        :root { --slot: 92px; --gap: 16px; --pad: 18px; }
                        .builder-wrapper .stat-box span { font-size: 17px; }
                      }
                      @media (max-width: 1060px) {
                        :root { --slot: 88px; --gap: 14px; --pad: 16px; }
                        .builder-wrapper .tree-wrapper { gap: 28px; }
                      }
                      @media (max-width: 980px) {
                        :root { --slot: 82px; --gap: 12px; --pad: 14px; }
                        .builder-wrapper .tree-wrapper { gap: 24px; }
                      }
                      @media (max-width: 920px) {
                        :root { --slot: 76px; --gap: 12px; --pad: 12px; }
                        .builder-wrapper .tree-wrapper { gap: 20px; }
                        .builder-wrapper .stat-box span { font-size: 16px; }
                      }
                    `}</style>
                      <div className="builder-wrapper p-4 md:p-6">
                      <div className="class-menu">
                        <span className="class-menu-title">Classes</span>
                        <div className="class-menu-grid">
                          {CLASS_DATA.map((c) => {
                            const src = classImagePath(c.name);
                            const selected = builderClass === c.name;
                            return (
                              <button
                                key={c.name}
                                type="button"
                                title={c.name}
                                className={`class-icon${selected ? ' selected' : ''}`}
                                onClick={() => setBuilderClass(c.name)}
                              >
                                <img
                                  src={src}
                                  onError={(e) => { const t = e.currentTarget; if (!t.dataset.fallback) { t.dataset.fallback = '1'; t.src = classImagePath(c.name, 'png'); } }}
                                  alt={c.name}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="dashboard">
                        <div className="stat-box"><span>{builderClass ? `${builderClass} - Level` : 'Level'}</span> 100</div>
                        <div className="stat-box"><label>Main Points</label><span id="main-pts">100</span></div>
                        <div className="stat-box"><label>Sub-Skill Points</label><span id="sub-pts">20</span></div>
                      </div>
                      <div className="tree-wrapper">
                        <div className="specialization-box">
                          <h3 id="tree-title-1" style={{ textAlign: 'center', color: 'var(--primary)' }}>Berserker</h3>
                          <div className="grid" id="grid-berserker"></div>
                        </div>
                        <div className="specialization-box">
                          <h3 id="tree-title-2" style={{ textAlign: 'center', color: 'var(--primary)' }}>Shield Bearer</h3>
                          <div className="grid" id="grid-shield"></div>
                        </div>
                      </div>
                      <div className="overlay" id="overlay" />
                      <div id="sub-window">
                        <h3 id="sub-title" style={{ color: 'var(--primary)', marginTop: 0 }}>Sub-skills</h3>
                        <div id="sub-content"></div>
                        <button style={{ width: '100%', marginTop: 15, cursor: 'pointer' }} onClick={() => {
                          const sub = document.getElementById('sub-window');
                          const ov = document.getElementById('overlay');
                          if (sub) sub.style.display = 'none';
                          if (ov) ov.style.display = 'none';
                        }}>Voltar</button>
                      </div>
                    </div>
                  </div>
                )}
                {buildModalOpen && selectedBuild && (
                  <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/80" onClick={() => { setBuildModalOpen(false); setSelectedBuild(null); }} />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="bg-[#151923] border border-white/10 rounded-sm shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                          <div>
                            <div className="text-sm font-black text-white uppercase tracking-widest">
                              {selectedBuild.title || '(sem título)'}
                            </div>
                            <div className="text-[11px] text-gray-400 mt-1">
                              {selectedBuild.className || selectedBuild.heroClass || ''}{selectedBuild.author ? ` · ${selectedBuild.author}` : ''}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="px-3 py-1 text-xs font-bold uppercase tracking-widest border border-white/10 text-gray-300 hover:bg-white hover:text-black transition-colors"
                            onClick={() => { setBuildModalOpen(false); setSelectedBuild(null); }}
                          >
                            Fechar
                          </button>
                        </div>
                        <div className="p-5 overflow-y-auto text-sm leading-relaxed custom-scrollbar">
                          {(() => {
                            const tagsArr = Array.isArray(selectedBuild?.tags) ? selectedBuild.tags : [];
                            const normTags = tagsArr.map((t) =>
                              String(t || '')
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .toLowerCase()
                            );
                            let tierType = null;
                            if (normTags.includes('final')) tierType = 'final';
                            else if (normTags.includes('atualizada') || normTags.includes('avancada')) tierType = 'avancada';
                            else if (normTags.includes('iniciante')) tierType = 'iniciante';
                            let badgeClass = 'bg-gray-500/20 text-gray-300';
                            let badgeLabel = '';
                            let badgeIcon = '';
                            if (tierType === 'iniciante') {
                              badgeClass = 'bg-emerald-500/20 text-emerald-400';
                              badgeLabel = 'Iniciante';
                              badgeIcon = '🌱';
                            } else if (tierType === 'avancada') {
                              badgeClass = 'bg-amber-500/20 text-amber-400';
                              badgeLabel = 'Avançada';
                              badgeIcon = '🛠️';
                            } else if (tierType === 'final') {
                              badgeClass = 'bg-red-500/20 text-red-400';
                              badgeLabel = 'Final';
                              badgeIcon = '🏁';
                            }
                            const stats = selectedBuild?.stats || {};
                            const statItems = [
                              { key: 'strength', label: 'Strength', color: '#92400e' },
                              { key: 'dexterity', label: 'Dexterity', color: '#22c55e' },
                              { key: 'intelligence', label: 'Intelligence', color: '#ec4899' },
                              { key: 'energy', label: 'Energy', color: '#0ea5e9' },
                              { key: 'armor', label: 'Armor', color: '#4b5563' },
                              { key: 'vitality', label: 'Vitality', color: '#ef4444' },
                            ].filter(({ key }) => (Number(stats?.[key]) || 0) > 0);
                            return (
                              <>
                                {(badgeLabel || statItems.length > 0) && (
                                  <div className="mb-4 space-y-3">
                                    {badgeLabel && (
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          {(() => {
                                            const cls = selectedBuild?.className || selectedBuild?.heroClass || '';
                                            if (!cls) return <div className="w-10 h-10 border border-white/10 rounded flex items-center justify-center text-gray-500">?</div>;
                                            const img = classImagePath(cls, 'webp');
                                            return (
                                              <>
                                                <img
                                                  src={img}
                                                  alt={cls}
                                                  onError={(e) => { e.currentTarget.src = 'https://herosiege.wiki.gg/images/Item_Chest.png'; }}
                                                  className="w-10 h-10 object-contain border border-white/10 rounded"
                                                />
                                                <div className="text-sm text-gray-200">{cls}</div>
                                              </>
                                            );
                                          })()}
                                        </div>
                                        <div className="flex flex-col items-end">
                                          <span className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">
                                            Build
                                          </span>
                                          <span className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-widest ${badgeClass}`}>
                                            <span className="mr-1">{badgeIcon}</span>
                                            {badgeLabel}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                    {statItems.length > 0 && (
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {statItems.map(({ key, label, color }) => (
                                          <div key={key} className="flex items-center gap-2 border px-2 py-1" style={{ borderColor: color }}>
                                            <div className="w-5 h-5">
                                              <svg viewBox="0 0 24 24" className="w-full h-full">
                                                <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
                                                <path d="M12 4 L14.59 9.26 L20.24 9.91 L15.88 13.64 L17.18 19.19 L12 16.2 L6.82 19.19 L8.12 13.64 L3.76 9.91 L9.41 9.26 Z" stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round" />
                                              </svg>
                                            </div>
                                            <span className="text-xs" style={{ color }}>{label}</span>
                                            <span className="ml-auto text-xs text-gray-300">{stats[key]}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                                {buildModalContentHtml ? (
                                  <div
                                    className="prose prose-invert prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: buildModalContentHtml }}
                                  />
                                ) : (
                                  <div className="text-gray-500 text-sm">
                                    Nenhum conteúdo detalhado foi cadastrado para esta build.
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {newBuildOpen && (
                  <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/80" onClick={() => setNewBuildOpen(false)} />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="bg-[#151923] border border-white/10 rounded-sm shadow-xl max-w-4xl w-full max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                          <div className="text-sm font-black text-white uppercase tracking-widest">
                            Nova Build
                          </div>
                          <button
                            type="button"
                            className="px-3 py-1 text-xs font-bold uppercase tracking-widest border border-white/10 text-gray-300 hover:bg-white hover:text-black transition-colors"
                            onClick={() => setNewBuildOpen(false)}
                          >
                            Fechar
                          </button>
                        </div>
                        <div className="p-5 overflow-y-auto custom-scrollbar">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                                Título da Build
                              </label>
                              <input
                                value={nbTitle}
                                onChange={(e) => setNbTitle(e.target.value)}
                                className="w-full bg-[#0f111a] border border-white/10 text-sm text-white px-3 py-2"
                                placeholder="Ex.: Bard Solo Map Farm"
                              />
                              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                                Autor / Nickname
                              </label>
                              <input
                                value={nbAuthor}
                                onChange={(e) => setNbAuthor(e.target.value)}
                                className="w-full bg-[#0f111a] border border-white/10 text-sm text-white px-3 py-2"
                                placeholder="Seu nick"
                              />
                              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                                Classe
                              </label>
                              <select
                                value={nbClass}
                                onChange={(e) => setNbClass(e.target.value)}
                                className="w-full bg-[#0f111a] border border-white/10 text-sm text-white px-3 py-2"
                              >
                                <option value="">Selecione</option>
                                {CLASS_DATA.map((c) => (
                                  <option key={c.name} value={c.name}>{c.name}</option>
                                ))}
                              </select>
                              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                                Tipo da Build
                              </label>
                              <select
                                value={nbType}
                                onChange={(e) => setNbType(e.target.value)}
                                className="w-full bg-[#0f111a] border border-white/10 text-sm text-white px-3 py-2"
                              >
                                <option value="iniciante">Iniciante 🌱</option>
                                <option value="avançada">Avançada 🛠️</option>
                                <option value="final">Final 🏁</option>
                              </select>
                              <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                                Distribuição de Pontos (Total: {NB_TOTAL}) · Restantes: {Math.max(0, NB_TOTAL - totalNbStats(nbStats))}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                  { key: 'strength', label: 'Strength', color: '#92400e' },
                                  { key: 'dexterity', label: 'Dexterity', color: '#22c55e' },
                                  { key: 'intelligence', label: 'Intelligence', color: '#ec4899' },
                                  { key: 'energy', label: 'Energy', color: '#0ea5e9' },
                                  { key: 'armor', label: 'Armor', color: '#4b5563' },
                                  { key: 'vitality', label: 'Vitality', color: '#ef4444' },
                                ].map(({ key, label, color }) => {
                                  const val = nbStats[key] || 0;
                                  const remain = NB_TOTAL - totalNbStats(nbStats);
                                  return (
                                    <div
                                      key={key}
                                      className="border p-3 bg-[#0f111a]"
                                      style={{ borderColor: color }}
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                          <div className="w-6 h-6">
                                            <svg
                                              viewBox="0 0 24 24"
                                              className="w-full h-full"
                                            >
                                              <circle
                                                cx="12"
                                                cy="12"
                                                r="9"
                                                stroke={color}
                                                strokeWidth="1.5"
                                                fill="none"
                                              />
                                              <path
                                                d="M12 4 L14.59 9.26 L20.24 9.91 L15.88 13.64 L17.18 19.19 L12 16.2 L6.82 19.19 L8.12 13.64 L3.76 9.91 L9.41 9.26 Z"
                                                stroke={color}
                                                strokeWidth="1.4"
                                                fill="none"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          </div>
                                          <div
                                            className="text-xs font-bold"
                                            style={{ color }}
                                          >
                                            {label}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 text-[11px]">
                                        <button
                                          type="button"
                                          className="px-2 py-1 border border-white/10 text-white hover:bg-white hover:text-black"
                                          onClick={() =>
                                            setNbStats((s) => ({
                                              ...s,
                                              [key]: Math.max(0, (s[key] || 0) - 1),
                                            }))
                                          }
                                        >
                                          −
                                        </button>
                                        <div className="flex-1 text-center text-white">{val}</div>
                                        <button
                                          type="button"
                                          className="px-2 py-1 border border-white/10 text-white hover:bg-white hover:text-black disabled:opacity-40"
                                          onClick={() =>
                                            setNbStats((s) => ({
                                              ...s,
                                              [key]: (s[key] || 0) + 1,
                                            }))
                                          }
                                          disabled={remain <= 0}
                                        >
                                          +1
                                        </button>
                                        <button
                                          type="button"
                                          className="px-2 py-1 border border-white/10 text-white hover:bg-white hover:text-black disabled:opacity-40"
                                          onClick={() =>
                                            setNbStats((s) => {
                                              const current = s[key] || 0;
                                              const toAdd = Math.min(10, NB_TOTAL - totalNbStats(s));
                                              if (toAdd <= 0) return s;
                                              return {
                                                ...s,
                                                [key]: current + toAdd,
                                              };
                                            })
                                          }
                                          disabled={remain <= 0}
                                        >
                                          +10
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                                Conteúdo (opcional)
                              </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {[
                                { s: '✅', bg: 'bg-emerald-600/20', fg: 'text-emerald-400' },
                                { s: '❌', bg: 'bg-red-600/20', fg: 'text-red-400' },
                                { s: '⭐', bg: 'bg-yellow-600/20', fg: 'text-yellow-400' },
                                { s: '⚠️', bg: 'bg-amber-600/20', fg: 'text-amber-400' },
                                { s: '🔥', bg: 'bg-orange-600/20', fg: 'text-orange-400' },
                                { s: '🛡️', bg: 'bg-slate-600/20', fg: 'text-slate-300' },
                                { s: '🗡️', bg: 'bg-rose-600/20', fg: 'text-rose-300' },
                                { s: '🧪', bg: 'bg-fuchsia-600/20', fg: 'text-fuchsia-300' },
                                { s: '💡', bg: 'bg-sky-600/20', fg: 'text-sky-300' },
                                { s: '📌', bg: 'bg-violet-600/20', fg: 'text-violet-300' },
                              ].map(({ s, bg, fg }) => (
                                <button
                                  key={s}
                                  type="button"
                                  className={`px-2 py-1 text-[12px] rounded ${bg} ${fg} border border-white/10 hover:bg-white/10`}
                                  onClick={() => {
                                    const ta = nbContentRef.current;
                                    if (ta && typeof ta.selectionStart === 'number') {
                                      const start = ta.selectionStart;
                                      const end = ta.selectionEnd;
                                      const next = (nbContent || '');
                                      const updated = next.slice(0, start) + s + next.slice(end);
                                      setNbContent(updated);
                                      setTimeout(() => {
                                        ta.focus();
                                        const pos = start + s.length;
                                        ta.setSelectionRange(pos, pos);
                                      }, 0);
                                    } else {
                                      setNbContent((v) => (v || '') + s);
                                    }
                                  }}
                                  aria-label={`Inserir marcador ${s}`}
                                  title={`Inserir marcador ${s}`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                            <textarea
                              ref={nbContentRef}
                              value={nbContent}
                              onChange={(e) => setNbContent(e.target.value)}
                              className="w-full bg-[#0f111a] border border-white/10 text-sm text-white px-3 py-2 min-h-[120px]"
                              placeholder="Descreva os detalhes da build (itens, rotação, dicas)..."
                            />
                            </div>
                            <div className="md:col-start-2 md:row-start-1 md:self-start">
                              {(() => {
                                const t = nbType;
                                let badgeClass = 'bg-gray-500/20 text-gray-300';
                                let badgeLabel = '';
                                let badgeIcon = '';
                                if (t === 'iniciante') {
                                  badgeClass = 'bg-emerald-500/20 text-emerald-400';
                                  badgeLabel = 'Iniciante';
                                  badgeIcon = '🌱';
                                } else if (t === 'avançada') {
                                  badgeClass = 'bg-amber-500/20 text-amber-400';
                                  badgeLabel = 'Avançada';
                                  badgeIcon = '🛠️';
                                } else if (t === 'final') {
                                  badgeClass = 'bg-red-500/20 text-red-400';
                                  badgeLabel = 'Final';
                                  badgeIcon = '🏁';
                                }
                                const stats = nbStats || {};
                                const statItems = [
                                  { key: 'strength', label: 'Strength', color: '#92400e' },
                                  { key: 'dexterity', label: 'Dexterity', color: '#22c55e' },
                                  { key: 'intelligence', label: 'Intelligence', color: '#ec4899' },
                                  { key: 'energy', label: 'Energy', color: '#0ea5e9' },
                                  { key: 'armor', label: 'Armor', color: '#4b5563' },
                                  { key: 'vitality', label: 'Vitality', color: '#ef4444' },
                                ].filter(({ key }) => (Number(stats?.[key]) || 0) > 0);
                                const cls = nbClass || '';
                                const img = cls ? classImagePath(cls, 'webp') : '';
                                return (
                                  <div className="border border-white/10 bg-[#0f111a] p-4">
                                    <div className="text-sm font-black text-white uppercase tracking-widest">
                                      {nbTitle || '(sem título)'}
                                    </div>
                                    <div className="text-[11px] text-gray-400 mt-1">
                                      {nbAuthor ? `Autor: ${nbAuthor}` : ''}
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        {cls ? (
                                          <img
                                            src={img}
                                            alt={cls}
                                            onError={(e) => { e.currentTarget.src = 'https://herosiege.wiki.gg/images/Item_Chest.png'; }}
                                            className="w-10 h-10 object-contain border border-white/10 rounded"
                                          />
                                        ) : (
                                          <div className="w-10 h-10 border border-white/10 rounded flex items-center justify-center text-gray-500">?</div>
                                        )}
                                        <div className="text-sm text-gray-200">{cls || 'Classe'}</div>
                                      </div>
                                      {badgeLabel && (
                                        <div className="flex flex-col items-end">
                                          <span className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">
                                            Build
                                          </span>
                                          <span className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-widest ${badgeClass}`}>
                                            <span className="mr-1">{badgeIcon}</span>
                                            {badgeLabel}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    {(badgeLabel || statItems.length > 0) && (
                                      <div className="mt-4 space-y-3">
                                        {statItems.length > 0 && (
                                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {statItems.map(({ key, label, color }) => (
                                              <div key={key} className="flex items-center gap-2 border px-2 py-1" style={{ borderColor: color }}>
                                                <div className="w-5 h-5">
                                                  <svg viewBox="0 0 24 24" className="w-full h-full">
                                                    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
                                                    <path d="M12 4 L14.59 9.26 L20.24 9.91 L15.88 13.64 L17.18 19.19 L12 16.2 L6.82 19.19 L8.12 13.64 L3.76 9.91 L9.41 9.26 Z" stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round" />
                                                  </svg>
                                                </div>
                                                <span className="text-xs" style={{ color }}>{label}</span>
                                                <span className="ml-auto text-xs text-gray-300">{stats[key]}</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    {(nbContent || '').trim() && (
                                      <div className="mt-4 text-sm whitespace-pre-wrap text-gray-200">
                                        {nbContent}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                          <div className="mt-5 flex justify-end gap-2">
                            <button
                              type="button"
                              className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                              onClick={async () => {
                                const title = (nbTitle || '').trim();
                                const author = (nbAuthor || '').trim();
                                const heroClass = (nbClass || '').trim();
                                if (!title || !heroClass) return;
                                const forum = slugifyClass(heroClass);
                                const tags = [nbType];
                                const rawContent = (nbContent || '').trim();
                                let contentHtml = '';
                                if (rawContent) {
                                  const escaped = rawContent
                                    .replace(/&/g, '&amp;')
                                    .replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;');
                                  contentHtml = escaped.replace(/\n/g, '<br />');
                                }
                                try {
                                  await addDoc(collection(db, 'builds'), {
                                    title,
                                    author,
                                    className: heroClass,
                                    heroClass: heroClass,
                                    classSlug: forum,
                                    forum: forum,
                                    tags,
                                    status: 'pending',
                                    content_html: contentHtml,
                                    stats: { ...nbStats, total: NB_TOTAL },
                                    createdAt: serverTimestamp(),
                                    updatedAt: serverTimestamp(),
                                  });
                                  setNewBuildOpen(false);
                                  setNbTitle('');
                                  setNbAuthor('');
                                  setNbContent('');
                                  setNbClass('');
                                  setNbType('iniciante');
                                  setNbStats({
                                    strength: 0,
                                    dexterity: 0,
                                    intelligence: 0,
                                    energy: 0,
                                    armor: 0,
                                    vitality: 0,
                                  });
                                } catch {
                                  // silencioso
                                }
                              }}
                            >
                              Enviar para moderação
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {(currentView === 'quests') && (
                  <div className="flex flex-col items-center justify-center h-96 border border-white/5 bg-[#151923] p-12 text-center animate-fade-in">
                    <span className="text-6xl mb-6 grayscale opacity-50">🚧</span>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">
                      Em <span className="text-red-600">Atualização</span>
                    </h2>
                    <p className="text-gray-400 max-w-md mx-auto">
                      Esta seção está sendo desenvolvida para a Season 9. Em breve novidades!
                    </p>
                  </div>
                )}

                {currentView === 'relics' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-end justify-between mb-6 border-b border-white/10 pb-4">
                      <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                        Banco de <span className="text-red-600">Relíquias</span>
                      </h2>
                    </div>
                    <RelicsView db={db} />
                  </div>
                )}

                {currentView === 'contact' && (
                  <div className="animate-fade-in">
                    <div className="space-y-6 max-w-xl">
                      <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                        Fale <span className="text-red-600">Conosco</span>
                      </h2>
                      <div className="bg-[#151923] p-6 border border-white/10 space-y-4">
                        <input
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Seu nome"
                          className="w-full bg-black/30 border border-white/10 p-3 text-sm text-white focus:border-red-500 outline-none transition-colors"
                        />
                        <input
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="Seu e-mail"
                          className="w-full bg-black/30 border border-white/10 p-3 text-sm text-white focus:border-red-500 outline-none transition-colors"
                        />
                        <select
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          className="w-full bg-black/30 border border-white/10 p-3 text-sm text-white focus:border-red-500 outline-none transition-colors"
                        >
                          <option value="Contato">Contato</option>
                          <option value="Reclamação">Reclamação</option>
                          <option value="Sugestão">Sugestão</option>
                          <option value="Parceria">Parceria</option>
                          <option value="Bug">Bug</option>
                          <option value="Outro">Outro</option>
                        </select>
                        <textarea
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Sua mensagem"
                          rows="5"
                          className="w-full bg-black/30 border border-white/10 p-3 text-sm text-white focus:border-red-500 outline-none transition-colors"
                        />
                        <input
                          value={contactImageUrl}
                          onChange={(e) => setContactImageUrl(e.target.value)}
                          placeholder="Link de imagem (opcional)"
                          className="w-full bg-black/30 border border-white/10 p-3 text-sm text-white focus:border-red-500 outline-none transition-colors"
                        />
                        <div className="flex flex-col gap-2 text-xs text-gray-300">
                          <span>Verificação simples:</span>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-2 bg-black/40 border border-white/10 rounded">
                              {contactCaptchaA} {contactCaptchaOp} {contactCaptchaB} =
                            </span>
                            <input
                              value={contactCaptchaAnswer}
                              onChange={(e) => setContactCaptchaAnswer(e.target.value)}
                              placeholder="Resultado"
                              className="w-24 bg-black/30 border border-white/10 p-2 text-xs text-white focus:border-red-500 outline-none transition-colors"
                            />
                            <button
                              type="button"
                              onClick={resetContactCaptcha}
                              className="text-[10px] uppercase tracking-widest border border-white/10 px-2 py-1 hover:bg-white/5 text-gray-300"
                            >
                              Trocar
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={submitContact}
                            disabled={contactSending}
                            className="border border-white/10 text-white font-bold uppercase px-6 py-3 text-xs tracking-widest hover:bg-white/5 transition-colors disabled:opacity-50"
                          >
                            Enviar
                          </button>
                          {contactSent && <span className="text-xs text-green-400">Recebido! Obrigado pelo contato.</span>}
                          {!!contactError && <span className="text-xs text-red-400">{contactError}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Blog View */}
                {currentView === 'blog' && (
                  <div className="space-y-8">
                    {!selectedBlogPost && (
                      <>
                        <div className="flex items-end justify-between mb-6 border-b border-white/10 pb-6">
                          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Blog</h2>
                          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{blogPosts.length} posts</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {blogPosts.map(post => (
                            <div key={post.id} onClick={() => { setSelectedBlogPost(post); window.location.hash = `#blog/${post.id}`; }} className="group relative bg-[#151923] border border-white/5 overflow-hidden cursor-pointer hover:border-orange-500/50 transition-all">
                              <div className="h-40 overflow-hidden relative flex items-center justify-center bg-black/50">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#151923] to-transparent z-10"></div>
                                <img
                                  src={imageOrFallback(post.image)}
                                  alt={post.title}
                                  onError={(e) => { e.currentTarget.src = 'https://herosiege.wiki.gg/images/Item_Chest.png'; }}
                                  className="h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                />
                              </div>
                              <div className="p-5 relative z-20 -mt-2">
                                <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">{formatDateTime(post)}</span>
                                <h4 className="text-white font-bold text-lg mt-1 leading-tight group-hover:text-orange-500 transition-colors">{post.title}</h4>
                                {post.author && (
                                  <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{post.author}</div>
                                )}
                                
                                {post.excerpt && <p className="text-gray-500 text-xs mt-2 leading-relaxed">{post.excerpt}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {selectedBlogPost && (
                      <div>
                        <button onClick={() => { setSelectedBlogPost(null); window.location.hash = '#blog'; }} className="text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-white mb-4">← Voltar</button>
                        <div className="bg-[#151923] border border-white/5">
                          <div className="h-60 w-full overflow-hidden relative flex items-center justify-center bg-black/50">
                            <img
                              src={imageOrFallback(selectedBlogPost.image)}
                              alt={selectedBlogPost.title}
                              onError={(e) => { e.currentTarget.src = 'https://herosiege.wiki.gg/images/Item_Chest.png'; }}
                              className="h-full object-contain"
                            />
                          </div>
                          <div className="p-6">
                            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">{formatDateTime(selectedBlogPost)}</span>
                            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mt-1">{selectedBlogPost.title}</h1>
                            {selectedBlogPost.author && <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{selectedBlogPost.author}</div>}
                            {Array.isArray(selectedBlogPost.tags) && selectedBlogPost.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {selectedBlogPost.tags.map(t => (
                                  <span key={t} className="text-[10px] px-2 py-0.5 border border-white/10 text-gray-400 uppercase tracking-widest">{t}</span>
                                ))}
                              </div>
                            )}
                            {selectedBlogPost.excerpt && <p className="text-gray-400 text-sm mt-3">{selectedBlogPost.excerpt}</p>}
                            <div className="mt-6 prose prose-invert max-w-none" ref={contentRef} />
                            <div className="mt-6">
                              <button
                                onClick={() => {
                                  const url = `${window.location.origin}${window.location.pathname}#blog/${selectedBlogPost.id}`;
                                  if (navigator.share) {
                                    navigator.share({ title: selectedBlogPost.title, url }).catch(() => {});
                                  } else {
                                    navigator.clipboard?.writeText(url);
                                    alert('Link copiado para a área de transferência.');
                                  }
                                }}
                                className="border border-white/10 text-white font-bold uppercase px-6 py-3 text-xs tracking-widest hover:bg-white/5 transition-colors"
                              >
                                Compartilhar
                              </button>
                            </div>
                            <div className="mt-10">
                              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Comentários</h3>
                              <BlogComments postId={selectedBlogPost.id} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Right Column: News/Sidebar */}
            <aside className="w-full md:w-80 flex-shrink-0 space-y-12">
                {/* Search Box */}
                <div className="bg-[#151923] p-6 border border-white/5">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Database Search</h3>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search hero, skill, item..." 
                            className="w-full bg-black/30 border border-white/10 p-3 text-sm text-white focus:border-red-500 focus:outline-none transition-colors"
                        />
                        <span className="absolute right-3 top-3 text-gray-600">🔍</span>
                    </div>
                </div>

                <div className="bg-[#151923] p-6 border border-white/5 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700/10 to-transparent opacity-40 group-hover:opacity-70 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <img src="https://store.steampowered.com/favicon.ico" alt="Steam" className="w-4 h-4 opacity-80" />
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Jogadores Online</h3>
                      {!!steamPlayers && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
                    </div>
                    <div className="flex items-baseline justify-center gap-3">
                      <span className="text-gray-400">
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <circle cx="8" cy="7" r="3"></circle>
                          <circle cx="16" cy="9" r="2.5"></circle>
                          <path d="M2 20c0-3.5 3-6 6-6s6 2.5 6 6H2z"></path>
                          <path d="M13 20c0-2.5 2-4.5 4.5-4.5S22 17.5 22 20h-9z"></path>
                        </svg>
                      </span>
                      <div className="text-5xl font-black text-white tracking-tight">{steamPlayers ?? '—'}</div>
                    </div>
                  </div>
                </div>

                {/* Season Countdown */}
                <div className="bg-[#151923] p-6 border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 text-center">
                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-[0.2em] mb-2 block">Next Season</span>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-1">
                            Season <span className="text-red-600">9</span> Start
                        </h3>
                        <h4 className="text-lg font-bold text-orange-500 uppercase tracking-widest mb-4">
                            Incarnation
                        </h4>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-black/40 p-2 border border-white/5 rounded-sm">
                                <span className="block text-xl font-bold text-white">{timeLeft.days}</span>
                                <span className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">Days</span>
                            </div>
                            <div className="bg-black/40 p-2 border border-white/5 rounded-sm">
                                <span className="block text-xl font-bold text-white">{timeLeft.hours}</span>
                                <span className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">Hours</span>
                            </div>
                            <div className="bg-black/40 p-2 border border-white/5 rounded-sm">
                                <span className="block text-xl font-bold text-white">{timeLeft.minutes}</span>
                                <span className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">Mins</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-600 mt-4 font-mono">Target: April 3, 2026 (Est.)</p>
                    </div>
                </div>

                {/* Latest Updates */}
                <div>
                    <h3 className="text-xl font-black text-white uppercase italic mb-6 border-l-4 border-red-600 pl-4">
                        Últimas <span className="text-red-600">Atualizações</span>
                    </h3>
                    <div className="space-y-4">
                        {(blogPosts.slice(0,3)).map((p) => (
                          <div key={p.id} className="flex gap-4 group cursor-pointer" onClick={() => { setCurrentView('blog'); setSelectedBlogPost(p); window.location.hash = `#blog/${p.id}`; }}>
                            <div className="w-20 h-20 bg-[#151923] flex-shrink-0 overflow-hidden relative">
                              {p.image ? (
                                <img
                                  src={imageOrFallback(p.image)}
                                  alt={p.title}
                                  onError={(e) => { e.currentTarget.src = 'https://herosiege.wiki.gg/images/Item_Chest.png'; }}
                                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-colors"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-800 group-hover:bg-red-900/20 transition-colors"></div>
                              )}
                            </div>
                            <div>
                              <span className="text-[10px] text-red-500 font-bold uppercase">{formatDateTime(p)}</span>
                              <h4 className="text-white font-bold leading-tight group-hover:text-red-500 transition-colors">{p.title}</h4>
                            </div>
                          </div>
                        ))}
                    </div>
                </div>

                {/* Newsletter */}
                <div className="bg-gradient-to-br from-red-600 to-red-900 p-8 text-center">
                    <h3 className="text-2xl font-black text-white italic uppercase mb-2">Join the Fight</h3>
                    <p className="text-red-100 text-xs mb-6">Comece sua jornada em Tarethiel hoje mesmo!</p>
                    <a href="https://store.steampowered.com/app/269210/Hero_Siege/" target="_blank" rel="noopener noreferrer" className="inline-block w-full bg-white text-red-900 font-bold uppercase py-3 text-xs tracking-widest hover:bg-gray-100 transition-colors">
                        Buy on Steam
                    </a>
                </div>
            </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b0d14] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-50 hover:opacity-100 transition-opacity">
            <div className="text-sm text-gray-500">
                Hero Siege Brasil 2026© Este site não é afiliado à Panic Art Studios. Todos os assets e dados pertencem aos seus respectivos donos.
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
                <a href="https://discord.gg/herosiegeofficial" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white cursor-pointer transition-colors">Discord</a>
                <a href="https://store.steampowered.com/app/269210/Hero_Siege/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white cursor-pointer transition-colors">Steam</a>
                <a href="https://www.panicartstudios.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white cursor-pointer transition-colors">PAS</a>
            </div>
        </div>
      </footer>

      {/* Class Detail Modal (Overlay) */}
      {selectedClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={closeModal}></div>
            
            <div className="relative bg-[#0f111a] w-full max-w-6xl h-[85vh] border border-white/10 flex flex-col md:flex-row shadow-2xl overflow-hidden animate-fade-in">
                
                {/* Close Button */}
                <button 
                    onClick={closeModal}
                    className="absolute top-4 right-4 z-50 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
                >
                    ✕
                </button>

                {/* Sidebar Info */}
                <div className="w-full md:w-80 bg-[#0b0d14] border-r border-white/5 relative overflow-hidden flex flex-col">
                    <div className="absolute inset-0 bg-[url('https://herosiege.wiki.gg/images/c/c5/Viking_SkinID_1.png')] bg-cover opacity-5"></div>
                    
                    <div className="w-full h-full overflow-y-auto custom-scrollbar p-8 flex flex-col items-center text-center relative z-10">
                        <img 
                            src={classImagePath(selectedClass)} 
                            onError={(e) => { const t = e.currentTarget; if (!t.dataset.fallback) { t.dataset.fallback = '1'; t.src = classImagePath(selectedClass, 'png'); } }}
                            alt={selectedClass} 
                            className="w-48 h-48 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] mb-6"
                        />
                        
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">
                            {selectedClass}
                        </h2>
                        
                        <div className="w-full h-px bg-white/10 my-6 flex-shrink-0"></div>

                        {loading ? (
                            <div className="text-red-500 animate-pulse">Carregando dados...</div>
                        ) : wikiData ? (
                            <div className="w-full text-left space-y-6">
                                 <div className="bg-[#151923] p-4 border border-white/5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xl">⚔️</span>
                                        <span className="text-gray-400 text-xs font-bold uppercase">Equipamento</span>
                                    </div>
                                    <div className="text-white font-bold text-sm leading-tight">
                                        {wikiData.weapon}
                                    </div>
                                 </div>

                                {/* Navigation Tabs */}
                                 <div className="space-y-1">
                                    {wikiData.sections.map((section, index) => {
                                        const hasTitle = section?.title && String(section.title).trim();
                                        const label = hasTitle
                                          ? section.title
                                          : (section?.isExtra ? '🔍 Extra' : specTitleFor(selectedClass, index));
                                        return (
                                        <button
                                            key={index}
                                            onClick={() => setActiveTab(index)}
                                            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-l-2 select-none ${
                                                activeTab === index 
                                                ? 'bg-red-600/10 border-red-600 text-white' 
                                                : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                        );
                                    })}
                                 </div>
                            </div>
                        ) : (
                            <div className="text-gray-500">Selecionando...</div>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-[#0f111a] relative overflow-hidden flex flex-col">
                    {/* Content Header */}
                    <div className="h-20 border-b border-white/5 flex items-center px-8 bg-[#0f111a]">
                        <h3 className="text-xl font-bold text-gray-300 uppercase">
                            {(() => {
                              const sec = wikiData?.sections?.[activeTab];
                              if (!sec) return "Detalhes";
                              const hasTitle = sec?.title && String(sec.title).trim();
                              if (hasTitle) return sec.title;
                              return sec?.isExtra ? '🔍 Extra' : specTitleFor(selectedClass, activeTab);
                            })()}
                        </h3>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {loading ? (
                             <div className="flex items-center justify-center h-full">
                                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                             </div>
                        ) : wikiData ? (
                            <div 
                                className="wiki-content prose prose-invert prose-red max-w-none"
                                dangerouslySetInnerHTML={{ __html: wikiData.sections[activeTab]?.html }} 
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Selecione uma classe para ver os detalhes
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
      
      {/* Global Styles for this component only (Scopedish) */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #0b0d14;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #333;
            border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #ef4444;
        }
        
        /* Wiki Content Styles Override */
        .wiki-content table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 4px;
            margin-bottom: 2rem;
        }
        .wiki-content tr {
            background: #151923;
        }
        .wiki-content td {
            padding: 1rem;
            border: 1px solid #2a303c;
            color: #9ca3af;
        }
        .wiki-content td:first-child {
            border-left: 2px solid #ef4444;
            width: 80px;
            text-align: center;
        }
        .wiki-content img {
            max-width: 60px;
            border-radius: 4px;
            border: 1px solid #444;
        }
        .wiki-content b {
            color: #ef4444;
            display: block;
            margin-bottom: 4px;
            font-family: 'Orbitron', sans-serif;
            font-size: 0.9em;
        }
      `}</style>
    </div>
  );
};

export default NewDesign;
