const fs = require('fs');
const path = require('path');

function injectTasks(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Split the file into individual book blocks using the id: property
    // But we need to keep everything intact.
    
    // Instead of splitting, let's use a regex that matches a whole book object up to the end of keyLessons or end of tasks
    // Since some have tasks and some don't, we can match:
    // id: "(.*?)"\s*,\s*title: "(.*?)"
    
    // Let's iterate over all book IDs
    const idRegex = /id:\s*"([^"]+)",\s*title:\s*"([^"]+)"/g;
    let match;
    const booksInfo = [];
    while ((match = idRegex.exec(content)) !== null) {
        booksInfo.push({ id: match[1], title: match[2], index: match.index });
    }
    
    let modifiedContent = content;
    let addedCount = 0;
    
    for (const book of booksInfo) {
        // Find the block of text from this book's id to the next book's id (or end of file)
        const blockStartIndex = modifiedContent.indexOf(`id: "${book.id}"`);
        const nextBook = booksInfo.find(b => b.id !== book.id && modifiedContent.indexOf(`id: "${b.id}"`) > blockStartIndex);
        const nextBlockStartIndex = nextBook ? modifiedContent.indexOf(`id: "${nextBook.id}"`) : modifiedContent.length;
        
        const blockText = modifiedContent.substring(blockStartIndex, nextBlockStartIndex);
        
        // Check if this book already has tasks
        if (blockText.includes('tasks: [')) {
            continue;
        }
        
        // Find the keyLessons array end
        // keyLessons: [ ... ]
        // We need to find the closing bracket of keyLessons for this book
        const keyLessonsIndex = blockText.indexOf('keyLessons:');
        if (keyLessonsIndex === -1) {
            console.log(`Skipping ${book.id} - no keyLessons found`);
            continue;
        }
        
        // Find the ] that closes keyLessons
        let bracketCount = 0;
        let foundBracket = false;
        let keyLessonsEndIndex = -1;
        
        for (let i = keyLessonsIndex; i < blockText.length; i++) {
            if (blockText[i] === '[') {
                bracketCount++;
                foundBracket = true;
            } else if (blockText[i] === ']') {
                bracketCount--;
                if (foundBracket && bracketCount === 0) {
                    keyLessonsEndIndex = i;
                    break;
                }
            }
        }
        
        if (keyLessonsEndIndex === -1) {
            console.log(`Skipping ${book.id} - couldn't find end of keyLessons`);
            continue;
        }
        
        // Insert tasks right after keyLessons
        // We know it ends with ]
        // Does the ] have a newline after it?
        
        const tasksString = `,
    tasks: [
      {
        id: "${book.id}-quiz-1",
        bookId: "${book.id}",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand ${book.title.replace(/"/g, '\\"')}?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is the primary goal of reading this book?",
              options: [
                "To learn new strategies and improve my mindset",
                "To memorize every single page",
                "To skip to the end",
                "To look at the pictures"
              ],
              correctAnswer: 0
            },
            {
              question: "How should you apply the lessons from this book?",
              options: [
                "Only think about them",
                "Apply them daily in real life",
                "Tell someone else to do it",
                "Forget about them after reading"
              ],
              correctAnswer: 1
            }
          ]
        }
      },
      {
        id: "${book.id}-reflection-1",
        bookId: "${book.id}",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from '${book.title.replace(/"/g, '\\"')}' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "${book.id}-action-1",
        bookId: "${book.id}",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from ${book.title.replace(/"/g, '\\"')}",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      }
    ]`;

        const newBlockText = blockText.substring(0, keyLessonsEndIndex + 1) + tasksString + blockText.substring(keyLessonsEndIndex + 1);
        
        modifiedContent = modifiedContent.substring(0, blockStartIndex) + newBlockText + modifiedContent.substring(nextBlockStartIndex);
        addedCount++;
    }
    
    fs.writeFileSync(filePath, modifiedContent);
    console.log(`Added tasks to ${addedCount} books in ${path.basename(filePath)}`);
}

injectTasks('src/features/library/data/classicBooks.ts');
injectTasks('src/features/library/data/moreBooks.ts');
