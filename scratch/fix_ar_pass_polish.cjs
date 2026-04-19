const fs = require('fs');

const arPath = 'src/locales/ar.ts';
let content = fs.readFileSync(arPath, 'utf8');

const t = {
  "A complete MBA for kids. Master 10 modules—from Money Basics to AI & Leadership—through interactive lessons and real-world simulations.": "ماجستير إدارة أعمال كامل للأطفال. أتقن 10 وحدات - من أساسيات المال إلى الذكاء الاصطناعي والقيادة - من خلال دروس تفاعلية ومحاكاة واقعية.",
};

Object.keys(t).forEach(eng => {
  const regex = new RegExp(":\\s*['\"]" + eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "['\"]", 'g');
  content = content.replace(regex, ": '" + t[eng] + "'");
});

fs.writeFileSync(arPath, content, 'utf8');
console.log('Final Polish Arabic translation complete.');
