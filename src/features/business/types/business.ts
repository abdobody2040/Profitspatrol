/**
 * ProfitsPatrol Persistent Business Simulation Types (PRD Sections 28 - 33, 109)
 */

export type BusinessType = 
  | 'lemonade_stand' 
  | 'craft_studio' 
  | 'pet_care' 
  | 'ecommerce' 
  | 'game_studio' 
  | 'eco_consulting';

export type QualityTier = 'budget' | 'standard' | 'premium';

export interface DailyRecord {
  day: number;
  customers: number;
  unitsSold: number;
  revenue: number;
  expenses: number;
  profit: number;
  reputationDelta: number;
  eventNoteEn?: string;
  eventNoteAr?: string;
}

export interface BusinessConsequence {
  id: string;
  type: 'warning' | 'celebration' | 'critical' | 'info';
  titleEn: string;
  titleAr: string;
  whyExplanationEn: string;
  whyExplanationAr: string;
  suggestedActionEn: string;
  suggestedActionAr: string;
  heroAdvisorId: 'ollie' | 'reema' | 'filo' | 'kami' | 'rex';
}

export interface BusinessVenture {
  id: string;
  name: string;
  type: BusinessType;
  day: number;
  cash: number;
  inventory: number;
  inventoryCostPerUnit: number;
  sellingPrice: number;
  qualityTier: QualityTier;
  marketingBudget: number;
  reputation: number; // 0 - 100
  customersServed: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  history: DailyRecord[];
  activeConsequence?: BusinessConsequence | null;
}

export interface SimulationResult {
  day: number;
  customersVisited: number;
  unitsSold: number;
  revenue: number;
  inventoryCostUsed: number;
  marketingSpent: number;
  totalExpenses: number;
  dailyProfit: number;
  reputationChange: number;
  consequence?: BusinessConsequence | null;
}
