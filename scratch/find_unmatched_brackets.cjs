const fs = require('fs');
const filePath = 'C:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\src\\v2\\V2App.tsx';

let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Insert closing brace at line 1858 (0-indexed 1857)
lines.splice(1857, 0, '    };');

const testContent = lines.join('\n');
const testLines = testContent.split('\n');

const stack = [];
for (let i = 0; i < testLines.length; i++) {
  const line = testLines[i];
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '{') {
      stack.push({ line: i + 1, col: j + 1, type: '{' });
    } else if (char === '}') {
      if (stack.length === 0) {
        console.log(`Unmatched } at line ${i + 1}, col ${j + 1}`);
      } else {
        stack.pop();
      }
    }
  }
}

if (stack.length > 0) {
  console.log(`With fix: Unmatched { remaining: ${stack.length}`);
  stack.forEach((item, index) => {
    if (index < 10 || index >= stack.length - 10) {
      console.log(`  { opened at line ${item.line}, col ${item.col}: ${testLines[item.line - 1].trim()}`);
    } else if (index === 10) {
      console.log('  ...');
    }
  });
} else {
  console.log("With fix: No unmatched brackets! Syntax is completely correct!");
}
