const fs = require('fs');
const path = require('path');

// 1. Update Layout.tsx: enable desktop sidebar for everyone on desktop
const layoutPath = path.resolve('src/components/layout/Layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');

const oldSidebar = `{/* DESKTOP SIDEBAR - Replaced with BottomNav for kids */}
      {!isKid && (
        <nav className={\`hidden md:flex w-64 bg-white dark:bg-gray-800 border-e border-gray-200 dark:border-gray-700 p-4 flex-col h-full z-20 \${isIntern ? 'pb-16' : ''}\`}>
          {renderNavContent()}
        </nav>
      )}`;

const newSidebar = `{/* DESKTOP SIDEBAR - Always available on desktop screens */}
      <nav className={\`hidden md:flex w-64 bg-white dark:bg-gray-800 border-e border-gray-200 dark:border-gray-700 p-4 flex-col h-full z-20 shrink-0 \${isIntern ? 'pb-16' : ''}\`}>
        {renderNavContent()}
      </nav>`;

layoutContent = layoutContent.replace(oldSidebar, newSidebar);
layoutContent = layoutContent.replace(oldSidebar.replace(/\n/g, '\r\n'), newSidebar.replace(/\n/g, '\r\n'));

fs.writeFileSync(layoutPath, layoutContent, 'utf8');
console.log('Layout.tsx updated: desktop sidebar enabled for all roles on desktop');

// 2. Update BottomNav.tsx: hide on desktop (md:hidden) since desktop has full sidebar
const bottomNavPath = path.resolve('src/features/ageMode/components/BottomNav.tsx');
let bottomNavContent = fs.readFileSync(bottomNavPath, 'utf8');

const oldNavTag = `      <nav
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 shadow-[0_-8px_25px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom,0px)] h-[72px] sm:h-[80px]"
      >`;

const newNavTag = `      <nav
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 shadow-[0_-8px_25px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom,0px)] h-[72px] sm:h-[80px] md:hidden"
      >`;

bottomNavContent = bottomNavContent.replace(oldNavTag, newNavTag);
bottomNavContent = bottomNavContent.replace(oldNavTag.replace(/\n/g, '\r\n'), newNavTag.replace(/\n/g, '\r\n'));

fs.writeFileSync(bottomNavPath, bottomNavContent, 'utf8');
console.log('BottomNav.tsx updated: added md:hidden for clean desktop layout');

// 3. Update UserProfile.tsx: add Logout button and quick section links
const profilePath = path.resolve('src/features/dashboard/components/UserProfile.tsx');
let profileContent = fs.readFileSync(profilePath, 'utf8');

// Ensure LogOut icon is imported
if (!profileContent.includes('LogOut')) {
  profileContent = profileContent.replace(
    'import { Briefcase, Rocket',
    'import { LogOut, Briefcase, Rocket'
  );
}

// Ensure useAppStore provides logout
if (!profileContent.includes('logout } = useAppStore();') && profileContent.includes('{ user, toggleEquipItem } = useAppStore();')) {
  profileContent = profileContent.replace(
    '{ user, toggleEquipItem } = useAppStore();',
    '{ user, toggleEquipItem, logout } = useAppStore();'
  );
}

// Add Logout button in top preference bar
const oldPrefBarEnd = `                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
                        title={t('settings.title', 'الإعدادات')}
                    >
                        <SettingsIcon className="w-5 h-5" />
                    </button>
                </div>`;

const newPrefBarEnd = `                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
                        title={t('settings.title', 'الإعدادات')}
                    >
                        <SettingsIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm(i18n.language.startsWith('ar') ? 'هل تريد تسجيل الخروج؟' : 'Are you sure you want to sign out?')) {
                                logout();
                                navigate('/login');
                            }
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-black transition-colors"
                        title={t('nav.signout', 'تسجيل الخروج')}
                    >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav.signout', 'خروج')}</span>
                    </button>
                </div>`;

profileContent = profileContent.replace(oldPrefBarEnd, newPrefBarEnd);
profileContent = profileContent.replace(oldPrefBarEnd.replace(/\n/g, '\r\n'), newPrefBarEnd.replace(/\n/g, '\r\n'));

// Add Bottom prominent Logout button
const oldBottomTag = `            {showJoinClass && <JoinClassModal onClose={() => setShowJoinClass(false)} />}
        </div>`;

const newBottomTag = `            {/* Big Logout Button */}
            <div className="max-w-2xl mx-auto pt-4 pb-12">
                <button
                    onClick={() => {
                        if (window.confirm(i18n.language.startsWith('ar') ? 'هل تريد تسجيل الخروج؟' : 'Are you sure you want to sign out?')) {
                            logout();
                            navigate('/login');
                        }
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-900 font-black text-base transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                    <LogOut className="w-5 h-5" />
                    <span>{t('nav.signout', 'تسجيل الخروج من الحساب')}</span>
                </button>
            </div>

            {showJoinClass && <JoinClassModal onClose={() => setShowJoinClass(false)} />}
        </div>`;

profileContent = profileContent.replace(oldBottomTag, newBottomTag);
profileContent = profileContent.replace(oldBottomTag.replace(/\n/g, '\r\n'), newBottomTag.replace(/\n/g, '\r\n'));

fs.writeFileSync(profilePath, profileContent, 'utf8');
console.log('UserProfile.tsx updated: added Logout buttons');
