
import { describe, it, expect, vi } from 'vitest';
import { TheTankEngine, JUDGES, Offer, PitchAnalysis } from '@/features/tank/logic/TheTankEngine';

describe('TheTankEngine', () => {

    describe('analyzePitch', () => {
        it('scores finance keywords in English', () => {
            const transcript = "We make a lot of profit and revenue";
            const analysis = TheTankEngine.analyzePitch(transcript, false);
            expect(analysis.strengths).toContain('mentioned_finance');
            expect(analysis.score).toBeGreaterThanOrEqual(15);
        });

        it('scores finance keywords in Arabic', () => {
            const transcript = "لدينا ربح عالي ودخل ممتاز";
            const analysis = TheTankEngine.analyzePitch(transcript, true);
            expect(analysis.strengths).toContain('mentioned_finance');
            expect(analysis.score).toBeGreaterThanOrEqual(15);
        });

        it('identifies clear problem_solution structure', () => {
            const transcript = "The problem is homework is boring. Our solution is this fun app.";
            const analysis = TheTankEngine.analyzePitch(transcript, false);
            expect(analysis.strengths).toContain('clear_problem_solution');
        });

        it('penalizes pitch with no financial data', () => {
            const transcript = "I have a cool idea about spaceships.";
            const analysis = TheTankEngine.analyzePitch(transcript, false);
            expect(analysis.weaknesses).toContain('missing_finance');
        });
    });

    describe('generateOffers', () => {
        // cases: score below threshold / medium / high
        test.each([
            [10, 0],
            [30, 1],
            [90, 3],
        ])('score %i generates %i offers', (score, expectedCount) => {
            expect(TheTankEngine.generateOffers(score)).toHaveLength(expectedCount);
        });
    });

    describe('checkCounterOffer', () => {
        const mockJudge = JUDGES[0]; // Cash Judge (Patience 3)
        const mockOffer: Offer = {
            judge: mockJudge,
            valuation: 100000,
            equity: 20,
            comment: 'Test'
        };

        it('auto-accepts when user offers better terms than judge', () => {
            // User gives higher equity — strictly better for the judge
            const result = TheTankEngine.checkCounterOffer(
                mockOffer,
                100000, // same valuation
                25,     // higher equity (user is generous)
                100000,
                20,
                0
            );
            expect(result.accepted).toBe(true);
        });

        it('walks away when negotiation rounds exceed judge patience', () => {
            const result = TheTankEngine.checkCounterOffer(
                mockOffer,
                200000,
                10,
                100000,
                20,
                5 // Round 5 > Patience 3
            );
            expect(result.isWalkAway).toBe(true);
        });

        it('accepts reasonable counter within 20% of current valuation', () => {
            // isReasonable: counterVal <= currentVal * 1.2 AND counterEquity >= currentEquity * 0.8
            // 110k <= 120k (true), 20 >= 16 (true) → accepted
            const result = TheTankEngine.checkCounterOffer(
                mockOffer,
                110000,
                20,
                100000,
                20,
                0
            );
            expect(result.accepted).toBe(true);
        });

        it('meets in the middle on unreasonable counter', () => {
            // 200k > 120k → unreasonable → counter = (100k + 200k) / 2 = 150k
            const result = TheTankEngine.checkCounterOffer(
                mockOffer,
                200000,
                20,
                100000,
                20,
                0
            );
            expect(result.accepted).toBe(false);
            expect(result.counterOffer?.valuation).toBe(150000);
        });
    });
});
