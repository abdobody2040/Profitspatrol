import { describe, it, expect, beforeEach } from "vitest";
import { CANONICAL_ARCADE_GAMES, findGame } from "../registry/canonicalRegistry";
import { GameRewardAdapter } from "../adapters/GameRewardAdapter";
import { GameProgressAdapter } from "../adapters/GameProgressAdapter";

describe("Arcade Games Integration", () => {
  describe("Canonical Game Registry Integrity", () => {
    it("should contain exactly 50 arcade game stations", () => {
      expect(CANONICAL_ARCADE_GAMES).toHaveLength(50);
    });

    it("should have sequential station numbers from 01 to 50", () => {
      const numbers = CANONICAL_ARCADE_GAMES.map(g => g.stationNumber);
      for (let i = 1; i <= 50; i++) {
        const expected = i.toString().padStart(2, "0");
        expect(numbers).toContain(expected);
      }
    });

    it("should have unique IDs and source IDs with no duplicates", () => {
      const ids = new Set(CANONICAL_ARCADE_GAMES.map(g => g.id));
      const sourceIds = new Set(CANONICAL_ARCADE_GAMES.map(g => g.sourceId));
      expect(ids.size).toBe(50);
      expect(sourceIds.size).toBe(50);
    });

    it("should resolve games by id, sourceId, or stationNumber", () => {
      const game01 = findGame("arcade_01_coin");
      expect(game01).toBeDefined();
      expect(game01?.stationNumber).toBe("01");

      const gameBySource = findGame("coin");
      expect(gameBySource?.id).toBe("arcade_01_coin");

      const gameByNum = findGame("01");
      expect(gameByNum?.id).toBe("arcade_01_coin");
    });

    it("should have valid metadata fields for all games", () => {
      CANONICAL_ARCADE_GAMES.forEach(game => {
        expect(game.titleKey).toMatch(/^games\..+\.title$/);
        expect(game.objectiveKey).toMatch(/^games\..+\.objective$/);
        expect(game.ageRange[0]).toBeGreaterThanOrEqual(5);
        expect(game.ageRange[1]).toBeLessThanOrEqual(18);
        expect(game.engine).toBe("react");
        expect(["rookie", "founder", "tycoon"]).toContain(game.difficulty);
        expect(["intern", "founder", "tycoon"]).toContain(game.requiredTier);
        expect(typeof game.componentLoader).toBe("function");
      });
    });

    it("should configure stations 01-10 as free (intern tier)", () => {
      const freeGames = CANONICAL_ARCADE_GAMES.slice(0, 10);
      freeGames.forEach(g => {
        expect(g.premium).toBe(false);
        expect(g.requiredTier).toBe("intern");
      });
    });
  });

  describe("GameRewardAdapter Authoritative Rewards & Anti-Duplication", () => {
    const mockGame = CANONICAL_ARCADE_GAMES[0];

    it("should award higher XP and coins on first clear with high score", () => {
      const reward = GameRewardAdapter.calculateReward(
        mockGame,
        { achieved: true, score: 95, stars: 3 },
        0,
        0
      );

      expect(reward.stars).toBe(3);
      expect(reward.isFirstClear).toBe(true);
      expect(reward.xp).toBeGreaterThanOrEqual(100);
      expect(reward.coins).toBeGreaterThanOrEqual(25);
    });

    it("should award effort XP and 0 coins when game is not achieved", () => {
      const reward = GameRewardAdapter.calculateReward(
        mockGame,
        { achieved: false, score: 30, stars: 0 },
        0,
        0
      );

      expect(reward.stars).toBe(0);
      expect(reward.coins).toBe(0);
      expect(reward.xp).toBe(10);
    });

    it("should be idempotent and prevent double claiming the same attempt", async () => {
      const attemptId = `test_attempt_${Date.now()}`;
      
      const firstResult = await GameRewardAdapter.processCompletion(
        mockGame,
        { achieved: true, score: 90, stars: 3 },
        0,
        0,
        attemptId
      );
      expect(firstResult.xpAwarded).toBeGreaterThan(0);

      // Re-processing identical attemptId must return 0 new rewards
      const duplicateResult = await GameRewardAdapter.processCompletion(
        mockGame,
        { achieved: true, score: 90, stars: 3 },
        90,
        3,
        attemptId
      );
      expect(duplicateResult.xpAwarded).toBe(0);
      expect(duplicateResult.coinsAwarded).toBe(0);
    });
  });

  describe("GameProgressAdapter Persistence", () => {
    it("should get default fresh progress for unplayed game", () => {
      const progress = GameProgressAdapter.getProgress("non_existent_game");
      expect(progress.completed).toBe(false);
      expect(progress.bestScore).toBe(0);
      expect(progress.stars).toBe(0);
      expect(progress.playCount).toBe(0);
    });

    it("should save and retrieve updated progress", () => {
      const result = {
        gameId: "test_game_progress",
        attemptId: "att_1",
        achieved: true,
        score: 88,
        stars: 2,
        xpAwarded: 150,
        coinsAwarded: 30,
        completedAt: new Date().toISOString(),
      };

      const saved = GameProgressAdapter.saveResult(result);
      expect(saved.bestScore).toBe(88);
      expect(saved.stars).toBe(2);
      expect(saved.completed).toBe(true);
      expect(saved.playCount).toBe(1);

      const retrieved = GameProgressAdapter.getProgress("test_game_progress");
      expect(retrieved.bestScore).toBe(88);
      expect(retrieved.stars).toBe(2);
    });
  });
});
