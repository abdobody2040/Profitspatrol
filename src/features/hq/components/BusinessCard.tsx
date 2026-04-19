import React, { useRef } from 'react';
import { useAppStore } from '../../../store';
import { motion } from 'framer-motion';

// ─── BusinessCard ─────────────────────────────────────────────────────────────
// A premium "shareable business card" for the kid's profile.
// Displays: name, title/rank, top skill, streak, BizCoins, HQ level.
// Has a "Download as Image" button using the Canvas API (no html2canvas dep needed).

const RANK_TITLES: Record<string, string> = {
    intern: 'Startup Intern',
    founder: 'Young Founder',
    board_member: 'Board Member',
    tycoon: 'Business Tycoon',
};

const RANK_COLORS: Record<string, string> = {
    intern: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
    founder: 'linear-gradient(135deg, #1d4ed8 0%, #312e81 100%)',
    board_member: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    tycoon: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
};

export const BusinessCard: React.FC = () => {
    const { user } = useAppStore();
    const cardRef = useRef<HTMLDivElement>(null);

    if (!user) return null;

    const tier = user.subscriptionTier ?? 'intern';
    const rankTitle = RANK_TITLES[tier] ?? 'Startup Intern';
    const gradient = RANK_COLORS[tier] ?? RANK_COLORS.intern;
    const topSkill = user.unlockedSkills?.[0] ?? 'Business Strategy';
    const level = user.level ?? 1;
    const bizCoins = user.bizCoins ?? 0;
    const streak = user.streak ?? 0;

    // Download card as PNG using the browser's built-in print / screenshot API via a blob
    const handleDownload = async () => {
        const card = cardRef.current;
        if (!card) return;
        // Dynamic import of html2canvas would be ideal; fallback: open print dialog
        try {
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(card, { scale: 2, backgroundColor: null });
            const link = document.createElement('a');
            link.download = `${user.name ?? 'profits-patrol'}-business-card.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch {
            // Fallback: Custom print window with preserved CSS backgrounds
            const printContents = card.outerHTML;
            const win = window.open('', '_blank', 'width=800,height=600');
            if (!win) return;

            win.document.write(`
                <!doctype html>
                <html>
                <head>
                    <meta charset="utf-8"/>
                    <title>Profits Patrol Business Card — ${user.name}</title>
                    <style>
                        /* Print-specific overrides to ensure backgrounds and gradients render */
                        @page { margin: 0; size: auto; }
                        body { 
                            margin: 0; 
                            padding: 0;
                            background: #f8fafc; 
                            display: flex; 
                            justify-content: center; 
                            align-items: center; 
                            min-height: 100vh;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                        }
                        
                        /* Create a nice presentation container for the printed page */
                        .print-container {
                            padding: 40px;
                            background-image: radial-gradient(circle at top right, #e0e7ff, transparent 400px),
                                              radial-gradient(circle at bottom left, #f3e8ff, transparent 400px);
                            border-radius: 32px;
                            box-shadow: 0 20px 40px rgba(0,0,0,0.05);
                            border: 8px solid white;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 24px;
                        }

                        .print-header {
                            text-align: center;
                            margin-bottom: 16px;
                        }
                        
                        .print-title {
                            font-size: 28px;
                            font-weight: 900;
                            color: #4f46e5;
                            margin: 0 0 8px 0;
                            letter-spacing: -0.5px;
                        }
                        
                        .print-subtitle {
                            font-size: 16px;
                            font-weight: 600;
                            color: #64748b;
                            margin: 0;
                        }

                        /* Scale the card up slightly for better print resolution */
                        #print-target {
                            transform: scale(1.15);
                            transform-origin: center;
                            margin: 20px 0;
                        }

                        /* Hide the container styling when actually printing, just center the card */
                        @media print { 
                            body { 
                                background: white; 
                                align-items: flex-start;
                                padding-top: 40px;
                            }
                            .print-container {
                                border: none;
                                box-shadow: none;
                                background-image: none;
                            }
                            #print-target {
                                transform: scale(1);
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="print-container">
                        <div class="print-header">
                            <h1 class="print-title">🚀 Official Profits Patrol Business Card</h1>
                            <p class="print-subtitle">Verified CEO Identity</p>
                        </div>
                        <div id="print-target">
                            ${printContents}
                        </div>
                    </div>
                </body>
                </html>
            `);
            win.document.close();
            win.focus();
            setTimeout(() => win.print(), 1000);
        }
    };

    return (
        <div>
            {/* Card */}
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{
                    background: gradient,
                    borderRadius: 24,
                    padding: '28px 28px 22px',
                    border: '2px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    maxWidth: 380,
                    position: 'relative',
                    overflow: 'hidden',
                    fontFamily: 'Inter, system-ui, sans-serif',
                }}
            >
                {/* Decorative circles */}
                <div style={{
                    position: 'absolute', right: -60, top: -60,
                    width: 200, height: 200,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', right: -20, bottom: -80,
                    width: 160, height: 160,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)',
                    pointerEvents: 'none',
                }} />

                {/* Logo badge */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    marginBottom: 24
                }}>
                    <div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '1.2px' }}>
                            PROFITS PATROL
                        </div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.5px' }}>
                            Business Academy
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.12)',
                        borderRadius: 12, padding: '4px 10px',
                        fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 800,
                        border: '1px solid rgba(255,255,255,0.15)',
                    }}>
                        LVL {level}
                    </div>
                </div>

                {/* Avatar + Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                    <div style={{
                        width: 60, height: 60, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        border: '2px solid rgba(255,255,255,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 32, flexShrink: 0,
                    }}>
                        🧑
                    </div>
                    <div>
                        <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: 0, lineHeight: 1.1 }}>
                            {user.name ?? 'Young Entrepreneur'}
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: '4px 0 0', fontWeight: 600 }}>
                            {rankTitle}
                        </p>
                    </div>
                </div>

                {/* Stats grid */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                    gap: 12, marginBottom: 20,
                }}>
                    {[
                        { label: 'BizCoins', value: bizCoins.toLocaleString(), icon: '🪙' },
                        { label: 'Streak', value: `${streak}d`, icon: '🔥' },
                        { label: 'Top Skill', value: topSkill.split(' ')[0], icon: '⚡' },
                    ].map(({ label, value, icon }) => (
                        <div key={label} style={{
                            background: 'rgba(255,255,255,0.08)',
                            borderRadius: 12, padding: '10px 8px', textAlign: 'center',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                            <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{value}</div>
                            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.4px' }}>
                                {label.toUpperCase()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom divider + username */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12 }}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0, fontStyle: 'italic' }}>
                        @{user.username ?? user.name?.toLowerCase().replace(/\s/g, '_') ?? 'entrepreneur'}
                        <span style={{ float: 'right' }}>profitspatrol.app</span>
                    </p>
                </div>
            </motion.div>

            {/* Download button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                style={{
                    marginTop: 14,
                    width: '100%',
                    maxWidth: 380,
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    color: '#fff', border: 'none', borderRadius: 14,
                    padding: '12px 0', fontSize: 14, fontWeight: 800,
                    cursor: 'pointer', boxShadow: '0 6px 24px rgba(99,102,241,0.4)',
                }}
            >
                📥 Download Business Card
            </motion.button>
        </div>
    );
};

export default BusinessCard;
