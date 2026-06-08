const fs = require('fs');
const path = require('path');

const coreRendererPath = 'c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\public\\v2\\js\\core-renderer.js';
const heroProjectPath = 'c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\public\\v2\\js\\hero-project.js';

function searchInFile(filePath, term) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`\n=== Searching for "${term}" in ${path.basename(filePath)} ===`);
    const regex = new RegExp(`.{0,50}${term}.{0,100}`, 'gi');
    let match;
    let count = 0;
    while ((match = regex.exec(content)) !== null) {
      count++;
      console.log(`Match ${count}: ... ${match[0].replace(/\n/g, ' ')} ...`);
      if (count >= 15) {
        console.log("Truncating results (>= 15 matches)");
        break;
      }
    }
    if (count === 0) {
      console.log("No matches found.");
    }
  } catch (err) {
    console.error("Error reading file:", err.message);
  }
}

searchInFile(coreRendererPath, 'scroll');
searchInFile(coreRendererPath, 'opacity');
searchInFile(coreRendererPath, 'visibility');
searchInFile(coreRendererPath, 'canvas');

searchInFile(heroProjectPath, 'scroll');
searchInFile(heroProjectPath, 'opacity');
