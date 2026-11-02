const fs = require('fs');
const path = require('path');

// Mock a environment where we can evaluate the TS files as JS objects
// This is tricky because they are ESM and have imports.
// We'll use a simpler regex-based approach to find and fix object-to-array issues.

const arPath = 'src/locales/ar.ts';
let content = fs.readFileSync(arPath, 'utf8');

/**
 * Regex to find objects like:
 * instructions: {
 *   '0': '...',
 *   '1': '...'
 * }
 * and convert them to:
 * instructions: [
 *   '...',
 *   '...'
 * ]
 */

function fixObjectToArrays(text) {
    // This regex looks for a key followed by { and then '0': or "0":
    // It captures the indentation and the entire block until the closing }
    // Note: This is a heuristic and might need multiple passes or refinements.
    
    let changed = true;
    let passes = 0;
    
    while (changed && passes < 10) {
        changed = false;
        passes++;
        
        const pattern = /(\w+):\s*{(\s+)'0':\s*/g;
        
        // However, a simple regex replace might break nested structures.
        // Let's use a more targeted approach for the known problematic keys:
        // arcadeList, reviews, steps, instructions, questions, options, steps, checkpoints
        
        const keys = ['arcadeList', 'reviews', 'steps', 'instructions', 'questions', 'options', 'checkpoints', 'arcadeList'];
        
        keys.forEach(key => {
            const keyRegex = new RegExp(`(${key}):\\s*{(\\s+)'0':`, 'g');
            if (keyRegex.test(text)) {
                // Find the full block for this key
                // This is a bit complex with regex, but since we know the format is consistent:
                // We'll find the matching closing brace.
            }
        });
    }
}

// Safer approach:
// Replace patterns like "'0': " with nothing, and change the surrounding { } to [ ]
// for specific blocks.

function manualFix(text) {
    let result = text;

    // Fix patterns like:
    // arcadeList: {
    //   '0': '...',
    //   '1': '...'
    // }
    // into arrays.
    
    // 1. Find all blocks that start with a key and then { '0':
    // 2. Replace { with [
    // 3. Replace '0': '1': etc with nothing
    // 4. Replace the matching } with ]
    
    // We'll use a state machine or a very careful regex.
    // Given the file size, a regex with a function evaluator is best.
    
    const blockRegex = /(\w+):\s*{([^}]*?'0':[^}]*?)}/gs;
    
    result = result.replace(blockRegex, (match, key, body) => {
        // Only convert if it contains '0': but NOT if it's a nested object like hq_levels
        // though hq_levels doesn't use '0'.
        
        if (body.includes("'0':")) {
            // Remove '0': '1': etc.
            let newBody = body.replace(/^\s*['"]\d+['"]:\s*/gm, '');
            return `${key}: [${newBody}]`;
        }
        return match;
    });

    return result;
}

const fixedContent = manualFix(content);
if (fixedContent !== content) {
    fs.writeFileSync(arPath, fixedContent, 'utf8');
} else {
    console.error('No changes needed or regex failed to match.');
}
