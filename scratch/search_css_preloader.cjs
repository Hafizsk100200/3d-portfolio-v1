const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\Hafiz SK\\.gemini\\antigravity-ide\\brain\\0f51a07a-ab3f-4ab3-b83f-ad4a2f17dfdf';
const filePath = path.join(artifactDir, 'scratch', 'lukebaffait_index.css');

const content = fs.readFileSync(filePath, 'utf8');

const searchRules = [
  'preloader-logo',
  'preloader-luke',
  'preloader-baffait',
  'preloader-dot',
  'proj-item',
  'proj-item-name'
];

searchRules.forEach(rule => {
  console.log(`\n=== Rules matching "${rule}" ===`);
  const regex = new RegExp(`\\.?[#a-zA-Z0-9_-]*${rule}[a-zA-Z0-9_-]*\\s*\\{[^}]*\\}`, 'gi');
  let match;
  let found = false;
  while ((match = regex.exec(content)) !== null) {
    found = true;
    console.log(match[0].replace(/\s+/g, ' '));
  }
  if (!found) {
    console.log("No rule found.");
  }
});
