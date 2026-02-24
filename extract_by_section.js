
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'RelicsView.js');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

let currentSection = 'Passivas'; // Default inicial
const sectionMap = {
    'Relíquias Orbitais': 'Orbitais',
    'Relíquias Seguidores': 'Seguidores',
    'Relíquias Após Cada Morte': 'AposMorte',
    'Relíquias com Chance ao Atacar': 'AoAtacar',
    'Relíquias com Chance ao Ser Atingido': 'AoSerAtingido',
    'Relíquias com Chance ao Castar': 'AoCastar'
};

const relicsBySection = {
    'Passivas': [], // Vai pegar o que estiver antes da primeira seção
    'Orbitais': [],
    'Seguidores': [],
    'AposMorte': [],
    'AoAtacar': [],
    'AoSerAtingido': [],
    'AoCastar': []
};

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detectar seção
    for (const [key, val] of Object.entries(sectionMap)) {
        if (line.includes(key)) {
            currentSection = val;
            // console.log(`Found section: ${val} at line ${i}`);
        }
    }

    // Pular se for linha de título da seção
    if (Object.keys(sectionMap).some(k => line.includes(k))) continue;

    // Detectar relíquia
    // Padrão: <div>Nome</div> dentro de <td ...> <div class="text-center">
    const divMatch = /<div>([A-Z][a-zA-Z0-9 '\-&]+)<\/div>/.exec(line);
    if (divMatch) {
        const name = divMatch[1];
        if (!name.includes('Damage') && !name.includes('Duration') && !name.includes('Level') && !name.includes('Ability Name') && !name.includes('Value Level') && !name.includes('Chance Level') && name !== 'Name') {
            if (!relicsBySection[currentSection].includes(name)) {
                relicsBySection[currentSection].push(name);
            }
        }
    }
    
    const altMatch = /alt="Relics ([^"]+)"/.exec(line);
    if (altMatch) {
        const name = altMatch[1];
        if (!relicsBySection[currentSection].includes(name)) {
            relicsBySection[currentSection].push(name);
        }
    }
}

console.log('--- RESULTS ---');
Object.keys(relicsBySection).forEach(sec => {
    if (relicsBySection[sec].length > 0) {
        console.log(`\nSection: ${sec} (${relicsBySection[sec].length})`);
        relicsBySection[sec].forEach(r => console.log(`  ${r}`));
    }
});

// Calcular total único
const allRelics = new Set();
Object.values(relicsBySection).flat().forEach(r => allRelics.add(r));
console.log(`\nTotal Unique Extras Found: ${allRelics.size}`);
