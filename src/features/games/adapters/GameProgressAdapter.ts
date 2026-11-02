import type { GameProgressRecord, NormalizedGameResult } from "../types";

const PROGRESS_STORAGE_KEY = "pp_arcade_progress_v1";

export class GameProgressAdapter {
  private static getStoredProgress(): Record<string, GameProgressRecord> {
    try {
      const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error("[GameProgressAdapter] Failed to read local arcade progress:", e);
      return {};
    }
  }

  private static setStoredProgress(records: Record<string, GameProgressRecord>): void {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error("[GameProgressAdapter] Failed to save local arcade progress:", e);
    }
  }

  public static getProgress(gameId: string): GameProgressRecord {
    const records = this.getStoredProgress();
    return records[gameId] || {
      gameId,
      bestScore: 0,
      stars: 0,
      completed: false,
      playCount: 0,
    };
  }

  public static getAllProgress(): Record<string, GameProgressRecord> {
    return this.getStoredProgress();
  }

  public static saveResult(result: NormalizedGameResult): GameProgressRecord {
    const records = this.getStoredProgress();
    const current = records[result.gameId] || {
      gameId: result.gameId,
      bestScore: 0,
      stars: 0,
      completed: false,
      playCount: 0,
    };

    const updated: GameProgressRecord = {
      gameId: result.gameId,
      bestScore: Math.max(current.bestScore, result.score),
      stars: Math.max(current.stars, result.stars),
      completed: current.completed || result.achieved,
      playCount: current.playCount + 1,
      lastPlayedAt: result.completedAt,
    };

    records[result.gameId] = updated;
    this.setStoredProgress(records);

    // Optional background sync to backend endpoint without blocking UI
    this.syncToBackend(result).catch(() => {});

    return updated;
  }

  private static async syncToBackend(result: NormalizedGameResult): Promise<void> {
    try {
      // Prepared for Laravel/MySQL backend API
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      if (!token) return;

      await fetch("/api/v1/profile/games/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: JSON.stringify({
          game_id: result.gameId,
          attempt_id: result.attemptId,
          score: result.score,
          stars: result.stars,
          xp_awarded: result.xpAwarded,
          coins_awarded: result.coinsAwarded,
          completed_at: result.completedAt,
        }),
      });
    } catch {
      // Backend sync failure does not break the client experience
    }
  }
}
