const fs = require('fs');

const fileContent = fs.readFileSync('g:\\Vibe coding\\Profitspatrol\\src\\features\\education\\data\\curriculum.ts', 'utf8');

const match = fileContent.match(/const RAW_DATA = (\[[\s\S]*?\]);\s*export const ALL_LESSONS/);
if (match) {
  const rawDataString = match[1];
  const rawData = eval('(' + rawDataString + ')');
  
  let mdContent = '# Profits Patrol Lessons (For Video Conversion)\n\n';
  mdContent += 'This document contains all the lessons extracted from the application to be converted into videos.\n\n';
  
  // Group by topic_tag
  const groupedLessons = {};
  rawData.forEach(lesson => {
    if (!groupedLessons[lesson.topic_tag]) {
      groupedLessons[lesson.topic_tag] = [];
    }
    groupedLessons[lesson.topic_tag].push(lesson);
  });
  
  for (const topic in groupedLessons) {
    mdContent += `## Module: ${topic}\n\n`;
    groupedLessons[topic].forEach(lesson => {
      mdContent += `### Lesson ${lesson.id}: ${lesson.lesson_payload.headline}\n\n`;
      mdContent += `**Difficulty:** Level ${lesson.difficulty}\n\n`;
      mdContent += `**Script / Content:**\n> ${lesson.lesson_payload.body_text}\n\n`;
      mdContent += `**Key Term:** ${lesson.lesson_payload.key_term}\n\n`;
      mdContent += `**Quiz Element (For Engagement):**\n`;
      mdContent += `- *Question:* ${lesson.challenge_payload.question_text}\n`;
      mdContent += `- *Correct Answer:* ${lesson.challenge_payload.correct_answer}\n`;
      mdContent += `- *Wrong Options:* ${lesson.challenge_payload.distractors.join(' | ')}\n\n`;
      mdContent += `**Flavor Text / Outro:**\n*${lesson.flavor_text}*\n\n`;
      mdContent += `---\n\n`;
    });
  }
  
  fs.writeFileSync('g:\\Vibe coding\\Profitspatrol\\lessons_for_videos.md', mdContent);
} else {
  console.error('Failed to find RAW_DATA');
}
