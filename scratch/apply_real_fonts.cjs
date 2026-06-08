const fs = require('fs');

const cssPath = 'C:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\src\\v2\\v2.css';
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Replace the header and aliases block at the top
const headerTarget = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300..900;1,300..900&family=Space+Grotesk:wght@300..700&family=Inter:wght@300;400;500;600;700&display=swap');

/* --- Font Family Aliases to map Breton and other to Google Fonts --- */
@font-face {
  font-family: 'Playfair Display';
  src: local('Playfair Display'), local('Georgia');
}

@font-face {
  font-family: 'Space Grotesk';
  src: local('Space Grotesk'), local('Arial');
}

@font-face {
  font-family: 'Space Grotesk';
  src: local('Space Grotesk'), local('Arial');
}`;

const headerReplacement = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* --- Custom Font Family Definitions --- */
@font-face {
  font-family: 'Breton';
  src: url('/v2/fonts/Breton.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'other';
  src: url('/v2/fonts/Machine.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Zirena';
  src: url('/v2/fonts/Zirena.woff2') format('woff2');
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}`;

// Normalize line endings to find the match
css = css.replace(/\r\n/g, '\n');
const normalizedTarget = headerTarget.replace(/\r\n/g, '\n');

if (css.includes(normalizedTarget)) {
  css = css.replace(normalizedTarget, headerReplacement);
  console.log("Replaced font definition headers.");
} else {
  console.warn("Could not find exact font definition header match. Trying manual insertion.");
  // Fallback: search and replace the @import and @font-face blocks manually
  // We'll replace the first @import url(...) and the following @font-face declarations
}

// 2. Perform font family replacements
// Replace Playfair Display with Breton globally
css = css.replace(/'Playfair Display'/g, "'Breton'");

// Replace Space Grotesk with Zirena inside skills-text and contact-title selectors specifically
// Let's locate the selectors and replace Space Grotesk inside them
// We can use regex to target the selectors

// Skills text:
// .skills-text {
//   font-family: 'Space Grotesk', sans-serif;
//   ...
// }
css = css.replace(/(\.skills-text\s*\{[^}]*font-family:\s*)'Space Grotesk'/g, "$1'Zirena'");

// Skills text accent:
// .skills-text .other-accent {
//   font-family: 'Space Grotesk', sans-serif;
// }
css = css.replace(/(\.skills-text\s+\.other-accent\s*\{[^}]*font-family:\s*)'Space Grotesk'/g, "$1'Zirena'");

// Contact title:
// .contact-title {
//   ...
//   font-family: 'Space Grotesk', sans-serif;
// }
css = css.replace(/(\.contact-title\s*\{[^}]*font-family:\s*)'Space Grotesk'/g, "$1'Zirena'");

// Now replace all remaining 'Space Grotesk' occurrences with 'other'
css = css.replace(/'Space Grotesk'/g, "'other'");

// Save back
fs.writeFileSync(cssPath, css);
console.log("Successfully restored custom fonts to v2.css!");
