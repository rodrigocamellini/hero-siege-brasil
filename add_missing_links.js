
const fs = require('fs');
const path = 'src/EtherNodesData.js';

try {
    let content = fs.readFileSync(path, 'utf8');

    // Robust extraction of the array
    const startMarker = 'export const connections = [';
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) throw new Error("Could not find start marker");

    // Find the matching closing bracket for the array
    // Since it ends with "];", we can look for that.
    const endIndex = content.lastIndexOf('];');
    if (endIndex === -1) throw new Error("Could not find end marker");

    const arrayStr = content.substring(startIndex + startMarker.length - 1, endIndex + 1); // include [ and ]

    let connections;
    try {
        connections = JSON.parse(arrayStr);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        console.log("Snippet:", arrayStr.substring(0, 100) + "..." + arrayStr.substring(arrayStr.length - 100));
        process.exit(1);
    }

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

    let addedCount = 0;

    missing.forEach(m => {
        // Check if link exists in either direction
        const exists = connections.some(c => 
            (c.from === m.from && c.to === m.to) || 
            (c.from === m.to && c.to === m.from)
        );
        
        if (!exists) {
            connections.push(m);
            console.log(`Added missing: ${m.from} -> ${m.to}`);
            addedCount++;
        } else {
            console.log(`Link already exists: ${m.from} <-> ${m.to}`);
        }
    });

    if (addedCount > 0) {
        const newArrayStr = JSON.stringify(connections, null, 2);
        const newContent = content.substring(0, startIndex + startMarker.length - 1) + 
                           newArrayStr + 
                           content.substring(endIndex + 1);
        
        fs.writeFileSync(path, newContent);
        console.log(`Updated file with ${addedCount} new connections.`);
    } else {
        console.log("All requested connections already exist.");
    }

} catch (err) {
    console.error("Error:", err.message);
}
