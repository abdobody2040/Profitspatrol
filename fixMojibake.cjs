const fs = require('fs');

function fixMojibake(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error("File not found:", filePath);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Attempt perfect Buffer reverse:
    try {
        let buf = Buffer.from(content, 'latin1');
        let fixedContent = buf.toString('utf8');
        
        // Let's check if the fixed content makes sense
        if (fixedContent.includes('🐐') || fixedContent.includes('📌') || fixedContent.includes('🏆')) {
            fs.writeFileSync(filePath, fixedContent, 'utf8');
            return;
        }
    } catch(e) {}
    
    // Fallback manual dictionary:
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
    } else {
        console.log('No changes needed:', filePath);
    }
}

fixMojibake('src/locales/en.ts');
fixMojibake('src/locales/ar.ts');
fixMojibake('src/locales/ar.ts.bak');
