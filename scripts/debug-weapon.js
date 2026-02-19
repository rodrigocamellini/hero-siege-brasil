const axios = require('axios');
const cheerio = require('cheerio');

async function debugClass(className) {
  console.log(`Debugging ${className}...`);
  const urlNome = className.replace(/\s+/g, '_');
  const wikiUrl = `https://herosiege.wiki.gg/api.php?action=parse&page=${encodeURIComponent(urlNome)}&prop=text&format=json`;

  try {
    const { data } = await axios.get(wikiUrl);
    const htmlContent = data.parse.text["*"];
    const $ = cheerio.load(htmlContent);

    // Find the 'Weapon Restrictions' header
    const weaponHeader = $('h2').filter((i, el) => $(el).text().includes('Weapon Restrictions'));
    
    if (weaponHeader.length > 0) {
        console.log("Found 'Weapon Restrictions' header!");
        
        // Print the next few elements to see how data is structured
        let next = weaponHeader.next();
        for (let i = 0; i < 3; i++) {
            console.log(`\n--- Sibling ${i + 1} (${next[0]?.tagName}) ---`);
            console.log(next.html()?.trim());
            console.log("Text:", next.text().trim());
            next = next.next();
        }
    } else {
        console.log("'Weapon Restrictions' header not found.");
    }

  } catch (error) {
    console.error(error);
  }
}

debugClass("Viking");
