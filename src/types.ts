
// User & Auth
export enum UserRole {
  KID = 'KID',
  PARENT = 'PARENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export type SubscriptionTier = 'intern' | 'founder' | 'board' | 'tycoon' | 'classroom' | 'teacher_solo' | 'teacher_pro' | 'school_small' | 'school_medium' | 'school_large';

// ─── User Sub-Types ─────────────────────────────────────────────────────────
// These are additive sub-shapes of the User interface, intended for:
//   1. Targeted DB saves (only the profiles table columns)
//   2. Function signatures that only need identity vs. progression data
//   3. Future table normalization (user_progression, billing tables)
// The full User interface is unchanged for backward compatibility.

/** Columns that map 1:1 to the `profiles` DB table. */
export interface UserCore {
  id: string;
  name: string;
  username?: string;
  /** @deprecated — auth concern only; use supabase.auth.getUser() */
  email?: string;
  role: UserRole;
  avatar?: string;
}

/** Gameplay progression state — future: user_progression table. */
export interface UserProgression {
  xp: number;
  level: number;
  streak: number;
  lastActivityDate: string;
  bizCoins: number;
  completedLessonIds: string[];
  badges: string[];
  inventory: string[];
  energy: number;
  lastEnergyRefill: number;
}

/** Subscription billing state — future: billing service join. */
export interface UserSubscription {
  subscriptionStatus: 'FREE' | 'PREMIUM';
  subscriptionTier: SubscriptionTier;
  billingCycle?: 'MONTHLY' | 'YEARLY';
}
// ─────────────────────────────────────────────────────────────────────────────


// HQ Builder Types
export interface PlacedItem {
  id: string;
  itemId: string;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
  roomType?: string; // Which room this item is placed in
}

export interface FurnitureItem {
  id: string;
  name: string;
  type: 'desk' | 'chair' | 'plant' | 'decoration' | 'lighting' | 'rug';
  cost: number;
  icon: string; // Lucide icon name or emoji
  width: number; // Grid cells
  height: number;
  reqHqLevel?: string;
}

export interface UserSettings {
  dailyGoalMinutes: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  themeColor: 'blue' | 'green' | 'purple' | 'orange';
  themeMode: 'light' | 'dark';
}

export interface BusinessLogo {
  companyName: string;
  backgroundColor: string;
  icon: string;
  iconColor: string;
  shape: 'circle' | 'square' | 'rounded';
  estText?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'CHARISMA' | 'EFFICIENCY' | 'WISDOM';
  description: string;
  cost: number;
  effect: {
    type: 'PASSIVE_PRICE' | 'PASSIVE_COST' | 'PASSIVE_XP' | 'ACTIVE_CLICK' | 'PASSIVE_SPEED';
    value: number;
  };
}

export interface HQLevel {
  id: string;
  name: string;
  cost: number;
  description: string;
  icon: string;
}

export interface PortfolioItem {
  businessId: string;
  managerLevel: number;
  lastCollected: string; // ISO Date
}

export interface User {
  id: string;
  name: string;
  /**
   * @deprecated COPPA/PRIVACY: email is an Supabase Auth concern only.
   * It must NOT be used in game logic, logs, or exports.
   * Use Supabase Auth APIs (supabase.auth.getUser()) to read it when strictly required.
   */
  email?: string;
  username?: string;
  // ✅ SECURITY: `password` field removed — plaintext passwords must NEVER exist on the User model.
  //    Authentication is handled exclusively by Supabase Auth (bcrypt server-side).
  avatar?: string; // Custom profile avatar
  role: UserRole;
  xp: number;
  level: number;
  age?: number; // User's age for content adaptation
  streak: number;
  lastActivityDate: string; // ISO Date YYYY-MM-DD
  bizCoins: number;
  currentModuleId: string;
  completedLessonIds: string[];
  readBookIds?: string[]; // New: Track books read
  badges: string[];
  inventory: string[]; // IDs of bought items

  // New Fields for Phase 3
  classId?: string; // Linked Class
  settings: UserSettings;
  linkedChildId?: string; // For Parent
  parentId?: string; // For Kid linked to Parent

  // Phase 4
  businessLogo?: BusinessLogo;

  // Phase 5: Progression
  hqLevel: string;
  unlockedSkills: string[];
  portfolio: PortfolioItem[];
  equippedItems: string[]; // IDs of currently worn items
  placedItems: PlacedItem[]; // HQ Builder Items
  properties: UserProperty[]; // Real Estate

  // Phase 6: SaaS / Subscription
  subscriptionStatus: 'FREE' | 'PREMIUM';
  subscriptionTier: SubscriptionTier;
  energy: number; // Current energy, max 5
  lastEnergyRefill: number; // timestamp
  billingCycle?: 'MONTHLY' | 'YEARLY';

  // Customization
  hqTheme?: 'blue' | 'gold' | 'modern';

  // Book Tasks (Phase 7)
  completedBookTasks?: BookTaskCompletion[];
  bookTaskStreak?: number; // Days in a row completing book tasks
  lastBookTaskDate?: string; // ISO Date YYYY-MM-DD

  // Phase 8: Engagement
  streakShield?: boolean; // Premium perk: 1 free skip per week
  streakShieldUsedDate?: string; // ISO Date — when the shield was last used
  streakLastBonusDate?: string; // ISO Date — last 7-day bonus claimed

  // Phase 9: Referrals
  referralCode?: string;
  referredBy?: string; // UUID of the user who referred them
  totalReferrals?: number;

  // Phase 10: Graduation (Year-End)
  hasGraduated?: boolean;

  // Year 2: Daily Spin Wheel
  lastSpinDate?: string; // ISO Date YYYY-MM-DD — tracks 24h cooldown
  totalSpins?: number;

  // Year 2: Weekly CEO Challenge
  weeklyChallenges?: {
    weekKey: string; // e.g. '2026-W09'
    completed: string[]; // challenge IDs completed this week
    bonusClaimed: boolean; // true if the 500-coin all-complete bonus was claimed
  };

  // Year 2: BizPulse Daily News Feed
  bizPulseRead?: {
    date: string; // ISO date YYYY-MM-DD (resets daily)
    articleIds: string[]; // article IDs read today
  };

  // Year 2: Corporations / Guilds
  corporationId?: string; // ID of the corporation the user belongs to

  // Year 2: Stock Market
  stockPortfolio?: {
    stockId: string;
    shares: number;
    avgBuyPrice: number;
  }[];

  // Year 2: Seasonal Events
  completedSeasonalChallenges?: string[]; // challenge IDs claimed

  // Year 2: Parent Report fields (tracked progressively)
  lessonsCompleted?: number;
  gigsCompleted?: number;
  streakDays?: number;
  topAchievement?: string;
  linkedKidId?: string; // for PARENT accounts: id of their linked kid
}

// ─── Corporation (Guild) ──────────────────────────────────────────────────────
export interface CorporationMember {
  id: string;
  name: string;
  level: number;
  xp: number;
}

export interface Corporation {
  id: string;
  name: string;
  motto?: string;
  emoji: string;
  color: string; // gradient start hex
  ownerId: string;
  memberIds: string[]; // user IDs
  members?: CorporationMember[]; // populated from users list
  totalXP: number; // sum of members' XP
  createdAt: string; // ISO date
}

// ─── Daily Missions ───────────────────────────────────────────────────────────

export type MissionActionType =
  | 'COMPLETE_LESSON'
  | 'PLAY_GIG'
  | 'READ_BOOK'
  | 'COMPLETE_GAME'
  | 'COMPLETE_DEBATE'
  | 'EARN_COINS';

export interface DailyMission {
  id: string;
  icon: string;
  title: string;
  description: string;
  actionType: MissionActionType;
  targetCount: number; // how many times the action must be done
  xpReward: number;
  coinReward: number;
}

export interface DailyMissionCompletion {
  missionId: string;
  progress: number; // how many times done today
  completed: boolean;
  claimedReward: boolean;
}

export interface DailyMissionsState {
  date: string; // ISO date YYYY-MM-DD — resets when different from today
  missions: DailyMission[]; // today's 3 missions
  completions: DailyMissionCompletion[];
}

// ─── Weekly Challenge ──────────────────────────────────────────────────────────

export type WeeklyChallengeType =
  | 'BOSS_BATTLE'    // Complete a Boss Battle
  | 'QUIZ_BLITZ'     // Answer 20 quiz questions correctly
  | 'LESSON_SPRINT'  // Complete 10 lessons in the week
  | 'GIG_MARATHON'   // Complete 15 gigs in the week
  | 'COIN_GRIND';    // Earn 2000 BizCoins in the week

export interface WeeklyChallenge {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: WeeklyChallengeType;
  targetCount: number;
  xpReward: number;
  coinReward: number;
  /** Prize avatar/badge item IDs for top-3 finishers */
  prizeItems: string[];
}

export interface WeeklyChallengeEntry {
  userId: string;
  name: string;
  avatarEmoji?: string;
  progress: number;
  completed: boolean;
  claimedReward: boolean;
}

export interface WeeklyChallengeState {
  weekStart: string; // ISO date of the Monday this challenge started
  challenge: WeeklyChallenge;
  /** Current user's progress entry */
  myEntry: WeeklyChallengeEntry | null;
}

// ─── Seasonal Events ───────────────────────────────────────────────────────────

export type SeasonalEventType =
  | 'LESSON_MARATHON'   // Complete the most lessons during the event
  | 'GIG_RUSH'          // Earn the most BizCoins from gigs
  | 'STREAK_KEEPER'     // Maintain the longest streak during event week
  | 'COIN_SPRINT';      // Earn the most BizCoins from any source

export interface SeasonalEvent {
  id: string;
  icon: string;
  title: string;
  description: string;
  theme: string;            // CSS gradient string for theming
  type: SeasonalEventType;
  /** ISO date strings */
  startDate: string;
  endDate: string;
  xpReward: number;
  coinReward: number;
  /** Cosmetic item IDs exclusively earnable by finishing top 10 */
  exclusiveItems: string[];
  /** Boss Battle scenario override for event */
  bossId?: string;
}

export interface SeasonalEventEntry {
  userId: string;
  name: string;
  avatarEmoji?: string;
  score: number;       // metric varies by event type
  rank?: number;
}

export interface SeasonalEventState {
  activeEvent: SeasonalEvent | null;
  myScore: number;
  myRank: number | null;
  /** Top 10 leaderboard entries (includes current user if in top 10) */
  leaderboard: SeasonalEventEntry[];
  joined: boolean;
  rewardClaimed: boolean;
}

export interface Classroom {
  id: string;
  name: string;
  code: string; // 6-digit alphanumeric
  teacherId: string;
  studentIds: string[];
  lockedModules: string[]; // Modules teacher has restricted
  schoolHoursOnly?: boolean; // Restrict arcade access to 8am-3pm M-F
}

// --- NEW TEACHER ENTITIES (PHASE 1) ---

export interface StudentGroup {
  id: string;
  classId: string;
  name: string; // e.g., "Advanced Math Group", "Reading Support"
  studentIds: string[];
  color?: string; // UI Decoration
}

export interface RubricCriteria {
  id: string;
  title: string;
  description: string;
  maxScore: number;
}

export interface Rubric {
  id: string;
  teacherId: string;
  title: string;
  criteria: RubricCriteria[];
}

export interface Assignment {
  id: string;
  classId: string;
  lessonId: string; // References UniversalLessonUnit.id
  title: string; // Override lesson title or custom task name
  description?: string; // New: Rich text description

  // Differentiated Instruction
  studentGroupId?: string; // Optional: If null, assigned to whole class. If set, only for that group.
  specificStudentIds?: string[]; // Optional: Specific list of student IDs (Overrides group if present)

  // Scheduling
  scheduledAt?: string; // ISO Date. If in future, students can't see it yet.
  dueDate?: string; // ISO Date.

  // Homework Mode (Q4)
  isHomework?: boolean;        // Teacher marks this as take-home work
  maxXP?: number;             // XP cap for this assignment (for gradebook)
  homeworkDeadline?: string;  // Stricter ISO deadline separate from dueDate

  // Grading
  rubricId?: string; // Optional linking to a Rubric
  maxPoints: number;

  // Resources
  resourceUrl?: string; // Link to PDF/Video

  createdAt: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SCHEDULED';
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;

  submittedAt: string; // ISO Date
  status: 'PENDING' | 'GRADED' | 'LATE';
  content?: string; // Text answer or link
  // Grading & Feedback
  grade?: number; // 0-100 or points
  letterGrade?: 'Intern' | 'Founder' | 'Tycoon';
  feedback?: string;
  audioFeedbackUrl?: string; 
  rubricScores?: Record<string, number>; 
  bizCoinsAwarded?: number;
  xpGained?: number;
}

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  friend?: Profile; // Populated via join
}

export interface DbLeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string;
  level: number;
  xp: number;
  net_worth: number;
  rank?: number;
}

export type Profile = {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
}

/**
 * A pending friend request — a Friend row that has not yet been accepted.
 * Enforces `status: 'pending'` at the type level so it cannot be
 * accidentally substituted for an accepted Friend.
 */
export type FriendRequest = Omit<Friend, 'status'> & { readonly status: 'pending' };

export interface ProjectFeedback {
  date: string;
  grade?: number; // Final score
  feedback?: string; // Written feedback
  audioFeedbackUrl?: string; // URL to audio blob for voice feedback
  rubricScores?: Record<string, number>; // Key: criteriaId, Value: score awarded
  letterGrade?: 'Intern' | 'Founder' | 'Tycoon';
  bizCoinsAwarded?: number;
  xpGained?: number;
}

export interface GradeResult {
  score: number;
  letterGrade: 'Intern' | 'Founder' | 'Tycoon';
  feedback: string;
  bizCoinsAwarded: number;
  xpGained: number;
  rubricScores?: Record<string, number>;
}

// --- LIBRARY TYPES ---

// Book Task Types
export type BookTaskType =
  | 'quiz'
  | 'reflection'
  | 'action_challenge'
  | 'share_teach'
  | 'application';

export interface BookTask {
  id: string;
  bookId: string;
  type: BookTaskType;
  title: string;
  description: string;

  // For quiz tasks
  quiz?: {
    questions: {
      question: string;
      options: string[];
      correctAnswer: number; // Index of correct option
    }[];
  };

  // For reflection tasks
  reflection?: {
    prompt: string;
    minWords?: number;
  };

  // For action challenges
  actionChallenge?: {
    steps: string[];
    daysRequired?: number;
    checkpoints: string[];
  };

  // Rewards
  rewards: {
    xp: number;
    coins: number;
    badge?: string;
  };

  // Difficulty
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
}

export interface BookTaskCompletion {
  taskId: string;
  bookId: string;
  completedAt: string;
  score?: number; // For quizzes
  response?: string; // For reflections
  checkpointProgress?: Record<string, boolean>; // For action challenges
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  summary: string;
  /** Optional long-form ~5-minute read summary for Profits Patrol Exclusives */
  fullContent?: string;
  category: 'Mindset' | 'Finance' | 'Strategy' | 'Biography' | 'Fiction' | 'Creativity' | 'History' | 'Economics' | 'Leadership' | 'Sci-Fi & Dystopian' | 'Real-World Business';
  keyLessons: string[]; // Array of 3 bullet points
  ageRating: string;
  tasks?: BookTask[]; // Optional for backward compatibility
}

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: 'Mindset' | 'Finance' | 'Strategy' | 'CaseStudy' | 'Tutorial';
  duration: string; // e.g. "5:30"
  thumbnailUrl?: string; // Optional override
  tags?: string[];
}

export interface LiveSession {
  id: string;
  title: string;
  description: string;
  meetingUrl: string; // Zoom/Meet link
  hostId: string; // Teacher ID
  startTime: string; // ISO String
  durationMinutes: number;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  targetAudience: 'ALL' | 'CLASS' | 'GROUP';
  targetId?: string; // ClassId or GroupId

  // Live Mentorship (Q4) — guest speaker profile
  isMentorship?: boolean;     // Gates Zoom link to Tycoon subscribers
  speakerName?: string;       // e.g. "Alex Chen, CEO of StartupX"
  speakerEmoji?: string;      // e.g. "🧑‍💼"
  speakerBio?: string;        // 1-sentence bio shown on the widget
  speakerRole?: string;       // e.g. "Serial Entrepreneur · Forbes 30U30"
}

export interface NewsEvent {
  id: string;
  headline: string;
  type: 'MARKET' | 'WEATHER' | 'LOCAL' | 'GLOBAL';
  effect?: {
    target: 'LEMONADE' | 'STOCK' | 'ALL';
    multiplier: number; // e.g. 1.2 for 20% boost
    durationMinutes: number;
  };
  createdAt: string;
}

export interface SideHustle {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  energyCost: number;
  durationSeconds: number;
  minigameType: 'RHYTHM' | 'TAP' | 'SWIPE' | 'QUIZ';
  requiredLevel: number;
  category?: 'Service' | 'Creative' | 'Tech' | 'Business';
  skillTags?: string[];
  lifeTip?: string;
}

export interface TurnaroundScenario {
  id: string;
  title: string;
  companyName: string;
  initialCash: number;
  initialBurnRate: number; // Cash lost per day
  turns: number; // Days to fix it
  issues: {
    id: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'CRITICAL';
    fixed: boolean;
    costToFix: number;
    impactOnBurn: number; // Amount burn rate decreases if fixed
  }[];
  winCondition: {
    minCash: number;
    maxBurn: number;
  };
  completionId?: string; // ID to mark as complete in user progress
  /** Per-boss visual personality */
  theme?: {
    emoji: string;           // Big header emoji e.g. 🍕
    accentColor: string;     // Tailwind color name e.g. 'orange'
    tagline: string;         // Dramatic 1-liner shown on briefing
    bgClass: string;         // Tailwind bg class for sidebar e.g. 'bg-orange-50 dark:bg-orange-950/30'
    badgeClass: string;      // Tailwind classes for the BOSS BATTLE badge
    btnClass: string;        // Tailwind classes for primary button
    /** Optional random surprise event that triggers on turn 3 */
    surpriseEvent?: {
      headline: string;      // e.g. "⚡ Power Outage!"
      cashDelta: number;     // Negative = cost, positive = windfall
      burnDelta: number;
    };
  };
}
// ----------------------------------------
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'AVATAR' | 'POWERUP' | 'CONSUMABLE';
  icon: string;
  effectType?: 'HINT' | 'SECOND_LIFE' | 'INCOME_BOOST';
}

export interface LeaderboardEntry {
  id: string;
  name: string; // Masked name e.g. "Cool Panda"
  xp: number;
  avatar: string;
  isCurrentUser?: boolean;
}

// --- LEGACY LESSON TYPES (For LessonPlayer.tsx) ---
export enum SlideType {
  INTRO = 'INTRO',
  INFO = 'INFO',
  QUIZ = 'QUIZ',
  REWARD = 'REWARD'
}

export interface Slide {
  id: string;
  type: SlideType;
  content: string;
  imagePlaceholder?: string;
  options?: string[];
  correctAnswer?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  xpReward: number;
  slides: Slide[];
}

// --- LEMONADE GAME TYPES (For LemonadeStand.tsx) ---
export interface LemonadeState {
  day: number;
  funds: number;
  inventory: {
    lemons: number;
    sugar: number;
    cups: number;
  };
  recipe: {
    lemonsPerCup: number;
    sugarPerCup: number;
    pricePerCup: number;
  };
  history: Array<{
    day: number;
    weather: string;
    cupsSold: number;
    profit: number;
    feedback: string;
  }>;
}

// --- UNIVERSAL JSON SCHEMA (Game Engine V2) ---
export interface UniversalLessonUnit {
  id: string;
  topic_tag: string;
  difficulty: number;
  lesson_payload: {
    headline: string;
    body_text: string;
    key_term?: string; // Optional now
    image_url?: string; // New field for visuals
  };
  challenge_payload: {
    question_text: string;
    correct_answer: string;
    distractors: string[];
  };
  game_rewards: {
    base_xp: number;
    currency_value: number;
  };
  flavor_text: string;
  linkedGameId?: string; // Links to a BusinessSimulation.business_id
}

// --- DYNAMIC GAME ENGINE TYPES ---

// --- DYNAMIC GAME ENGINE TYPES ---

export type GameType =
  // Engine 1: Cooking (Stacking/Assembly)
  | 'cooking_game'
  // Engine 2: Service (Task Queue)
  | 'service_queue'
  // Engine 3: Rhythm (Timing/Beat)
  | 'action_rhythm'
  // Engine 4: Grid (Territory/Snake)
  | 'grid_territory'
  // Engine 5: Idle (Clicker/Automation)
  | 'clicker_idle'
  // Engine 6: Repair (Drag-Drop Puzzle)
  | 'puzzle_repair'
  // Engine 7: Conveyor (Sorting/Quality)
  | 'production_conveyor'
  // Engine 8: Matching (Pattern/Color)
  | 'matching_pattern'
  // Engine 9: Physics (Balance/Stacking)
  | 'physics_balance'
  // Engine 10: Tycoon (Resource Sliders)
  | 'simulation_tycoon'
  // Engine 11: Office (Tower Sim)
  | 'office_tower'
  // Engine 12: Timeline (Planning/Sequencing)
  | 'timeline_planner'
  // Engine 13: Trading (Auction/Markets)
  | 'trading_auction'
  // Engine 14: Defense (Tap Defense)
  | 'defense_game'
  // Engine 15: Streamer Sim
  | 'streamer_sim'
  // Legacy / Transitional types (mapped to engines above)
  | 'retail_store' | 'food_service' | 'driving_game' | 'matching_game'
  | 'rhythm_game' | 'negotiation_game' | 'shop_management' | 'task_management'
  | 'arcade_action' | 'production_line' | 'matching_color' | 'resource_management'
  | 'balance_game' | 'office_sim' | 'event_sim' | 'trading_sim' | 'precision_maker'
  | 'clicker_code' | 'defense_tap' | 'sim_creator' | 'resource_balance'
  | 'trading_ethics' | 'repair_sim' | 'design_game' | 'pricing_game'
  | 'audience_game' | 'quality_control' | 'narrative_choice' | 'stock_sim' | 'sorting_game';

export interface VisualConfig {
  theme: 'eco' | 'neon' | 'pastel' | 'realistic' | 'dark' | 'light' | 'modern' | 'classic' | 'cyber' | 'party' | 'streamer';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  background_type?: 'gradient' | 'image' | 'solid';
  icon?: string;
}

export interface GameEntity {
  id: string;
  type: 'item' | 'obstacle' | 'target' | 'resource';
  name: string;
  emoji?: string;
  value?: number;
  behavior?: 'fall' | 'static' | 'move_random';
}

export interface ScoringConfig {
  base_points: number;
  win_threshold?: number; // Score needed to win/pass day
  time_limit?: number; // Seconds
}

export interface BusinessUpgrade {
  id: string;
  name: string;
  effect: string; // Description
  cost: number;
  modifier_target?: string; // e.g., 'click_value', 'revenue_multiplier'
  modifier_value?: number;
}

export interface BusinessEvent {
  event_name: string;
  effect: string;
  duration: string;
  modifier_target?: string;
  modifier_value?: number;
}

// --- ENGINE SPECIFIC CONFIGS ---
export interface CookingIngredient {
  id: string;
  labelKey: string; // Translation lookup
  icon: string;
  type: string; // 'base', 'filling', etc.
}

export interface CookingRecipe {
  id: string;
  items: string[]; // IDs in stacking order
}

export interface ServiceAction {
  id: string;
  labelKey: string;
  icon: string;
  color?: string;
}

export interface ServiceCustomerType {
  id: string;
  name: string;
  possible_requests: string[][]; // Array of action sequences
}

export interface RhythmLane {
  id: string;
  color: string;
  icon: string;
  label: string;
}

export interface RhythmNote {
  time: number;
  lane: number;
}

export interface RhythmTrack {
  id: string;
  name: string;
  bpm: number;
  duration: number;
  lanes: number;
  notes: RhythmNote[];
}

export interface RhythmConfig {
  track?: RhythmTrack; // The song data
  tracks?: RhythmLane[]; // Visual configuration for lanes
  track_name?: string;
  bpm?: number;
}

export interface GridConfig {
  rows: number;
  cols: number;
  start_pos: { r: number; c: number };
  obstacles: { r: number; c: number }[];
  visuals: {
    cell_empty: string; // Color or Image URL
    cell_filled: string;
    player_icon: string;
  };
}

export interface ClickerConfig {
  resource_name: string; // e.g. "Money", "Lines of Code"
  click_label: string; // "Click", "Code"
  auto_label: string; // "Auto", "Bot"
  click_icon?: string; // Overrides visual_config
}

export interface RepairPart {
  id: string;
  name: string;
  icon: string;
  initial_pos: { x: number; y: number }; // % (0-100)
  target_pos: { x: number; y: number }; // % (0-100)
}

export interface RepairConfig {
  parts: RepairPart[];
  bg_color?: string; // Board color
}

export interface TenantType {
  id: string;
  name: string;
  cost: number;
  income: number;
  icon: string;
  color: string;
}

export interface OfficeConfig {
  tenant_types: TenantType[];
  max_floors: number;
}

export interface TimelineEvent {
  id: string;
  name: string;
  duration: number; // hours
  fun: number;
  icon: string;
  color: string;
}

export interface TimelineConfig {
  events: TimelineEvent[];
  start_hour: number; // e.g. 12 (12 PM)
  end_hour: number; // e.g. 22 (10 PM)
}

export interface TradingItem {
  id: string;
  name: string;
  min_value: number;
  max_value: number; // Actual value is random between min/max
  start_price: number;
  icon: string;
}

export interface TradingConfig {
  items: TradingItem[];
  initial_budget: number;
}

export interface DefenseEnemy {
  id: string;
  name: string;
  speed: number;
  health: number;
  score: number;
  icon: string;
  color: string;
}

export interface DefenseConfig {
  enemies: DefenseEnemy[];
  spawn_rate: number; // ms
  win_time: number; // seconds
}

export interface StreamerAction {
  id: string;
  name: string;
  energy_cost: number;
  mood_effect: number;
  view_effect: number;
  icon: string;
  color: string;
}

export interface StreamerConfig {
  actions: StreamerAction[];
}

export interface BusinessSimulation {
  business_id: string;
  name: string;
  nameKey?: string; // Translation key for name
  category: string;
  description: string;
  descriptionKey?: string; // Translation key for description
  game_type: GameType;

  // Visuals
  visual_config?: VisualConfig;

  // For Tycoon/Simulation Games
  variables?: {
    resources: string[];
    dynamic_factors: string[];
    player_inputs: string[]; // Keys for sliders
  };

  // For Arcade/Clicker Games
  game_mechanics?: {
    click_value?: number;
    auto_click_rate?: number;
    spawn_rate?: number;
    lanes?: number; // For sorting/driving
  };

  // Engine Configs
  cooking_config?: {
    ingredients: CookingIngredient[];
    recipes: CookingRecipe[];
  };

  service_config?: {
    actions: ServiceAction[];
    customer_types: ServiceCustomerType[];
  };

  rhythm_config?: RhythmConfig;

  grid_config?: GridConfig;

  clicker_config?: ClickerConfig;

  repair_config?: RepairConfig;

  office_config?: OfficeConfig;

  timeline_config?: TimelineConfig;

  trading_config?: TradingConfig;

  defense_config?: DefenseConfig;

  streamer_config?: StreamerConfig;

  entities?: GameEntity[];
  scoring?: ScoringConfig;

  // Progression
  upgrade_tree: BusinessUpgrade[];
  event_triggers: {
    positive: BusinessEvent;
    negative: BusinessEvent;
  };
}

// --- CMS TYPES ---

export interface ContentBlock {
  id: string;
  type: 'HERO' | 'TEXT_IMAGE' | 'CTA';
  title?: string;
  subtitle?: string;
  content?: string; // Rich text / markdown
  image?: string;
  buttonText?: string;
  layout?: 'image_left' | 'image_right' | 'center';
  backgroundColor?: string;
}

export interface CustomPage {
  id: string;
  slug: string; // URL slug e.g. "about-us"
  title: string;
  blocks: ContentBlock[];
}

export interface Bounty {
  id: string;
  creatorId: string; // Parent ID
  assigneeId?: string; // Kid ID (optional if open to all)
  title: string;
  description: string;
  reward: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'PENDING_APPROVAL' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  completedAt?: string;
}

export interface CMSContent {
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    heroImage: string;
    featuresTitle: string; // "How KidCap Works"
    featuresSubtitle: string;
    arcadeTitle: string; // "Real Business Simulations"
    arcadeDesc: string;
    ctaTitle: string; // Bottom CTA
    ctaSubtitle: string;
    extraSections?: ContentBlock[]; // New dynamic sections on home
  };
  features: {
    learningTitle: string;
    learningDesc: string;
    learningImage: string;
    arcadeTitle: string;
    arcadeDesc: string;
    arcadeImage: string;
    progressionTitle: string;
    progressionDesc: string;
    progressionImage: string;
    safetyTitle: string;
    safetyDesc: string;
    safetyImage: string;
  };
  customPages: CustomPage[]; // Array of new pages
}

// --- REAL ESTATE TYPES ---
export interface TenantEvent {
  type: 'BONUS' | 'COST';
  description: string;
  amount: number;
  date: string; // ISO YYYY-MM-DD
}

export interface Property {
  id: string;
  name: string;
  description: string;
  type: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL';
  tier?: 'CITY' | 'METRO' | 'GLOBAL';
  cost: number;
  initialIncome: number; // Daily income
  incomeGrowthRate: number; // Income increase per upgrade
  maxLevel: number;
  image: string; // Emoji or URL
  reqLevel: number; // User level required
  renovationSkins?: string[]; // Alternative emoji skins unlocked by renovation
}

export interface UserProperty {
  propertyId: string;
  level: number;
  lastCollected: string; // ISO Date
  renovationLevel?: number; // Index into renovationSkins array (0 = base image)
  hasInsurance?: boolean;
  tenantEvent?: TenantEvent; // Today's random tenant event
}
