const fs = require('fs');

// 1. VoiceNarrationButton.tsx: add `size?: 'sm' | 'md' | 'lg'`
let vnb = fs.readFileSync('src/components/ui/VoiceNarrationButton.tsx', 'utf8');
if (!vnb.includes('size?:')) {
  vnb = vnb.replace(
    "interface VoiceNarrationButtonProps {",
    "export interface VoiceNarrationButtonProps {\n  size?: 'sm' | 'md' | 'lg';"
  );
  vnb = vnb.replace(
    "  variant = 'pill',",
    "  variant = 'pill',\n  size = 'md',"
  );
  fs.writeFileSync('src/components/ui/VoiceNarrationButton.tsx', vnb, 'utf8');
  console.log('Fixed VoiceNarrationButton.tsx size prop');
}

// 2. SoundService in src/lib/sound.ts: add playReward
let snd = fs.readFileSync('src/lib/sound.ts', 'utf8');
if (!snd.includes('playReward:')) {
  snd = snd.replace(
    "playCoin: () => {",
    "playReward: () => {\n    SoundService.playCoin();\n  },\n\n  playCoin: () => {"
  );
  fs.writeFileSync('src/lib/sound.ts', snd, 'utf8');
  console.log('Added playReward to SoundService in src/lib/sound.ts');
}

// 3. UserProfile.tsx: missing i18n
let up = fs.readFileSync('src/features/dashboard/components/UserProfile.tsx', 'utf8');
if (up.includes("const { t } = useTranslation();")) {
  up = up.replace("const { t } = useTranslation();", "const { t, i18n } = useTranslation();");
  fs.writeFileSync('src/features/dashboard/components/UserProfile.tsx', up, 'utf8');
  console.log('Fixed i18n in UserProfile.tsx');
}

// 4. TeacherDashboard.tsx: missing Classroom import
let td = fs.readFileSync('src/features/education/components/TeacherDashboard.tsx', 'utf8');
if (!td.includes('Classroom,')) {
  td = td.replace(
    "import { UserRole, Assignment, StudentGroup, Rubric, User, Submission, RubricCriteria } from '../../../types';",
    "import { UserRole, Assignment, StudentGroup, Rubric, User, Submission, RubricCriteria, Classroom } from '../../../types';"
  );
  fs.writeFileSync('src/features/education/components/TeacherDashboard.tsx', td, 'utf8');
  console.log('Added Classroom import to TeacherDashboard.tsx');
}

// 5. CharacterRelationshipsModal.tsx: 'neutral' -> 'idle'
let crm = fs.readFileSync('src/features/characters/components/CharacterRelationshipsModal.tsx', 'utf8');
if (crm.includes("'neutral'")) {
  crm = crm.replace("'neutral'", "'idle'");
  fs.writeFileSync('src/features/characters/components/CharacterRelationshipsModal.tsx', crm, 'utf8');
  console.log('Fixed emotion in CharacterRelationshipsModal.tsx');
}

// 6. CharacterTrustCard.tsx: 'smug' -> 'excited', url -> path, fallbackEmoji -> '🌟'
let ctc = fs.readFileSync('src/features/characters/components/CharacterTrustCard.tsx', 'utf8');
ctc = ctc.replace("isRival ? 'smug' : 'happy'", "isRival ? 'excited' : 'happy'");
ctc = ctc.replace("src={charAsset.url}", "src={charAsset.path}");
ctc = ctc.replace("{charAsset.fallbackEmoji}", "🌟");
fs.writeFileSync('src/features/characters/components/CharacterTrustCard.tsx', ctc, 'utf8');
console.log('Fixed CharacterTrustCard.tsx');

// 7. livingWorldStore.ts: comparison
let lws = fs.readFileSync('src/features/livingWorld/store/livingWorldStore.ts', 'utf8');
lws = lws.replace("if (isDone && current.status !== 'completed')", "if (isDone)");
fs.writeFileSync('src/features/livingWorld/store/livingWorldStore.ts', lws, 'utf8');
console.log('Fixed livingWorldStore.ts comparison');

// 8. types.ts: Submission gradedAt/plagiarismScore/originalityScore, and User unlockedDistricts/achievements
let types = fs.readFileSync('src/types.ts', 'utf8');
if (!types.includes('gradedAt?: string;')) {
  types = types.replace(
    "  status: 'PENDING' | 'GRADED' | 'LATE';",
    "  status: 'PENDING' | 'GRADED' | 'LATE';\n  gradedAt?: string;\n  plagiarismScore?: number;\n  originalityScore?: number;"
  );
}
if (!types.includes('unlockedDistricts?:')) {
  types = types.replace(
    "  badges: string[];",
    "  badges: string[];\n  unlockedDistricts?: (string | number)[];\n  achievements?: any[];"
  );
}
fs.writeFileSync('src/types.ts', types, 'utf8');
console.log('Fixed types.ts Submission and User fields');

// 9. RexShowdownModal.tsx: narrativeAr/narrativeEn -> rexTauntAr/rexTauntEn
let rsm = fs.readFileSync('src/features/rivalry/components/RexShowdownModal.tsx', 'utf8');
rsm = rsm.replace("challenge.narrativeAr", "challenge.rexTauntAr");
rsm = rsm.replace("challenge.narrativeEn", "challenge.rexTauntEn");
fs.writeFileSync('src/features/rivalry/components/RexShowdownModal.tsx', rsm, 'utf8');
console.log('Fixed RexShowdownModal.tsx challenge properties');

// 10. tests/avatar/avatarWardrobe.test.ts: role: 'KID' -> UserRole.KID, unlockedDistricts: [1] -> ['1']
let awt = fs.readFileSync('tests/avatar/avatarWardrobe.test.ts', 'utf8');
awt = awt.replace("import { User } from '../../src/types';", "import { User, UserRole } from '../../src/types';");
awt = awt.replace("role: 'KID',", "role: UserRole.KID,");
awt = awt.replace("unlockedDistricts: [1],", "unlockedDistricts: ['1'],");
awt = awt.replace("unlockedDistricts: [1, 2, 3]", "unlockedDistricts: ['1', '2', '3']");
fs.writeFileSync('tests/avatar/avatarWardrobe.test.ts', awt, 'utf8');
console.log('Fixed tests/avatar/avatarWardrobe.test.ts');
