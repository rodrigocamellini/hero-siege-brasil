
const fs = require('fs');
const path = 'src/EtherNodesData.js';

try {
    let content = fs.readFileSync(path, 'utf8');

    // Extract rawData
    const rawStart = content.indexOf('export const rawData = [');
    const rawEnd = content.indexOf('];', rawStart);
    const rawStr = content.substring(rawStart + 24, rawEnd + 1);
    const rawData = JSON.parse(rawStr);

    console.log(`Total nodes: ${rawData.length}`);

    // Extract connections
    const connStart = content.indexOf('export const connections = [');
    const connEnd = content.lastIndexOf('];');
    const connStr = content.substring(connStart + 27, connEnd + 1);
    const connections = JSON.parse(connStr);

    const missing = [
        {from: 7, to: 6},
        {from: 21, to: 22},
        {from: 23, to: 24},
        {from: 36, to: 37},
        {from: 67, to: 68},
        {from: 373, to: 372},
        {from: 339, to: 340},
        {from: 341, to: 342},
        {from: 297, to: 304},
        {from: 10, to: 9},
        {from: 281, to: 280},
        {from: 182, to: 204},
        {from: 163, to: 162}
    ];

    const nodesToCheck = new Set();
    missing.forEach(m => {
        nodesToCheck.add(m.from);
        nodesToCheck.add(m.to);
    });

    console.log("Checking node existence...");
    nodesToCheck.forEach(id => {
        if (!rawData[id]) {
            console.error(`NODE MISSING: ID ${id} is not in rawData!`);
        }
    });

    console.log("Checking connections...");
    missing.forEach(m => {
        const exact = connections.find(c => c.from === m.from && c.to === m.to);
        const reverse = connections.find(c => c.from === m.to && c.to === m.from);
        
        if (exact) console.log(`Exact match exists: ${m.from}->${m.to}`);
        else if (reverse) console.log(`Reverse match exists: ${m.to}->${m.from} (User asked for ${m.from}->${m.to})`);
        else console.log(`MISSING completely: ${m.from}->${m.to}`);
    });

} catch (e) {
    console.error(e);
}
