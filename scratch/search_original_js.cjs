const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\Hafiz SK\\.gemini\\antigravity-ide\\brain\\0f51a07a-ab3f-4ab3-b83f-ad4a2f17dfdf';
const filePath = path.join(artifactDir, 'scratch', 'lukebaffait_index.js');

const content = fs.readFileSync(filePath, 'utf8');
const regex = /startShader/gi;
let match;
while ((match = regex.exec(content)) !== null) {
  const start = Math.max(0, match.index - 100);
  const end = Math.min(content.length, match.index + 200);
  console.log(`Context: ... ${content.substring(start, end).replace(/\s+/g, ' ')} ...`);
}
