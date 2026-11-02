const fs = require('fs');
const filePath = 'src/features/auth/components/Auth.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const target = `<span>🧒</span> Kid`;
const replacement = `<span>🧒</span> Junior (7y)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateField('username', 'maya10@profits.com');
                                                updateField('password', 'Password123!');
                                            }}
                                            className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <span>🚀</span> Explorer (10y)`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully updated Auth.tsx with Explorer test button!');
} else {
    console.error('Target not found in Auth.tsx');
}
