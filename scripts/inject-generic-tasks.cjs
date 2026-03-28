const fs = require('fs');
const path = require('path');

function injectTasks(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const idRegex = /id:\s*"([^"]+)",\s*title:\s*"([^"]+)"/g;
    let match;
    const booksInfo = [];
    while ((match = idRegex.exec(content)) !== null) {
        booksInfo.push({ id: match[1], title: match[2], index: match.index });
    }
    
    console.log(`Matched ${booksInfo.length} books in ${path.basename(filePath)}`);
    
    let modifiedContent = content;
    let addedCount = 0;
    
    for (let curr = booksInfo.length - 1; curr >= 0; curr--) {
        const book = booksInfo[curr];
        const nextBook = booksInfo[curr + 1];
        
        const blockStartIndex = book.index;
        const nextBlockStartIndex = nextBook ? nextBook.index : modifiedContent.length;
        
        const blockText = modifiedContent.substring(blockStartIndex, nextBlockStartIndex);
        
        if (blockText.includes('tasks: [')) {
            console.log(`Skipping ${book.id} - already has tasks`);
            continue;
        }
        
        const keyLessonsIndex = blockText.indexOf('keyLessons:');
        if (keyLessonsIndex === -1) {
            console.log(`Skipping ${book.id} - no keyLessons found`);
            continue;
        }
        
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
