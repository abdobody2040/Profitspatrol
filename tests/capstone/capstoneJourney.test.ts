import { describe, it, expect, beforeEach } from 'vitest';
import { useCapstoneStore } from '../../src/features/capstone/store/capstoneStore';
import { CAPSTONE_PROBLEMS } from '../../src/features/capstone/data/capstoneData';
import { useAppStore } from '../../src/store';

describe('Grand Entrepreneurship Capstone System (Phase A - Section 49)', () => {
  beforeEach(() => {
    useCapstoneStore.getState().resetCapstone();
    useAppStore.setState({
      user: {
        id: 'capstone_candidate',
        name: 'Sarah Tycoon',
        xp: 1000,
        ppTokens: 500,
        level: 10,
        role: 'kid',
        hasGraduated: false,
        badges: []
      } as any
    });
  });

  it('1. Progresses through venture setup steps accurately', () => {
    const store = useCapstoneStore.getState();
    expect(store.currentStage).toBe('problem');

    // 1. Problem
    store.setProblem(CAPSTONE_PROBLEMS[1]);
    expect(useCapstoneStore.getState().venture.problemId).toBe(CAPSTONE_PROBLEMS[1].id);

    // 2. Solution
    store.setSolution('EcoSeed Pens', 'أقلام البذور البيئية', 'eco_stationery', 'plantable_cellulose');
    expect(useCapstoneStore.getState().venture.solutionNameEn).toBe('EcoSeed Pens');

    // 3. Economics
    store.setEconomics(1.5, 4.5);
    const ventEconomics = useCapstoneStore.getState().venture;
    expect(ventEconomics.unitCost).toBe(1.5);
    expect(ventEconomics.sellingPrice).toBe(4.5);
    expect(ventEconomics.marginPercent).toBe(67); // ((4.5 - 1.5) / 4.5) * 100 = 66.6% -> 67%

    // 4. Branding
    store.setBranding('EcoSprout Inc.', 'Plant Your Future!', 'ازرع مستقبلك!', '#10B981');
    expect(useCapstoneStore.getState().venture.companyName).toBe('EcoSprout Inc.');

    // 5. Operations
    store.setOperations('local_ethical');
    expect(useCapstoneStore.getState().venture.consequenceShield).toBe(true);

    // 6. Strategy
    store.setStrategy('innovation');
    expect(useCapstoneStore.getState().venture.competitiveMoat).toBe('innovation');
  });

  it('2. Pitching to The Tank produces valuation, offers, and official certificate', () => {
    const store = useCapstoneStore.getState();

    // Setup high-performing venture
    store.setProblem(CAPSTONE_PROBLEMS[0]);
    store.setEconomics(2.0, 6.0); // 67% margin
    store.setBranding('Crunchy Bites', 'Pure Energy!', 'طاقة نقية!', '#F97316');
    store.setOperations('local_ethical');
    store.setStrategy('customer_trust');

    const result = store.pitchToTheTank();
    expect(result.valuation).toBeGreaterThan(10000);
    expect(result.fundingRaised).toBeGreaterThan(2000);
    expect(['Tycoon', 'Founder']).toContain(result.grade);

    // Check store state
    const finalState = useCapstoneStore.getState();
    expect(finalState.currentStage).toBe('graduated');
    expect(finalState.venture.investorOffers).toHaveLength(3);

    // Ollie should invest due to solid economics
    const ollieOffer = finalState.venture.investorOffers.find(o => o.investorName.includes('Ollie'));
    expect(ollieOffer?.verdict).toBe('invest');

    // Filo should invest due to ethical supplier
    const filoOffer = finalState.venture.investorOffers.find(o => o.investorName.includes('Filo'));
    expect(filoOffer?.verdict).toBe('invest');

    // Certificate should be generated
    expect(finalState.certificate).not.toBeNull();
    expect(finalState.certificate?.studentName).toBe('Sarah Tycoon');
    expect(finalState.certificate?.companyName).toBe('Crunchy Bites');
    expect(finalState.certificate?.signatures.ollie).toBe(true);

    // AppStore user must be graduated and rewarded
    const user = useAppStore.getState().user;
    expect(user?.hasGraduated).toBe(true);
    expect(user?.xp).toBe(1500); // 1000 + 500
    expect(user?.ppTokens).toBe(800); // 500 + 300
    expect(user?.badges).toContain('badge_capstone_graduate');
  });

  it('3. Unethical supplier choice results in Philo passing on investment', () => {
    const store = useCapstoneStore.getState();
    store.setEconomics(1.0, 5.0);
    store.setOperations('cheap_unverified'); // Unethical choice!

    store.pitchToTheTank();
    const finalState = useCapstoneStore.getState();

    const filoOffer = finalState.venture.investorOffers.find(o => o.investorName.includes('Filo'));
    expect(filoOffer?.verdict).toBe('pass');
    expect(filoOffer?.offerTokens).toBe(0);
  });
});
