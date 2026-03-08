const fs = require('fs');
const path = require('path');

// Load raw data by evaluating the file content
// We can't require it directly because it's an ES module export or might have other dependencies
// But based on previous turns, it seems to be a file with `export const rawData = [...]`
// I'll read the file and extract the array.

const filePath = path.join(__dirname, 'src', 'EtherNodesData.js');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Extract the array content
const match = fileContent.match(/export const rawData = (\[[\s\S]*?\]);/);
if (!match) {
    console.error("Could not find rawData array in file");
    process.exit(1);
}

// Parse the array
// We need to be careful with JSON parsing if the keys are not quoted or if there are comments
// But typically it's valid JS object literal.
// I'll use eval to parse it since it's a trusted local file for this task.
const rawData = eval(match[1]);

const pairsToCheck = [
    [7, 6],
    [21, 22],
    [23, 24],
    [36, 37],
    [67, 68],
    [373, 372],
    [339, 340],
    [341, 342],
    [297, 304],
    [10, 9],
    [281, 280],
    [182, 204],
    [163, 162]
];

console.log("Checking connections...");

const connections = rawData.slice(394); // Assuming nodes are 0-393 and connections follow?
// Wait, the structure of rawData in EtherNodesData.js is usually:
// Nodes 0..N, then connections are defined separately?
// Or is rawData just nodes?
// Let's check the structure first.
// The file content I saw earlier had `{"from": ..., "to": ...}` inside the array.
// So rawData is a mix of nodes and connections?
// Let's separate them.

const nodes = [];
const links = [];

rawData.forEach(item => {
    if (item.id !== undefined) {
        nodes[item.id] = item;
    } else if (item.from !== undefined && item.to !== undefined) {
        links.push(item);
    }
});

console.log(`Found ${nodes.length} nodes (indices up to ${nodes.length-1})`);
console.log(`Found ${links.length} links`);

pairsToCheck.forEach(([u, v]) => {
    // Check if link exists
    const link = links.find(l => (l.from === u && l.to === v) || (l.from === v && l.to === u));
    
    // Check node existence
    const nodeU = nodes[u];
    const nodeV = nodes[v];

    console.log(`Pair ${u} -> ${v}:`);
    if (link) {
        console.log(`  STATUS: FOUND (Direction: ${link.from} -> ${link.to})`);
    } else {
        console.log(`  STATUS: MISSING`);
    }

    if (!nodeU) console.log(`  Node ${u} is missing!`);
    if (!nodeV) console.log(`  Node ${v} is missing!`);
    
    if (nodeU && nodeV) {
        console.log(`  Coords: ${u}(${nodeU.x}, ${nodeU.y}) -> ${v}(${nodeV.x}, ${nodeV.y})`);
        const dx = nodeU.x - nodeV.x;
        const dy = nodeU.y - nodeV.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        console.log(`  Distance: ${dist.toFixed(2)}`);
    }
    console.log("---");
});
