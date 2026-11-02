import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { localStorageAdapter } from '../../../services/persistence/LocalStorageAdapter';
import { BusinessVenture, BusinessType, QualityTier, SimulationResult } from '../types/business';
import { evaluateConsequences } from '../engine/consequenceEngine';
import { useTrustStore } from '../../characters/store/trustStore';
import { RelationshipEngine } from '../../characters/engine/relationshipEngine';
import { useAppStore } from '../../../store';

export interface BusinessStoreState {
  venture: BusinessVenture;
  lastSimResult: SimulationResult | null;
  initVenture: (type: BusinessType, name: string) => void;
  buyInventory: (units: number) => { success: boolean; message?: string; discountApplied?: boolean };
  setPrice: (price: number) => void;
  setQuality: (quality: QualityTier) => void;
  setMarketingBudget: (amount: number) => void;
  simulateNextDay: () => SimulationResult;
  clearConsequence: () => void;
  resetVenture: () => void;
}

const QUALITY_COSTS: Record<QualityTier, number> = {
  budget: 0.5,
  standard: 1.0,
  premium: 2.0
};

const DEFAULT_VENTURE: BusinessVenture = {
  id: 'biz_01',
  name: 'Sunnyside Lemonade',
  type: 'lemonade_stand',
  day: 1,
  cash: 50.0,
  inventory: 10,
  inventoryCostPerUnit: 1.0,
  sellingPrice: 2.0,
  qualityTier: 'standard',
  marketingBudget: 5.0,
  reputation: 60,
  customersServed: 0,
  totalRevenue: 0,
  totalExpenses: 0,
  netProfit: 0,
  history: []
};

export const useBusinessStore = create<BusinessStoreState>()(
  persist(
    (set, get) => ({
      venture: DEFAULT_VENTURE,
      lastSimResult: null,

      initVenture: (type: BusinessType, name: string) => {
        set({
          venture: {
            ...DEFAULT_VENTURE,
            id: `biz_${Date.now()}`,
            name,
            type,
            day: 1,
            cash: 50.0,
            inventory: 10,
            inventoryCostPerUnit: 1.0,
            sellingPrice: 2.0,
            qualityTier: 'standard',
            marketingBudget: 5.0,
            reputation: 60,
            history: []
          },
          lastSimResult: null
        });
      },

      buyInventory: (units: number) => {
        const { venture } = get();
        const trustStore = useTrustStore.getState();
        // Filo protection (filo_p2) or Rex deal (rex_p2) gives a 15% wholesale discount
        const hasWholesalePerk = trustStore.hasPerk('filo_p2') || trustStore.hasPerk('rex_p2');
        const discountMultiplier = hasWholesalePerk ? 0.85 : 1.0;

        const cost = Math.round(units * venture.inventoryCostPerUnit * discountMultiplier * 100) / 100;
        if (venture.cash < cost) {
          return { success: false, message: 'Not enough cash to purchase this inventory!' };
        }

        set({
          venture: {
            ...venture,
            cash: Math.round((venture.cash - cost) * 100) / 100,
            inventory: venture.inventory + units
          }
        });
        return { success: true, discountApplied: hasWholesalePerk };
      },

      setPrice: (price: number) => {
        set((state) => ({
          venture: {
            ...state.venture,
            sellingPrice: Math.max(0.25, Math.round(price * 100) / 100)
          }
        }));
      },

      setQuality: (quality: QualityTier) => {
        const trustStore = useTrustStore.getState();
        // Kami prototype mastery (kami_p3) gives 20% discount on premium sourcing
        const baseCost = QUALITY_COSTS[quality];
        const costWithKami = quality === 'premium' && trustStore.hasPerk('kami_p3')
          ? Math.round(baseCost * 0.8 * 100) / 100
          : baseCost;

        set((state) => ({
          venture: {
            ...state.venture,
            qualityTier: quality,
            inventoryCostPerUnit: costWithKami
          }
        }));
      },

      setMarketingBudget: (amount: number) => {
        set((state) => ({
          venture: {
            ...state.venture,
            marketingBudget: Math.max(0, Math.round(amount * 100) / 100)
          }
        }));
      },

      simulateNextDay: () => {
        const { venture } = get();
        const trustStore = useTrustStore.getState();

        // ── Active Hero Perks Integration ──
        const hasOllieForecast = trustStore.hasPerk('ollie_p3'); // +15% traffic from strategic planning
        const hasReemaMarketing = trustStore.hasPerk('reema_p2'); // +45% marketing efficiency
        const hasFiloShield = trustStore.hasPerk('filo_p2') || trustStore.hasPerk('filo_p4'); // Prevents steep empty shelf penalty

        // 1. Demand & Customer Visits calculation
        // Base traffic is 8-15 visitors (+15% if Ollie forecast perk active)
        const rawBaseTraffic = 8 + Math.floor(Math.random() * 8);
        const baseTraffic = hasOllieForecast ? Math.round(rawBaseTraffic * 1.15) : rawBaseTraffic;

        // Marketing boost: each $1 brings 1.5 visitors (boosted to 2.2 with Reema's perk)
        const visitorsPerDollar = hasReemaMarketing ? 2.2 : 1.5;
        const marketingBoost = Math.floor(venture.marketingBudget * visitorsPerDollar);

        // Reputation multiplier: 50 rep = 1.0x, 100 rep = 1.5x
        const repMultiplier = 0.5 + (venture.reputation / 100);
        const customersVisited = Math.max(2, Math.round((baseTraffic + marketingBoost) * repMultiplier));

        // 2. Conversion / Willingness to buy based on price vs perceived value
        const idealPrice = venture.qualityTier === 'budget' ? 1.5 : venture.qualityTier === 'standard' ? 3.0 : 5.0;
        let conversionRate = 0.8;
        if (venture.sellingPrice > idealPrice) {
          const markup = (venture.sellingPrice - idealPrice) / idealPrice;
          conversionRate = Math.max(0.1, 0.8 - markup * 0.7);
        } else if (venture.sellingPrice < idealPrice) {
          conversionRate = Math.min(0.98, 0.8 + ((idealPrice - venture.sellingPrice) / idealPrice) * 0.2);
        }

        const potentialBuyers = Math.round(customersVisited * conversionRate);
        const unitsSold = Math.min(potentialBuyers, venture.inventory);

        // 3. Financial calculations
        const revenue = Math.round(unitsSold * venture.sellingPrice * 100) / 100;
        const inventoryCostUsed = Math.round(unitsSold * venture.inventoryCostPerUnit * 100) / 100;
        // Marketing expense paid today (capped by available cash)
        const marketingSpent = Math.min(venture.cash, venture.marketingBudget);
        const totalExpenses = Math.round((inventoryCostUsed + marketingSpent) * 100) / 100;
        const dailyProfit = Math.round((revenue - totalExpenses) * 100) / 100;

        // 4. Reputation change
        let repDelta = 0;
        if (unitsSold > 0) {
          if (venture.qualityTier === 'premium' && conversionRate > 0.6) repDelta += 4;
          else if (venture.qualityTier === 'standard' && conversionRate >= 0.5) repDelta += 2;
          else if (venture.qualityTier === 'budget' && venture.sellingPrice > 2.0) repDelta -= 3;
        }
        if (customersVisited > unitsSold * 2 && venture.inventory === 0) {
          // Empty shelves disappointment penalty (reduced by Filo's shield)
          repDelta -= hasFiloShield ? 1 : 4;
        }

        const newReputation = Math.min(100, Math.max(10, venture.reputation + repDelta));
        const newCash = Math.max(0, Math.round((venture.cash - marketingSpent + revenue) * 100) / 100);
        const newInventory = Math.max(0, venture.inventory - unitsSold);

        // 5. Consequence check
        const consequence = evaluateConsequences(venture, {
          day: venture.day,
          customersVisited,
          unitsSold,
          revenue,
          inventoryCostUsed,
          marketingSpent,
          totalExpenses,
          dailyProfit,
          reputationChange: repDelta
        });

        // 6. Character Trust & Story Quests Feedback
        if (dailyProfit > 0) {
          RelationshipEngine.onPrudentSavingsMaintained();
        }
        if (marketingSpent > 0 && revenue > marketingSpent) {
          const roiPercent = Math.round(((revenue - marketingSpent) / marketingSpent) * 100);
          RelationshipEngine.onMarketingCampaignSuccess(roiPercent);
        }
        // General business practice awards Ollie strategic planning trust
        RelationshipEngine.onLessonCompleted('strategy', 75);

        const simResult: SimulationResult = {
          day: venture.day,
          customersVisited,
          unitsSold,
          revenue,
          inventoryCostUsed,
          marketingSpent,
          totalExpenses,
          dailyProfit,
          reputationChange: repDelta,
          consequence
        };

        const dailyRecord = {
          day: venture.day,
          customers: customersVisited,
          unitsSold,
          revenue,
          expenses: totalExpenses,
          profit: dailyProfit,
          reputationDelta: repDelta,
          eventNoteEn: consequence ? consequence.titleEn : undefined,
          eventNoteAr: consequence ? consequence.titleAr : undefined
        };

        set({
          venture: {
            ...venture,
            day: venture.day + 1,
            cash: newCash,
            inventory: newInventory,
            reputation: newReputation,
            customersServed: venture.customersServed + unitsSold,
            totalRevenue: Math.round((venture.totalRevenue + revenue) * 100) / 100,
            totalExpenses: Math.round((venture.totalExpenses + totalExpenses) * 100) / 100,
            netProfit: Math.round((venture.netProfit + dailyProfit) * 100) / 100,
            history: [dailyRecord, ...venture.history].slice(0, 30),
            activeConsequence: consequence
          },
          lastSimResult: simResult
        });

        if (unitsSold > 0) {
          try {
            useAppStore.getState().trackMissionProgress('BUSINESS_SALE', 1, 'launch');
          } catch (_) {}
        }

        return simResult;
      },

      clearConsequence: () => {
        set((state) => ({
          venture: {
            ...state.venture,
            activeConsequence: null
          }
        }));
      },

      resetVenture: () => {
        set({
          venture: DEFAULT_VENTURE,
          lastSimResult: null
        });
      }
    }),
    {
      name: 'profits-patrol-business-storage',
      storage: createJSONStorage(() => localStorageAdapter)
    }
  )
);
