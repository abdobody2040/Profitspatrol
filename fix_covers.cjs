const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, 'public', 'images', 'books');
const availableCovers = fs.readdirSync(booksDir).map(file => file.toLowerCase());

function findCover(id) {
    // Exact match
    let match = availableCovers.find(c => c === id + '.jpg' || c === id + '.png');
    if (match) return '/images/books/' + match;

    // Special mappings
    const mappings = {
        'mindset-the-new-psychology-of-success': 'mindset.jpg',
        '7-habits-of-highly-effective-people': '7-habits.jpg',
        'how-to-win-friends-and-influence-people': 'win-friends.jpg',
        'rich-dad-poor-dad': 'rich-dad.jpg', // or rich-dad-poor-dad.jpg
        'the-intelligent-investor': 'the-intelligent-investor.jpg',
        'the-lean-startup': 'the-lean-startup.jpg',
        'the-4-hour-workweek': '4-hour-workweek.jpg',
        'the-5-am-club': '5-am-club.jpg',
        'the-alchemist': 'the-alchemist-pp.jpg',
        'the-alchemist-pp': 'the-alchemist-pp.jpg',
        'the-everything-store': 'the-everything-store.jpg',
        'the-ride-of-a-lifetime': 'the-ride-of-a-lifetime.jpg',
        'the-snowball': 'the-snowball.jpg',
        'the-tipping-point': 'the-tipping-point.jpg',
        'the-virgin-way': 'the-virgin-way.jpg',
        'the-war-of-art': 'the-war-of-art.jpg',
        'i-will-teach-you-to-be-rich': 'i-will-teach-you-to-be-rich.jpg',
        'the-richest-man-in-babylon': 'richest-man.jpg',
        'company-of-one': 'company-of-one.jpg',
        'losing-my-virginity': 'losing-my-virginity.jpg',
        'will': 'will.png',
        'the-compound-effect': 'the-compound-effect.jpg',
        'psychology-of-money': 'psychology-money.jpg',
        'the-magic-of-thinking-big': 'magic-of-thinking-big.jpg',
        'the-power-of-positive-thinking': 'power-of-positive-thinking.jpg',
    };

    if (mappings[id] && availableCovers.includes(mappings[id])) {
        return '/images/books/' + mappings[id];
    }

    // Try to find a partial match
    const partialMatch = availableCovers.find(c => c.includes(id) || id.includes(c.split('.')[0]));
    if (partialMatch) {
        return '/images/books/' + partialMatch;
    }

    return '/images/books/default-book.jpg';
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let fixedContent = content.replace(/id:\s*['"]([^'"]+)['"][\s\S]*?coverUrl:\s*['"]([^'"]+)['"]/g, (match, id, oldCover) => {
        const newCover = findCover(id);
        return match.replace(oldCover, newCover);
    });
    fs.writeFileSync(filePath, fixedContent, 'utf8');
}

processFile(path.join(__dirname, 'src/features/library/data/classicBooks.ts'));
processFile(path.join(__dirname, 'src/features/library/data/moreBooks.ts'));
