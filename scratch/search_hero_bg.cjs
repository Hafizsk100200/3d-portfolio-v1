const fs = require('fs');

const files = ['src/v2/V2App.tsx', 'src/v2/v2.css'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('hero_bg')) {
      console.log(`Found in ${file}`);
    } else {
      console.log(`Not found in ${file}`);
    }
  }
});
