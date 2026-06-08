const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\Hafiz SK\\.gemini\\antigravity-ide\\brain\\0f51a07a-ab3f-4ab3-b83f-ad4a2f17dfdf';
const filePath = path.join(artifactDir, 'scratch', 'lukebaffait_index.css');

const content = fs.readFileSync(filePath, 'utf8');

const searchRules = [
  'about-text',
  'about-sub',
  'skills-text',
  'skills-subtitle',
  'contact-title',
  'contact-dispo',
  'footer-name',
  'preloader-content',
  'hero-tagline'
];

searchRules.forEach(rule => {
  console.log(`\n=== Rules matching "${rule}" ===`);
  const regex = new RegExp(`\\.?[#a-zA-Z0-9_-]*${rule}[a-zA-Z0-9_-]*\\s*\\{[^}]*font-family:[^}]*\\}`, 'gi');
  let match;
  let found = false;
  while ((match = regex.exec(content)) !== null) {
    found = true;
    console.log(match[0].replace(/\s+/g, ' '));
  }
  if (!found) {
    console.log("No specific font-family rule found.");
  }
});
