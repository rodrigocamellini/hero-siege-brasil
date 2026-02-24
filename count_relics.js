
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'RelicsView.js');

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const tables = [
    { name: 'Passivas', start: 160, end: 215 },
    { name: 'Orbitais', start: 224, end: 450 },
    { name: 'Seguidores', start: 456, end: 780 },
    { name: 'Ao Castar', start: 793, end: 860 },
    { name: 'Ao Atacar', start: 866, end: 1880 },
    { name: 'Ao Matar', start: 1890, end: 2580 },
    { name: 'Ao Tomar Dano', start: 2592, end: 3000 } // estimado
  ];

  tables.forEach(t => {
    let count = 0;
    // Procurar <tr> que tenha uma célula com imagem ou nome na primeira coluna
    // O padrão é <tr className="border-t ...">
    // Vou contar linhas que começam com <tr className="border-t
    
    const section = lines.slice(t.start, t.end).join('\n');
    const matches = section.match(/<tr className="border-t/g);
    count = matches ? matches.length : 0;
    console.log(`${t.name}: ${count} itens`);
  });

} catch (err) {
  console.error(err);
}
