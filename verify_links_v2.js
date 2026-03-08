const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src', 'EtherNodesData.js');
const tempPath = path.join(__dirname, 'temp_ether_nodes.js');

try {
    let content = fs.readFileSync(srcPath, 'utf8');
    
    // Replace ES module exports with CommonJS-compatible declarations
    // We remove 'export ' prefix
    content = content.replace(/export const/g, 'const');
    
    // Append module.exports
    content += '\nmodule.exports = { rawData, CENTER_ORIGIN };';
    
    fs.writeFileSync(tempPath, content);
    
    const { rawData } = require(tempPath);
    
    console.log(`Loaded ${rawData.length} items from rawData`);
    
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
    
    // Separate nodes and links
    // Assuming nodes are objects with 'id' or just by index
    // The previous read showed rawData starts with nodes.
    // Let's assume nodes are first part, then connections.
    
    const nodes = [];
    const links = [];
    
    rawData.forEach((item, index) => {
        if (item.from !== undefined && item.to !== undefined) {
            links.push(item);
        } else {
            // Assume it's a node
            // The index in array might not match ID if there are gaps or if ID is explicit
            // But let's check if item has 'id' property
            if (item.id !== undefined) {
                nodes[item.id] = item;
            } else {
                // If no ID, assume index matches
                nodes[index] = item;
            }
        }
    });
    
    console.log(`Found ${nodes.length} nodes`);
    console.log(`Found ${links.length} links`);
    
    pairsToCheck.forEach(([u, v]) => {
        const link = links.find(l => (l.from === u && l.to === v) || (l.from === v && l.to === u));
        
        const nodeU = nodes[u];
        const nodeV = nodes[v];
        
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
