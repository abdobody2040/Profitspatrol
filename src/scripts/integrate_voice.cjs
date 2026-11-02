const fs = require('fs');

// 1. UniversalLessonEngine.tsx
let ule = fs.readFileSync('src/features/education/components/UniversalLessonEngine.tsx', 'utf8');

const uleTarget1 = '<span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">{t(\'engine.briefing\', { defaultValue: \'Briefing\' })}</span>';
const uleReplace1 = `<div className="flex items-center gap-2">
                                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">{t('engine.briefing', { defaultValue: 'Briefing' })}</span>
                                        <VoiceNarrationButton characterId="ollie" textToSpeak={\`\${translatedHeadline}. \${translatedBody}\`} size="sm" />
                                    </div>`;

if (ule.includes(uleTarget1)) {
  ule = ule.replace(uleTarget1, uleReplace1);
  console.log('Integrated VoiceNarrationButton into UniversalLessonEngine briefing');
} else {
  console.log('uleTarget1 not found or already replaced');
}

fs.writeFileSync('src/features/education/components/UniversalLessonEngine.tsx', ule, 'utf8');

// 2. CharacterDialogueModal.tsx
let cdm = fs.readFileSync('src/features/characters/components/CharacterDialogueModal.tsx', 'utf8');

if (!cdm.includes('VoiceNarrationButton')) {
  cdm = cdm.replace(
    "import { X, Sparkles, MessageCircle, ChevronRight, Award, Heart } from 'lucide-react';",
    "import { X, Sparkles, MessageCircle, ChevronRight, Award, Heart } from 'lucide-react';\nimport { VoiceNarrationButton } from '../../../components/ui/VoiceNarrationButton';"
  );

  const bubbleTarget = `<p className={\`text-slate-700 dark:text-slate-200 leading-relaxed \${isJunior ? 'text-lg font-medium' : 'text-base'}\`}>
                  {isArabic ? dialogueAr : dialogueEn}
                </p>`;
  const bubbleTargetCRLF = bubbleTarget.replace(/\n/g, '\r\n');

  const bubbleReplace = `<p className={\`text-slate-700 dark:text-slate-200 leading-relaxed \${isJunior ? 'text-lg font-medium' : 'text-base'}\`}>
                  {isArabic ? dialogueAr : dialogueEn}
                </p>
                <div className="mt-3 flex justify-end">
                  <VoiceNarrationButton 
                    characterId={characterId} 
                    textToSpeak={isArabic ? dialogueAr : dialogueEn} 
                    size="sm" 
                  />
                </div>`;

  if (cdm.includes(bubbleTargetCRLF)) {
    cdm = cdm.replace(bubbleTargetCRLF, bubbleReplace.replace(/\n/g, '\r\n'));
    console.log('Integrated VoiceNarrationButton into CharacterDialogueModal (CRLF)');
  } else if (cdm.includes(bubbleTarget)) {
    cdm = cdm.replace(bubbleTarget, bubbleReplace);
    console.log('Integrated VoiceNarrationButton into CharacterDialogueModal (LF)');
  }

  fs.writeFileSync('src/features/characters/components/CharacterDialogueModal.tsx', cdm, 'utf8');
}

// 3. RexShowdownModal.tsx
let rsm = fs.readFileSync('src/features/rivalry/components/RexShowdownModal.tsx', 'utf8');

if (!rsm.includes('VoiceNarrationButton')) {
  rsm = rsm.replace(
    "import { SoundService } from '../../../lib/sound';",
    "import { SoundService } from '../../../lib/sound';\nimport { VoiceNarrationButton } from '../../../components/ui/VoiceNarrationButton';"
  );

  const rexTarget = `              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-400 italic">
                  &ldquo;{isArabic ? RIVAL_REX.philosophyAr : RIVAL_REX.philosophyEn}&rdquo;
                </span>
              </div>`;
  const rexTargetCRLF = rexTarget.replace(/\n/g, '\r\n');

  const rexReplace = `              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-rose-400 italic">
                  &ldquo;{isArabic ? RIVAL_REX.philosophyAr : RIVAL_REX.philosophyEn}&rdquo;
                </span>
                <VoiceNarrationButton
                  characterId="rex"
                  textToSpeak={resolution 
                    ? (isArabic ? resolution.rexResponseAr : resolution.rexResponseEn)
                    : (isArabic ? challenge.narrativeAr : challenge.narrativeEn)}
                  size="sm"
                />
              </div>`;

  if (rsm.includes(rexTargetCRLF)) {
    rsm = rsm.replace(rexTargetCRLF, rexReplace.replace(/\n/g, '\r\n'));
    console.log('Integrated VoiceNarrationButton into RexShowdownModal (CRLF)');
  } else if (rsm.includes(rexTarget)) {
    rsm = rsm.replace(rexTarget, rexReplace);
    console.log('Integrated VoiceNarrationButton into RexShowdownModal (LF)');
  }

  fs.writeFileSync('src/features/rivalry/components/RexShowdownModal.tsx', rsm, 'utf8');
}

console.log('Voice integration script completed!');
