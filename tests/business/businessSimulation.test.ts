import { describe, it, expect, beforeEach } from 'vitest';
import { useBusinessStore } from '../../src/features/business/store/businessStore';
import { evaluateConsequences } from '../../src/features/business/engine/consequenceEngine';
import { BusinessVenture } from '../../src/features/business/types/business';
import { useTrustStore } from '../../src/features/characters/store/trustStore';

describe('Persistent Business Simulation (Phase 5) & Hero Perks', () => {
  beforeEach(() => {
    useBusinessStore.getState().resetVenture();
    useTrustStore.getState().resetAllTrust();
  });

  it('initializes with default venture properties', () => {
    const venture = useBusinessStore.getState().venture;
    expect(venture.name).toBe('Sunnyside Lemonade');
    expect(venture.type).toBe('lemonade_stand');
    expect(venture.cash).toBe(50);
    expect(venture.inventory).toBe(10);
    expect(venture.sellingPrice).toBe(2.0);
    expect(venture.day).toBe(1);
  });

  it('handles inventory purchases and prevents purchases without sufficient cash', () => {
    const store = useBusinessStore.getState();

    // Buy 10 units at $1.00 cost = $10
    const res1 = store.buyInventory(10);
    expect(res1.success).toBe(true);

    const updated1 = useBusinessStore.getState().venture;
    expect(updated1.inventory).toBe(20);
    expect(updated1.cash).toBe(40);

    // Try to buy 100 units at $1.00 cost = $100 (cash is only $40)
    const res2 = store.buyInventory(100);
    expect(res2.success).toBe(false);
    expect(useBusinessStore.getState().venture.cash).toBe(40);
  });

  it('applies wholesale discount when Filo or Rex perks are unlocked', () => {
    const store = useBusinessStore.getState();
    const trustStore = useTrustStore.getState();

    // Unlock Rex Tier 2 (which gives rex_p2)
    trustStore.addTrust('rex', 120, 'Showdown win', 'فوز في النزال');
    expect(trustStore.hasPerk('rex_p2')).toBe(true);

    // Buy 10 units: with 15% discount, cost should be $8.50 instead of $10.00
    const res = store.buyInventory(10);
    expect(res.success).toBe(true);
    expect(res.discountApplied).toBe(true);

    const updated = useBusinessStore.getState().venture;
    expect(updated.cash).toBe(41.5); // 50 - 8.5
    expect(updated.inventory).toBe(20);
  });

  it('updates price, quality tier, and marketing budget', () => {
    const store = useBusinessStore.getState();

    store.setPrice(3.5);
    store.setQuality('premium');
    store.setMarketingBudget(10);

    const venture = useBusinessStore.getState().venture;
    expect(venture.sellingPrice).toBe(3.5);
    expect(venture.qualityTier).toBe('premium');
    expect(venture.inventoryCostPerUnit).toBe(2.0);
    expect(venture.marketingBudget).toBe(10);
  });

  it('applies Kami discount for premium sourcing when kami_p3 is unlocked', () => {
    const store = useBusinessStore.getState();
    const trustStore = useTrustStore.getState();

    // Unlock Kami Tier 3 (giving kami_p3)
    trustStore.addTrust('kami', 260, 'Lab inventions', 'اختراعات المعمل');
    expect(trustStore.hasPerk('kami_p3')).toBe(true);

    store.setQuality('premium');
    const venture = useBusinessStore.getState().venture;
    // Base 2.0 with 20% discount = 1.6
    expect(venture.inventoryCostPerUnit).toBe(1.6);
  });

  it('simulates daily sales, accurately computing revenue, expenses, and profit', () => {
    const store = useBusinessStore.getState();
    store.setPrice(2.0);
    store.setMarketingBudget(5.0);

    const sim = store.simulateNextDay();
    expect(sim.day).toBe(1);
    expect(sim.customersVisited).toBeGreaterThan(0);
    expect(sim.unitsSold).toBeLessThanOrEqual(10); // Capped by starting inventory of 10
    expect(sim.revenue).toBe(Math.round(sim.unitsSold * 2.0 * 100) / 100);
    expect(sim.totalExpenses).toBeGreaterThanOrEqual(0);

    const nextVenture = useBusinessStore.getState().venture;
    expect(nextVenture.day).toBe(2);
    expect(nextVenture.history.length).toBe(1);
  });

  it('evaluates consequences when selling below cost', () => {
    const mockVenture: BusinessVenture = {
      id: 'v1',
      name: 'Test Stand',
      type: 'lemonade_stand',
      day: 1,
      cash: 50,
      inventory: 10,
      inventoryCostPerUnit: 2.0, // High cost
      sellingPrice: 1.0, // Selling at a loss!
      qualityTier: 'premium',
      marketingBudget: 0,
      reputation: 60,
      customersServed: 0,
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      history: []
    };

    const consequence = evaluateConsequences(mockVenture, {
      day: 1,
      customersVisited: 10,
      unitsSold: 5,
      revenue: 5,
      inventoryCostUsed: 10,
      marketingSpent: 0,
      totalExpenses: 10,
      dailyProfit: -5,
      reputationChange: 0
    });

    expect(consequence).not.toBeNull();
    expect(consequence?.id).toBe('cons_selling_below_cost');
    expect(consequence?.heroAdvisorId).toBe('filo');
  });

  it('detects empty inventory with marketing spent', () => {
    const mockVenture: BusinessVenture = {
      id: 'v2',
      name: 'Test Stand',
      type: 'lemonade_stand',
      day: 1,
      cash: 20,
      inventory: 0, // No stock
      inventoryCostPerUnit: 1.0,
      sellingPrice: 2.5,
      qualityTier: 'standard',
      marketingBudget: 10, // Spent on marketing
      reputation: 60,
      customersServed: 0,
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      history: []
    };

    const consequence = evaluateConsequences(mockVenture, {
      day: 1,
      customersVisited: 15,
      unitsSold: 0,
      revenue: 0,
      inventoryCostUsed: 0,
      marketingSpent: 10,
      totalExpenses: 10,
      dailyProfit: -10,
      reputationChange: -4
    });

    expect(consequence).not.toBeNull();
    expect(consequence?.id).toBe('cons_empty_shelves');
    expect(consequence?.heroAdvisorId).toBe('ollie');
  });
});
