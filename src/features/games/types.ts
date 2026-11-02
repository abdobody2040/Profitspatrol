import type { ComponentType } from "react";

export type GameEngineType = "react" | "phaser";
export type GameDifficulty = "rookie" | "founder" | "tycoon";
export type GameDistrict = 
  | "money" 
  | "builders" 
  | "risk" 
  | "operations" 
  | "innovation" 
  | "leadership" 
  | "strategy" 
  | "launch";

export interface GameComponentProps {
  paused: boolean;
  onEnd: (result: RawGameResult) => void;
}

export interface RawGameResult {
  achieved: boolean;
  score: number;
  stars: number;
  message?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Structured Common Game Result Model (PRD Section 27)
 * Structured output returned by games to drive progression, competencies, and consequences.
 */
export interface CommonGameResult {
  gameId: string;
  attemptId: string;
  achieved: boolean;
  score: number;
  maxScore?: number;
  accuracy?: number; // 0 - 100 percentage
  mistakes?: number;
  stars: number; // 1 to 3
  xpAwarded: number;
  coinsAwarded: number; // ppTokens awarded
  durationSeconds?: number;
  completedAt: string;
  competencyDeltas?: Record<string, number>;
  masteryProgress?: {
    competencyId: string;
    newLevel: number;
    delta: number;
  };
  missionProgress?: {
    missionId: string;
    completed: boolean;
  };
  characterReaction?: {
    heroId: 'ollie' | 'reema' | 'filo' | 'kami' | 'rex';
    emotion: string;
    dialogueKey?: string;
    dialogueText?: string;
  };
  consequences?: Array<{
    target: string;
    change: number;
    message: string;
  }>;
  unlockedBadges?: string[];
  message?: string;
}

export type NormalizedGameResult = CommonGameResult;

export interface UnifiedGameDefinition {
  id: string; // e.g. "arcade_01_coin"
  stationNumber: string; // "01" through "50"
  sourceId: string; // original id e.g. "coin"
  titleKey: string;
  shortKey: string;
  objectiveKey: string;
  skillKey: string;
  district: GameDistrict;
  ageRange: [number, number];
  estimatedMinutes: string;
  accentColor: string;
  engine: GameEngineType;
  difficulty: GameDifficulty;
  premium: boolean;
  requiredTier: "intern" | "founder" | "tycoon";
  image?: string;
  iconName: string;
  componentLoader: () => Promise<{ default: ComponentType<GameComponentProps> }>;
}

export interface GameProgressRecord {
  gameId: string;
  bestScore: number;
  stars: number;
  completed: boolean;
  playCount: number;
  lastPlayedAt?: string;
}

export type GameResult = { achieved: boolean; score: number; stars: number; message: string };

