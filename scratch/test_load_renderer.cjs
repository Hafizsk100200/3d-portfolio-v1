const fs = require('fs');
const path = require('path');

const jsPath = 'c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\public\\v2\\js\\core-renderer.js';

// Setup basic window mock
global.window = {};
global.self = global.window;
global.globalThis = global.window;
global.document = {
  createElement: () => ({
    style: {},
    addEventListener: () => {}
  }),
  addEventListener: () => {},
  documentElement: {
    clientHeight: 1080,
    clientWidth: 1920
  }
};
global.navigator = { userAgent: 'Chrome' };
global.performance = { now: Date.now };
global.requestAnimationFrame = () => {};
global.cancelAnimationFrame = () => {};


// Load file by evaluating it in the global context
const code = fs.readFileSync(jsPath, 'utf8');
try {
  // Shadow exports and module to force browser global assignment
  const shadowEval = new Function('module', 'exports', code);
  shadowEval(undefined, undefined);
  console.log("Keys on window.CoreRenderer:", Object.keys(global.window.CoreRenderer));
  console.log("Types of properties:");
  for (const k of Object.keys(global.window.CoreRenderer)) {
    console.log(`- ${k}: ${typeof global.window.CoreRenderer[k]}`);
  }
} catch (err) {
  console.error("Evaluation failed:", err);
}
