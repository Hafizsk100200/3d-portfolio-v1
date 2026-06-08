const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\public\\v2\\js\\core-renderer.js';
const content = fs.readFileSync(filePath, 'utf8');

// Find all property assignments to CoreRenderer or init functions
const searchStrings = ['CoreRenderer.init', 'window.CoreRenderer.init', 'init:'];
for (const str of searchStrings) {
  const idx = content.indexOf(str);
  if (idx !== -1) {
    console.log(`Found "${str}" at index ${idx}`);
    console.log(`Context: ${content.substring(idx - 100, idx + 100).replace(/\s+/g, ' ')}`);
  } else {
    console.log(`"${str}" not found`);
  }
}
