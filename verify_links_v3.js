const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src', 'EtherNodesData.js');
const tempPath = path.join(__dirname, 'temp_ether_nodes_v3.js');

try {
    let content = fs.readFileSync(srcPath, 'utf8');
    
    // Replace ES module exports with CommonJS-compatible declarations
    content = content.replace(/export const/g, 'const');
    
    // Append module.exports
    content += '\nmodule.exports = { rawData, connections, CENTER_ORIGIN };';
    
    fs.writeFileSync(tempPath, content);
    
    const { rawData, connections } = require(tempPath);
    
    console.log(`Loaded ${rawData.length} nodes from rawData`);
    console.log(`Loaded ${connections.length} links from connections`);
    
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
    
    const nodes = rawData; // Assuming rawData is just nodes based on previous finding
    const links = connections;

    pairsToCheck.forEach(([u, v]) => {
        const link = links.find(l => (l.from === u && l.to === v) || (l.from === v && l.to === u));
        
        const nodeU = nodes.find(n => n.id === u) || nodes[u]; // Try find by ID first, then index
        const nodeV = nodes.find(n => n.id === v) || nodes[v];
        
        console.log(`Checking ${u} -> ${v}:`);
        
        if (link) {
            console.log(`  LINK FOUND: ${link.from} -> ${link.to}`);
        } else {
            console.log(`  LINK MISSING`);
        }
        
        if (!nodeU) console.log(`  Node ${u} MISSING`);
        if (!nodeV) console.log(`  Node ${v} MISSING`);
        
        if (nodeU && nodeV) {
            console.log(`  Coords: ${u}(${nodeU.x}, ${nodeU.y}) -> ${v}(${nodeV.x}, ${nodeV.y})`);
        }
        console.log('---');
    });

} catch (err) {
    console.error("Error:", err);
} finally {
    if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
    }
}
