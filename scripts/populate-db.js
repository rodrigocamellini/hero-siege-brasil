const axios = require('axios');
const cheerio = require('cheerio');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error("ERROR: 'serviceAccountKey.json' not found in scripts folder.");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const classes = [
  "Viking", "Pyromancer", "Marksman", "Pirate", "Nomad", "Redneck", 
  "Necromancer", "Samurai", "Paladin", "Amazon", "Demon Slayer", 
  "Demonspawn", "Shaman", "White Mage", "Marauder", "Plague Doctor", 
  "Shield Lancer", "Jötunn", "Illusionist", "Exo", "Butcher", "Stormweaver"
];

async function scrapeClass(className) {
  console.log(`Scraping ${className}...`);
  const urlNome = className.replace(/\s+/g, '_');
  const wikiUrl = `https://herosiege.wiki.gg/api.php?action=parse&page=${encodeURIComponent(urlNome)}&prop=text&format=json`;

  try {
    const { data } = await axios.get(wikiUrl);
    
    if (data.error) {
        console.error(`Wiki API Error for ${className}:`, data.error.info);
        return null;
    }

    const htmlContent = data.parse.text["*"];
    const $ = cheerio.load(htmlContent);

    // 1. Image
    const imageUrl = `https://herosiege.wiki.gg/images/${urlNome}.png`;

    // 2. Weapon Info (Refined for Wiki.gg Structure)
    let weapon = "Desconhecido"; 
    
    // Strategy: Find H2 header "Weapon Restrictions" and get the text of the next element
    $('h2').each((i, el) => {
        const headerText = $(el).text().trim();
        if (headerText.includes('Weapon Restrictions') || headerText.includes('Weapons')) {
            // Get the next element (usually a <p> or <ul>)
            const nextEl = $(el).next();
            if (nextEl.length > 0) {
                // If it's a paragraph, just get text
                // If it's a list, get list items
                let text = nextEl.text().trim();
                
                // Clean up common "edit" links if they sneaked in (though usually in header)
                text = text.replace(/\[.*?\]/g, '').trim();
                
                if (text) {
                    weapon = text;
                    return false; // Break loop
                }
            }
        }
    });

    // Fallback: Check for infobox table rows (some pages might still use it)
    if (weapon === "Desconhecido") {
        $('.infobox tr').each((i, el) => {
            const th = $(el).find('th').text().trim();
            const td = $(el).find('td').text().trim();
            
            if (th.includes('Weapon') || th.includes('Restrictions')) {
                weapon = td;
            }
        });
    }

    // 3. Sections (Unified and Reordered)
    const especializacoes = [];

    $('table').each((i, el) => {
        const table = $(el);
        
        // Find title
        let title = `Section ${i + 1}`;
        let prev = table.prev();
        while (prev.length && !prev[0].tagName.startsWith('h')) {
             prev = prev.prev();
        }
        if (prev.length && prev[0].tagName.startsWith('h')) {
            title = prev.text().replace(/\[.*?\]/g, '').trim();
        }

        if (table.text().length > 30) {
            // Fix images
            table.find('img').each((j, img) => {
                const src = $(img).attr('src');
                if (src && src.startsWith('/')) {
                    $(img).attr('src', 'https://herosiege.wiki.gg' + src);
                }
                $(img).removeAttr('width');
                $(img).removeAttr('height');
            });
            // Fix links
            table.find('a').each((j, a) => {
                const content = $(a).html();
                $(a).replaceWith(`<span>${content}</span>`);
            });
            // Cleanup styles
            table.removeAttr('class');
            table.removeAttr('style');

            const sectionData = {
                title: title,
                html: $.html(table)
            };

            especializacoes.push(sectionData);
        }
    });

    // --- REORDERING LOGIC ---
    // User Request: "COLOQUE TODOS OS MENUS DE CLASS AUGUMENT ACIMA DE SECTION 4"
    
    // Find "Class Augments" (or similar)
    const augmentIndices = [];
    especializacoes.forEach((s, i) => {
        if (s.title.toLowerCase().includes('augment')) {
            augmentIndices.push(i);
        }
    });

    // Find "Section 4"
    let section4Index = especializacoes.findIndex(s => s.title.toLowerCase() === 'section 4');

    if (section4Index !== -1 && augmentIndices.length > 0) {
        // Move all augment sections to be before Section 4
        // We iterate in reverse to keep relative order of augments if multiple
        for (let i = augmentIndices.length - 1; i >= 0; i--) {
            const idx = augmentIndices[i];
            // Only move if it is currently AFTER Section 4
            if (idx > section4Index) {
                // Remove
                const [item] = especializacoes.splice(idx, 1);
                // Insert at section4Index
                especializacoes.splice(section4Index, 0, item);
            }
        }
    }

    if (especializacoes.length === 0) {
        especializacoes.push({ title: "Geral", html: $.html() });
    }

    return {
      name: className,
      weapon: weapon,
      imageUrl: imageUrl,
      wikiUrl: `https://herosiege.wiki.gg/wiki/${urlNome}`,
      especializacoes: especializacoes,
      extra_info: [], // Ensure this is empty
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

  } catch (error) {
    console.error(`Error scraping ${className}:`, error.message);
    return null;
  }
}

async function run() {
  console.log('Starting Wiki.gg scraper (Reordered)...');
  
  const batch = db.batch();
  let count = 0;
  let batchCount = 0;

  for (const cls of classes) {
    const data = await scrapeClass(cls);
    if (data) {
      const docId = cls.toLowerCase().replace(/\s+/g, '-').replace(/ö/g, 'o');
      const docRef = db.collection('classes').doc(docId);
      batch.set(docRef, data, { merge: true });
      count++;
      batchCount++;
    }
    
    if (batchCount >= 50) {
        await batch.commit();
        batchCount = 0;
    }

    console.log('Waiting 10s...');
    await new Promise(resolve => setTimeout(resolve, 10000));
  }

  if (batchCount > 0) {
    await batch.commit();
  }
  
  console.log(`Successfully updated ${count} classes with reordered sections.`);
}

run();
