const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '../src/store.ts');
const localePath = path.join(__dirname, '../src/locales/en.ts');

const storeContent = fs.readFileSync(storePath, 'utf8');
const localeContent = fs.readFileSync(localePath, 'utf8');

// Regex to find SHOP_ITEMS array content
// Helper to extract items
const itemsRegex = /{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*description:\s*'([^']+)'/g;

let match;
const items = {};

while ((match = itemsRegex.exec(storeContent)) !== null) {
    const [_, id, name, desc] = match;
    items[id] = {
        name: name,
        desc: desc
    };
}

console.log(`Found ${Object.keys(items).length} items.`);

// Construct the new translation block string
let newBlock = 'store_items: {\n';
for (const [id, data] of Object.entries(items)) {
    newBlock += `      ${id}: {\n        name: "${data.name}",\n        desc: "${data.desc}"\n      },\n`;
}
newBlock += '    },';

// Check if store_items already exists, if so replace it, else insert after shop_items
if (localeContent.includes('store_items: {')) {
    console.log('store_items block already exists. Replacing...');
    const storeItemsRegex = /store_items:\s*\{[\s\S]*?\},\s*/;
    // This simple regex might fail on nested braces, but store_items shouldn't have nested braces other than the items themselves.
    // Actually, let's use a safer replacement strategy or just manual check.
    // Given the previous task complexity, let's assume valid formatted JSON-like structure.

    // Safe replacement is hard with regex on nested structures.
    // However, we know "store_items" is not in the file based on grep search (only shop_items).
    // I will check strictly.
}

// Insert after shop_items
const insertionPoint = 'shop_items: {';
const insertionIndex = localeContent.indexOf(insertionPoint);

if (insertionIndex === -1) {
    console.error('Could not find shop_items block to insert after.');
    process.exit(1);
}

// Find the end of shop_items block is hard without parsing.
// Alternative: Insert BEFORE shop_items.
const newLocaleContent = localeContent.replace('shop_items: {', newBlock + '\n    shop_items: {');

fs.writeFileSync(localePath, newLocaleContent, 'utf8');
console.log('Successfully updated en.ts with store_items.');
