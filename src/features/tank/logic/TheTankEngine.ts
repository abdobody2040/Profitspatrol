

// RE-DEFINE INTERFACES LOCALLY IF NEEDED OR IMPORT FROM TYPES
// Based on TheTankMode.tsx, these seem to be locally defined there. 
// We should probably move them to a global types file or export them here.
// For now, I will export them here so the component can import them.

export interface Judge {
    id: string;
    nameKey: string;
    styleKey: string;
    color: string;
    minEquity: number;
    maxValuationMultiplier: number;
    patience: number;
}

export interface Offer {
    judge: Judge;
    valuation: number;
    equity: number;
    comment: string;
}

export interface PitchAnalysis {
    score: number;
    strengths: string[];
    weaknesses: string[];
    tips: string[];
}

export const JUDGES: Judge[] = [
    { id: 'cash', nameKey: 'tank.judge_cash', styleKey: 'tank.style_cash', color: 'bg-green-600', minEquity: 25, maxValuationMultiplier: 0.8, patience: 3 },
    { id: 'tech', nameKey: 'tank.judge_tech', styleKey: 'tank.style_tech', color: 'bg-blue-600', minEquity: 15, maxValuationMultiplier: 1.5, patience: 5 },
    { id: 'vision', nameKey: 'tank.judge_vision', styleKey: 'tank.style_vision', color: 'bg-purple-600', minEquity: 20, maxValuationMultiplier: 1.2, patience: 4 },
    { id: 'eco', nameKey: 'tank.judge_eco', styleKey: 'tank.style_eco', color: 'bg-emerald-500', minEquity: 10, maxValuationMultiplier: 1.0, patience: 6 },
    { id: 'trend', nameKey: 'tank.judge_trend', styleKey: 'tank.style_trend', color: 'bg-pink-500', minEquity: 30, maxValuationMultiplier: 2.0, patience: 2 },
];

export class TheTankEngine {

    static analyzePitch(transcript: string, isAr: boolean): PitchAnalysis {
        const text = transcript.toLowerCase();

        const checkKeywords = (keywords: string[]) => keywords.some(k => text.includes(k));

        let score = 0;
        const strengths: string[] = [];
        const weaknesses: string[] = [];

        // KEYWORD DICTIONARIES
        const KW = {
            finance: isAr
                ? ['ربح', 'مال', 'فلوس', 'تكلفة', 'سعر', 'ريال', 'دخل', 'ميزانية', 'استثمار', 'مصاريف']
                : ['profit', 'money', 'revenue', 'cost', 'price', 'dollar', 'earn', 'fund'],
            problem: isAr
                ? ['مشكلة', 'صعوبة', 'تحدي', 'نحتاج', 'إصلاح', 'يعاني', 'غلط', 'أزمة']
                : ['problem', 'solve', 'need', 'fix', 'issue', 'pain'],
            solution: isAr
                ? ['حل', 'تطبيق', 'برنامج', 'منتج', 'خدمة', 'فكرة', 'مساعدة', 'نقدم', 'ابتكار']
                : ['solution', 'help', 'app', 'product', 'service', 'create', 'offer'],
            traction: isAr
                ? ['بيع', 'مبيعات', 'زبائن', 'عملاء', 'ناس', 'مستخدمين', 'طلب', 'سوق', 'اشتريت']
                : ['sales', 'customer', 'user', 'people', 'bought', 'sold', 'order', 'market']
        };

        // SCORING LOGIC
        if (checkKeywords(KW.finance)) {
            score += 15;
            strengths.push('mentioned_finance');
        } else {
            weaknesses.push('missing_finance');
        }

        const hasProblem = checkKeywords(KW.problem);
        const hasSolution = checkKeywords(KW.solution);

        if (hasProblem) score += 10;
        if (hasSolution) score += 10;

        if (hasProblem && hasSolution) {
            strengths.push('clear_problem_solution');
        } else {
            if (!hasProblem) weaknesses.push('missing_problem');
        }

        if (checkKeywords(KW.traction)) {
            score += 15;
            strengths.push('mentioned_traction');
        }

        if (text.length > 50) score += 10;
        if (text.length > 200) score += 20;

        // Random noise (Deterministic for tests if desired, but keeping randomness for game fun)
        // For testing we might want to mock Math.random, or we can just accept the range.
        // We'll keep it as is for now.
        score += Math.floor(Math.random() * 20);

        return {
            score,
            strengths,
            weaknesses,
            tips: [
                score < 40 ? 'tip_elaborate' : 'tip_keep_it_up',
                weaknesses.includes('missing_finance') ? 'tip_finance' : 'tip_general'
            ]
        };
    }

    static generateOffers(score: number): Offer[] {
        // Determine how many judges want in
        let numOffers = 0;
        if (score < 15) numOffers = 0; // Reject
        else if (score < 40) numOffers = 1;
        else if (score < 70) numOffers = 2;
        // Cap at 3 offers
        else numOffers = 3;

        if (numOffers === 0) {
            return [];
        }

        // Pick unique judges - simple shuffle
        const shuffledJudges = [...JUDGES].sort(() => 0.5 - Math.random());
        const selectedJudges = shuffledJudges.slice(0, numOffers);

        return selectedJudges.map(judge => {
            const baseValuation = 50000 + (score * 1000);
            let val = baseValuation * judge.maxValuationMultiplier;
            val = Math.round(val / 1000) * 1000;

            let eq = judge.minEquity;
            // Random slight variance
            eq += Math.floor(Math.random() * 5);

            return {
                judge,
                valuation: Math.max(10000, val),
                equity: Math.min(50, Math.max(5, eq)),
                // Localization happens in component, this is just a key or generic string
                // We'll return a status code or simple string key
                comment: score > 70 ? 'GREAT' : 'GOOD'
            };
        });
    }

    static checkCounterOffer(
        selectedOffer: Offer,
        counterValuation: number,
        counterEquity: number,
        currentValuation: number,
        currentEquity: number,
        round: number
    ): { accepted: boolean, counterOffer?: { valuation: number, equity: number }, message: string, isWalkAway?: boolean } {

        // Check Patience
        if (round >= selectedOffer.judge.patience) {
            return { accepted: false, message: 'ANGRY', isWalkAway: true };
        }

        // Logic
        // Judge accepts if valuation is <= 120% of current AND equity >= 80% of current
        const isReasonable = (counterValuation <= currentValuation * 1.2) && (counterEquity >= currentEquity * 0.8);

        // Auto accept if deal is SAME or BETTER for judge (Lower Val or Higher Equity)
        const isAutoAccept = counterValuation <= currentValuation && counterEquity >= currentEquity;

        if (isAutoAccept || isReasonable) {
            return { accepted: true, message: 'ACCEPTED' };
        } else {
            // Judge counters back
            // Meet in the middle
            const newOfferVal = Math.round((currentValuation + counterValuation) / 2 / 1000) * 1000;
            const newOfferEq = Math.round((currentEquity + counterEquity) / 2);

            return {
                accepted: false,
                counterOffer: { valuation: newOfferVal, equity: newOfferEq },
                message: 'COUNTER'
            };
        }
    }
}
