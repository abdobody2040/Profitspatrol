const fs = require('fs');
const path = require('path');

// 1. Update Layout.tsx - remove NewsTicker
const layoutPath = path.resolve('src/components/layout/Layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');

layoutContent = layoutContent.replace(/import NewsTicker from '\.\.\/\.\.\/features\/game\/components\/NewsTicker';\r?\n/, '');

const newsTickerBlockRegex = /\{\/\* News Ticker \(parent only\) & Intern Ad Banner \*\/\}\r?\n\s*\{isParent && \(\r?\n\s*<div className="absolute left-0 right-0 w-full z-\[190\] bottom-\[72px\] flex flex-col">\r?\n\s*<NewsTicker \/>\r?\n\s*<\/div>\r?\n\s*\)\}/;
layoutContent = layoutContent.replace(newsTickerBlockRegex, '{/* Intern Ad Banner */}');

fs.writeFileSync(layoutPath, layoutContent, 'utf8');
console.log('Layout.tsx updated successfully');

// 2. Update App.tsx - extend routeMap
const appPath = path.resolve('src/app/App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');

const oldRouteMap = `'the_tank': '/the-tank',
            'map': '/map',
            'assignments': '/assignments',
            'games': '/games',
            'library': '/library',
            'store': '/store',
            'leaderboard': '/leaderboard',
            'hq': '/hq',
            'skills': '/skills',
            'portfolio': '/portfolio',
            'profile': '/profile',`;

const newRouteMap = `'the_tank': '/the-tank',
            'the-tank': '/the-tank',
            'map': '/map',
            'assignments': '/assignments',
            'missions': '/assignments',
            'quests': '/assignments',
            'tasks': '/assignments',
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
            'me': '/profile',`;

if (appContent.includes(oldRouteMap)) {
  appContent = appContent.replace(oldRouteMap, newRouteMap);
  fs.writeFileSync(appPath, appContent, 'utf8');
  console.log('App.tsx routeMap updated successfully');
} else {
  // Try CRLF replacement
  const oldRouteMapCRLF = oldRouteMap.replace(/\n/g, '\r\n');
  const newRouteMapCRLF = newRouteMap.replace(/\n/g, '\r\n');
  if (appContent.includes(oldRouteMapCRLF)) {
    appContent = appContent.replace(oldRouteMapCRLF, newRouteMapCRLF);
    fs.writeFileSync(appPath, appContent, 'utf8');
    console.log('App.tsx routeMap (CRLF) updated successfully');
  } else {
    console.warn('Could not find oldRouteMap in App.tsx');
  }
}

// 3. Update BottomNav.tsx
const bottomNavPath = path.resolve('src/features/ageMode/components/BottomNav.tsx');
let bottomNavContent = fs.readFileSync(bottomNavPath, 'utf8');

// Replace currentTab calculation
const oldCurrentTab = `  const currentTab = activeTab || (
    location.pathname.includes('/map') ? 'map' :
    location.pathname.includes('/games') || location.pathname.includes('/the-tank') || location.pathname.includes('/real-estate') ? 'play' :
    location.pathname.includes('/missions') ? 'missions' :
    location.pathname.includes('/profile') ? 'me' : 'map'
  );`;

const newCurrentTab = `  const currentTab = (() => {
    const raw = activeTab || '';
    if (raw === 'map' || (!raw && location.pathname.includes('/map'))) return 'map';
    if (['games', 'play', 'arcade', 'the-tank', 'the_tank', 'real-estate'].includes(raw) || (!raw && (location.pathname.includes('/games') || location.pathname.includes('/the-tank') || location.pathname.includes('/real-estate')))) return 'play';
    if (['assignments', 'missions', 'quests', 'tasks'].includes(raw) || (!raw && (location.pathname.includes('/assignments') || location.pathname.includes('/missions')))) return 'missions';
    if (['profile', 'me'].includes(raw) || (!raw && location.pathname.includes('/profile'))) return 'me';
    return raw || 'map';
  })();`;

// Also update handleTabClick
const oldHandleTabClick = `    if (onNavigate) {
      onNavigate(tabId);
    } else {
      navigate(route);
    }`;

const newHandleTabClick = `    if (onNavigate) {
      onNavigate(tabId);
    }
    navigate(route);`;

bottomNavContent = bottomNavContent.replace(oldCurrentTab, newCurrentTab);
bottomNavContent = bottomNavContent.replace(oldCurrentTab.replace(/\n/g, '\r\n'), newCurrentTab.replace(/\n/g, '\r\n'));
bottomNavContent = bottomNavContent.replace(oldHandleTabClick, newHandleTabClick);
bottomNavContent = bottomNavContent.replace(oldHandleTabClick.replace(/\n/g, '\r\n'), newHandleTabClick.replace(/\n/g, '\r\n'));

fs.writeFileSync(bottomNavPath, bottomNavContent, 'utf8');
console.log('BottomNav.tsx updated successfully');
