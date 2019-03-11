const path = require('path');

// Helper functions
const ROOT = path.resolve(__dirname, '..');

function root(args) {
    return path.join(...[ROOT].concat(...args));
}

exports.root = root;
