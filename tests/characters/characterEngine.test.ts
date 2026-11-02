import { describe, it, expect } from 'vitest';
import { 
  HEROES, 
  getHero, 
  getAllHeroes, 
  getHeroDialogue 
} from '../../src/features/characters/data/heroes';
import { 
  RIVAL_REX, 
  getRexDialogue 
} from '../../src/features/characters/data/rivalRex';
import { getCharacterAsset } from '../../src/lib/assets/assetRegistry';

describe('4 Heroes System (Phase 3)', () => {
  it('defines the 4 canonical heroes with complete metadata', () => {
    const heroKeys = Object.keys(HEROES);
    expect(heroKeys).toHaveLength(4);
    expect(heroKeys).toEqual(['ollie', 'reema', 'filo', 'kami']);

    // Check Ollie
    const ollie = getHero('ollie');
    expect(ollie.nameEn).toBe('Ollie');
    expect(ollie.nameAr).toBe('أولي');
    expect(ollie.animalEn).toBe('Owl');
    expect(ollie.pillarEn).toBe('PLAN');
    expect(ollie.pillarAr).toBe('خطّط');
    expect(ollie.coreCompetencyGroup).toBe('money');

    // Check Reema
    const reema = getHero('reema');
    expect(reema.nameEn).toBe('Reema');
    expect(reema.nameAr).toBe('ريما');
    expect(reema.animalEn).toBe('Arctic Fox');
    expect(reema.pillarEn).toBe('CONNECT');
    expect(reema.pillarAr).toBe('تواصل');
    expect(reema.coreCompetencyGroup).toBe('marketing');

    // Check Filo
    const filo = getHero('filo');
    expect(filo.nameEn).toBe('Filo');
    expect(filo.nameAr).toBe('فيلو');
    expect(filo.animalEn).toBe('Baby Elephant');
    expect(filo.pillarEn).toBe('PROTECT');
    expect(filo.pillarAr).toBe('احْمِ');
    expect(filo.coreCompetencyGroup).toBe('risk_ethics');

    // Check Kami
    const kami = getHero('kami');
    expect(kami.nameEn).toBe('Kami');
    expect(kami.nameAr).toBe('كامي');
    expect(kami.animalEn).toBe('Chameleon');
    expect(kami.pillarEn).toBe('CREATE');
    expect(kami.pillarAr).toBe('ابْتَكِر');
    expect(kami.coreCompetencyGroup).toBe('innovation');
  });

  it('provides rich bilingual dialogue banks for each hero', () => {
    const heroes = getAllHeroes();
    expect(heroes).toHaveLength(4);

    for (const hero of heroes) {
      expect(hero.dialogueBank.greeting.length).toBeGreaterThan(0);
      expect(hero.dialogueBank.encouragement.length).toBeGreaterThan(0);
      expect(hero.dialogueBank.success.length).toBeGreaterThan(0);
      expect(hero.dialogueBank.mistakeReflect.length).toBeGreaterThan(0);
      expect(hero.dialogueBank.tip.length).toBeGreaterThan(0);

      const dialogue = getHeroDialogue(hero.id as any, 'greeting');
      expect(dialogue).toBeDefined();
      expect(dialogue.textEn).toBeTruthy();
      expect(dialogue.textAr).toBeTruthy();
    }
  });

  it('resolves character assets for all 4 heroes across emotional states', () => {
    const heroes = getAllHeroes();
    for (const hero of heroes) {
      const assetDefault = getCharacterAsset(hero.id);
      expect(assetDefault).toBeDefined();
      expect(assetDefault.path).toBeTruthy();

      const assetHappy = getCharacterAsset(hero.id, 'happy');
      expect(assetHappy).toBeDefined();
      expect(assetHappy.path).toBeTruthy();
    }
  });
});

describe('Rival Rex Engine (Phase 3)', () => {
  it('defines Rex with proper philosophy and animal representation', () => {
    expect(RIVAL_REX.id).toBe('rex');
    expect(RIVAL_REX.nameEn).toBe('Rex');
    expect(RIVAL_REX.nameAr).toBe('ريكس');
    expect(['Raccoon', 'T-Rex Dinosaur']).toContain(RIVAL_REX.animalEn);
    expect(RIVAL_REX.philosophyEn).toBe('Think Again.');
    expect(RIVAL_REX.philosophyAr).toBe('فكر مرة أخرى!');
    expect(['#0F172A', '#C8553D']).toContain(RIVAL_REX.colors.primary);
  });

  it('provides distinct competition dialogues for Rex', () => {
    const challengeDialogue = getRexDialogue('challenge');
    expect(challengeDialogue).toBeDefined();
    expect(challengeDialogue.textEn).toBeTruthy();
    expect(challengeDialogue.textAr).toBeTruthy();

    const victoryDialogue = getRexDialogue('victory');
    expect(victoryDialogue).toBeDefined();
    expect(victoryDialogue.textEn).toBeTruthy();

    const defeatDialogue = getRexDialogue('defeat');
    expect(defeatDialogue).toBeDefined();
    expect(defeatDialogue.textEn).toBeTruthy();
  });

  it('resolves Rex asset via AssetRegistry', () => {
    const asset = getCharacterAsset('rex');
    expect(asset).toBeDefined();
    expect(asset.path).toMatch(/rex/);
  });
});
