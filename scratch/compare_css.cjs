const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\Hafiz SK\\.gemini\\antigravity-ide\\brain\\0f51a07a-ab3f-4ab3-b83f-ad4a2f17dfdf';

const originalCss = fs.readFileSync(path.join(artifactDir, 'scratch', 'lukebaffait_index.css'), 'utf8');
const ourCss = fs.readFileSync('src/v2/v2.css', 'utf8');

const getFontDeclarations = (css) => {
  const lines = css.split('\n');
  const decls = [];
  lines.forEach((line, index) => {
    if (line.includes('font-family')) {
      decls.push({ lineNum: index + 1, content: line.trim() });
    }
  });
  return decls;
};

console.log("=== ORIGINAL CSS FONT FAMILIES ===");
getFontDeclarations(originalCss).forEach(d => {
  console.log(`${d.lineNum}: ${d.content}`);
});

console.log("\n=== OUR CSS FONT FAMILIES ===");
getFontDeclarations(ourCss).forEach(d => {
  console.log(`${d.lineNum}: ${d.content}`);
});
