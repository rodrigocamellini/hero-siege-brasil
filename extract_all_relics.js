const fs = require('fs');
const path = require('path');

const relicsViewPath = path.join(__dirname, 'src', 'RelicsView.js');
const content = fs.readFileSync(relicsViewPath, 'utf8');

// Extrair PASSIVE_RELICS
const passiveMatch = content.match(/export const PASSIVE_RELICS = \[([\s\S]*?)\];/);
let passiveRelics = [];
if (passiveMatch) {
    const arrayContent = passiveMatch[1];
    const nameMatches = arrayContent.matchAll(/name:\s*['"]([^'"]+)['"]/g);
    for (const match of nameMatches) {
        passiveRelics.push(match[1]);
    }
}

console.log(`PASSIVE_RELICS count: ${passiveRelics.length}`);

// Extrair relíquias do JSX
const allRelics = new Set();

// Adicionar PASSIVE_RELICS ao set
passiveRelics.forEach(r => allRelics.add(r));

// Regex para capturar nomes em alt tags de imagens de relíquias
// Ex: alt="Relics Demon Sheep"
const altRegex = /alt="Relics ([^"]+)"/g;
let match;
while ((match = altRegex.exec(content)) !== null) {
    allRelics.add(match[1]);
}

// Regex para capturar nomes em divs centralizadas (comum nas tabelas manuais)
// Ex: <div>Demon Sheep</div>
// Filtrar strings que parecem ser cabeçalhos ou stats
const divRegex = /<div>([A-Z][a-zA-Z0-9 '&\-\.]+)<\/div>/g;
while ((match = divRegex.exec(content)) !== null) {
    const name = match[1].trim();
    const ignoreList = [
        'Name', 'Ability Name', 'Value Level', 'Relíquias', 
        'Arcane Damage', 'Cold Damage', 'Fire Damage', 'Lightning Damage', 'Physical Damage', 'Poison Damage',
        'Duration', 'Chance', 'Level'
    ];
    
    // Ignorar se contém palavras da lista de ignore
    if (!ignoreList.some(ignore => name.includes(ignore)) && name.length > 2) {
        allRelics.add(name);
    }
}

// Regex para capturar nomes na segunda coluna das tabelas manuais
// Ex: <td className="px-4 py-3">Demon Sheep</td>
const tdRegex = /<td className="px-4 py-3">([A-Z][a-zA-Z0-9 '&\-\.]+)<\/td>/g;
while ((match = tdRegex.exec(content)) !== null) {
    const name = match[1].trim();
    // Validar se é um nome de relíquia provável (começa com maiúscula, não é stat)
    if (!name.includes('Damage') && !name.includes('Level') && name.length > 2) {
         allRelics.add(name);
    }
}

// Normalizar nomes (alguns podem ter variações como "Steve's" vs "Steves")
// Vamos manter a versão com caracteres especiais se existir
const normalizedRelics = Array.from(allRelics).sort();

console.log(`Total Unique Relics Found: ${normalizedRelics.length}`);
console.log('List:');
console.log(JSON.stringify(normalizedRelics, null, 2));

// Identificar quais já estão em EXTRA_RELICS (simulado lendo o arquivo novamente ou assumindo o que sabemos)
// Para ser preciso, vamos extrair EXTRA_RELICS do arquivo também
const extraMatch = content.match(/export const EXTRA_RELICS = \[([\s\S]*?)\];/);
let currentExtraRelics = [];
if (extraMatch) {
    const arrayContent = extraMatch[1];
    const nameMatches = arrayContent.matchAll(/name:\s*['"]([^'"]+)['"]/g);
    for (const match of nameMatches) {
        currentExtraRelics.push(match[1]);
    }
}

console.log(`Current EXTRA_RELICS count: ${currentExtraRelics.length}`);

// Encontrar faltantes
const existingSet = new Set([...passiveRelics, ...currentExtraRelics]);
const missing = normalizedRelics.filter(r => !existingSet.has(r));

console.log('Missing Relics to add to EXTRA_RELICS:');
console.log(JSON.stringify(missing, null, 2));
