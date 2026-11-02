import * as fs from 'fs';

const logPath = 'C:\\Users\\ABDO\\.gemini\\antigravity-ide\\brain\\139000c0-de95-4f5c-8750-03775f2a0f66\\.system_generated\\logs\\transcript.jsonl';

function parseLogs() {
    if (!fs.existsSync(logPath)) {
        console.error('File not found:', logPath);
        return;
    }

    const lines = fs.readFileSync(logPath, 'utf8').split('\n');

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const foundEmails = new Set();
    const foundCredentials = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        try {
            const entry = JSON.parse(line);
            const contentStr = JSON.stringify(entry);

            // Search for email-like strings
            const emails = contentStr.match(emailRegex);
            if (emails) {
                emails.forEach(e => {
                    if (!e.includes('git') && !e.includes('npm') && !e.includes('coppa') && !e.includes('cozy') && !e.includes('juicy')) {
                        foundEmails.add(e);
                    }
                });
            }

            // Look for password context
            if (contentStr.toLowerCase().includes('password') && (contentStr.toLowerCase().includes('login') || contentStr.toLowerCase().includes('sign'))) {
                foundCredentials.push({
                    step: entry.step_index,
                    source: entry.source,
                    type: entry.type,
                    snippet: contentStr.substring(0, 500) // snippet
                });
            }
        } catch (e) {
            // Ignore parse errors on malformed lines
        }
    }

}

parseLogs();
