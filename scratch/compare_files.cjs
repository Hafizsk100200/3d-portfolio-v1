const fs = require('fs');
const path = require('path');

const file1_app = 'c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\src\\v2\\V2App.tsx';
const file2_app = 'c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Portfolio v2\\src\\v2\\V2App.tsx';

const file1_css = 'c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\src\\v2\\v2.css';
const file2_css = 'c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Portfolio v2\\src\\v2\\v2.css';

function compare(f1, f2, label) {
  if (!fs.existsSync(f1)) {
    console.log(`${label}: File 1 does not exist at ${f1}`);
    return;
  }
  if (!fs.existsSync(f2)) {
    console.log(`${label}: File 2 does not exist at ${f2}`);
    return;
  }
  const c1 = fs.readFileSync(f1, 'utf8');
  const c2 = fs.readFileSync(f2, 'utf8');
  if (c1 === c2) {
    console.log(`${label}: Files are identical.`);
  } else {
    console.log(`${label}: Files differ! Sizes: ${c1.length} vs ${c2.length}`);
  }
}

compare(file1_app, file2_app, 'V2App.tsx');
compare(file1_css, file2_css, 'v2.css');
