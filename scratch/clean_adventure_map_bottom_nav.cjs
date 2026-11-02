const fs = require('fs');
const path = require('path');

// 1. Remove duplicate BottomNav from AdventureMap.tsx
const mapPath = path.resolve('src/features/hq/components/AdventureMap.tsx');
let mapContent = fs.readFileSync(mapPath, 'utf8');

const oldBottomNavInMap = `      {/* Bottom Navigation */}
      <BottomNav activeTab="map" onNavigate={onNavigate} />`;

mapContent = mapContent.replace(oldBottomNavInMap, '');
mapContent = mapContent.replace(oldBottomNavInMap.replace(/\n/g, '\r\n'), '');

fs.writeFileSync(mapPath, mapContent, 'utf8');
console.log('AdventureMap.tsx: removed duplicate BottomNav');

// 2. Ensure BottomNav.tsx is visible on all screen sizes (remove md:hidden)
const bottomNavPath = path.resolve('src/features/ageMode/components/BottomNav.tsx');
let bottomNavContent = fs.readFileSync(bottomNavPath, 'utf8');

bottomNavContent = bottomNavContent.replace('sm:h-[80px] md:hidden"', 'sm:h-[80px]"');

fs.writeFileSync(bottomNavPath, bottomNavContent, 'utf8');
console.log('BottomNav.tsx: ensured visibility across all devices');
