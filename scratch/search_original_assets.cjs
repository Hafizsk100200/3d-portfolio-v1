const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\Hafiz SK\\.gemini\\antigravity-ide\\brain\\0f51a07a-ab3f-4ab3-b83f-ad4a2f17dfdf';

const search = (file) => {
  const filePath = path.join(artifactDir, 'scratch', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('hero_bg')) {
      console.log(`Found hero_bg in original ${file}`);
    } else {
      console.log(`Not found in original ${file}`);
    }
  }
};

search('lukebaffait_index.js');
search('lukebaffait_index.css');
