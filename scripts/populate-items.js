const axios = require('axios');
const cheerio = require('cheerio');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error("serviceAccountKey.json not found");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const wikiApi = async (page) => {
  const url = `https://herosiege.wiki.gg/api.php?action=parse&page=${encodeURIComponent(page)}&prop=text&format=json`;
  const { data } = await axios.get(url);
  if (!data.parse || !data.parse.text || !data.parse.text['*']) throw new Error('Invalid wiki response');
  return data.parse.text['*'];
};

const absUrl = (u) => {
  if (!u) return u;
  if (u.startsWith('//')) return 'https:' + u;
  if (u.startsWith('/')) return 'https://herosiege.wiki.gg' + u;
  return u;
};

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const GROUPS = {
  Weapons: [
    'Swords','Daggers','Maces','Axes','Claws','Polearms','Chainsaws',
    'Staves','Canes','Wands','Books','Spellblades','Bows','Guns','Flasks','Throwing Weapons','Throwing Weapon'
  ],
  Armor: ['Helmets','Body Armors','Gloves','Boots','Shield','Shields'],
  Jewellery: ['Amulets','Rings','Belts'],
  'Special Items': ['Charms','Relics','Glyphs','Potions'],
  Misc: ['Keys','Materials','Socketables','Consumables','Collectibles']
};

const GROUP_ORDER = ['Weapons','Armor','Jewellery','Special Items','Misc'];

function detectGroup(title){
  for (const g of GROUP_ORDER) {
    if (GROUPS[g].includes(title)) return g;
  }
  return 'Misc';
}

async function scrapeCategories() {
  const html = await wikiApi('Items');
  const $ = cheerio.load(html);
  const categories = [];
  $('a').each((i, a) => {
    const img = $(a).find('img');
    const src = img.attr('src');
    const rawTitle = $(a).attr('title') || $(a).text().trim();
    const title = rawTitle.replace(/^Category\s+/, '').trim();
    const href = $(a).attr('href');
    if (src && href && title && href.startsWith('/wiki/')) {
      const entry = {
        title,
        image: absUrl(src),
        href: 'https://herosiege.wiki.gg' + href
      };
      categories.push(entry);
    }
  });
  const map = new Map();
  categories.forEach(c => {
    if (!map.has(c.title)) map.set(c.title, c);
  });
  const list = Array.from(map.values()).map(c => ({
    ...c,
    group: detectGroup(c.title),
    order: GROUP_ORDER.indexOf(detectGroup(c.title))
  }));
  list.sort((a,b) => (a.order - b.order) || (a.title.localeCompare(b.title)));
  return list;
}

async function scrapeCategoryItems(title) {
  const html = await wikiApi(title);
  const $ = cheerio.load(html);
  const items = [];
  $('table').each((i, t) => {
    const table = $(t);
    const cls = (table.attr('class') || '').toLowerCase();
    if (cls.includes('navbox') || cls.includes('sidebar') || cls.includes('toc')) return;
    // detect section rarity/context by nearest previous header
    let sectionTitle = '';
    const prevHeader = table.prevAll('h2, h3').first();
    if (prevHeader && prevHeader.length) {
      sectionTitle = prevHeader.text().replace(/\[edit\]/i, '').trim();
    }
    const headers = [];
    table.find('tr').first().find('th').each((j, th) => headers.push($(th).text().trim()));
    const nameIdx = headers.findIndex(h => /name|item/i.test(h));
    if (headers.length < 2) return;
    table.find('tr').slice(1).each((j, tr) => {
      const cols = $(tr).find('td');
      if (cols.length === 0) return;
      let name = '';
      let image = '';
      let link = '';
      const data = {};
      cols.each((k, td) => {
        const cell = $(td);
        const img = cell.find('img').first().attr('src');
        if (img && !image) image = absUrl(img);
        if (!link) {
          const a = cell.find('a').first();
          const href = a.attr('href');
          if (href && href.startsWith('/wiki/')) link = 'https://herosiege.wiki.gg' + href;
        }
        const text = cell.text().replace(/\[.*?\]/g, '').trim();
        const h = headers[k] || `col_${k}`;
        if (nameIdx >= 0) {
          if (k === nameIdx) name = text || name;
        } else if (k === 0) {
          name = text || name;
        }
        data[h] = text;
      });
      if (name && !name.includes('●')) {
        items.push({ name, image, link, data, section: sectionTitle });
      }
    });
  });
  // gallery fallback
  $('.gallery .gallerybox').each((i, gb) => {
    const box = $(gb);
    const a = box.find('a').first();
    const img = box.find('img').first();
    const href = a.attr('href');
    const name = (img.attr('alt') || a.attr('title') || box.text() || '').trim();
    const src = img.attr('src');
    if (href && name && !name.includes('●')) {
      items.push({
        name,
        image: src ? absUrl(src) : '',
        link: href.startsWith('/wiki/') ? 'https://herosiege.wiki.gg' + href : href,
        data: {},
        section: $('.gallery').prevAll('h2,h3').first().text().replace(/\[edit\]/i,'').trim() || ''
      });
    }
  });
  // simple list fallback
  $('.mw-parser-output ul li a[href^="/wiki/"]').each((i, a) => {
    const $a = $(a);
    const name = $a.text().trim();
    const href = $a.attr('href');
    if (name && href && !name.includes('●')) {
      items.push({
        name,
        image: '',
        link: 'https://herosiege.wiki.gg' + href,
        data: {},
        section: $a.closest('ul').prevAll('h2,h3').first().text().replace(/\[edit\]/i,'').trim() || ''
      });
    }
  });
  return items;
}

function deriveRarity(data, name) {
  const r = (data.Rarity || data.Rank || data.Quality || '').trim();
  if (/satanic set/i.test(r) || (/satanic/i.test(r) && /set/i.test(name))) return 'Satanic Set';
  if (/satanic/i.test(r)) return 'Satanic';
  if (/angelic/i.test(r)) return 'Angelic';
  if (/heroic/i.test(r)) return 'Heroic';
  if (/unholy/i.test(r)) return 'Unholy';
  if (/legend/i.test(r)) return 'Legendary';
  if (/epic/i.test(r)) return 'Epic';
  if (/rare/i.test(r)) return 'Rare';
  if (/magic/i.test(r)) return 'Magic';
  if (/normal|common/i.test(r)) return 'Common';
  return r || null;
}

async function scrapeItemDetailByLink(link){
  if (!link) return { description: null, detailRarity: null, tier: null, detailHtml: null };
  const page = decodeURIComponent(link.split('/wiki/')[1] || '');
  try {
    const html = await wikiApi(page);
    const $ = cheerio.load(html);
    let description = null;
    let detailRarity = null;
    let tier = null;
    let detailHtml = null;
    const contentParas = $('p').toArray().map(p => $(p).text().replace(/\[.*?\]/g, '').trim()).filter(Boolean);
    if (contentParas.length) description = contentParas[0];
    if (!description) {
      const infobox = $('.infobox').first();
      const cap = infobox.find('caption').text().trim();
      if (cap) description = cap;
    }
    const pageText = $('.mw-parser-output').text().replace(/\[.*?\]/g, ' ').replace(/\s+/g, ' ').trim();
    const rarMatch = pageText.match(/\b(Satanic Set|Satanic|Angelic|Unholy|Heroic|Legendary|Epic|Rare|Magic|Common)\b/i);
    if (rarMatch) detailRarity = rarMatch[1].replace(/^\w/, c => c.toUpperCase());
    const tierMatch = pageText.match(/Tier:\s*([A-Z]{1,3})/i);
    if (tierMatch) tier = tierMatch[1];
    let box = null;
    $('.mw-parser-output').find('div,table,section').each((i, el) => {
      const txt = $(el).text();
      if (/Attack Damage/i.test(txt) && /Attacks per Second/i.test(txt) && txt.length > 50) {
        box = $(el);
        return false;
      }
      return true;
    });
    if (box) {
      box.find('a').each((i, a) => {
        const href = $(a).attr('href');
        if (href && href.startsWith('/')) $(a).attr('href', 'https://herosiege.wiki.gg' + href);
      });
      detailHtml = box.html();
    }
    return { description, detailRarity, tier, detailHtml };
  } catch (e) {
    return { description: null, detailRarity: null, tier: null, detailHtml: null };
  }
}

async function run() {
  console.log('Scraping item categories...');
  let cats = await scrapeCategories();
  const only = (process.env.CATEGORY || '').split(',').map(s => s.trim()).filter(Boolean);
  if (only.length) {
    cats = cats.filter(c => only.includes(c.title));
    console.log('Filtering categories to:', only.join(', '));
  }
  let countCats = 0;
  for (const cat of cats) {
    const id = slug(cat.title);
    const catRef = db.collection('item_categories').doc(id);
    await catRef.set({
      title: cat.title,
      image: cat.image,
      wikiUrl: cat.href,
      group: cat.group,
      order: cat.order,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    countCats++;
    console.log('Scraping items for', cat.title);
    let items = [];
    try {
      items = await scrapeCategoryItems(cat.title);
    } catch (e) {
      if (String(e && e.message || '').includes('status code 429')) {
        console.warn('Rate limited. Waiting 15s and retrying...', cat.title);
        await new Promise(r => setTimeout(r, 15000));
        try {
          items = await scrapeCategoryItems(cat.title);
        } catch (e2) {
          console.warn('Failed items for category', cat.title, e2.message);
          items = [];
        }
      } else {
        console.warn('Failed items for category', cat.title, e.message);
        items = [];
      }
    }
    // clear previous items to avoid stale/duplicated docs
    try {
      const oldSnap = await catRef.collection('items').get();
      for (const d of oldSnap.docs) {
        await d.ref.delete();
      }
    } catch (e) {
      console.warn('Failed to clear previous items for', cat.title, e.message);
    }
    // process items with light concurrency to avoid rate limiting
    const getIdFromLink = (link, fallbackName) => {
      if (link) {
        const page = decodeURIComponent(link.split('/wiki/')[1] || '');
        if (page) return slug(page);
      }
      return slug(fallbackName);
    };
    for (const it of items) {
      const iid = getIdFromLink(it.link, it.name);
      const iref = catRef.collection('items').doc(iid);
      let desc = null;
      let detailR = null;
      let detailHtml = null;
      try {
        const det = await scrapeItemDetailByLink(it.link);
        desc = det.description;
        detailR = det.detailRarity;
        detailHtml = det.detailHtml;
      } catch (_) {
        desc = null;
        detailR = null;
        detailHtml = null;
      }
      const sectionR = deriveRarity({ Rarity: it.section || '' }, it.name || '') || deriveRarity({ Rank: it.section || '' }, it.name || '');
      const inferredRarity = detailR || deriveRarity(it.data || {}, it.name || '') || sectionR || null;
      await iref.set({
        name: it.name,
        image: it.image,
        rarity: inferredRarity,
        data: it.data,
        wikiUrl: it.link || null,
        description: desc,
        detail_html: detailHtml,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      await new Promise(r => setTimeout(r, 500)); // small delay per item
    }
    await new Promise(r => setTimeout(r, 5000));
  }
  console.log(`Imported ${countCats} categories`);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
