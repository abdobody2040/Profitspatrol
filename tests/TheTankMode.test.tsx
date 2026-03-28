
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import TheTankMode from '@/features/tank/components/TheTankMode';
import { TheTankEngine } from '@/features/tank/logic/TheTankEngine';
import * as SoundContext from '@/contexts/SoundContext';
import * as AppStore from '@/store';

// Mock Translation
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            language: 'en',
            changeLanguage: vi.fn(),
        },
    }),
}));

// Mock confetti
vi.mock('canvas-confetti', () => ({
    default: vi.fn(),
}));

// Mock SoundContext
const mockPlaySuccess = vi.fn();
const mockPlayMoney = vi.fn();
const mockPlayError = vi.fn();
vi.spyOn(SoundContext, 'useAppSound').mockReturnValue({
    playSuccess: mockPlaySuccess,
    playMoney: mockPlayMoney,
    playError: mockPlayError,
    playClick: vi.fn(),



    toggleMute: vi.fn(),
    mute: false,

});

// Mock Store
const mockUpdateUser = vi.fn();
vi.spyOn(AppStore, 'useAppStore').mockReturnValue({
    user: { id: 'test-user', bizCoins: 1000 },
    updateUser: mockUpdateUser,
} as any);

// Mock Engine to be deterministic
vi.mock('@/features/tank/logic/TheTankEngine', async (importOriginal) => {
    const actual: any = await importOriginal();
    return {
        ...actual,
        TheTankEngine: {
            ...actual.TheTankEngine,
            analyzePitch: vi.fn(),
            generateOffers: vi.fn(),
            checkCounterOffer: vi.fn(),
        },
    };
});

describe('TheTankMode Component', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders correctly in PREP stage', () => {
        render(<TheTankMode />);
        expect(screen.getByText('the_tank.title')).toBeInTheDocument();
        expect(screen.getByText('the_tank.action_ready')).toBeInTheDocument();
    });

    it('transitions to PITCH stage on click', () => {
        render(<TheTankMode />);
        fireEvent.click(screen.getByText('the_tank.action_ready'));
        expect(screen.getByText('the_tank.stage_pitch_title')).toBeInTheDocument();
    });

    it('handles pitch submission and analysis flow', async () => {
        // Setup Mock Returns
        (TheTankEngine.analyzePitch as any).mockReturnValue({
            score: 80,
            strengths: ['mentioned_finance'],
            weaknesses: [],
            tips: ['tip_keep_it_up'],
        });

        (TheTankEngine.generateOffers as any).mockReturnValue([
            {
                judge: { id: 'test', nameKey: 'Judge Test', styleKey: 'Test Style', color: 'bg-red-500', minEquity: 10, maxValuationMultiplier: 1.0, patience: 3 },
                valuation: 100000,
                equity: 10,
                comment: 'GREAT'
            }
        ]);

        render(<TheTankMode />);

        // Go to Pitch
        fireEvent.click(screen.getByText('the_tank.action_ready'));

        // Enter Text
        const textarea = screen.getByPlaceholderText('the_tank.placeholder');
        fireEvent.change(textarea, { target: { value: 'I have a great business with lots of profit.' } });

        // Submit
        fireEvent.click(screen.getByText('the_tank.action_submit'));

        // Advance timers to simulate analysis time
        act(() => {
            vi.advanceTimersByTime(5000);
        });

        // Check if we are in OFFERS selection
        try {
            expect(screen.getByText('the_tank.offers_available')).toBeInTheDocument();
        } catch (e) {
            console.log('Test failed to find offers_available. Current screen:');
            screen.debug();
            throw e;
        }

        expect(TheTankEngine.analyzePitch).toHaveBeenCalled();
        expect(TheTankEngine.generateOffers).toHaveBeenCalledWith(80);
        expect(mockPlaySuccess).toHaveBeenCalled();
    });

    it('blocks submission if finance details are missing', async () => {
        // Setup Mock Returns with missing finance
        (TheTankEngine.analyzePitch as any).mockReturnValue({
            score: 10,
            strengths: [],
            weaknesses: ['missing_finance'],
            tips: ['tip_finance'],
        });

        render(<TheTankMode />);

        // Go to Pitch
        fireEvent.click(screen.getByText('the_tank.action_ready'));

        // Enter Weak Text
        const textarea = screen.getByPlaceholderText('the_tank.placeholder');
        fireEvent.change(textarea, { target: { value: 'I have a cool idea.' } });

        // Submit
        fireEvent.click(screen.getByText('the_tank.action_submit'));

        // Should show error and NOT advance
        expect(screen.getByText('the_tank.error_missing_finance')).toBeInTheDocument();
        expect(mockPlayError).toHaveBeenCalled();

        // Should NOT show thinking text
        expect(screen.queryByText('the_tank.thinking_1')).not.toBeInTheDocument();
    });

    it('handles offer selection and accepting a deal', async () => {
        // Setup State to be in OFFER_SELECTION (by mocking flow again or just starting there if we exported stage... but we can't easily. So we flow through) or we can mock generateOffers to return immediately?
        // Let's flow through.

        (TheTankEngine.analyzePitch as any).mockReturnValue({
            score: 80,
            strengths: [],
            weaknesses: [],
            tips: []
        });

        const mockOffer = {
            judge: { id: 'cash', nameKey: 'the_tank.judge_cash', styleKey: 'the_tank.style_cash', color: 'bg-green-600', minEquity: 25, maxValuationMultiplier: 0.8, patience: 3 },
            valuation: 50000,
            equity: 20,
            comment: 'GREAT'
        };

        (TheTankEngine.generateOffers as any).mockReturnValue([mockOffer]);

        render(<TheTankMode />);

        // Flow to Offers
        fireEvent.click(screen.getByText('the_tank.action_ready'));
        const textarea = screen.getByPlaceholderText('the_tank.placeholder');
        fireEvent.change(textarea, { target: { value: 'Pitch pitch pitch' } });
        fireEvent.click(screen.getByText('the_tank.action_submit'));

        act(() => {
            vi.advanceTimersByTime(10000);
        });

        // Verify we reached selection stage
        expect(screen.getByText('the_tank.offers_available')).toBeInTheDocument();

        // Select Offer
        const offerCard = screen.getByText('the_tank.judge_cash');
        fireEvent.click(offerCard);

        // Verify Negotiation Screen
        expect(screen.getByText('the_tank.label_offer')).toBeInTheDocument();

        // Accept Deal
        fireEvent.click(screen.getByText('the_tank.action_deal'));

        // Check Deal Screen
        expect(screen.getByText('the_tank.deal_title')).toBeInTheDocument();
        expect(mockUpdateUser).toHaveBeenCalled();
        expect(mockPlayMoney).toHaveBeenCalled();
    });

    it('handles negotiation counter offer flow', async () => {
        (TheTankEngine.analyzePitch as any).mockReturnValue({ score: 80, strengths: [], weaknesses: [], tips: [] });

        const mockOffer = {
            judge: { id: 'cash', nameKey: 'the_tank.judge_cash', styleKey: 'the_tank.style_cash', color: 'bg-green-600', minEquity: 25, maxValuationMultiplier: 0.8, patience: 3 },
            valuation: 50000,
            equity: 20,
            comment: 'GOOD'
        };
        (TheTankEngine.generateOffers as any).mockReturnValue([mockOffer]);

        // Counter Logic Mock
        (TheTankEngine.checkCounterOffer as any).mockReturnValue({
            accepted: false,
            counterOffer: { valuation: 60000, equity: 22 },
            message: 'COUNTER'
        });

        render(<TheTankMode />);

        // Flow to Offers
        fireEvent.click(screen.getByText('the_tank.action_ready'));
        const textarea = screen.getByPlaceholderText('the_tank.placeholder');
        fireEvent.change(textarea, { target: { value: 'Pitch pitch pitch' } });
        fireEvent.click(screen.getByText('the_tank.action_submit'));
        act(() => {
            vi.advanceTimersByTime(10000);
        });

        // Select Offer
        const offerCard = screen.getByText('the_tank.judge_cash');
        fireEvent.click(offerCard);

        // Click Counter
        fireEvent.click(screen.getByText('the_tank.action_counter'));

        // Verify Counter UI
        expect(screen.getByText('the_tank.counter_title')).toBeInTheDocument();

        // Submit Counter
        fireEvent.click(screen.getByText('the_tank.action_submit_counter'));

        // Should have called checkCounterOffer
        expect(TheTankEngine.checkCounterOffer).toHaveBeenCalled();

        // Should show counter message/stage update (In this mock, it returns a counter offer, so it stays in negotiation but updates values)
        // verify one of the values updated if we can check text content
        expect(screen.getByText('$60,000')).toBeInTheDocument(); // 60k was our mock return
    });

});
