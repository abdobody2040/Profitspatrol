/**
 * Single source of truth for all module/topic definitions used in KidMap.
 *
 * Previously this data was spread across three separate lookup tables inside
 * KidMap.tsx (toLicenseKey, getProjectCode, and the if/else icon chain).
 * Any new module now only needs to be added here.
 */

import type { LucideIcon } from 'lucide-react';
import {
    Coins, Rocket, TrendingUp, Megaphone, Star, Globe, Cpu,
    HeartHandshake, Plane, Brain, Bitcoin, Leaf, Building2,
    BarChart2, Sparkles, DollarSign, Briefcase,
} from 'lucide-react';

export interface ModuleDefinition {
    /** Display name — must match lesson.topic_tag exactly */
    tag: string;
    /** snake_case key used for subscription license checks */
    licenseKey: string;
    /** Short code passed to ProjectSubmitter as lessonId */
    projectCode: string;
    /** Tailwind color name (without prefix) used for node theming */
    color: string;
    /** Lucide icon component rendered on the map node */
    Icon: LucideIcon;
    /** Which season this module belongs to (1–4) */
    season: 1 | 2 | 3 | 4;
}

export const MODULE_DEFINITIONS: readonly ModuleDefinition[] = [
    // ── Season 1: Foundation ──────────────────────────────────────────────────
    { tag: 'Money Basics',           licenseKey: 'money_basics',          projectCode: 'MOD_MB',     color: 'yellow',  Icon: Coins,          season: 1 },
    { tag: 'Entrepreneurship',       licenseKey: 'entrepreneurship',       projectCode: 'MOD_ENT',    color: 'orange',  Icon: Rocket,         season: 1 },
    { tag: 'Investing & Wealth',     licenseKey: 'investing_wealth',       projectCode: 'MOD_INV',    color: 'emerald', Icon: TrendingUp,     season: 1 },
    { tag: 'Marketing',              licenseKey: 'marketing',              projectCode: 'MOD_MKT',    color: 'rose',    Icon: Megaphone,      season: 1 },
    { tag: 'Leadership',             licenseKey: 'leadership',             projectCode: 'MOD_LDR',    color: 'purple',  Icon: Star,           season: 1 },
    { tag: 'Economics',              licenseKey: 'economics',              projectCode: 'MOD_ECO',    color: 'cyan',    Icon: Globe,          season: 1 },
    { tag: 'Technology',             licenseKey: 'technology',             projectCode: 'MOD_TECH',   color: 'indigo',  Icon: Cpu,            season: 1 },
    { tag: 'Social Responsibility',  licenseKey: 'social_responsibility',  projectCode: 'MOD_SOC',    color: 'lime',    Icon: HeartHandshake, season: 1 },
    { tag: 'Global Business',        licenseKey: 'global_business',        projectCode: 'MOD_GLO',    color: 'sky',     Icon: Plane,          season: 1 },
    { tag: 'Financial Smarts',       licenseKey: 'financial_smarts',       projectCode: 'MOD_FIN',    color: 'teal',    Icon: Brain,          season: 1 },

    // ── Season 2: Advanced Track ──────────────────────────────────────────────
    { tag: 'Crypto & Blockchain',    licenseKey: 'crypto_blockchain',      projectCode: 'MOD_CRYPTO', color: 'amber',   Icon: Bitcoin,        season: 2 },
    { tag: 'AI & Future Jobs',       licenseKey: 'ai_future_jobs',         projectCode: 'MOD_AIJOB',  color: 'blue',    Icon: Cpu,            season: 2 },
    { tag: 'Sustainability Business',licenseKey: 'sustainability_business', projectCode: 'MOD_SUST',   color: 'green',   Icon: Leaf,           season: 2 },

    // ── Season 3: CEO Track ───────────────────────────────────────────────────
    { tag: 'Venture Capital',        licenseKey: 'venture_capital',        projectCode: 'MOD_VC',     color: 'yellow',  Icon: TrendingUp,     season: 3 },
    { tag: 'Corporate Strategy',     licenseKey: 'corporate_strategy',     projectCode: 'MOD_CORP',   color: 'violet',  Icon: Building2,      season: 3 },
    { tag: 'Global Trade',           licenseKey: 'global_trade',           projectCode: 'MOD_GLOB',   color: 'teal',    Icon: Globe,          season: 3 },

    // ── Season 4: Mastery Track ───────────────────────────────────────────────
    { tag: 'Financial Modeling',     licenseKey: 'financial_modeling',     projectCode: 'MOD_FMD',    color: 'fuchsia', Icon: BarChart2,      season: 4 },
    { tag: 'Brand Building',         licenseKey: 'brand_building',         projectCode: 'MOD_BRAND',  color: 'pink',    Icon: Sparkles,       season: 4 },
    { tag: 'Future of Money',        licenseKey: 'future_of_money',        projectCode: 'MOD_FUTURE', color: 'indigo',  Icon: DollarSign,     season: 4 },
    { tag: 'Negotiation & Persuasion',licenseKey: 'negotiation_persuasion', projectCode: 'MOD_NEG',    color: 'orange',  Icon: Briefcase,      season: 4 },
] as const;

/** O(1) lookup map — tag → ModuleDefinition */
export const MODULE_MAP = new Map<string, ModuleDefinition>(
    MODULE_DEFINITIONS.map(m => [m.tag, m])
);
