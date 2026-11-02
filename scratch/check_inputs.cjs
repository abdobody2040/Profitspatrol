const fs = require('fs');
const readline = require('readline');
const stream = fs.createReadStream('C:/Users/ABDO/.gemini/antigravity-ide/brain/35a5ddef-1b62-499a-b0bd-4d4728730ea0/.system_generated/logs/transcript.jsonl');
const rl = readline.createInterface({ input: stream });
const inputs = [];
rl.on('line', (line) => {
  if (line.includes('"USER_INPUT"')) {
    inputs.push(line);
  }
});
rl.on('close', () => {
  console.log('Total user inputs:', inputs.length);
  inputs.slice(-5).forEach(i => {
    try {
      const obj = JSON.parse(i);
      console.log('--- Step', obj.step_index, '---');
      console.log(obj.content);
    } catch(e) {
      console.log(i.substring(0, 200));
    }
  });
});
