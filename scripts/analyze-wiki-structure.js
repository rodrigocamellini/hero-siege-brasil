const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeClass(className) {
  console.log(`Analyzing Wiki structure for: ${className}...`);
  const urlNome = className.replace(/\s+/g, '_');
  const wikiUrl = `https://herosiege.wiki.gg/api.php?action=parse&page=${encodeURIComponent(urlNome)}&prop=text&format=json`;

  try {
    const { data } = await axios.get(wikiUrl);
    
    if (data.error) {
        console.error(`Wiki API Error:`, data.error.info);
        return;
    }

    const htmlContent = data.parse.text["*"];
    const $ = cheerio.load(htmlContent);

    console.log('\n--- HEADERS FOUND (H2) ---');
    $('h2').each((i, el) => {
        console.log(`- ${$(el).text().replace('[edit]', '').trim()}`);
    });

    console.log('\n--- SUB-HEADERS FOUND (H3) ---');
    $('h3').each((i, el) => {
        console.log(`- ${$(el).text().replace('[edit]', '').trim()}`);
    });

    console.log('\n--- TABLES FOUND ---');
    $('table').each((i, el) => {
        // Try to identify table content by looking at the previous header
        let prev = $(el).prev();
        while (prev.length && !prev[0].tagName.startsWith('h')) {
             prev = prev.prev();
        }
        const context = prev.length ? prev.text().replace('[edit]', '').trim() : "Unknown Section";
        console.log(`- Table ${i+1}: likely belongs to section "${context}"`);
    });

  } catch (error) {
    console.error(`Error:`, error.message);
  }
}

analyzeClass('Viking');
