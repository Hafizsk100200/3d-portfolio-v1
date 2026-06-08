const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\Hafiz SK\\.gemini\\antigravity-ide\\brain\\0f51a07a-ab3f-4ab3-b83f-ad4a2f17dfdf';
const filePath = path.join(artifactDir, 'scratch', 'lukebaffait_index.css');

const content = fs.readFileSync(filePath, 'utf8');

const regex = /[^a-zA-Z0-9_-]mix-blend-mode\s*:\s*([^;}]*)/gi;
let match;
console.log("=== ORIGINAL SITE MIX-BLEND-MODE DEFINITIONS ===");
while ((match = regex.exec(content)) !== null) {
  const start = Math.max(0, match.index - 80);
  const end = Math.min(content.length, match.index + 120);
  console.log(`Context: ... ${content.substring(start, end).replace(/\s+/g, ' ')} ...`);
}
