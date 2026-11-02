const fs = require('fs');
const { resources } = require('./src/features/games/locales/sourceResources.ts');
console.log('common en:', resources.en?.translation?.common);
console.log('common ar:', resources.ar?.translation?.common);

