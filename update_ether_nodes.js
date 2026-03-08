const fs = require('fs');
const path = require('path');

// Caminhos dos arquivos
const csvPath = path.join(__dirname, 'etherstatus.csv');
const jsPath = path.join(__dirname, 'src', 'EtherNodesData.js');

// 1. Ler e processar o CSV
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split(/\r?\n/);
const nodesMap = new Map();

// Pular cabeçalho
for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Separar Area e Status (apenas no primeiro ponto e vírgula)
    const firstSemi = line.indexOf(';');
    if (firstSemi === -1) continue;

    const areaStr = line.substring(0, firstSemi).trim(); // "Area 1"
    const statusStr = line.substring(firstSemi + 1).trim(); // "Nome • Descrição"

    // Extrair ID
    const match = areaStr.match(/Area (\d+)/i);
    if (match) {
        const id = parseInt(match[1], 10);
        
        // Separar Nome e Descrição
        let name = statusStr;
        let description = '';
        
        const bulletIndex = statusStr.indexOf('•');
        if (bulletIndex !== -1) {
            name = statusStr.substring(0, bulletIndex).trim();
            description = statusStr.substring(bulletIndex + 1).trim();
        }

        nodesMap.set(id, { name, description });
    }
}

console.log(`Carregados ${nodesMap.size} nós do CSV.`);

// 2. Ler o arquivo JS existente
let jsContent = fs.readFileSync(jsPath, 'utf8');

// Encontrar o início e fim de rawData
const startMarker = 'export const rawData = [';
const startIndex = jsContent.indexOf(startMarker);

if (startIndex === -1) {
    console.error('Não foi possível encontrar "export const rawData = [" no arquivo JS.');
    process.exit(1);
}

// Precisamos extrair o array rawData original para preservar as coordenadas
// Vamos fazer um parse manual simples ou usar eval (com cuidado)
// Como o formato é simples JSON-like dentro do array, podemos tentar extrair o bloco
let arrayEndIndex = -1;
let openBrackets = 0;
let foundStart = false;

for (let i = startIndex; i < jsContent.length; i++) {
    if (jsContent[i] === '[') {
        openBrackets++;
        foundStart = true;
    } else if (jsContent[i] === ']') {
        openBrackets--;
        if (foundStart && openBrackets === 0) {
            arrayEndIndex = i + 1;
            break;
        }
    }
}

if (arrayEndIndex === -1) {
    console.error('Não foi possível encontrar o fechamento do array rawData.');
    process.exit(1);
}

const rawDataStr = jsContent.substring(startIndex + 'export const rawData = '.length, arrayEndIndex);
let rawData;

try {
    // Tentar parsear como JSON (pode falhar se tiver trailing commas ou chaves sem aspas)
    // O arquivo original parece ter chaves com aspas: "x": 1092.56
    rawData = JSON.parse(rawDataStr);
} catch (e) {
    console.error('Erro ao parsear rawData original como JSON. Tentando eval seguro...');
    try {
        rawData = eval(rawDataStr);
    } catch (e2) {
        console.error('Falha crítica ao ler rawData.', e2);
        process.exit(1);
    }
}

// 3. Mesclar dados
const newRawData = rawData.map((node, index) => {
    // Preservar coordenadas
    const newNode = { ...node };
    
    if (index === 0) {
        newNode.name = "Ether Core";
        newNode.description = "Start Point";
    } else {
        const csvData = nodesMap.get(index);
        if (csvData) {
            newNode.name = csvData.name;
            newNode.description = csvData.description;
        } else {
            // Fallback para nós sem dados no CSV
            newNode.name = `Node ${index}`;
            newNode.description = "Unknown Node";
        }
    }
    return newNode;
});

// 4. Reconstruir o arquivo JS
const newRawDataStr = JSON.stringify(newRawData, null, 2);
const newJsContent = jsContent.substring(0, startIndex + 'export const rawData = '.length) + 
                     newRawDataStr + 
                     jsContent.substring(arrayEndIndex);

fs.writeFileSync(jsPath, newJsContent, 'utf8');
console.log('EtherNodesData.js atualizado com sucesso!');
