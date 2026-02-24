
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'RelicsView.js');

try {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Regex para capturar conteúdo da primeira célula de uma linha
  // Assume que a primeira célula contém o nome
  // Procurar por <div>Nome</div> dentro de <td>
  // Ou <td>Nome</td>
  
  const relics = new Set();
  
  // Padrão 1: <div>Nome</div> dentro de <td ...> ... <div className="text-center"> ... </div>
  // Vamos simplificar: procurar qualquer string que pareça um nome de relíquia (Capitalized Words) dentro de uma div que não seja uma classe.
  
  const divRegex = /<div>([A-Z][a-zA-Z0-9 '\-&]+)<\/div>/g;
  let match;
  while ((match = divRegex.exec(content)) !== null) {
     const name = match[1].trim();
     // Filtros de falso positivo
     if (['Name', 'Ability Name', 'Value Level 1', 'Value Level 5', 'Value Level 10', 'Chance Level 1', 'Chance Level 5', 'Chance Level 10', 'Relíquias Orbitais', 'Relíquias de Seguidores', 'Relíquias ao Castar', 'Relíquias Ao Atacar', 'Relíquias Ao Matar', 'Relíquias Ao Tomar Dano', 'Nenhuma relíquia encontrada para esse termo.'].includes(name)) continue;
     if (name.includes('Damage')) continue;
     
     relics.add(name);
  }

  // Padrão 2: alt="Relics Nome"
  const altRegex = /alt="Relics ([^"]+)"/g;
  while ((match = altRegex.exec(content)) !== null) {
    relics.add(match[1].trim());
  }
  
  // Padrão 3: itens de PASSIVE_RELICS
  // Vamos ler o arquivo e extrair a definição de PASSIVE_RELICS se possível, ou assumir que já as temos.
  // Mas o objetivo é encontrar as que NÃO estão em PASSIVE_RELICS nem no EXTRA_RELICS atual.

  console.log('--- POTENTIAL RELICS ---');
  const sorted = Array.from(relics).sort();
  sorted.forEach(r => console.log(r));
  console.log(`Total potential: ${sorted.length}`);

} catch (err) {
  console.error(err);
}
