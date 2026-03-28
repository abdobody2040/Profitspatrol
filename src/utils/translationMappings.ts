/**
 * Translation Key Mappings
 * 
 * This file provides type-safe mappings for dynamic translation keys.
 * 
 * WHY THIS EXISTS:
 * String concatenation in t() calls breaks i18next:
 *   ❌ t('the_tank.tier_' + tier) // Shows raw key in UI
 *   ✅ t(TIER_KEYS[tier])          // Works correctly
 * 
 * USAGE:
 *   import { TIER_KEYS } from '@/utils/translationMappings';
 *   const tierName = t(TIER_KEYS[user.subscriptionTier]);
 */

export const TIER_KEYS = {
    intern: 'pricing.tier_intern',
    founder: 'pricing.tier_founder',
    tycoon: 'pricing.tier_tycoon',
    board: 'pricing.tier_board'
} as const;

export type SubscriptionTier = keyof typeof TIER_KEYS;

/**
 * Game name mappings for dynamic game references
 */
export const GAME_KEYS = {
    lemonade_stand: 'games.lemonade_stand',
    pizza_delivery: 'games.pizza_delivery',
    coffee_cart: 'games.coffee_cart',
    taco_truck: 'games.taco_truck',
    cupcake_bakery: 'games.cupcake_bakery',
    ice_cream_parlor: 'games.ice_cream_parlor',
    car_wash: 'games.car_wash',
    pet_salon: 'games.pet_salon',
    print_shop: 'games.print_shop',
    toy_factory: 'games.toy_factory',
    operations: 'games.operations'
} as const;

export type GameId = keyof typeof GAME_KEYS;

/**
 * Category mappings for arcade filters
 */
export const CATEGORY_KEYS = {
    all: 'arcade.cat_all',
    retail: 'arcade.cat_retail',
    service: 'arcade.cat_service',
    production: 'arcade.cat_production',
    creative: 'arcade.cat_creative',
    tech: 'arcade.cat_tech',
    social: 'arcade.cat_social',
    tycoon: 'arcade.cat_tycoon'
} as const;

export type CategoryId = keyof typeof CATEGORY_KEYS;

/**
 * Helper function to safely get translation key
 * Falls back to a default if key doesn't exist
 */
export function getTranslationKey<T extends Record<string, string>>(
    mapping: T,
    key: string,
    fallback?: string
): string {
    return (mapping as any)[key] || fallback || key;
}
