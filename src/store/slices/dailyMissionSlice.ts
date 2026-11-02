import { StateCreator } from 'zustand';
import type { AppState } from '../types';
import { DailyMission, DailyMissionsState, DailyMissionCompletion, MissionActionType } from '../../types';
import { calculateCompetencyDelta } from '../../domain/mastery/masteryCalculator';

// ─── General Daily Mission Pool ────────────────────────────────────────────────
export const MISSION_POOL: DailyMission[] = [
  {
    id: 'dm_lesson_1',
    icon: '📚',
    title: 'Student Mindset',
    titleAr: 'عقلية المتعلم',
    description: 'Complete 1 lesson today',
    descriptionAr: 'أكمل درساً تعليمياً واحداً اليوم',
    actionType: 'COMPLETE_LESSON',
    targetCount: 1,
    xpReward: 30,
    coinReward: 50,
  },
  {
    id: 'dm_lesson_2',
    icon: '🎓',
    title: 'Power Learner',
    titleAr: 'المتعلم المتميز',
    description: 'Complete 3 lessons today',
    descriptionAr: 'أكمل 3 دروس تعليمية اليوم',
    actionType: 'COMPLETE_LESSON',
    targetCount: 3,
    xpReward: 100,
    coinReward: 150,
  },
  {
    id: 'dm_gig_1',
    icon: '💼',
    title: 'Hustle Time',
    titleAr: 'وقت العمل الحر',
    description: 'Complete 1 gig in Gig Central',
    descriptionAr: 'أنجز عملاً حراً واحداً في مركز الأعمال',
    actionType: 'PLAY_GIG',
    targetCount: 1,
    xpReward: 25,
    coinReward: 40,
  },
  {
    id: 'dm_gig_2',
    icon: '⚡',
    title: 'Side Hustle Pro',
    titleAr: 'محترف الأعمال الحرة',
    description: 'Complete 3 gigs in Gig Central',
    descriptionAr: 'أنجز 3 أعمال حرة في مركز الأعمال',
    actionType: 'PLAY_GIG',
    targetCount: 3,
    xpReward: 80,
    coinReward: 120,
  },
  {
    id: 'dm_book_1',
    icon: '📖',
    title: 'Bookworm',
    titleAr: 'قارئ نهم',
    description: 'Read a book in the library',
    descriptionAr: 'اقرأ كتاباً من مكتبة المعرفة',
    actionType: 'READ_BOOK',
    targetCount: 1,
    xpReward: 20,
    coinReward: 30,
  },
  {
    id: 'dm_game_1',
    icon: '🎮',
    title: 'Game On!',
    titleAr: 'تحدي الألعاب',
    description: 'Complete 1 business game',
    descriptionAr: 'العب لعبة أعمال واحدة بنجاح',
    actionType: 'COMPLETE_GAME',
    targetCount: 1,
    xpReward: 30,
    coinReward: 50,
  },
  {
    id: 'dm_game_2',
    icon: '🏆',
    title: 'Arcade Boss',
    titleAr: 'بطل الألعاب الريادية',
    description: 'Complete 2 business games',
    descriptionAr: 'العب لعبتي أعمال بنجاح',
    actionType: 'COMPLETE_GAME',
    targetCount: 2,
    xpReward: 70,
    coinReward: 100,
  },
  {
    id: 'dm_debate_1',
    icon: '🎤',
    title: 'Debate Master',
    titleAr: 'سيد الإقناع والمناظرة',
    description: 'Win a Debate Dojo round',
    descriptionAr: 'اربح جولة في مناظرات الأعمال',
    actionType: 'COMPLETE_DEBATE',
    targetCount: 1,
    xpReward: 50,
    coinReward: 75,
  },
  {
    id: 'dm_coins_1',
    icon: '💰',
    title: 'Money Maker',
    titleAr: 'صانع الأموال',
    description: 'Earn 200 P Tokens from activities',
    descriptionAr: 'اجمع 200 رمز PP من أنشطتك',
    actionType: 'EARN_ppTokens',
    targetCount: 200,
    xpReward: 40,
    coinReward: 60,
  },
  {
    id: 'dm_coins_2',
    icon: '🤑',
    title: 'Coin Collector',
    titleAr: 'جامع العملات',
    description: 'Earn 500 P Tokens from activities',
    descriptionAr: 'اجمع 500 رمز PP من أنشطتك',
    actionType: 'EARN_ppTokens',
    targetCount: 500,
    xpReward: 90,
    coinReward: 0,
  }
];

// ─── 8-District Competency Contracts Pool ──────────────────────────────────────
export const DISTRICT_CONTRACTS_POOL: DailyMission[] = [
  {
    id: 'dc_money_1',
    icon: '💰',
    title: 'Startup Cash Flow Audit',
    titleAr: 'تدقيق التدفق النقدي للشركات الناشئة',
    description: 'Complete 1 lesson in Money District to master budgeting',
    descriptionAr: 'أكمل درساً واحداً في حي النقود لاحتراف الميزانية',
    actionType: 'DISTRICT_LESSON',
    targetCount: 1,
    xpReward: 60,
    coinReward: 80,
    districtId: 'money',
    competencyId: 'budgeting',
    competencyXpReward: 50,
    isContract: true
  },
  {
    id: 'dc_builders_1',
    icon: '🚀',
    title: 'Builders Margin Analysis',
    titleAr: 'تحليل هوامش ربح البناة',
    description: 'Complete 1 lesson in Builders District to master pricing strategy',
    descriptionAr: 'أكمل درساً واحداً في حي البناة لاحتراف تسعير المنتجات',
    actionType: 'DISTRICT_LESSON',
    targetCount: 1,
    xpReward: 70,
    coinReward: 90,
    districtId: 'builders',
    competencyId: 'pricing',
    competencyXpReward: 50,
    isContract: true
  },
  {
    id: 'dc_risk_1',
    icon: '🛡️',
    title: 'Scam Defense Protocol',
    titleAr: 'بروتوكول التصدي للاحتيال المالي',
    description: 'Complete 1 lesson in Risk District to protect your assets',
    descriptionAr: 'أكمل درساً واحداً في حي الثروة والمخاطر لحماية أموالك',
    actionType: 'DISTRICT_LESSON',
    targetCount: 1,
    xpReward: 80,
    coinReward: 100,
    districtId: 'risk',
    competencyId: 'scam_defense',
    competencyXpReward: 50,
    isContract: true
  },
  {
    id: 'dc_operations_1',
    icon: '⚙️',
    title: 'Supply Chain Optimization',
    titleAr: 'تحسين سلاسل التوريد واللوجستيات',
    description: 'Complete 1 operations task or manage business inventory',
    descriptionAr: 'أكمل مهمة لوجستية أو أدر مخزون متجرك بنجاح',
    actionType: 'DISTRICT_CONTRACT',
    targetCount: 1,
    xpReward: 75,
    coinReward: 95,
    districtId: 'operations',
    competencyId: 'inventory',
    competencyXpReward: 50,
    isContract: true
  },
  {
    id: 'dc_innovation_1',
    icon: '💡',
    title: 'Kami Lab Synthesis',
    titleAr: 'توليف الابتكار في مختبر كيمي',
    description: 'Synthesize 1 prototype in Kami Experiment Lab',
    descriptionAr: 'اصنع نموذجاً أولياً واحداً في مختبر كيمي للابتكار',
    actionType: 'PROTOTYPE_CRAFT',
    targetCount: 1,
    xpReward: 85,
    coinReward: 110,
    districtId: 'innovation',
    competencyId: 'prototyping',
    competencyXpReward: 60,
    isContract: true
  },
  {
    id: 'dc_leadership_1',
    icon: '🤝',
    title: 'Win-Win Negotiation Deal',
    titleAr: 'صفقة التفاوض الرابحة للطرفين',
    description: 'Win 1 debate round or complete 1 leadership lesson',
    descriptionAr: 'اربح جولة مناظرة أو أكمل درساً في حي القيادة',
    actionType: 'COMPLETE_DEBATE',
    targetCount: 1,
    xpReward: 90,
    coinReward: 120,
    districtId: 'leadership',
    competencyId: 'negotiation',
    competencyXpReward: 60,
    isContract: true
  },
  {
    id: 'dc_strategy_1',
    icon: '♟️',
    title: 'Rival Rex Market Showdown',
    titleAr: 'مواجهة ريكس السوقية',
    description: 'Confront Rival Rex in a district showdown',
    descriptionAr: 'واجه المنافس ريكس في تحدي الأحياء التنافسي',
    actionType: 'RIVAL_SHOWDOWN',
    targetCount: 1,
    xpReward: 100,
    coinReward: 130,
    districtId: 'strategy',
    competencyId: 'competitive_strategy',
    competencyXpReward: 75,
    isContract: true
  },
  {
    id: 'dc_launch_1',
    icon: '👑',
    title: 'Empire Sales Cycle',
    titleAr: 'دورة مبيعات الإمبراطورية',
    description: 'Simulate a day in your business store with positive sales',
    descriptionAr: 'قم بمحاكاة يوم في متجرك وحقق مبيعات ناجحة',
    actionType: 'BUSINESS_SALE',
    targetCount: 1,
    xpReward: 95,
    coinReward: 125,
    districtId: 'launch',
    competencyId: 'global_vision',
    competencyXpReward: 65,
    isContract: true
  }
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/** Deterministic daily seed — picks 3 daily missions */
function pickTodaysMissions(today: string): DailyMission[] {
  const hash = today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pool = [...MISSION_POOL];
  const picked: DailyMission[] = [];
  let seed = hash;
  for (let i = 0; i < 3; i++) {
    const idx = seed % pool.length;
    picked.push(pool[idx]);
    pool.splice(idx, 1);
    seed = Math.floor(seed * 1.37 + 7) % 9999;
  }
  return picked;
}

/** Deterministic daily seed — picks 2 district competency contracts */
function pickTodaysContracts(today: string): DailyMission[] {
  const hash = today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pool = [...DISTRICT_CONTRACTS_POOL];
  const picked: DailyMission[] = [];
  let seed = hash + 19;
  for (let i = 0; i < 2; i++) {
    const idx = seed % pool.length;
    picked.push(pool[idx]);
    pool.splice(idx, 1);
    seed = Math.floor(seed * 1.51 + 13) % 9999;
  }
  return picked;
}

function buildInitialCompletions(missions: DailyMission[]): DailyMissionCompletion[] {
  return missions.map((m) => ({
    missionId: m.id,
    progress: 0,
    completed: false,
    claimedReward: false,
  }));
}

function freshDailyState(): DailyMissionsState {
  const today = getTodayISO();
  const missions = pickTodaysMissions(today);
  const districtContracts = pickTodaysContracts(today);
  const allMissions = [...missions, ...districtContracts];

  return {
    date: today,
    missions,
    districtContracts,
    completions: buildInitialCompletions(allMissions),
  };
}

// ─── Slice Definition ──────────────────────────────────────────────────────────

export interface DailyMissionsSlice {
  dailyMissions: DailyMissionsState;
  /** Called by action handlers with optional districtId */
  trackMissionProgress: (actionType: MissionActionType, amount?: number, districtId?: string) => void;
  claimMissionReward: (missionId: string) => void;
  /** Called on app mount to reset if day changed */
  refreshDailyMissions: () => void;
}

export const createDailyMissionsSlice: StateCreator<AppState, [], [], DailyMissionsSlice> = (set, get) => ({
  dailyMissions: freshDailyState(),

  refreshDailyMissions: () => {
    const today = getTodayISO();
    const current = get().dailyMissions;
    if (current.date !== today) {
      set({ dailyMissions: freshDailyState() });
    }
  },

  trackMissionProgress: (actionType, amount = 1, districtId?: string) => {
    const today = getTodayISO();
    set((state) => {
      // Auto-reset if new day
      const dm = state.dailyMissions.date !== today ? freshDailyState() : state.dailyMissions;
      const allMissions = [...dm.missions, ...(dm.districtContracts || [])];

      const updatedCompletions = dm.completions.map((c) => {
        const mission = allMissions.find((m) => m.id === c.missionId);
        if (!mission || c.completed) return c;

        // Check if action matches
        let matches = false;
        if (mission.actionType === actionType) {
          if (districtId && mission.districtId) {
            matches = mission.districtId === districtId;
          } else {
            matches = true;
          }
        } else if (actionType === 'COMPLETE_LESSON' && mission.actionType === 'DISTRICT_LESSON') {
          matches = !districtId || !mission.districtId || mission.districtId === districtId;
        }

        if (!matches) return c;

        const newProgress = c.progress + amount;
        return {
          ...c,
          progress: newProgress,
          completed: newProgress >= mission.targetCount,
        };
      });

      return {
        dailyMissions: {
          ...dm,
          completions: updatedCompletions,
        },
      };
    });
  },

  claimMissionReward: (missionId) => {
    set((state) => {
      const dm = state.dailyMissions;
      const completion = dm.completions.find((c) => c.missionId === missionId);
      const mission = 
        dm.missions.find((m) => m.id === missionId) || 
        dm.districtContracts?.find((m) => m.id === missionId);

      if (!completion || !mission || !completion.completed || completion.claimedReward) return {};

      const user = state.user;
      if (!user) return {};

      const updatedCompletions = dm.completions.map((c) =>
        c.missionId === missionId ? { ...c, claimedReward: true } : c
      );

      let updatedUser = {
        ...user,
        xp: (user.xp || 0) + mission.xpReward,
        ppTokens: (user.ppTokens || 0) + mission.coinReward,
      };

      // If this is a district competency contract, award competency mastery XP!
      if (mission.competencyId && mission.competencyXpReward) {
        const currentComp = user.competencyMastery?.[mission.competencyId] || {
          level: 1,
          score: 0,
          lastTestedAt: ''
        };
        const delta = calculateCompetencyDelta(
          mission.competencyId,
          currentComp.score,
          mission.competencyXpReward
        );
        updatedUser = {
          ...updatedUser,
          competencyMastery: {
            ...(user.competencyMastery || {}),
            [mission.competencyId]: {
              level: delta.newLevel,
              score: delta.newXp,
              lastTestedAt: new Date().toISOString()
            }
          }
        };
      }

      return {
        dailyMissions: { ...dm, completions: updatedCompletions },
        user: updatedUser,
      };
    });
  },
});
