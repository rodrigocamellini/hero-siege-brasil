const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'argumentos.html');

function between(str, start, end) {
  const i = str.indexOf(start);
  if (i === -1) return '';
  const j = str.indexOf(end, i + start.length);
  if (j === -1) return '';
  return str.slice(i + start.length, j);
}

function stripTags(str) {
  return str.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function parseCard(cardHtml) {
  const nameRaw = between(cardHtml, '<h2', '</h2>');
  const name = stripTags(nameRaw);

  const descRaw = between(cardHtml, '<p', '</p>');
  const desc = stripTags(descRaw);

  const tableRaw = between(cardHtml, '<table', '</table>');
  if (!tableRaw) {
    return { name, desc, levels: [], headers: [], rows: [] };
  }

  const headerRowRaw = between(tableRaw, '<thead', '</thead>');
  const headerCells = headerRowRaw.match(/<th[^>]*>[\s\S]*?<\/th>/g) || [];
  const headers = headerCells.map((th, idx) => {
    const text = stripTags(th);
    if (idx === 0 && text.toLowerCase() === 'level') return 'level';
    return text;
  });

  const bodyRaw = between(tableRaw, '<tbody', '</tbody>');
  const rowBlocks = bodyRaw.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) || [];
  const rows = rowBlocks.map((tr) => {
    const cells = tr.match(/<td[^>]*>[\s\S]*?<\/td>/g) || [];
    return cells.map((td) => stripTags(td));
  });

  const levels = rows.map((r) => r[0]).filter(Boolean);

  return { name, desc, levels, headers, rows };
}

function main() {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const parts = html.split('<div class="chakra-card');
  const cards = parts.slice(1);
  const result = [];

  cards.forEach((chunk) => {
    const endIndex = chunk.indexOf('</div><div class="chakra-card');
    const cardHtml = endIndex === -1 ? chunk : chunk.slice(0, endIndex);
    const parsed = parseCard(cardHtml);
    if (parsed.name) {
      result.push(parsed);
    }
  });

  process.stdout.write(JSON.stringify(result, null, 2));
}

main();

