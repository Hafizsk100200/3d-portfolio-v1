const fs = require('fs');

const content = fs.readFileSync('public/v2/js/hero-project.js', 'utf8');
const firstLine = content.split('\n')[0];
const window = {};
eval(firstLine);

window._heroProjectData.layers.forEach(layer => {
  console.log(`Layer: ${layer.id || layer.type}`);
  if (layer.states) {
    console.log("  states:", Object.keys(layer.states).map(k => `${k}: ${JSON.stringify(layer.states[k])}`));
  } else {
    console.log("  no states");
  }
});
