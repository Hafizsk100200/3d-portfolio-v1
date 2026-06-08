const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\Hafiz SK\\.gemini\\antigravity-ide\\brain\\0f51a07a-ab3f-4ab3-b83f-ad4a2f17dfdf';
const filePath = path.join(artifactDir, 'scratch', 'lukebaffait_index.css');

const content = fs.readFileSync(filePath, 'utf8');

const regex = /\.reveal-image-wrap\s*\{[^}]*\}/gi;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(match[0].replace(/\s+/g, ' '));
}
