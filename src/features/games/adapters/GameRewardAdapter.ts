import { useAppStore } from "../../../store";
import type { RawGameResult, NormalizedGameResult, UnifiedGameDefinition } from "../types";

// In-memory set of claimed attempt IDs to prevent replay exploit within session
const claimedAttempts = new Set<string>();

export interface RewardCalculation {
  xp: number;
  coins: number;
  stars: number;
  isFirstClear: boolean;
  isNewHighScore: boolean;
}

export class GameRewardAdapter {
  /**
   * Generates a unique attempt ID
   */
  public static createAttemptId(gameId: string): string {
    return `${gameId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Authoritative reward calculation logic
   * Game UI does not decide rewards — main Profits Patrol engine decides.
   */
  public static calculateReward(
    game: UnifiedGameDefinition,
    rawResult: RawGameResult,
    previousBestScore: number = 0,
    previousStars: number = 0
  ): RewardCalculation {
    if (!rawResult.achieved) {
      return {
        xp: 10, // Small effort XP for participation
        coins: 0,
        stars: 0,
        isFirstClear: false,
        isNewHighScore: false,
      };
    }

    const isFirstClear = previousStars === 0;
    const isNewHighScore = rawResult.score > previousBestScore;
    
    // Tier-based base rewards
    const tierMultiplier = game.requiredTier === "tycoon" ? 1.5 : game.requiredTier === "founder" ? 1.25 : 1.0;
    
    // Stars calculation: 1 star for pass, 2 stars for >= 65, 3 stars for >= 90
    const stars = rawResult.score >= 90 ? 3 : rawResult.score >= 65 ? 2 : 1;
    const improvedStars = Math.max(0, stars - previousStars);

    // Authoritative XP formula:
    // First clear gets substantial boost; replay gets incremental star/score bonus
    const baseXP = isFirstClear ? 100 : 20;
    const starXP = improvedStars * 50;
    const scoreBonusXP = Math.floor((rawResult.score / 100) * 30);
    const finalXP = Math.round((baseXP + starXP + scoreBonusXP) * tierMultiplier);

    // Authoritative P Tokens formula:
    const baseCoins = isFirstClear ? 25 : 5;
    const starCoins = improvedStars * 15;
    const finalCoins = Math.round((baseCoins + starCoins) * tierMultiplier);

    return {
      xp: finalXP,
      coins: finalCoins,
      stars,
      isFirstClear,
      isNewHighScore,
    };
  }

  /**
   * Finalizes and awards rewards idempotently to Profits Patrol user economy
   */
  public static async processCompletion(
    game: UnifiedGameDefinition,
    rawResult: RawGameResult,
    previousBestScore: number = 0,
    previousStars: number = 0,
    attemptId?: string
  ): Promise<NormalizedGameResult> {
    const finalAttemptId = attemptId || this.createAttemptId(game.id);

    // Prevent double claim
    if (claimedAttempts.has(finalAttemptId)) {
      console.warn(`[GameRewardAdapter] Attempt ${finalAttemptId} already processed. Skipping duplicate reward.`);
      return {
        gameId: game.id,
        attemptId: finalAttemptId,
        achieved: rawResult.achieved,
        score: rawResult.score,
        stars: rawResult.stars,
        xpAwarded: 0,
        coinsAwarded: 0,
        completedAt: new Date().toISOString(),
        message: rawResult.message,
      };
    }

    claimedAttempts.add(finalAttemptId);

    const calculation = this.calculateReward(game, rawResult, previousBestScore, previousStars);

    // Award XP and Tokens in main Profits Patrol store
    const store = useAppStore.getState();
    if (calculation.xp > 0 && typeof store.completeGame === "function") {
      store.completeGame(rawResult.score, calculation.xp);
    }
    if (calculation.coins > 0 && store.user && typeof store.setUser === "function") {
      store.setUser({
        ...store.user,
        ppTokens: (store.user.ppTokens || 0) + calculation.coins,
      });
    }

    return {
      gameId: game.id,
      attemptId: finalAttemptId,
      achieved: rawResult.achieved,
      score: rawResult.score,
      stars: calculation.stars,
      xpAwarded: calculation.xp,
      coinsAwarded: calculation.coins,
      completedAt: new Date().toISOString(),
      message: rawResult.message,
    };
  }
}
