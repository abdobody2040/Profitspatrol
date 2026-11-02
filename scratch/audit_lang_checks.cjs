const fs = require('fs');

function search(d) {
  const results = [];
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = d + '/' + f.name;
    if (f.isDirectory() && !p.includes('node_modules') && !p.includes('.git')) {
      results.push(...search(p));
    } else if (/\.(tsx|ts)$/.test(f.name) && !p.includes('.test.')) {
      const c = fs.readFileSync(p, 'utf8');
      const lines = c.split('\n');
      lines.forEach((l, i) => {
        if (/=== ['"](ar|en)['"]|language ===|isArabic|isAr\b/.test(l)) {
          results.push(`${p}:${i + 1}: ${l.trim()}`);
        }
      });
    }
  }
  return results;
}

const hits = search('src');
console.log('Total hits:', hits.length);
hits.slice(0, 40).forEach(h => console.log(h));

