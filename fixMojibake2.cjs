const fs = require('fs');
const path = require('path');

function fixMojibake(filePath) {
    if (!fs.existsSync(filePath)) {
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    const map = {
        'ðŸ  ': '🐐', 'ðŸ“ ': '📌', 'ðŸ¤ ': '🤝', 'ðŸ‘¥': '👥', 'âš¡': '⚡', 'ðŸ“¦': '📦', 'ðŸ¤–': '🤖', 
        'ðŸ ›ï¸ ': '🗄️', 'ðŸ †': '🏆', 'ðŸš¦': '🚦', 'ðŸ”‹': '🔋', 'ðŸŒ ': '🌍', '🔄': '🔄', 'ðŸ  ': '🏠', 
        'ðŸŽ™ï¸ ': '🎙️', 'ðŸ›¡ï¸ ': '🛡️', 'ðŸ‘‘': '👑', 'ðŸ“ˆ': '📈', 'ðŸŒ±': '🌱', 'ðŸŽ‰': '🎉', 'ðŸ¦ˆ': '🦈', 
        'ðŸ’¡': '💡', 'ðŸ“Š': '📊', 'ðŸš€': '🚀', 'ðŸŽ¨': '🎨', 'ðŸ’Ž': '💎', 'â†’': '→'
    };
    
    let replaced = content;
    for (const [bad, good] of Object.entries(map)) {
        replaced = replaced.split(bad).join(good);
    }
    
    if (replaced !== content) {
        fs.writeFileSync(filePath, replaced, 'utf8');
    }
}

const arDir = 'src/locales/ar';
if (fs.existsSync(arDir)) {
    fs.readdirSync(arDir).forEach(file => {
        if (file.endsWith('.ts')) {
            fixMojibake(path.join(arDir, file));
        }
    });
}
