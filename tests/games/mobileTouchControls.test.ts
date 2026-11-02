import { describe, it, expect, vi } from 'vitest';
import { TOWER_TYPES, WAVES, PATH } from '../../src/features/game/components/game-templates/DefenseTemplate';

describe('Mobile Touch Controls & Mini-Game Engines (Improvement 4)', () => {
  describe('DefenseTemplate Architecture', () => {
    it('defines accessible touch tower configurations with distinct roles', () => {
      expect(TOWER_TYPES.length).toBe(3);
      
      const firewall = TOWER_TYPES.find(t => t.type === 'firewall');
      const antivirus = TOWER_TYPES.find(t => t.type === 'antivirus');
      const encryptor = TOWER_TYPES.find(t => t.type === 'encryptor');

      expect(firewall).toBeDefined();
      expect(firewall?.cost).toBe(50);
      expect(firewall?.range).toBe(25);

      expect(antivirus).toBeDefined();
      expect(antivirus?.damage).toBe(10);
      expect(antivirus?.cooldown).toBe(300);

      expect(encryptor).toBeDefined();
      expect(encryptor?.damage).toBe(50);
      expect(encryptor?.cost).toBe(200);
    });

    it('validates wave progression and target coordinates', () => {
      expect(WAVES.length).toBe(5);
      expect(WAVES[0].count).toBe(5);
      expect(WAVES[4].type).toBe('hacker'); // Boss wave

      expect(PATH.length).toBeGreaterThanOrEqual(4);
      // Ensure path starts above and leaves below
      expect(PATH[0].y).toBeLessThan(0);
      expect(PATH[PATH.length - 1].y).toBeGreaterThanOrEqual(100);
    });

    it('calculates accurate coordinate percentages for touch/pointer placements', () => {
      const mockBoundingBox = {
        left: 100,
        top: 200,
        width: 400,
        height: 600,
      };

      const touchClientX = 300; // Middle X
      const touchClientY = 500; // Halfway Y

      const pctX = ((touchClientX - mockBoundingBox.left) / mockBoundingBox.width) * 100;
      const pctY = ((touchClientY - mockBoundingBox.top) / mockBoundingBox.height) * 100;

      expect(pctX).toBe(50);
      expect(pctY).toBe(50);
    });
  });

  describe('Grid Movement & Gesture Logic', () => {
    it('detects swipe directions from touch coordinates with minimum threshold', () => {
      const minSwipe = 25;

      const detectSwipe = (start: { x: number; y: number }, end: { x: number; y: number }) => {
        const dx = end.x - start.x;
        const dy = end.y - start.y;

        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > minSwipe) return 'RIGHT';
          if (dx < -minSwipe) return 'LEFT';
        } else {
          if (dy > minSwipe) return 'DOWN';
          if (dy < -minSwipe) return 'UP';
        }
        return 'TAP';
      };

      // Test Right Swipe
      expect(detectSwipe({ x: 100, y: 100 }, { x: 160, y: 105 })).toBe('RIGHT');
      // Test Left Swipe
      expect(detectSwipe({ x: 200, y: 100 }, { x: 140, y: 110 })).toBe('LEFT');
      // Test Down Swipe
      expect(detectSwipe({ x: 100, y: 100 }, { x: 105, y: 170 })).toBe('DOWN');
      // Test Up Swipe
      expect(detectSwipe({ x: 100, y: 200 }, { x: 105, y: 130 })).toBe('UP');
      // Test Small Drag / Tap
      expect(detectSwipe({ x: 100, y: 100 }, { x: 105, y: 108 })).toBe('TAP');
    });

    it('enforces boundary conditions and obstacles on grid movement', () => {
      const rows = 6;
      const cols = 6;
      const obstacles = [{ r: 1, c: 1 }, { r: 2, c: 2 }];

      const canMove = (curr: { r: number; c: number }, dr: number, dc: number) => {
        const nr = curr.r + dr;
        const nc = curr.c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return false;
        if (obstacles.some(o => o.r === nr && o.c === nc)) return false;
        return true;
      };

      expect(canMove({ r: 0, c: 0 }, -1, 0)).toBe(false); // Out of top bounds
      expect(canMove({ r: 0, c: 0 }, 0, -1)).toBe(false); // Out of left bounds
      expect(canMove({ r: 0, c: 0 }, 0, 1)).toBe(true);   // Valid Right move
      expect(canMove({ r: 1, c: 0 }, 0, 1)).toBe(false);  // Blocked by obstacle at (1,1)
    });
  });

  describe('Conveyor & Operations Touch Sorting', () => {
    it('accurately matches item types to target bins', () => {
      const BINS = [
        { id: 'recycle', types: ['plastic', 'metal'] },
        { id: 'compost', types: ['organic'] },
        { id: 'trash', types: ['defective'] },
      ];

      const matchBin = (itemType: string, binId: string) => {
        const bin = BINS.find(b => b.id === binId);
        return bin ? bin.types.includes(itemType) : false;
      };

      expect(matchBin('plastic', 'recycle')).toBe(true);
      expect(matchBin('organic', 'recycle')).toBe(false);
      expect(matchBin('organic', 'compost')).toBe(true);
      expect(matchBin('defective', 'trash')).toBe(true);
    });
  });
});
