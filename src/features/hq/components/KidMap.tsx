import React, { useMemo, useState } from 'react';
import { useAppStore } from '../../../store';
import {
    Check, Star, Lock,
    Rocket, Trees as Tree, Cloud,
    Play, ShieldAlert, Briefcase, X, Flag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import InvestorPitchModal from '../../game/components/InvestorPitchModal';
import ProjectSubmitter from '../../education/components/ProjectSubmitter';
import DifficultySelectModal, { Difficulty } from './DifficultySelectModal';
import { SCENARIOS } from '../../scenarios/data/scenarios';
import { launchBossScenario } from '../../scenarios/utils/bossLauncher';
import { MODULE_MAP } from '../data/modules';
import { useEducationStore } from "../../../store/educationStore";

// Season boundaries: module indices that start a new season
const SEASON_GATES: { afterModuleIndex: number; label: string; emoji: string }[] = [
    { afterModuleIndex: 9, label: 'Season 2 — Advanced Track', emoji: '🔥' },
    { afterModuleIndex: 12, label: 'Season 3 — CEO Track', emoji: '💼' },
    { afterModuleIndex: 15, label: 'Season 4 — Mastery Track', emoji: '🚀' },
];

// --- VISUAL CONSTANTS ---
const BUTTON_SIZE = 80;
const GAP = 120;
const AMPLITUDE = 100;
const CENTER_X = 250;

interface KidMapProps {
    onStartLesson: (moduleId: string) => void;
}

const KidMap: React.FC<KidMapProps> = ({ onStartLesson }) => {
    const { user, startScenario } = useAppStore();
    const { lessons, completeLesson } = useEducationStore();
    const isAdmin = user?.role === 'ADMIN';
    const { t } = useTranslation();
    const [showPaywall, setShowPaywall] = useState(false);
    const [projectToOpen, setProjectToOpen] = useState<{ id: string, code: string, difficulty?: Difficulty } | null>(null);

    // Difficulty State
    const [difficultyModalOpen, setDifficultyModalOpen] = useState(false);
    const [selectedNodeData, setSelectedNodeData] = useState<{ id: string, type: 'BOSS' | 'PROJECT', title: string } | null>(null);

    // Helper to convert Title to snake_case key
    const toLicenseKey = (title: string) => {
        const map: Record<string, string> = {
            "Money Basics": "money_basics",
            "Entrepreneurship": "entrepreneurship",
            "Investing & Wealth": "investing_wealth",
            "Marketing": "marketing",
            "Leadership": "leadership",
            "Economics": "economics",
            "Technology": "technology",
            "Social Responsibility": "social_responsibility",
            "Global Business": "global_business",
            "Financial Smarts": "financial_smarts",
            // Season 2
            "Crypto & Blockchain": "crypto_blockchain",
            "AI & Future Jobs": "ai_future_jobs",
            "Sustainability Business": "sustainability_business",
            // Season 3
            "Venture Capital": "venture_capital",
            "Corporate Strategy": "corporate_strategy",
            "Global Trade": "global_trade",
            // Season 4
            "Financial Modeling": "financial_modeling",
            "Brand Building": "brand_building",
            "Future of Money": "future_of_money",
            "Negotiation & Persuasion": "negotiation_persuasion",
        };
        return map[title] || title.toLowerCase().replace(/ /g, '_');
    };

    // Helper to get Project Code
    const getProjectCode = (tag: string) => {
        const map: Record<string, string> = {
            "Money Basics": "MOD_MB",
            "Entrepreneurship": "MOD_ENT",
            "Investing & Wealth": "MOD_INV",
            "Marketing": "MOD_MKT",
            "Leadership": "MOD_LDR",
            "Economics": "MOD_ECO",
            "Technology": "MOD_TECH",
            "Social Responsibility": "MOD_SOC",
            "Global Business": "MOD_GLO",
            "Financial Smarts": "MOD_FIN",
            // Season 2
            "Crypto & Blockchain": "MOD_CRYPTO",
            "AI & Future Jobs": "MOD_AIJOB",
            "Sustainability Business": "MOD_SUST",
            // Season 3
            "Venture Capital": "MOD_VC",
            "Corporate Strategy": "MOD_CORP",
            "Global Trade": "MOD_GLOB",
            // Season 4
            "Financial Modeling": "MOD_FMD",
            "Brand Building": "MOD_BRAND",
            "Future of Money": "MOD_FUTURE",
            "Negotiation & Persuasion": "MOD_NEG",
        };
        return map[tag] || "MOD_GEN";
    };

    // Initial Launch (intercepted)
    const handleNodeClick = (node: any) => {
        if (node.nodeType === 'GATE') return; // decorative only
        if (node.nodeType === 'BOSS' || node.nodeType === 'PROJECT') {
            setSelectedNodeData({ id: node.id, type: node.nodeType, title: node.title });
            setDifficultyModalOpen(true);
        } else {
            onStartLesson(node.id);
        }
    };

    // Actual Launch after Difficulty Selection
    const handleDifficultySelect = (difficulty: Difficulty) => {
        setDifficultyModalOpen(false);
        if (!selectedNodeData) return;

        if (selectedNodeData.type === 'BOSS') {
            launchBossScenario(selectedNodeData.id, difficulty, startScenario);
        } else if (selectedNodeData.type === 'PROJECT') {
            const def = MODULE_MAP.get(selectedNodeData.title);
            setProjectToOpen({
                id: selectedNodeData.id,
                code: def?.projectCode ?? 'MOD_GEN',
                difficulty: difficulty
            });
        }
        setSelectedNodeData(null);
    };

    // Group Lessons by Module (Section)
    const sections = useMemo(() => {
        if (!lessons || lessons.length === 0) return [];

        const uniqueTags = Array.from(new Set(lessons.map(l => l.topic_tag)));

        return uniqueTags.map((tag, sectionIndex) => {
            const moduleLessons = lessons.filter(l => l.topic_tag === tag);
            const def = MODULE_MAP.get(tag);

            return {
                id: `SEC_${sectionIndex}`,
                title: tag,
                lessons: moduleLessons,
                color: def?.color ?? 'emerald',
                Icon: def?.Icon ?? Star,
                startIndex: 0
            };
        });
    }, [lessons]);

    // Calculate Global Node Positions
    const { nodes, totalHeight } = useMemo(() => {
        let globalIndex = 0;
        let yOffset = 220;
        const allNodes: any[] = [];

        sections.forEach((section, sectionIndex) => {
            section.startIndex = globalIndex;
            yOffset += 40;

            // Check if a Season GATE should appear before this section
            const gate = SEASON_GATES.find(g => g.afterModuleIndex === sectionIndex - 1);
            // Actually we insert gates BEFORE the section that starts a new season
            // Season 2 starts at module index 10 (0-based), Season 3 at 13, Season 4 at 16
            const gateBeforeThis = SEASON_GATES.find(g => g.afterModuleIndex + 1 === sectionIndex);
            if (gateBeforeThis) {
                allNodes.push({
                    id: `GATE_${sectionIndex}`,
                    title: gateBeforeThis.label,
                    emoji: gateBeforeThis.emoji,
                    nodeType: 'GATE',
                    globalIndex,
                    sectionId: section.id,
                    sectionColor: 'gate',
                    SectionIcon: Flag,
                    x: 0,
                    y: yOffset
                });
                yOffset += GAP + 60;
                globalIndex++;
            }

            // 1. Regular Lessons
            section.lessons.forEach((lesson: any, i: number) => {
                const x = Math.sin(globalIndex * 0.7) * AMPLITUDE;

                allNodes.push({
                    ...lesson,
                    nodeType: 'LESSON',
                    globalIndex,
                    sectionLessonIndex: i + 1,
                    sectionId: section.id,
                    sectionColor: section.color,
                    SectionIcon: section.Icon,
                    x: x,
                    y: yOffset
                });

                yOffset += GAP;
                globalIndex++;

            });

            // 2. Unit Project Node
            const projectX = Math.sin(globalIndex * 0.7) * AMPLITUDE;
            allNodes.push({
                id: `${section.id}_PROJECT`,
                title: `${section.title}`,
                nodeType: 'PROJECT',
                globalIndex,
                sectionId: section.id,
                sectionColor: section.color,
                SectionIcon: Briefcase,
                x: projectX,
                y: yOffset
            });
            yOffset += GAP;
            globalIndex++;

            // 3. Boss Battle Node
            const bossX = Math.sin(globalIndex * 0.7) * AMPLITUDE;
            allNodes.push({
                id: `${section.id}_BOSS`,
                title: 'Boss Battle',
                nodeType: 'BOSS',
                globalIndex,
                sectionId: section.id,
                sectionColor: 'red',
                SectionIcon: ShieldAlert,
                x: bossX,
                y: yOffset
            });
            yOffset += GAP;
            globalIndex++;

            yOffset += 100;
        });

        return { nodes: allNodes, totalHeight: yOffset + 200 };
    }, [sections]);

    // SVG Path Generation
    const pathD = useMemo(() => {
        if (nodes.length === 0) return "";
        let d = `M ${nodes[0].x + CENTER_X} ${nodes[0].y}`;

        for (let i = 0; i < nodes.length - 1; i++) {
            const p1 = nodes[i];
            const p2 = nodes[i + 1];

            const x1 = p1.x + CENTER_X;
            const y1 = p1.y;
            const x2 = p2.x + CENTER_X;
            const y2 = p2.y;

            const cp1x = x1;
            const cp1y = y1 + (GAP * 0.5);
            const cp2x = x2;
            const cp2y = y2 - (GAP * 0.5);

            d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
        }
        return d;
    }, [nodes]);

    // Calculate First Incomplete Lesson Index (Strict Progression)
    const firstIncompleteGlobalIndex = useMemo(() => {
        if (!user || nodes.length === 0) return 0;

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.nodeType === 'LESSON') {
                if (!user.completedLessonIds.includes(node.id)) return i;
            }
            else {
                if (!user.completedLessonIds.includes(node.id)) return i;
            }
        }
        return nodes.length;
    }, [user?.completedLessonIds, nodes]);

    // Enhanced Node State Logic
    const getNodeState = (lessonId: string, index: number) => {
        if (!user) return { status: 'LOCKED', stars: 0, isLocked: true, isCurrent: false };

        let isLocked = true;
        let isCurrent = false;
        let status = 'LOCKED';

        // Determine natural progression status
        if (index < firstIncompleteGlobalIndex) {
            isLocked = false;
            status = 'COMPLETE';
        } else if (index === firstIncompleteGlobalIndex) {
            isLocked = false;
            isCurrent = true;
            status = 'ACTIVE';
        } else {
            isLocked = true;
            status = 'LOCKED';
        }

        // Admin Override: Unlock everything, but keep "Current" indicator for guidance
        if (isAdmin) {
            isLocked = false;
            if (status === 'LOCKED') status = 'ACTIVE';
        }

        return {
            status,
            isLocked,
            isCurrent,
            stars: status === 'COMPLETE' ? 3 : 0
        };
    };

    if (nodes.length === 0) return null;

    return (
        <div className="relative pb-32 overflow-hidden w-full max-w-2xl mx-auto">
            <InvestorPitchModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

            <DifficultySelectModal
                isOpen={difficultyModalOpen}
                onClose={() => setDifficultyModalOpen(false)}
                onSelect={handleDifficultySelect}
                type={selectedNodeData?.type || 'BOSS'}
            />

            {/* PROJECT SUBMITTER MODAL */}
            <AnimatePresence>
                {projectToOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-transparent w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
                        >
                            <button
                                onClick={() => setProjectToOpen(null)}
                                className="absolute top-4 right-4 z-50 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg border-2 border-gray-100 dark:border-gray-700 text-gray-500 hover:text-red-500 transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <ProjectSubmitter
                                lessonId={projectToOpen.code}
                                difficulty={projectToOpen.difficulty as Difficulty}
                                onComplete={() => {
                                    completeLesson(projectToOpen.id);
                                    setProjectToOpen(null);
                                    const bossNodeId = projectToOpen.id.replace('_PROJECT', '_BOSS');
                                    // Pass same difficulty to Boss Level for consistency
                                    setTimeout(() => launchBossScenario(bossNodeId, projectToOpen.difficulty, startScenario), 500);
                                }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- BACKDROP --- */}
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#84cc16] to-[#65a30d] dark:from-slate-900 dark:to-slate-950 pointer-events-none transition-colors duration-500" />

            <div className="relative z-10" style={{ height: totalHeight }}>
                {/* DECORATIONS - Trees/Clouds */}
                {Array.from({ length: Math.ceil(totalHeight / 400) }).map((_, i) => {
                    // ✅ IMPROVEMENT: Replace Math.random() with a deterministic seeded function.
                    // Math.random() inside render produces different values on every re-render,
                    // causing layout thrash, hydration mismatches, and unpredictable animations.
                    // This simple integer hash (djb2-lite) gives stable positions per index.
                    const hash = (seed: number) => {
                        let h = seed * 2654435761;
                        h = ((h >> 16) ^ h) * 0x45d9f3b;
                        return (h >>> 0) / 0xFFFFFFFF; // normalize 0-1
                    };
                    const treeOffset = hash(i * 3 + 1) * 200;
                    const treeScale = 0.8 + hash(i * 3 + 2) * 0.5;
                    const cloudLeft = hash(i * 3 + 3) * 80;

                    return (
                        <React.Fragment key={i}>
                            <div className="absolute opacity-20 text-[#365314] dark:text-slate-800 transition-colors duration-500" style={{
                                top: i * 400 + treeOffset,
                                left: i % 2 === 0 ? '5%' : '85%',
                                transform: `scale(${treeScale})`
                            }}>
                                <Tree size={80} fill="currentColor" />
                            </div>
                            {i % 3 === 0 && (
                                <div className="absolute opacity-15 text-white" style={{
                                    top: i * 400 + 100,
                                    left: `${cloudLeft}%`,
                                }}>
                                    <Cloud size={60} fill="currentColor" />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}

                {/* HEADER TITLE */}
                <div className="absolute top-0 left-0 w-full flex justify-center pt-8 pb-12 z-20">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-8 py-3 rounded-full shadow-lg border-b-4 border-gray-200 dark:border-gray-700 transition-colors">
                        <h1 className="text-2xl font-black text-green-700 dark:text-green-400 uppercase tracking-widest flex items-center gap-3 transition-colors">
                            <Rocket className="text-orange-500" size={28} />
                            {t('path_title', { defaultValue: 'Adventure Map' })}
                        </h1>
                    </div>
                </div>

                {/* --- PATH SVG --- */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" style={{ height: totalHeight }}>
                    <path d={pathD} fill="none" className="stroke-[#a16207] dark:stroke-slate-900 transition-colors duration-500" strokeWidth="110" strokeLinecap="round" opacity="0.3" />
                    <path d={pathD} fill="none" className="stroke-[#e5cca9] dark:stroke-slate-700 transition-colors duration-500" strokeWidth="90" strokeLinecap="round" />
                    <path d={pathD} fill="none" className="stroke-[#d4b895] dark:stroke-slate-600 transition-colors duration-500" strokeWidth="80" strokeLinecap="round" strokeDasharray="20 30" opacity="0.4" />
                </svg>

                {/* --- SECTION HEADERS --- */}
                {sections.map((section) => {
                    const firstNode = nodes.find(n => n.sectionId === section.id);
                    if (!firstNode) return null;

                    const headerColors: Record<string, string> = {
                        yellow: "bg-yellow-500 border-yellow-700",
                        orange: "bg-orange-500 border-orange-700",
                        emerald: "bg-emerald-500 border-emerald-700",
                        rose: "bg-rose-500 border-rose-700",
                        purple: "bg-purple-500 border-purple-700",
                        cyan: "bg-cyan-500 border-cyan-700",
                        indigo: "bg-indigo-500 border-indigo-700",
                        lime: "bg-lime-500 border-lime-700",
                        sky: "bg-sky-500 border-sky-700",
                        teal: "bg-teal-500 border-teal-700",
                        // Season 2
                        amber: "bg-amber-500 border-amber-700",
                        blue: "bg-blue-500 border-blue-700",
                        green: "bg-green-600 border-green-800",
                        // Season 3
                        violet: "bg-violet-600 border-violet-800",
                        // Season 4
                        fuchsia: "bg-fuchsia-500 border-fuchsia-700",
                        pink: "bg-pink-500 border-pink-700",
                    };
                    const colorClass = headerColors[section.color] || headerColors.emerald;

                    return (
                        <div
                            key={section.id}
                            className="absolute z-10 w-full px-4 left-0"
                            style={{ top: firstNode.y - 150 }}
                        >
                            <div className={`
                                mx-auto max-w-sm rounded-[24px] px-6 py-4 shadow-xl text-white
                                flex items-center justify-between border-b-[6px]
                                ${colorClass}
                                transition-transform hover:scale-[1.02] duration-300
                            `}>
                                <div>
                                    <div className="text-xs font-bold uppercase opacity-90 tracking-wider mb-1">
                                        {t('map.section', { defaultValue: 'SECTION' })} {parseInt(section.id.split('_')[1]) + 1}
                                    </div>
                                    <div className="font-black text-xl leading-tight drop-shadow-md">
                                        {section.title}
                                    </div>
                                </div>
                                <div className="opacity-40 p-2 bg-white/20 rounded-full">
                                    <section.Icon size={32} />
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* --- NODES --- */}
                {nodes.map((node, index) => {
                    const { status, isLocked, isCurrent } = getNodeState(node.id, index);

                    const colorConfig: Record<string, string> = {
                        yellow: 'bg-yellow-400 border-yellow-600 ring-yellow-200',
                        orange: 'bg-orange-400 border-orange-600 ring-orange-200',
                        emerald: 'bg-emerald-500 border-emerald-700 ring-emerald-200',
                        rose: 'bg-rose-400 border-rose-600 ring-rose-200',
                        purple: 'bg-purple-500 border-purple-700 ring-purple-200',
                        cyan: 'bg-cyan-400 border-cyan-600 ring-cyan-200',
                        indigo: 'bg-indigo-400 border-indigo-600 ring-indigo-200',
                        lime: 'bg-lime-400 border-lime-600 ring-lime-200',
                        sky: 'bg-sky-400 border-sky-600 ring-sky-200',
                        teal: 'bg-teal-400 border-teal-600 ring-teal-200',
                        // Season 2
                        amber: 'bg-amber-400 border-amber-600 ring-amber-200',
                        blue: 'bg-blue-500 border-blue-700 ring-blue-200',
                        green: 'bg-green-500 border-green-700 ring-green-200',
                        // Season 3
                        violet: 'bg-violet-500 border-violet-700 ring-violet-200',
                        // Season 4
                        fuchsia: 'bg-fuchsia-500 border-fuchsia-700 ring-fuchsia-200',
                        pink: 'bg-pink-400 border-pink-600 ring-pink-200',
                        // Boss special
                        red: 'bg-red-600 border-red-800 ring-red-400',
                        // Gate decoration
                        gate: 'bg-white border-gray-200 ring-gray-100',
                    };

                    // GATE NODE — renders a full-width season banner, not a button
                    if (node.nodeType === 'GATE') {
                        return (
                            <div
                                key={node.id}
                                className="absolute left-1/2 z-20"
                                style={{ top: node.y, transform: `translate(-50%, -50%)` }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-3 px-8 py-3 rounded-full bg-white/90 dark:bg-slate-800/90 border-2 border-dashed border-gray-300 dark:border-gray-600 shadow-2xl backdrop-blur-sm whitespace-nowrap"
                                >
                                    <span className="text-2xl">{node.emoji}</span>
                                    <span className="text-sm font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest">{node.title}</span>
                                    <span className="text-2xl">{node.emoji}</span>
                                </motion.div>
                            </div>
                        );
                    }

                    const activeColor = colorConfig[node.sectionColor] || colorConfig.emerald;
                    const finalColor = node.nodeType === 'BOSS'
                        ? 'bg-red-600 border-red-800 ring-red-400'
                        : node.nodeType === 'CHECKPOINT'
                            ? 'bg-yellow-300 border-yellow-500 ring-yellow-100'
                            : activeColor;

                    // Deciding what content to show in the button
                    let InnerContent;
                    if (status === 'COMPLETE') {
                        if (node.nodeType === 'BOSS') {
                            InnerContent = <ShieldAlert size={32} className="text-white drop-shadow-md" />;
                        } else if (node.nodeType === 'PROJECT') {
                            InnerContent = <Briefcase size={32} className="text-white drop-shadow-md" />;
                        } else if (node.nodeType === 'CHECKPOINT') {
                            InnerContent = <Star size={30} fill="currentColor" className="text-yellow-600 drop-shadow-md" />;
                        } else {
                            InnerContent = <Check size={36} strokeWidth={4} className="text-yellow-100" />;
                        }
                    } else if (isLocked) {
                        InnerContent = <Lock size={28} />;
                    } else if (isCurrent) {
                        if (node.nodeType === 'BOSS') InnerContent = <ShieldAlert size={32} className="animate-pulse" />;
                        else if (node.nodeType === 'PROJECT') InnerContent = <Briefcase size={32} />;
                        else InnerContent = <Play size={32} fill="currentColor" className="ml-1" />;
                    } else {
                        if (node.nodeType === 'BOSS') InnerContent = <ShieldAlert size={32} />;
                        else if (node.nodeType === 'PROJECT') InnerContent = <Briefcase size={32} />;
                        else InnerContent = <node.SectionIcon size={32} className="opacity-90" strokeWidth={2.5} />;
                    }

                    return (
                        <div
                            key={node.id}
                            className="absolute left-1/2 -translate-x-1/2 z-20"
                            style={{
                                top: node.y,
                                transform: `translate(calc(-50% + ${node.x}px), -50%)`
                            }}
                        >
                            <AnimatePresence>
                                {isCurrent && (
                                    <motion.div
                                        initial={{ y: -20, opacity: 0, scale: 0.8 }}
                                        animate={{ y: -85, opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-2xl font-black shadow-xl border-2 border-gray-100 whitespace-nowrap z-50 pointer-events-none"
                                    >
                                        <span className="text-lg">{t('map.start', { defaultValue: "Let's Go!" })}</span>
                                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-white rotate-45 border-b-2 border-r-2 border-gray-100"></div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={!isLocked ? { scale: 1.15 } : {}}
                                whileTap={!isLocked ? { scale: 0.9, translateY: 6 } : {}}
                                onClick={() => {
                                    if (isLocked) return;
                                    handleNodeClick(node);
                                }}
                                className={`
                                    relative group
                                    w-[84px] h-[74px] 
                                    rounded-[30px]
                                    flex items-center justify-center
                                    transition-all duration-200
                                    border-b-[8px]
                                    shadow-xl
                                    ${isLocked
                                        ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                                        : `${finalColor} text-white cursor-pointer`
                                    }
                                `}
                            >
                                {!isLocked && (
                                    <div className="absolute top-1 left-2 right-2 h-[40%] bg-gradient-to-b from-white/30 to-transparent rounded-t-[20px]" />
                                )}
                                {!isLocked && (
                                    <div className="absolute inset-2 border-2 border-black/5 rounded-[22px]" />
                                )}
                                <div className="relative z-10 drop-shadow-sm transform -translate-y-0.5">
                                    {InnerContent}
                                </div>
                                {/* Difficulty pips — shown for LESSON nodes always */}
                                {node.nodeType === 'LESSON' && !isLocked && (
                                    <div className="absolute -bottom-7 flex gap-0.5 z-20">
                                        {[1, 2, 3].map(pip => (
                                            <Star
                                                key={pip}
                                                size={12}
                                                className={pip <= (node.difficulty || 1)
                                                    ? 'fill-yellow-400 text-yellow-600 drop-shadow-sm'
                                                    : 'fill-gray-300 text-gray-400 dark:fill-gray-600'
                                                }
                                            />
                                        ))}
                                    </div>
                                )}
                                {/* Completion stars for non-lesson nodes */}
                                {status === 'COMPLETE' && node.nodeType !== 'LESSON' && node.nodeType !== 'GATE' && (
                                    <div className="absolute -bottom-8 flex gap-1 z-20">
                                        {[1, 2, 3].map(i => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.1 * i }}
                                            >
                                                <Star size={16} className="fill-yellow-400 text-yellow-600 drop-shadow-sm" />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.button>

                            {isCurrent && (
                                <motion.div
                                    className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-10"
                                    style={{ left: '120px' }}
                                    initial={{ opacity: 0, scale: 0.5, x: 20 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        x: 0,
                                        y: [0, -8, 0]
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        y: {
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut"
                                        }
                                    }}
                                >
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/20 rounded-full blur-sm" />
                                    <div className="relative w-32 h-32 flex items-center justify-center -mt-8">
                                        <img
                                            src="/assets/ollie_wave.png"
                                            alt="Mascot"
                                            className="w-full h-full object-contain filter drop-shadow-lg"
                                            loading="lazy"
                                            onError={(e) => {
                                                // ✅ SECURITY FIX: Never use innerHTML for error fallbacks.
                                                // innerHTML accepts arbitrary HTML and is an XSS vector.
                                                // Use textContent + safe DOM mutation instead.
                                                e.currentTarget.style.display = 'none';
                                                const parent = e.currentTarget.parentElement;
                                                if (parent) {
                                                    const fallback = document.createElement('span');
                                                    fallback.textContent = '🦉'; // textContent is XSS-safe
                                                    fallback.style.cssText = 'font-size:80px;filter:drop-shadow(0 4px 4px rgba(0,0,0,0.3))';
                                                    parent.appendChild(fallback);
                                                }
                                            }}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1 }}
                                            className="absolute -top-4 -right-4 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-xl rounded-bl-none shadow-md border-2 border-gray-100"
                                        >
                                            {t('common.lets_go') || "Let's Go!"}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default KidMap;
