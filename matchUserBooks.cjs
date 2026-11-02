const fs = require('fs');
const path = require('path');
const userList = `Zero to One (Teen Edition)
How to Turn $100 into $1,000,000
Better Than a Lemonade Stand
Do Hard Things
I Am Malala (Young Readers Edition)
Hidden Figures Young Readers' Edition
Max Einstein: The Genius Experiment
George's Secret Key to the Universe
A Long Walk to Water
The Crossover
Ender's Game
Teen Entrepreneur Toolbox
Kid CEO
The Young Entrepreneur's Guide to Starting and Running a Business
The Phantom Tollbooth
Money Ninja
The Lemonade War
Rock, Brock and the Savings Shock
Stack Your Money
The Total Money Makeover (Teen Edition)
Broke Millennial
Make Your Kid a Money Genius
The Richest Kid in the World
Young Money
Money Can Buy Happiness
Grit (Young Reader's Edition)
The Power of Yet
You Are a Badass (Teen Edition)
The 5 AM Club (Teen Edition)
The Energy Bus for Kids
Growth Mindset Coach
Can't Hurt Me (Teen Edition)
The Lion, the Witch and the Wardrobe
Matilda
James and the Giant Peach
The Hobbit
Charlotte's Web
Alice's Adventures in Wonderland
The Little Prince
Treasure Island
Harry Potter and the Sorcerer's Stone
The Giver
Peter Pan
A Wrinkle in Time
The Wonderful Wizard of Oz
The Richest Man in Babylon (For Teens)
Rich Kid, Smart Kid
I Will Teach You to Be Rich (Teen Edition)
The Motley Fool Investment Guide for Teens
Make Your Bed
Extreme Ownership
The 7 Habits of Highly Effective Teens
The Hunger Games
Dune
Fahrenheit 451
1984
Brave New World
The Martian
Ready Player One
Snow Crash
The Time Machine
Foundation
I, Robot
The Hitchhiker's Guide to the Galaxy
Animal Farm
Barbarians at the Gate
Bad Blood
Shoe Dog
The Everything Store
Too Big to Fail
The Big Short
Steve Jobs
Flash Boys
Liar's Poker
DisneyWar
Hatching Twitter
Super Pumped
Red Notice
Billion Dollar Whale
How to Win Friends and Influence People
Start with Why
Good to Great
The Art of War
Thinking, Fast and Slow
The Lean Startup`.split('\n');

const dataDir = 'src/features/library/data';
const found = [];

fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith('.ts') || file.endsWith('.js')) {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    
    userList.forEach(title => {
      // Find the object with this title
      const regex = new RegExp(`id:\\s*['"]([^'"]+)['"],\\s*title:\\s*['"]${title.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&')}['"]`, 'i');
      const match = regex.exec(content);
      if (match) {
        if (!found.find(f => f.id === match[1])) {
          found.push({ title, id: match[1] });
        }
      } else {
        // Try to match just title roughly if regex failed
        const lines = content.split('\\n');
        for (let i=0; i<lines.length; i++) {
          if (lines[i].includes(`title: "${title}"`) || lines[i].includes(`title: '${title}'`)) {
            let j = i;
            while(j >= Math.max(0, i-5)) {
               if (lines[j].includes('id:')) {
                  const idMatch = lines[j].match(/id:\s*['"]([^'"]+)['"]/);
                  if (idMatch && !found.find(f => f.id === idMatch[1])) {
                     found.push({ title, id: idMatch[1] });
                  }
                  break;
               }
               j--;
            }
          }
        }
      }
    });
  }
});

fs.writeFileSync('user_books_ids.json', JSON.stringify(found, null, 2));
