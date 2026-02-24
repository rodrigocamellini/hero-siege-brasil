const fs = require('fs');
const content = fs.readFileSync('src/RelicsView.js', 'utf8');

// Pattern: <div>NAME</div> where NAME is simple text
const divRegex = /<div>([A-Z][a-zA-Z0-9 '\-&]+)<\/div>/g;
const altRegex = /alt="Relics ([^"]+)"/g;

const divs = [];
let match;
while ((match = divRegex.exec(content)) !== null) {
  divs.push(match[1]);
}

const alts = [];
while ((match = altRegex.exec(content)) !== null) {
  alts.push(match[1]);
}

const uniqueDivs = [...new Set(divs)].sort();
const uniqueAlts = [...new Set(alts)].sort();

console.log('--- ALTS ---');
uniqueAlts.forEach(a => console.log(a));
console.log('--- DIVS ---');
uniqueDivs.forEach(d => console.log(d));
