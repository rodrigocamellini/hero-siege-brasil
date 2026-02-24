
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'RelicsView.js');

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const relics = new Set();
  let inTd = false;
  let tdContent = '';
  let collectingName = false;

  // Regex simples para capturar nomes dentro de divs após imagens, como visto no padrão
  // <div>Nome</div>
  const nameDivRegex = /<div>([A-Z][a-zA-Z0-9 '\-&]+)<\/div>/g;
  
  let match;
  while ((match = nameDivRegex.exec(content)) !== null) {
    // Ignora "Cold Damage", "Fire Damage", etc. que podem aparecer em divs
    const name = match[1].trim();
    if (!name.includes('Damage') && !name.includes('Duration') && !name.includes('Level')) {
        relics.add(name);
    }
  }

  // Regex para alt="Relics Nome"
  const altRegex = /alt="Relics ([^"]+)"/g;
  while ((match = altRegex.exec(content)) !== null) {
    relics.add(match[1].trim());
  }

  console.log('--- RELICS FOUND ---');
  const sortedRelics = Array.from(relics).sort();
  sortedRelics.forEach(r => console.log(r));
  console.log(`Total found: ${sortedRelics.length}`);

} catch (err) {
  console.error('Error:', err);
}
