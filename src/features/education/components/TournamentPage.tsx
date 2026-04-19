import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Timer, CheckCircle, XCircle, Star, Share2, RotateCcw, Copy, Play } from 'lucide-react';
import { useAppStore } from '../../../store';
import { DEFAULT_QUESTIONS, TournamentQuestion } from '../../../store/slices/tournamentSlice';

// ─── Helper: shuffle answers ───────────────────────────────────────────────────
function shuffleAnswers(q: TournamentQuestion): string[] {
    const all = [q.correctAnswer, ...q.distractors];
    for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const TournamentLobby: React.FC = () => {
    const { user, tournament, createTournament, startTournament, joinTournament, resetTournament } = useAppStore();
    const [joinCode, setJoinCode] = useState('');
    const [joinError, setJoinError] = useState('');
    const [view, setView] = useState<'HOME' | 'CREATE' | 'JOIN'>('HOME');
    const [copied, setCopied] = useState(false);

    const isTeacher = user?.role === 'TEACHER' || user?.role === 'ADMIN';


    const handleCreate = () => {
        createTournament('CEO Track Championship', DEFAULT_QUESTIONS, 20);
    };

    const handleJoin = () => {
        if (joinCode.length < 6) { setJoinError('Enter a valid 6-character code.'); return; }
        const ok = joinTournament(joinCode);
        if (!ok) setJoinError('Tournament not found. Check the code and try again.');
        else setJoinError('');
    };

    const copyCode = () => {
        if (tournament?.code) {
            navigator.clipboard.writeText(tournament.code).catch(() => { });
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    const style = {
        card: {
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
            border: '1.5px solid rgba(99,102,241,0.2)',
            borderRadius: 20, padding: '28px 24px',
        } as React.CSSProperties,
        btn: (color: string) => ({
            padding: '14px 28px', background: color, border: 'none',
            borderRadius: 14, color: '#fff', fontWeight: 800, fontSize: 15,
            cursor: 'pointer', width: '100%', marginBottom: 10,
        } as React.CSSProperties),
    };

    // If a tournament exists but not started — show waiting lobby
    if (tournament && tournament.status === 'LOBBY') {
        return (
            <div style={style.card}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>🏟️</div>
                    <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: 0 }}>{tournament.title}</h2>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
                        {tournament.questions.length} questions · {tournament.timePerQuestion}s per question
                    </p>
                </div>

                {/* Join code */}
                <div style={{ background: 'rgba(99,102,241,0.15)', borderRadius: 16, padding: '16px 20px', textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 6, letterSpacing: '0.5px' }}>JOIN CODE</div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: '#a78bfa', letterSpacing: 8 }}>{tournament.code}</div>
                    <button onClick={copyCode} style={{ marginTop: 10, background: 'transparent', border: '1px solid rgba(167,139,250,0.4)', borderRadius: 8, color: '#a78bfa', padding: '6px 16px', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
                        {copied ? '✅ Copied!' : <><Copy size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />Copy Code</>}
                    </button>
                </div>

                {/* Players list */}
                <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 10, letterSpacing: '0.5px' }}>
                        PLAYERS IN LOBBY ({tournament.entries.length})
                    </div>
                    {tournament.entries.map((e, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 10, marginBottom: 6 }}>
                            <span style={{ fontSize: 22 }}>{e.avatarEmoji}</span>
                            <span style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{e.name}</span>
                            {e.userId === user?.id && <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700, marginLeft: 'auto' }}>YOU</span>}
                        </div>
                    ))}
                </div>

                {isTeacher && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={startTournament}
                        style={{ ...style.btn('linear-gradient(135deg, #4f46e5, #7c3aed)'), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <Play size={16} /> Start Tournament!
                    </motion.button>
                )}
                <button onClick={resetTournament} style={{ ...style.btn('rgba(255,255,255,0.07)'), color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Cancel</button>
            </div>
        );
    }

    return (
        <div style={style.card}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 52, marginBottom: 10 }}>🏆</div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 }}>Tournament Mode</h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 8, lineHeight: 1.5 }}>
                    Challenge classmates in a live quiz battle. Fastest correct answers win the most points!
                </p>
            </div>

            {isTeacher ? (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleCreate}
                    style={{ ...style.btn('linear-gradient(135deg, #4f46e5, #7c3aed)'), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Trophy size={16} /> Create Tournament
                </motion.button>
            ) : null}

            {/* Join section */}
            <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 8, textAlign: 'center', letterSpacing: '0.4px' }}>OR JOIN WITH A CODE</div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input
                        value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                        placeholder="E.g. A3HK9Z"
                        style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: 4, textAlign: 'center', outline: 'none' }}
                    />
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={handleJoin}
                        style={{ padding: '12px 18px', background: 'linear-gradient(135deg, #059669, #10b981)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                        Join
                    </motion.button>
                </div>
                {joinError && <p style={{ color: '#f87171', fontSize: 12, marginTop: 6, textAlign: 'center' }}>{joinError}</p>}
            </div>
        </div>
    );
};

const TournamentArena: React.FC = () => {
    const { user, tournament, submitAnswer, nextQuestion } = useAppStore();
    const q = tournament?.questions[tournament.currentQuestionIndex ?? 0];
    const [answers, setAnswers] = useState<string[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [result, setResult] = useState<{ correct: boolean; points: number } | null>(null);
    const [timeLeft, setTimeLeft] = useState(tournament?.timePerQuestion ?? 20);
    const startTimeRef = useRef<number>(Date.now());
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Shuffle answers whenever question changes
    useEffect(() => {
        if (q) {
            setAnswers(shuffleAnswers(q));
            setSelected(null);
            setResult(null);
            setTimeLeft(tournament?.timePerQuestion ?? 20);
            startTimeRef.current = Date.now();
        }
    }, [tournament?.currentQuestionIndex]);

    // Timer countdown
    useEffect(() => {
        if (result) return;
        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(timerRef.current!);
                    // Auto-submit wrong if time runs out
                    if (!selected) {
                        setResult({ correct: false, points: 0 });
                    }
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current!);
    }, [tournament?.currentQuestionIndex, result]);

    const handleSelect = (ans: string) => {
        if (selected || result) return;
        clearInterval(timerRef.current!);
        const timeTakenMs = Date.now() - startTimeRef.current;
        const res = submitAnswer(ans, timeTakenMs);
        setSelected(ans);
        setResult({ correct: res.correct, points: res.pointsEarned });
    };

    const handleNext = () => nextQuestion();

    if (!q || !tournament) return null;

    const progress = ((tournament.currentQuestionIndex + 1) / tournament.questions.length) * 100;
    const userEntry = tournament.entries.find((e) => e.userId === user?.id);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#a78bfa' }}>
                    Q{tournament.currentQuestionIndex + 1}/{tournament.questions.length}
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#fbbf24' }}>
                    ⭐ {userEntry?.score ?? 0} pts
                </div>
                <div style={{ fontSize: 14, fontWeight: 900, color: timeLeft <= 5 ? '#f87171' : '#86efac' }}>
                    <Timer size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />{timeLeft}s
                </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.08)' }}>
                <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
                    style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #4f46e5, #a78bfa)' }} />
            </div>

            {/* Timer ring */}
            <div style={{ textAlign: 'center', padding: '6px 0' }}>
                <motion.div key={timeLeft}
                    initial={{ scale: timeLeft <= 5 ? 1.15 : 1 }}
                    animate={{ scale: 1 }}
                    style={{ display: 'inline-block', fontSize: timeLeft <= 5 ? 32 : 0, color: '#f87171', fontWeight: 900 }}>
                    {timeLeft <= 5 ? `⏰ ${timeLeft}` : ''}
                </motion.div>
            </div>

            {/* Question */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
                border: '1px solid rgba(99,102,241,0.25)', borderRadius: 18, padding: '22px 20px', textAlign: 'center',
            }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1.4, margin: 0 }}>{q.questionText}</p>
                <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700, marginTop: 8, display: 'block' }}>+{q.points} pts</span>
            </div>

            {/* Answer grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {answers.map((ans, i) => {
                    const isCorrect = ans === q.correctAnswer;
                    const isSelected = ans === selected;
                    const showResult = !!result;
                    let bg = 'rgba(255,255,255,0.07)';
                    let border = 'rgba(255,255,255,0.12)';
                    if (showResult && isCorrect) { bg = 'rgba(16,185,129,0.25)'; border = '#10b981'; }
                    else if (showResult && isSelected && !isCorrect) { bg = 'rgba(239,68,68,0.2)'; border = '#ef4444'; }
                    const colors = ['#4f46e5', '#7c3aed', '#2563eb', '#0891b2'];
                    if (!showResult && !isSelected) { bg = `${colors[i]}22`; border = `${colors[i]}55`; }
                    return (
                        <motion.button key={ans} whileHover={!result ? { scale: 1.03 } : {}} whileTap={!result ? { scale: 0.97 } : {}}
                            onClick={() => handleSelect(ans)}
                            style={{ padding: '16px 12px', background: bg, border: `1px solid ${border}`, borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: 13, cursor: result ? 'default' : 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                            {showResult && isCorrect && <CheckCircle size={14} style={{ verticalAlign: 'middle', marginRight: 4, color: '#10b981' }} />}
                            {showResult && isSelected && !isCorrect && <XCircle size={14} style={{ verticalAlign: 'middle', marginRight: 4, color: '#ef4444' }} />}
                            {ans}
                        </motion.button>
                    );
                })}
            </div>

            {/* Result feedback */}
            <AnimatePresence>
                {result && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', padding: '14px', background: result.correct ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)', borderRadius: 14, border: `1px solid ${result.correct ? '#10b981' : '#ef4444'}44` }}>
                        <div style={{ fontSize: 28, marginBottom: 4 }}>{result.correct ? '✅' : '❌'}</div>
                        <div style={{ fontWeight: 900, fontSize: 16, color: result.correct ? '#86efac' : '#f87171' }}>
                            {result.correct ? `+${result.points} points!` : `Correct: ${q.correctAnswer}`}
                        </div>
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleNext}
                            style={{ marginTop: 12, padding: '10px 28px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                            {tournament.currentQuestionIndex + 1 >= tournament.questions.length ? '📊 See Results' : 'Next Question →'}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TournamentLeaderboard: React.FC = () => {
    const { user, tournament, resetTournament } = useAppStore();
    if (!tournament) return null;

    const sorted = [...tournament.entries].sort((a, b) => b.score - a.score);
    const userRank = sorted.findIndex((e) => e.userId === user?.id) + 1;
    const winner = sorted[0];

    const medals = ['🥇', '🥈', '🥉'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Winner banner */}
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(251,191,36,0.1))', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 20, padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: 52 }}>🏆</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#fbbf24', marginTop: 6 }}>
                    {winner?.name} wins!
                </div>
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                    {winner?.score} points · {winner?.correctAnswers}/{tournament.questions.length} correct
                </div>
                {winner?.userId === user?.id && (
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.8 }}
                        style={{ marginTop: 10, fontSize: 14, fontWeight: 900, color: '#fbbf24' }}>
                        🎉 That's YOU! +300 BizCoins earned!
                    </motion.div>
                )}
            </motion.div>

            {/* Your rank */}
            {userRank > 1 && (
                <div style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 14, padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
                        Your rank: <strong style={{ color: '#a78bfa' }}>#{userRank}</strong> — {sorted[userRank - 1]?.score} pts
                    </span>
                </div>
            )}

            {/* Leaderboard list */}
            <div>
                {sorted.map((e, i) => (
                    <motion.div key={e.userId} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.06 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: e.userId === user?.id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)', border: e.userId === user?.id ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent', borderRadius: 14, marginBottom: 8 }}>
                        <span style={{ fontSize: 22, width: 28, textAlign: 'center', flexShrink: 0 }}>{medals[i] ?? `#${i + 1}`}</span>
                        <span style={{ fontSize: 22, flexShrink: 0 }}>{e.avatarEmoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>{e.name}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{e.correctAnswers}/{tournament.questions.length} correct</div>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#fbbf24', flexShrink: 0 }}>{e.score} pts</div>
                    </motion.div>
                ))}
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={resetTournament}
                style={{ padding: '14px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <RotateCcw size={16} /> Play Again
            </motion.button>
        </div>
    );
};

// ─── Main TournamentPage ───────────────────────────────────────────────────────

const TournamentPage: React.FC = () => {
    const { tournament } = useAppStore();

    const renderContent = () => {
        if (!tournament || tournament.status === 'IDLE') return <TournamentLobby />;
        if (tournament.status === 'LOBBY') return <TournamentLobby />;
        if (tournament.status === 'ACTIVE') return <TournamentArena />;
        if (tournament.status === 'FINISHED') return <TournamentLeaderboard />;
        return <TournamentLobby />;
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)', padding: '24px 16px', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ maxWidth: 580, margin: '0 auto' }}>
                {/* Page Header */}
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ textAlign: 'center', marginBottom: 28 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>
                        🏟️ School Tournaments
                    </h1>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
                        Live quiz battles with your classmates — answer fast, score more!
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.div key={tournament?.status ?? 'idle'} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TournamentPage;
