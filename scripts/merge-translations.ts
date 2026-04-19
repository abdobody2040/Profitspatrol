import * as fs from 'fs';
import * as path from 'path';

function run() {
    const dataPath = path.join(process.cwd(), 'scripts', 'new_translations.json');
    if (!fs.existsSync(dataPath)) {
        console.error("No translations found.");
        return;
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    let oldString = '';
    let newString = '';
    let translatedCount = 0;

    for (const [key, book] of Object.entries(data)) {
        if (/[\u0600-\u06FF]/.test((book as any).title)) {
            translatedCount++;
            
            // Reconstruct the exact string that was injected previously
            oldString += `      ${key}: {\n`;
            oldString += `        title: ${JSON.stringify((book as any).title)},\n`;
            oldString += `        fullContent: \`${(book as any).fullContent.replace(/`/g, '\\`')}\`,\n`;
            
            oldString += `        keyLessons: [\n`;
            const lessons = (book as any).keyLessons || [];
            for (let i = 0; i < lessons.length; i++) {
                oldString += `          ${JSON.stringify(lessons[i])}${i < lessons.length - 1 ? ',' : ''}\n`;
            }
            oldString += `        ]\n`;
            oldString += `      },\n\n`;

            // Construct the NEW correct string (using JSON.stringify for everything to avoid TS errors)
            newString += `      ${JSON.stringify(key)}: {\n`;
            newString += `        title: ${JSON.stringify((book as any).title)},\n`;
            // For fullContent, we also use JSON.stringify so it outputs a safe string instead of a backtick template that breaks if it has ${
            newString += `        fullContent: ${JSON.stringify((book as any).fullContent)},\n`;
            
            newString += `        keyLessons: [\n`;
            for (let i = 0; i < lessons.length; i++) {
                newString += `          ${JSON.stringify(lessons[i])}${i < lessons.length - 1 ? ',' : ''}\n`;
            }
            newString += `        ]\n`;
            newString += `      },\n\n`;
        }
    }

    const arPath = path.join(process.cwd(), 'src', 'locales', 'ar.ts');
    let arContent = fs.readFileSync(arPath, 'utf8');

    if (arContent.includes(oldString)) {
        console.log("Found previously injected broken translations. Replacing with fixed ones...");
        arContent = arContent.replace(oldString, newString);
        fs.writeFileSync(arPath, arContent, 'utf8');
        console.log(`Successfully fixed and injected ${translatedCount} translated books into ar.ts!`);
    } else if (arContent.includes(newString)) {
        console.log("The translations are already nicely formatted inside ar.ts!");
    } else {
        console.error("Could not find the previously injected string in ar.ts to replace! It might have been modified.");
    }
}

run();

