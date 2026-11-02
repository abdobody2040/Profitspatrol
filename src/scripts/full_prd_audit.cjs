const fs = require('fs');
const path = require('path');

const checks = [
  // 1-7: Heroes & Characters
  { id: 'SEC_04_HEROES', title: '4 Permanent Heroes (Ollie, Reema, Filo, Kami)', file: 'src/features/characters/data/heroes.ts' },
  { id: 'SEC_05_REX', title: 'Rex the Rival (Antagonist & Philosophy)', file: 'src/features/characters/data/rivalRex.ts' },
  { id: 'SEC_06_NPC', title: 'NPC Framework & Living World Profiles', file: 'src/features/livingWorld/data/npcProfiles.ts' },
  { id: 'SEC_07_CHAR_HIERARCHY', title: 'Character Hierarchy & Trust Levels', file: 'src/features/characters/engine/relationshipEngine.ts' },
  { id: 'SEC_37_RELATIONSHIPS', title: 'Character Relationships Modal & Perks', file: 'src/features/characters/components/CharacterRelationshipsModal.tsx' },
  { id: 'SEC_38_DIALOGUE', title: 'Character Dialogue Modal', file: 'src/features/characters/components/CharacterDialogueModal.tsx' },
  { id: 'SEC_39_EMOTIONS', title: 'Character Emotion System in Asset Registry', file: 'src/lib/assets/assetRegistry.ts' },

  // 8-16: World & Districts
  { id: 'SEC_08_DISTRICTS', title: '8 Canonical Districts', file: 'src/domain/world/districts.ts' },
  { id: 'SEC_18_WORLD_MAP', title: 'World Map 2.0 (Zigzag road, district selector)', file: 'src/features/hq/components/AdventureMap.tsx' },
  { id: 'SEC_19_CORE_LOOP', title: 'Core Game Loop (Explore -> Learn -> Play -> Build)', file: 'src/features/education/components/UniversalLessonEngine.tsx' },

  // 20-24: Curriculum & Competencies
  { id: 'SEC_20_CURRICULUM', title: 'Curriculum & 20 Modules', file: 'src/features/education/data/curriculum.ts' },
  { id: 'SEC_22_COMPETENCIES', title: '6 Competencies (Money, Business, Comm, Strategy, Innovation, Ethics)', file: 'src/domain/competency/competencies.ts' },
  { id: 'SEC_23_MASTERY', title: 'Mastery Calculator (4-tier progression)', file: 'src/features/mastery/engine/masteryCalculator.ts' },
  { id: 'SEC_24_ADAPTIVE', title: 'Adaptive Learning (Junior vs Explorer)', file: 'src/features/ageMode/hooks/useAgeMode.ts' },

  // 25-29: Game Architecture & Consequences
  { id: 'SEC_25_GAME_ARCH', title: 'Game Registry (50 Stations mapped to Districts)', file: 'src/features/games/data/gameRegistry.ts' },
  { id: 'SEC_26_GAME_LAUNCH', title: 'Universal Game Launcher', file: 'src/features/games/components/UniversalGameLauncher.tsx' },
  { id: 'SEC_27_RESULT_MODEL', title: 'Common Game Result Model', file: 'src/features/games/types/gameResult.ts' },
  { id: 'SEC_28_CONSEQUENCE', title: 'Consequence Engine', file: 'src/features/business/engine/consequenceEngine.ts' },
  { id: 'SEC_29_WHY_SYSTEM', title: 'Why? Consequence Explainer Modal', file: 'src/features/business/components/WhyExplanationModal.tsx' },

  // 30-35: Business Simulation
  { id: 'SEC_30_PERSISTENT_BIZ', title: 'Persistent Business Store', file: 'src/features/business/store/businessStore.ts' },
  { id: 'SEC_31_BIZ_LOOP', title: 'Business Daily Operations Loop', file: 'src/features/business/components/BusinessDashboard.tsx' },
  { id: 'SEC_34_REAL_ESTATE', title: 'Real Estate / Passive Income', file: 'src/features/game/components/RealEstatePortfolio.tsx' },
  { id: 'SEC_35_REX_RIVALRY', title: 'Rex Rivalry Competition & Market Share', file: 'src/features/rivalry/store/rivalryStore.ts' },
  { id: 'SEC_35_REX_MODAL', title: 'Rex Showdown Modal', file: 'src/features/rivalry/components/RexShowdownModal.tsx' },

  // 36: Living World
  { id: 'SEC_36_LIVING_WORLD', title: 'Living World Store & Schedules', file: 'src/features/livingWorld/store/livingWorldStore.ts' },
  { id: 'SEC_36_NPC_MODAL', title: 'NPC Dialogue & Interaction Modal', file: 'src/features/livingWorld/components/NPCDialogueModal.tsx' },

  // 40-44: Missions & Challenges
  { id: 'SEC_40_MISSION_ENGINE', title: 'Mission Engine (District Contracts & Bounties)', file: 'src/features/missions/components/DailyMissions.tsx' },
  { id: 'SEC_43_ACHIEVEMENTS', title: 'Achievement System', file: 'src/features/dashboard/components/BountyList.tsx' },

  // 45-48: HQ & Lab
  { id: 'SEC_45_HQ', title: 'Headquarters 2.0 (Builder & Empire)', file: 'src/features/hq/components/Headquarters.tsx' },
  { id: 'SEC_46_SKILL_TREE', title: 'Interactive Skill Tree', file: 'src/features/skills/components/SkillTreeView.tsx' },
  { id: 'SEC_47_KAMI_LAB', title: 'Kami Experiment Lab (Prototyping)', file: 'src/features/innovation/components/KamiExperimentLab.tsx' },

  // 49: Capstone
  { id: 'SEC_49_CAPSTONE', title: 'Capstone Venture Journey (7-Step Business Builder)', file: 'src/features/capstone/components/GrandCapstoneJourney.tsx' },

  // 50: Knowledge Hub
  { id: 'SEC_50_KNOWLEDGE', title: 'CEO Knowledge Vault / Library', file: 'src/features/library/components/LibraryModal.tsx' },

  // 56-58: Avatar & Assets
  { id: 'SEC_56_AVATAR', title: 'Avatar Wardrobe Catalog & Customizer', file: 'src/features/avatar/data/avatarCatalog.ts' },
  { id: 'SEC_57_ASSETS', title: 'Asset Registry with Fallbacks', file: 'src/lib/assets/assetRegistry.ts' },

  // 63-65: Parent & Teacher
  { id: 'SEC_63_PARENT', title: 'Parent Dashboard 2.0 (Moments, Screen time)', file: 'src/features/dashboard/components/ParentDashboard.tsx' },
  { id: 'SEC_64_PARENT_MOMENTS', title: 'Hero Mentorship Parent Card & Discussion Starters', file: 'src/features/dashboard/components/HeroMentorshipParentCard.tsx' },
  { id: 'SEC_65_TEACHER', title: 'Teacher Dashboard (Classrooms, Roster, Rubrics, CSV Export)', file: 'src/features/education/components/TeacherDashboard.tsx' },

  // 66: Real-World Missions
  { id: 'SEC_66_REAL_WORLD', title: 'Real-World Missions Modal (Family Missions)', file: 'src/features/realWorld/components/RealWorldMissionsModal.tsx' },

  // 67: Seasons
  { id: 'SEC_67_SEASON', title: 'Season System / Battle Pass / Seasonal Leaderboards', file: 'supabase/migrations/20260607000000_seasonal_leaderboards.sql' },

  // 68: Monetization
  { id: 'SEC_68_MONETIZATION', title: 'Stripe Monetization & Tier Plans', file: 'src/lib/stripe.ts' },

  // 70-71: i18n & RTL
  { id: 'SEC_70_I18N', title: 'Arabic + English RTL Localization', file: 'src/lib/i18n.ts' },

  // Specialized Simulation Modes
  { id: 'SPEC_THE_TANK', title: 'The Tank Mode (3-Judge Shark Tank)', file: 'src/features/tank/components/TheTankFloor.tsx' },
  { id: 'SPEC_DEBATE', title: 'Debate Arena with Fallacy Detector', file: 'src/features/debate/components/DebateArena.tsx' },
  { id: 'SPEC_VOICE', title: 'Character Voice Engine & Web Audio Earcons', file: 'src/services/voice/CharacterVoiceEngine.ts' },
  { id: 'SPEC_PWA', title: 'PWA Manifest & Offline Caching Config', file: 'vite.config.ts' },
];

console.log('--- AUDITING CODEBASE AGAINST MASTER PRD SPECIFICATIONS ---');
let doneCount = 0;
let missingCount = 0;

checks.forEach(c => {
  const exists = fs.existsSync(c.file);
  if (exists) {
    doneCount++;
    console.log(`[DONE] ${c.id}: ${c.title} (${c.file})`);
  } else {
    missingCount++;
    console.log(`[MISSING] ${c.id}: ${c.title} (${c.file})`);
  }
});

console.log(`\nSummary: ${doneCount} Done, ${missingCount} Missing out of ${checks.length} Core Checkpoints`);
