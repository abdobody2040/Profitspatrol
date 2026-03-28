import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { Logger } from '../../services/logger';


// ─── Types ────────────────────────────────────────────────────────────────────

export type FranchiseTier = 'KIOSK' | 'SHOP' | 'STORE' | 'ENTERPRISE';

export interface FranchiseVisit {
  visitorName: string;
  visitorEmoji: string;
  bizCoinsSpent: number;
  timestamp: string;
}

export interface FranchiseState {
  isUnlocked: boolean;          // Unlocked at level 5+
  isOpen: boolean;              // Player has opened their franchise
  tier: FranchiseTier;
  totalVisitors: number;
  totalEarned: number;
  pendingIncome: number;        // BizCoins waiting to be collected
  lastCollectedAt: string | null;
  recentVisits: FranchiseVisit[];  // Last 5 visitors shown in UI
  upgradeCount: number;         // How many times they've upgraded
}

export interface FranchiseSlice {
  franchise: FranchiseState;
  openFranchise: () => void;
  collectFranchiseIncome: () => number;
  upgradeFranchise: () => void;
  tickFranchise: () => void;    // Called on HQ mount to accrue income since last visit
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Min level to unlock franchise
const FRANCHISE_UNLOCK_LEVEL = 5;

// Income per hour by tier (in BizCoins)
const INCOME_PER_HOUR: Record<FranchiseTier, number> = {
  KIOSK: 10,
  SHOP: 25,
  STORE: 60,
  ENTERPRISE: 120,
};

// Upgrade cost by current tier → next
const UPGRADE_COST: Record<FranchiseTier, number> = {
  KIOSK: 500,
  SHOP: 1500,
  STORE: 4000,
  ENTERPRISE: 0, // Max tier
};

const TIER_ORDER: FranchiseTier[] = ['KIOSK', 'SHOP', 'STORE', 'ENTERPRISE'];

// Max pending income before it caps (keep things fair)
const MAX_PENDING_INCOME = 500;

// Mock visitor pool — deterministically seeded for fun
const VISITOR_POOL = [
  { name: 'Zaid K.', emoji: '👦' },
  { name: 'Layla M.', emoji: '👧' },
  { name: 'Omar B.', emoji: '🧑' },
  { name: 'Yasmin A.', emoji: '👩' },
  { name: 'Adam S.', emoji: '🧒' },
  { name: 'Sara J.', emoji: '👧' },
  { name: 'Bilal T.', emoji: '👦' },
  { name: 'Nour R.', emoji: '👩' },
  { name: 'Khalid F.', emoji: '🧑' },
  { name: 'Hana W.', emoji: '👧' },
];

function generateVisit(tier: FranchiseTier, seed: number): FranchiseVisit {
  const visitor = VISITOR_POOL[seed % VISITOR_POOL.length];
  const spend = Math.floor(INCOME_PER_HOUR[tier] / 4) + (seed % 5);
  return {
    visitorName: visitor.name,
    visitorEmoji: visitor.emoji,
    bizCoinsSpent: Math.max(1, spend),
    timestamp: new Date().toISOString(),
  };
}

// ─── Initial State ─────────────────────────────────────────────────────────────

const INITIAL_FRANCHISE: FranchiseState = {
  isUnlocked: false,
  isOpen: false,
  tier: 'KIOSK',
  totalVisitors: 0,
  totalEarned: 0,
  pendingIncome: 0,
  lastCollectedAt: null,
  recentVisits: [],
  upgradeCount: 0,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

export const createFranchiseSlice: StateCreator<AppState, [], [], FranchiseSlice> = (
  set,
  get
) => ({
  franchise: INITIAL_FRANCHISE,

  openFranchise: () => {
    const { user } = get();
    if (!user) return;

    const level = user.level ?? 1;
    if (level < FRANCHISE_UNLOCK_LEVEL) {
      Logger.warn(`[Franchise] User level ${level} < required ${FRANCHISE_UNLOCK_LEVEL}`);
      return;
    }

    set((state) => ({
      franchise: {
        ...state.franchise,
        isUnlocked: true,
        isOpen: true,
        lastCollectedAt: new Date().toISOString(),
      },
    }));
    Logger.info('[Franchise] Franchise opened');
  },

  collectFranchiseIncome: () => {
    const { franchise, user } = get();
    if (!franchise.isOpen || !user) return 0;

    const amount = franchise.pendingIncome;
    if (amount <= 0) return 0;

    set((state) => ({
      franchise: {
        ...state.franchise,
        pendingIncome: 0,
        totalEarned: state.franchise.totalEarned + amount,
        lastCollectedAt: new Date().toISOString(),
      },
      // Credit BizCoins to the user
      user: state.user
        ? { ...state.user, bizCoins: (state.user.bizCoins ?? 0) + amount }
        : state.user,
    }));

    Logger.info(`[Franchise] Collected ${amount} BizCoins`);
    return amount;
  },

  upgradeFranchise: () => {
    const { franchise, user } = get();
    if (!franchise.isOpen || !user) return;

    const currentIdx = TIER_ORDER.indexOf(franchise.tier);
    if (currentIdx >= TIER_ORDER.length - 1) return; // Already max tier

    const cost = UPGRADE_COST[franchise.tier];
    const currentCoins = user.bizCoins ?? 0;

    if (currentCoins < cost) {
      Logger.warn(`[Franchise] Not enough coins: need ${cost}, have ${currentCoins}`);
      return;
    }

    const nextTier = TIER_ORDER[currentIdx + 1];

    set((state) => ({
      franchise: {
        ...state.franchise,
        tier: nextTier,
        upgradeCount: state.franchise.upgradeCount + 1,
      },
      user: state.user
        ? { ...state.user, bizCoins: (state.user.bizCoins ?? 0) - cost }
        : state.user,
    }));

    Logger.info(`[Franchise] Upgraded to ${nextTier}`);
  },

  tickFranchise: () => {
    const { franchise } = get();
    if (!franchise.isOpen || !franchise.lastCollectedAt) return;

    const now = new Date();
    const lastCollected = new Date(franchise.lastCollectedAt);
    const elapsedHours = (now.getTime() - lastCollected.getTime()) / (1000 * 60 * 60);

    // ✅ FIX: Guard against negative elapsed time.
    // Clock going backwards (NTP correction, DST, tampered localStorage) would produce
    // negative rawIncome, corrupting pendingIncome below zero.
    if (elapsedHours <= 0) return;
    if (elapsedHours < 0.05) return; // Minimum 3 minutes gap

    const incomeRate = INCOME_PER_HOUR[franchise.tier];
    const rawIncome = Math.floor(incomeRate * elapsedHours);
    const newPending = Math.min(franchise.pendingIncome + rawIncome, MAX_PENDING_INCOME);

    // Generate proportional mock visits (1 per 10 coins earned)
    const numVisits = Math.max(0, Math.min(5, Math.floor(rawIncome / 10)));
    const seed = Math.floor(Date.now() / 1000);
    const newVisits: FranchiseVisit[] = Array.from({ length: numVisits }, (_, i) =>
      generateVisit(franchise.tier, seed + i)
    );

    const allVisits = [...newVisits, ...franchise.recentVisits].slice(0, 5);

    set((state) => ({
      franchise: {
        ...state.franchise,
        pendingIncome: newPending,
        totalVisitors: state.franchise.totalVisitors + numVisits,
        recentVisits: allVisits,
      },
    }));
  },
});

// ─── Helpers (exported for UI use) ────────────────────────────────────────────

export { INCOME_PER_HOUR, UPGRADE_COST, TIER_ORDER, FRANCHISE_UNLOCK_LEVEL, MAX_PENDING_INCOME };
