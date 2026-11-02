
import fs from 'fs';
import path from 'path';
import https from 'https';

const CLASSIC_PATH = 'src/features/library/data/classicBooks.ts';
const MORE_PATH = 'src/features/library/data/moreBooks.ts';
const BOOKS_DIR = 'public/images/books';

if (!fs.existsSync(BOOKS_DIR)) {
    fs.mkdirSync(BOOKS_DIR, { recursive: true });
}

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else if (response.statusCode === 302 || response.statusCode === 301) {
                downloadImage(response.headers.location, dest).then(resolve).catch(reject);
            } else {
                file.close();
                fs.unlink(dest, () => {});
                reject(new Error(`Status ${response.statusCode} for ${url}`));
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function processFile(filePath) {
    console.log(`Processing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const newLines = [...lines];
    
    let downloadCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('coverUrl:') && line.includes('http')) {
            // Find the URL
            const urlMatch = line.match(/coverUrl:\s*['"]([^'"]+)['"]/);
            if (!urlMatch) continue;
            const url = urlMatch[1];
            
            // Look upwards for id
            let id = null;
            for (let j = i - 1; j >= Math.max(0, i - 15); j--) {
                const prevLine = lines[j];
                const idMatch = prevLine.match(/id:\s*['"]([^'"]+)['"]/);
                if (idMatch) {
                    // Check if it's a book ID (not a task)
                    if (!idMatch[1].includes('-quiz') && !idMatch[1].includes('-reflection') && !idMatch[1].includes('-action') && !idMatch[1].includes('-share')) {
                        id = idMatch[1];
                        break;
                    }
                }
            }
            
            if (id) {
                const destName = `${id}.jpg`;
                const destPath = path.join(BOOKS_DIR, destName);
                const localUrl = `/images/books/${destName}`;
                
                try {
                    if (!fs.existsSync(destPath)) {
                        console.log(`Downloading ${id}...`);
                        await downloadImage(url, destPath);
                        console.log(`✅ Saved ${destName}`);
                    }
                    newLines[i] = line.replace(url, localUrl);
                    downloadCount++;
                } catch (err) {
                    console.error(`❌ Failed ${id}: ${err.message}`);
                }
            }
        }
    }
    
    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log(`Updated ${filePath}. Downloads: ${downloadCount}`);
}

async function run() {
    await processFile(CLASSIC_PATH);
    await processFile(MORE_PATH);
}

run();
