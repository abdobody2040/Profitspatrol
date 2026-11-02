const fs = require('fs');

// 1. Fix src/app/App.tsx routeMap
const appPath = 'src/app/App.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

const targetApp = `        const routeMap: Record<string, string> = {
            'the_tank': '/the-tank',
            'map': '/map',
            'assignments': '/assignments',
            'games': '/games',
            'library': '/library',
            'store': '/store',
            'leaderboard': '/leaderboard',
            'hq': '/hq',
            'skills': '/skills',
            'portfolio': '/portfolio',
            'profile': '/profile',
            'parent_dashboard': '/dashboard',
            'teacher_dashboard': user?.subscriptionTier?.startsWith('school_') ? '/principal' : '/classroom',
            'admin_dashboard': '/admin',
            'debate': '/debate',
            'videos': '/videos',
            'card-academy': '/card-academy',
            'side-hustle': '/side-hustle',
            'real-estate': '/real-estate',
            'social': '/social'
        };`;

const replacementApp = `        const routeMap: Record<string, string> = {
            'the_tank': '/the-tank',
            'map': '/map',
            'assignments': '/assignments',
            'missions': '/assignments',
            'quests': '/assignments',
            'games': '/games',
            'play': '/games',
            'arcade': '/games',
            'library': '/library',
            'store': '/store',
            'leaderboard': '/leaderboard',
            'hq': '/hq',
            'skills': '/skills',
            'portfolio': '/portfolio',
            'profile': '/profile',
            'me': '/profile',
            'parent_dashboard': '/dashboard',
            'teacher_dashboard': user?.subscriptionTier?.startsWith('school_') ? '/principal' : '/classroom',
            'admin_dashboard': '/admin',
            'debate': '/debate',
            'videos': '/videos',
            'card-academy': '/card-academy',
            'side-hustle': '/side-hustle',
            'real-estate': '/real-estate',
            'social': '/social'
        };`;

if (appContent.includes("'the_tank': '/the-tank'")) {
    appContent = appContent.replace(targetApp.replace(/\r\n/g, '\n'), replacementApp.replace(/\r\n/g, '\n'));
    // In case CRLF was present
    appContent = appContent.replace(targetApp, replacementApp);
    fs.writeFileSync(appPath, appContent, 'utf8');
    console.log('App.tsx routeMap updated successfully');
} else {
    console.log('Target not found in App.tsx');
}

// 2. Fix Layout.tsx: Remove NewsTicker from parent layout
const layoutPath = 'src/components/layout/Layout.tsx';
let layoutContent = fs.readFileSync(layoutPath, 'utf8');

const newsTickerBlock = `        {/* News Ticker (parent only) & Intern Ad Banner */}
        {isParent && (
          <div className="absolute left-0 right-0 w-full z-[190] bottom-[72px] flex flex-col">
            <NewsTicker />
          </div>
        )}`;

layoutContent = layoutContent.replace(newsTickerBlock.replace(/\r\n/g, '\n'), '        {/* News Ticker removed per user request */}');
layoutContent = layoutContent.replace(newsTickerBlock, '        {/* News Ticker removed per user request */}');
fs.writeFileSync(layoutPath, layoutContent, 'utf8');
console.log('Layout.tsx updated: NewsTicker removed for parents');
