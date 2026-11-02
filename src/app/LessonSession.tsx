import React from 'react';
import Layout from '../components/layout/Layout';
import UniversalLessonEngine from '../features/education/components/UniversalLessonEngine';
import { COURSE_MAP } from '../features/education/data/curriculum';
import { UniversalLessonUnit } from '../types';

interface LessonSessionProps {
  activeLessonId: string;
  lessons: UniversalLessonUnit[];
  activeTab: string;
  onNavigate: (path: string) => void;
  onExit: () => void;
  onCompleteModule: (moduleId: string) => void;
}

export const LessonSession: React.FC<LessonSessionProps> = ({
  activeLessonId,
  lessons,
  activeTab,
  onNavigate,
  onExit,
  onCompleteModule
}) => {
  const targetLesson = lessons.find(l => l.id === activeLessonId);
  const activeUnits = targetLesson ? lessons.filter(l => l.topic_tag === targetLesson.topic_tag) : [];

  if (activeUnits.length === 0) return null;

  const handleNextModule = (fromModuleId?: string) => {
    let currentModuleIndex = -1;
    if (fromModuleId) {
      currentModuleIndex = COURSE_MAP.findIndex(m => m.id === fromModuleId);
    } else if (activeLessonId) {
      currentModuleIndex = COURSE_MAP.findIndex(m => m.lessonIds.includes(activeLessonId));
    }

    if (currentModuleIndex !== -1) {
      const completedModule = COURSE_MAP[currentModuleIndex];
      if (completedModule) {
        onCompleteModule(completedModule.id);
        return;
      }
    }
    onExit();
  };

  const currentModule = COURSE_MAP.find(m => m.lessonIds.includes(activeLessonId));
  const currentModuleIndex = COURSE_MAP.findIndex(m => m.lessonIds.includes(activeLessonId));

  return (
    <Layout activeTab={activeTab} onNavigate={onNavigate}>
      <UniversalLessonEngine
        key={activeUnits[0]?.id}
        units={activeUnits}
        onExit={onExit}
        onNextModule={handleNextModule}
        hasProject={currentModule?.hasProject}
        initialLessonId={activeLessonId}
        bossGameId={currentModuleIndex !== -1 ? `SEC_${currentModuleIndex}_BOSS` : undefined}
      />
    </Layout>
  );
};

export default LessonSession;
