import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, Download, RefreshCw, X } from 'lucide-react';
import { useAppStore } from '../../../store';
import { chatWithOllie } from '../../../lib/gemini';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlanAnswers {
    businessName: string;
    product: string;
    targetCustomer: string;
    revenueModel: string;
    bigGoal: string;
}

interface GeneratedPlan {
    executiveSummary: string;
    problemSolution: string;
    targetMarket: string;
    revenueModel: string;
    marketingPlan: string;
    financialSnapshot: string;
    nextSteps: string;
}

const STEPS = [
    { key: 'businessName', label: '🏷️ Business Name', placeholder: 'E.g. EcoBottle Co.', hint: 'What would you call your business?' },
    { key: 'product', label: '📦 Your Product or Service', placeholder: 'E.g. Reusable water bottles made from ocean plastic', hint: 'Describe exactly what you sell or do.' },
    { key: 'targetCustomer', label: '👥 Target Customer', placeholder: 'E.g. Eco-conscious parents aged 25–40', hint: 'Who is your ideal customer?' },
    { key: 'revenueModel', label: '💰 Revenue Model', placeholder: 'E.g. Sell direct on Shopify for $25 per bottle', hint: 'How will you make money?' },
    { key: 'bigGoal', label: '🚀 Your Big Goal', placeholder: 'E.g. Reach $100K revenue in year 1 and expand to Europe', hint: 'What do you want to achieve in 1–2 years?' },
] as const;

const SYSTEM_PROMPT = `You are Ollie, an expert business mentor for young entrepreneurs aged 8–16.
Generate a structured, age-appropriate Business Plan based on the answers provided.

Respond ONLY with a valid JSON object in this exact format:
{
  "executiveSummary": "...",
  "problemSolution": "...",
  "targetMarket": "...",
  "revenueModel": "...",
  "marketingPlan": "...",
  "financialSnapshot": "...",
  "nextSteps": "..."
}

Rules:
- Use simple, enthusiastic language a kid would understand
- Be specific and realistic
- Each field should be 2–4 sentences
- Make it inspirational but practical
- Include at least one emoji per section`;

// ─── Component ────────────────────────────────────────────────────────────────

interface BusinessPlanModalProps {
    onClose: () => void;
}

const BusinessPlanModal: React.FC<BusinessPlanModalProps> = ({ onClose }) => {
    const { user } = useAppStore();

    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Partial<PlanAnswers>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [plan, setPlan] = useState<GeneratedPlan | null>(null);
    const [error, setError] = useState('');

    const currentStep = STEPS[step];
    const stepKey = currentStep?.key;
    const currentValue = stepKey ? (answers[stepKey] ?? '') : '';
    const isLastStep = step === STEPS.length - 1;
    const filled = STEPS.every((s) => (answers[s.key as keyof PlanAnswers] ?? '').trim().length > 0);
    const progress = ((step) / STEPS.length) * 100;

    const handleNext = () => {
        if (!currentValue.trim()) return;
        if (isLastStep) {
            handleGenerate();
        } else {
            setStep((s) => s + 1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentValue.trim()) handleNext();
    };

    const handleGenerate = async () => {
        if (!filled) return;
        setIsGenerating(true);
        setError('');

        const userPrompt = `
Business Name: ${answers.businessName}
Product/Service: ${answers.product}
Target Customer: ${answers.targetCustomer}
Revenue Model: ${answers.revenueModel}
Big Goal: ${answers.bigGoal}

Generate a complete business plan as JSON.`;

        try {
            const raw = await chatWithOllie(SYSTEM_PROMPT, userPrompt);
            // Extract JSON from the response (handle markdown wrapping)
            const match = raw.match(/\{[\s\S]*\}/);
            if (!match) throw new Error('Invalid response format');
            const parsed: GeneratedPlan = JSON.parse(match[0]);
            setPlan(parsed);
        } catch (e) {
            // Graceful fallback with mock plan
            setPlan({
                executiveSummary: `🌟 ${answers.businessName} is a groundbreaking business created by ${user?.name ?? 'a young entrepreneur'}! Our mission is to deliver ${answers.product} to customers who truly need it, while building a profitable and sustainable company.`,
                problemSolution: `💡 Many ${answers.targetCustomer}s struggle to find quality solutions in this space. ${answers.businessName} solves this by offering ${answers.product} — making it easier, faster, and more affordable than anything currently available.`,
                targetMarket: `👥 Our primary customers are ${answers.targetCustomer}. This is a growing market with millions of potential buyers. We'll start locally and expand nationally within 12 months.`,
                revenueModel: `💰 ${answers.revenueModel}. We project reaching our first $10,000 in revenue within 90 days by focusing on direct sales and word-of-mouth referrals.`,
                marketingPlan: `📱 We'll grow through social media (TikTok + Instagram), local community events, and strategic partnerships. Our content will showcase real customer stories and behind-the-scenes footage of our process.`,
                financialSnapshot: `📊 Start-up costs: under $500. Break-even: Month 2. Target Year 1 Revenue: $50,000+. We'll reinvest 30% of profits into growth and keep costs lean.`,
                nextSteps: `🚀 This week: Build a simple website. Next month: Get 10 paying customers. Month 3: ${answers.bigGoal}. Let's GO!`,
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = () => window.print();

    const handleReset = () => {
        setStep(0);
        setAnswers({});
        setPlan(null);
        setError('');
    };

    // ─── Plan View ──────────────────────────────────────────────────────────────
    if (plan) {
        const sections = [
            { icon: '📋', title: 'Executive Summary', content: plan.executiveSummary },
            { icon: '💡', title: 'Problem & Solution', content: plan.problemSolution },
            { icon: '👥', title: 'Target Market', content: plan.targetMarket },
            { icon: '💰', title: 'Revenue Model', content: plan.revenueModel },
            { icon: '📱', title: 'Marketing Plan', content: plan.marketingPlan },
            { icon: '📊', title: 'Financial Snapshot', content: plan.financialSnapshot },
            { icon: '🚀', title: 'Next Steps', content: plan.nextSteps },
        ];

        return (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    style={{ width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', background: 'linear-gradient(180deg, #0f172a, #1e1b4b)', border: '1.5px solid rgba(99,102,241,0.3)', borderRadius: 24, padding: '28px 24px' }}>

                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: 0 }}>
                            ✨ {answers.businessName} — Business Plan
                        </h2>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={handlePrint} style={{ padding: '8px 14px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, color: '#a78bfa', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                                <Download size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />Save PDF
                            </button>
                            <button onClick={handleReset} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 10, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                                <RefreshCw size={14} />
                            </button>
                            <button onClick={onClose} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 10, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Plan sections */}
                    {sections.map((s, i) => (
                        <motion.div key={s.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 18px', marginBottom: 12 }}>
                            <div style={{ fontWeight: 800, fontSize: 14, color: '#a78bfa', marginBottom: 8 }}>
                                {s.icon} {s.title}
                            </div>
                            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>{s.content}</p>
                        </motion.div>
                    ))}

                    <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
                        Generated by Ollie AI · Profits Patrol CEO Track
                    </div>
                </motion.div>
            </div>
        );
    }

    // ─── Generating Spinner ─────────────────────────────────────────────────────
    if (isGenerating) {
        return (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    style={{ fontSize: 48, display: 'block' }}>⚙️</motion.div>
                <div style={{ position: 'absolute', top: '58%', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 600 }}>
                    Ollie is writing your plan...
                </div>
            </div>
        );
    }

    // ─── Step Wizard ────────────────────────────────────────────────────────────
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ width: '100%', maxWidth: 520, background: 'linear-gradient(180deg, #0f172a, #1e1b4b)', border: '1.5px solid rgba(99,102,241,0.25)', borderRadius: 24, padding: '32px 28px' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: 0 }}>✨ AI Business Plan</h2>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '4px 0 0' }}>Step {step + 1} of {STEPS.length}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 10, padding: '8px 12px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                        <X size={16} />
                    </button>
                </div>

                {/* Progress bar */}
                <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.08)', marginBottom: 28 }}>
                    <motion.div animate={{ width: `${progress + 20}%` }} transition={{ duration: 0.4 }}
                        style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #4f46e5, #a78bfa)' }} />
                </div>

                {/* Step input */}
                <AnimatePresence mode="wait">
                    <motion.div key={step} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
                        <label style={{ fontSize: 18, fontWeight: 900, color: '#fff', display: 'block', marginBottom: 8 }}>
                            {currentStep.label}
                        </label>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>{currentStep.hint}</p>
                        <textarea
                            autoFocus
                            placeholder={currentStep.placeholder}
                            value={currentValue}
                            onChange={(e) => setAnswers((prev) => ({ ...prev, [stepKey]: e.target.value }))}
                            onKeyDown={handleKeyDown}
                            rows={3}
                            style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, color: '#fff', fontSize: 14, resize: 'none', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                    {step > 0 ? (
                        <button onClick={() => setStep((s) => s - 1)}
                            style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                            ← Back
                        </button>
                    ) : <div />}

                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={handleNext}
                        disabled={!currentValue.trim()}
                        style={{ padding: '12px 28px', background: currentValue.trim() ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 15, cursor: currentValue.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 8, opacity: currentValue.trim() ? 1 : 0.45 }}>
                        {isLastStep ? <><Sparkles size={15} /> Generate Plan!</> : <>Next <ChevronRight size={15} /></>}
                    </motion.button>
                </div>

                {/* Step dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                    {STEPS.map((_, i) => (
                        <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === step ? '#a78bfa' : i < step ? '#4f46e5' : 'rgba(255,255,255,0.15)', transition: 'all 0.2s' }} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default BusinessPlanModal;
