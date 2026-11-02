const fs = require('fs');
const filePath = 'src/features/admin/components/AdminDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace Supabase terminology with Laravel Backend
content = content.replace(/Syncing with Supabase\.\.\./g, 'Syncing with Backend...');
content = content.replace(/● Supabase Live/g, '● Laravel Backend Live');
content = content.replace(/title="Refresh from Supabase"/g, 'title="Refresh from Backend"');
content = content.replace(/This data comes directly from Supabase\. Users register through the app sign-up flow\./g, 'This data comes directly from the Laravel persistence API & SQLite backend database.');
content = content.replace(/Refresh from Supabase/g, 'Refresh from Backend');
content = content.replace(/refreshFromSupabase/g, 'refreshFromBackend');
content = content.replace(/Connect to Supabase to persist rubrics across sessions\./g, 'Connect to Laravel API to persist rubrics across sessions.');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated Supabase labels in AdminDashboard.tsx');
