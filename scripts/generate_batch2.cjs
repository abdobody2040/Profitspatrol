const fs = require('fs');
const path = require('path');

// Gemini API configuration
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const batch2 = [
    { id: "turn-100-into-1000000", title: "How to Turn $100 into $1,000,000", author: "James McKenna", category: "Finance", ageRating: "10+", coverUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80" },
    { id: "better-than-lemonade-stand", title: "Better Than a Lemonade Stand", author: "Daryl Bernstein", category: "Strategy", ageRating: "8+", coverUrl: "https://images.unsplash.com/photo-1543083616-64bcbd4a7dca?w=400&q=80" },
    { id: "teen-entrepreneur-toolbox", title: "Teen Entrepreneur Toolbox", author: "Anthony ONeal", category: "Strategy", ageRating: "12+", coverUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80" },
    { id: "kid-ceo-pp", title: "Kid CEO", author: "Kevin Carroll", category: "Leadership", ageRating: "10+", coverUrl: "https://images.unsplash.com/photo-1510565809798-26217466dc0f?w=400&q=80" },
    { id: "young-entrepreneurs-guide", title: "The Young Entrepreneur's Guide", author: "Steve Mariotti", category: "Strategy", ageRating: "12+", coverUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80" },
    { id: "do-hard-things-pp", title: "Do Hard Things", author: "Alex & Brett Harris", category: "Mindset", ageRating: "12+", coverUrl: "https://images.unsplash.com/photo-1515234585145-6678ab263de7?w=400&q=80" },
    { id: "i-am-malala-yr", title: "I Am Malala (YR Edition)", author: "Malala Yousafzai", category: "Biography", ageRating: "10+", coverUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80" },
    { id: "a-long-walk-to-water", title: "A Long Walk to Water", author: "Linda Sue Park", category: "Biography", ageRating: "10+", coverUrl: "https://images.unsplash.com/photo-1521742113222-19c2fb37ebb1?w=400&q=80" },
    { id: "hidden-figures-yr", title: "Hidden Figures Young Readers", author: "Margot Lee Shetterly", category: "Biography", ageRating: "10+", coverUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80" },
    { id: "i-robot-kids", title: "I, Robot (Stories for Kids)", author: "Isaac Asimov adapted", category: "Creativity", ageRating: "12+", coverUrl: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=400&q=80" },
    { id: "the-crossover", title: "The Crossover", author: "Kwame Alexander", category: "Fiction", ageRating: "10+", coverUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80" },
    { id: "max-einstein", title: "Max Einstein: The Genius Experiment", author: "Patterson & Grabenstein", category: "Creativity", ageRating: "8+", coverUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&q=80" },
    { id: "georges-secret-key", title: "George's Secret Key to the Universe", author: "Lucy & Stephen Hawking", category: "Creativity", ageRating: "8+", coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80" },
    { id: "enders-game-yr-pp", title: "Ender's Game (YR)", author: "Orson Scott Card", category: "Strategy", ageRating: "12+", coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80" }
];

async function generateBookContent(book) {
    const prompt = 'Use the following book details to produce an educational summary for kids/teens in a platform called Profits Patrol.\nTitle: "' + book.title + '"\nAuthor: "' + book.author + '"\n\nGenerate the following in JSON format:\n\n1. A "summary" (string): 1 sentence engaging summary.\n2. "fullContent" (string): A ~500-word highly engaging, markdown-formatted reading module. Use headers (## 🚀 Section Name), bullet points, and emojis.\n3. "keyLessons" (array of 3 strings): The biggest takeaways.\n4. "quiz": 2 multiple-choice questions about the book content, each with 4 string options and a 0-indexed "correctAnswer".\n5. "reflection": 1 reflection prompt, and "minWords" parameter (default 30).\n6. "actionChallenge": 1 action challenge with 3 practical steps (array of strings) and 3 checkpoints (array of strings).\n\nReturn ONLY valid JSON in this exact structure:\n{\n  "summary": "...",\n  "fullContent": "## 🚀 Welcome\\n...",\n  "keyLessons": ["...", "...", "..."],\n  "quiz": { "questions": [ { "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0 } ] },\n  "reflection": { "prompt": "...", "minWords": 30 },\n  "actionChallenge": { "steps": ["1", "2", "3"], "checkpoints": ["1", "2", "3"] }\n}';

    try {
        const response = await fetch(GEMINI_API_URL + '?key=' + GEMINI_API_KEY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
            })
        });

        if (!response.ok) throw new Error('API error: ' + response.status);
        const data = await response.json();
        let text = data.candidates[0].content.parts[0].text;

        let jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found in response');

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('❌ Error generating content for "' + book.title + '":', error.message);
        return null;
    }
}

async function run() {
    let output = '';
    for (const book of batch2) {
        console.log('Generating for ' + book.title + '...');
        const content = await generateBookContent(book);
        if (content) {
            output += '  {\n' +
                '    id: "' + book.id + '",\n' +
                '    title: "' + book.title + '",\n' +
                '    author: "' + book.author + '",\n' +
                '    coverUrl: "' + book.coverUrl + '",\n' +
                '    category: "' + book.category + '",\n' +
                '    ageRating: "' + book.ageRating + '",\n' +
                '    summary: "' + content.summary.replace(/"/g, '\\"') + '",\n' +
                '    fullContent: `' + content.fullContent + '`,\n' +
                '    keyLessons: ' + JSON.stringify(content.keyLessons, null, 6).replace(/]$/, '    ]') + ',\n' +
                '    tasks: [\n' +
                '      {\n' +
                '        id: "' + book.id + '-quiz-1",\n' +
                '        bookId: "' + book.id + '",\n' +
                '        type: "quiz",\n' +
                '        title: "Knowledge Check",\n' +
                '        description: "Test your understanding",\n' +
                '        rewards: { xp: 50, coins: 25 },\n' +
                '        difficulty: "easy",\n' +
                '        estimatedMinutes: 5,\n' +
                '        quiz: ' + JSON.stringify(content.quiz, null, 8).replace(/]$/, '        ]') + '\n' +
                '      },\n' +
                '      {\n' +
                '        id: "' + book.id + '-reflection-1",\n' +
                '        bookId: "' + book.id + '",\n' +
                '        type: "reflection",\n' +
                '        title: "Deep Dive",\n' +
                '        description: "Reflect on the lessons",\n' +
                '        rewards: { xp: 40, coins: 20 },\n' +
                '        difficulty: "medium",\n' +
                '        estimatedMinutes: 10,\n' +
                '        reflection: ' + JSON.stringify(content.reflection, null, 8).replace(/]$/, '        ]') + '\n' +
                '      },\n' +
                '      {\n' +
                '        id: "' + book.id + '-action-1",\n' +
                '        bookId: "' + book.id + '",\n' +
                '        type: "action_challenge",\n' +
                '        title: "Take Action",\n' +
                '        description: "Apply what you learned",\n' +
                '        rewards: { xp: 60, coins: 30 },\n' +
                '        difficulty: "hard",\n' +
                '        estimatedMinutes: 20,\n' +
                '        actionChallenge: ' + JSON.stringify(content.actionChallenge, null, 8).replace(/]$/, '        ]') + '\n' +
                '      }\n' +
                '    ]\n' +
                '  },\n';
        }
        await new Promise(r => setTimeout(r, 2000));
    }

    fs.writeFileSync('batch2_output.ts', output);
    console.log('Saved to batch2_output.ts');
}

run();
