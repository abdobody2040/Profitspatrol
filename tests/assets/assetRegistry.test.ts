import { describe, it, expect } from 'vitest';
import {
  getAsset,
  getCharacterAsset,
  registerAsset,
  ASSET_REGISTRY,
  type AssetEntry
} from '../../src/lib/assets/assetRegistry';

describe('AssetRegistry (PRD Section 57 & 58)', () => {
  it('resolves registered hero assets for Ollie, Reema, Filo, Kami, and Rex', () => {
    const ollieDefault = getAsset('hero_ollie_default');
    expect(ollieDefault).toBeDefined();
    expect(ollieDefault?.path).toContain('ollie');
    expect(ollieDefault?.characterId).toBe('ollie');

    const reemaDefault = getAsset('hero_reema_default');
    expect(reemaDefault).toBeDefined();
    expect(reemaDefault?.characterId).toBe('reema');

    const filoDefault = getAsset('hero_filo_default');
    expect(filoDefault).toBeDefined();
    expect(filoDefault?.characterId).toBe('filo');

    const kamiDefault = getAsset('hero_kami_default');
    expect(kamiDefault).toBeDefined();
    expect(kamiDefault?.characterId).toBe('kami');

    const rexDefault = getAsset('rival_rex_default');
    expect(rexDefault).toBeDefined();
    expect(rexDefault?.characterId).toBe('rex');
  });

  it('provides safe fallback when specific emotion/state asset is requested', () => {
    // If a specific mood is missing, falls back to default character asset
    const fallbackAsset = getCharacterAsset('reema', 'surprised');
    expect(fallbackAsset).toBeDefined();
    expect(fallbackAsset.characterId).toBe('reema');
  });

  it('supports runtime asset registration and override without code modification', () => {
    const customAsset: AssetEntry = {
      assetId: 'district_01_banner',
      assetType: 'image',
      path: '/images/districts/d1_banner.webp',
      version: 1,
      status: 'active'
    };

    registerAsset(customAsset);
    const resolved = getAsset('district_01_banner');
    expect(resolved).toEqual(customAsset);
  });
});
