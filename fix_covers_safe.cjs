const fs = require('fs');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const mappings = {
        'mindset-the-new-psychology-of-success': '/images/books/mindset.jpg',
        '7-habits-of-highly-effective-people': '/images/books/7-habits.jpg',
        'atomic-habits': '/images/books/atomic-habits.jpg',
        'how-to-win-friends-and-influence-people': '/images/books/win-friends.jpg',
        'start-with-why': '/images/books/start-with-why.jpg',
        'the-little-engine-that-could': '/images/books/the-little-engine-that-could.jpg',
        'kidpreneurs': '/images/books/kidpreneurs.jpg',
        'rich-dad-poor-dad-for-teens': '/images/books/rich-dad-poor-dad-for-teens.jpg',
        'the-boy-who-harnessed-the-wind': '/images/books/the-boy-who-harnessed-the-wind.jpg',
        'charlie-and-the-chocolate-factory': '/images/books/charlie-chocolate-factory.jpg',
        'the-alchemist': '/images/books/the-alchemist-pp.jpg'
    };

    // We will find each block and replace the coverUrl
    let lines = content.split('\n');
    let currentId = null;

    for (let i = 0; i < lines.length; i++) {
        const idMatch = lines[i].match(/id:\s*['"]([^'"]+)['"]/);
        if (idMatch) {
            currentId = idMatch[1];
        }

        if (lines[i].includes('coverUrl:')) {
            if (currentId && mappings[currentId]) {
                lines[i] = lines[i].replace(/coverUrl:\s*['"][^'"]+['"]/, `coverUrl: '${mappings[currentId]}'`);
            }
        }
    }

    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

processFile('src/features/library/data/classicBooks.ts');
processFile('src/features/library/data/moreBooks.ts');
