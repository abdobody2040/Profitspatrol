const fs = require('fs');
const filePath = 'src/features/admin/components/AdminDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import for CANONICAL_ARCADE_GAMES and UnifiedGameShell
const importTarget = "import GameEngine from '../../game/components/GameEngine';";
const importReplacement = `import GameEngine from '../../game/components/GameEngine';
import { CANONICAL_ARCADE_GAMES } from '../../games/registry/canonicalRegistry';
import UnifiedGameShell from '../../games/components/UnifiedGameShell';
import type { UnifiedGameDefinition } from '../../games/types';`;

if (!content.includes('CANONICAL_ARCADE_GAMES')) {
    content = content.replace(importTarget, importReplacement);
}

// 2. Update contentTab state type and add previewArcadeGame state
const stateTarget = "const [contentTab, setContentTab] = useState<'LESSONS' | 'GAMES'>('LESSONS');";
const stateReplacement = `const [contentTab, setContentTab] = useState<'LESSONS' | 'GAMES' | 'ARCADE'>('ARCADE');
    const [previewArcadeGame, setPreviewArcadeGame] = useState<UnifiedGameDefinition | null>(null);`;

content = content.replace(stateTarget, stateReplacement);

// 3. Update Content tab header buttons
const buttonsTarget = `<div className="flex gap-4">
                            <button onClick={() => setContentTab('LESSONS')} className={\`font-bold \${contentTab === 'LESSONS' ? 'text-blue-600' : 'text-gray-400'}\`}>{t('admin.dashboard.content.lessons')} ({lessons.length})</button>
                            <button onClick={() => setContentTab('GAMES')} className={\`font-bold \${contentTab === 'GAMES' ? 'text-blue-600' : 'text-gray-400'}\`}>{t('admin.dashboard.content.games')} ({games.length})</button>
                        </div>`;

const buttonsReplacement = `<div className="flex gap-4">
                            <button onClick={() => setContentTab('ARCADE')} className={\`font-bold px-3 py-1.5 rounded-lg \${contentTab === 'ARCADE' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-800'}\`}>🎮 Arcade Stations (50)</button>
                            <button onClick={() => setContentTab('GAMES')} className={\`font-bold px-3 py-1.5 rounded-lg \${contentTab === 'GAMES' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-800'}\`}>🏢 Tycoon Simulations ({games.length})</button>
                            <button onClick={() => setContentTab('LESSONS')} className={\`font-bold px-3 py-1.5 rounded-lg \${contentTab === 'LESSONS' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:text-gray-800'}\`}>📚 Curriculum Lessons ({lessons.length})</button>
                        </div>`;

content = content.replace(buttonsTarget, buttonsReplacement);

// 4. Add ARCADE content list renderer
const listTarget = `{contentTab === 'GAMES' && games.map(g => (`;
const arcadeListBlock = `{contentTab === 'ARCADE' && CANONICAL_ARCADE_GAMES.map(ag => (
                            <div key={ag.id} className="p-4 flex items-center justify-between hover:bg-gray-50 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-black flex items-center justify-center text-sm shadow-sm">
                                        #{ag.stationNumber}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">{t(ag.titleKey as any, { defaultValue: ag.id })}</div>
                                        <div className="text-xs text-gray-400 font-mono">
                                            District: <span className="font-bold text-indigo-600">{ag.district}</span> • Tier: <span className="font-bold text-emerald-600">{ag.requiredTier}</span> • Age: {ag.ageRange[0]}-{ag.ageRange[1]}y
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setPreviewArcadeGame(ag)} 
                                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                                    >
                                        <Play size={14} /> Test Station
                                    </button>
                                </div>
                            </div>
                        ))}
                        {contentTab === 'GAMES' && games.map(g => (`;

content = content.replace(listTarget, arcadeListBlock);

// 5. Add preview modal for previewArcadeGame
const previewTarget = `{/* Game Preview */}`;
const previewReplacement = `{/* Arcade Game Preview Modal */}
            {previewArcadeGame && (
                <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl h-[85vh] bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl border-4 border-slate-700">
                        <UnifiedGameShell game={previewArcadeGame} onExit={() => setPreviewArcadeGame(null)} />
                    </div>
                </div>
            )}

            {/* Game Preview */}`;

content = content.replace(previewTarget, previewReplacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated AdminDashboard with 50 Canonical Arcade Stations!');
