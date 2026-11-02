/**
 * ProfitsPatrol Asset Registry (PRD Section 57 & 58)
 * Centralizes visual and audio assets to ensure external replaceability
 * without hardcoding asset paths inside individual components.
 */

export type AssetType = 'image' | 'audio' | 'animation' | 'icon' | 'badge';
export type AssetStatus = 'active' | 'deprecated' | 'placeholder';
export type CharacterId = 'ollie' | 'reema' | 'filo' | 'kami' | 'rex';
export type CharacterEmotion =
  | 'default'
  | 'idle'
  | 'happy'
  | 'sad'
  | 'thinking'
  | 'surprised'
  | 'excited'
  | 'celebrating'
  | 'worried'
  | 'pointing'
  | 'talking';

export interface AssetEntry {
  assetId: string;
  assetType: AssetType;
  path: string;
  version: number;
  characterId?: CharacterId;
  emotion?: CharacterEmotion;
  language?: 'ar' | 'en' | 'universal';
  theme?: 'junior' | 'explorer' | 'shared';
  status: AssetStatus;
  altTextEn?: string;
  altTextAr?: string;
}

export const ASSET_REGISTRY: Map<string, AssetEntry> = new Map();

/** Initial seed of canonical character and world assets */
const INITIAL_ASSETS: AssetEntry[] = [
  // ── Ollie (Plan) ──
  {
    assetId: 'hero_ollie_default',
    assetType: 'image',
    path: '/brand/ollie-logo.png',
    version: 1,
    characterId: 'ollie',
    emotion: 'default',
    status: 'active',
    altTextEn: 'Ollie the Owl',
    altTextAr: 'البومة أولي'
  },
  {
    assetId: 'hero_ollie_wave',
    assetType: 'image',
    path: '/assets/ollie_wave.png',
    version: 1,
    characterId: 'ollie',
    emotion: 'talking',
    status: 'active',
    altTextEn: 'Ollie waving',
    altTextAr: 'أولي يلوح'
  },
  {
    assetId: 'hero_ollie_happy',
    assetType: 'image',
    path: '/characters/ollie/cheer.webp',
    version: 1,
    characterId: 'ollie',
    emotion: 'happy',
    status: 'active'
  },
  {
    assetId: 'hero_ollie_thinking',
    assetType: 'image',
    path: '/characters/ollie/think.webp',
    version: 1,
    characterId: 'ollie',
    emotion: 'thinking',
    status: 'active'
  },
  {
    assetId: 'hero_ollie_celebrating',
    assetType: 'image',
    path: '/characters/ollie/cheer.webp',
    version: 1,
    characterId: 'ollie',
    emotion: 'celebrating',
    status: 'active'
  },

  // ── Reema (Connect) ──
  {
    assetId: 'hero_reema_default',
    assetType: 'image',
    path: '/images/characters_clean/reema_idle.png',
    version: 1,
    characterId: 'reema',
    emotion: 'default',
    status: 'active',
    altTextEn: 'Reema the Connector',
    altTextAr: 'ريما رائدة التواصل'
  },
  {
    assetId: 'hero_reema_happy',
    assetType: 'image',
    path: '/images/characters_clean/reema_idle.png',
    version: 1,
    characterId: 'reema',
    emotion: 'happy',
    status: 'active'
  },

  // ── Filo (Protect) ──
  {
    assetId: 'hero_filo_default',
    assetType: 'image',
    path: '/images/characters_clean/filo_idle.png',
    version: 1,
    characterId: 'filo',
    emotion: 'default',
    status: 'active',
    altTextEn: 'Filo the Risk Guardian',
    altTextAr: 'فيلو حامي المخاطر'
  },

  // ── Kami (Create) ──
  {
    assetId: 'hero_kami_default',
    assetType: 'image',
    path: '/images/characters_clean/kami_idle.png',
    version: 1,
    characterId: 'kami',
    emotion: 'default',
    status: 'active',
    altTextEn: 'Kami the Product Inventor',
    altTextAr: 'كامي المخترع الصغير'
  },

  // ── Rex (Rival) ──
  {
    assetId: 'rival_rex_default',
    assetType: 'image',
    path: '/images/characters_clean/rex_idle.png',
    version: 1,
    characterId: 'rex',
    emotion: 'default',
    status: 'active',
    altTextEn: 'Rex the Dinosaur (Business Rival)',
    altTextAr: 'ريكس المنافس الذكي'
  },

  // ── Districts ──
  {
    assetId: 'district_01_money',
    assetType: 'image',
    path: '/assets/districts/district_01_money.webp',
    version: 1,
    status: 'active',
    altTextEn: 'District 1: Money District',
    altTextAr: 'الحي ١: حي النقود والتوفير'
  },
  {
    assetId: 'district_02_builders',
    assetType: 'image',
    path: '/assets/districts/district_02_builders.webp',
    version: 1,
    status: 'active'
  }
];

// Initialize registry
for (const entry of INITIAL_ASSETS) {
  ASSET_REGISTRY.set(entry.assetId, entry);
}

/** Retrieve asset entry by unique ID */
export function getAsset(assetId: string): AssetEntry | undefined {
  return ASSET_REGISTRY.get(assetId);
}

/** Register or override an asset at runtime */
export function registerAsset(asset: AssetEntry): void {
  ASSET_REGISTRY.set(asset.assetId, asset);
}

/**
 * Retrieve character asset for a given emotion/state,
 * with safe automatic fallback to default.
 */
export function getCharacterAsset(
  characterId: CharacterId,
  emotion: CharacterEmotion = 'default'
): AssetEntry {
  const specificKey = `hero_${characterId}_${emotion}`;
  const specific = ASSET_REGISTRY.get(specificKey);
  if (specific) return specific;

  // Fallback to default
  const defaultKey = characterId === 'rex' ? 'rival_rex_default' : `hero_${characterId}_default`;
  const defaultAsset = ASSET_REGISTRY.get(defaultKey);
  if (defaultAsset) return defaultAsset;

  // Ultimate fallback to Ollie
  return (
    ASSET_REGISTRY.get('hero_ollie_default') || {
      assetId: 'fallback',
      assetType: 'image',
      path: '/brand/ollie-logo.png',
      version: 1,
      characterId: 'ollie',
      status: 'active'
    }
  );
}
