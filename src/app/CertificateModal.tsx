import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { COURSE_MAP, getLessonBatch } from '../features/education/data/curriculum';

const ModuleRecap = React.lazy(() => import('../features/education/components/ModuleRecap'));

interface CertificateModalProps {
  showCertificateId: string;
  onClose: () => void;
  onAdvanceLesson: (lessonId: string | null) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  showCertificateId,
  onClose,
  onAdvanceLesson
}) => {
  const completedIndex = COURSE_MAP.findIndex(m => m.id === showCertificateId);
  const moduleTitle = COURSE_MAP.find(m => m.id === showCertificateId)?.title || "Module Complete";
  const lessons = getLessonBatch(showCertificateId);

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Suspense fallback={<div className="text-white"><Loader2 className="animate-spin" /></div>}>
        <ModuleRecap
          moduleTitle={moduleTitle}
          lessons={lessons}
          totalXp={500}
          onClose={onClose}
          onNextModule={() => {
            onClose();
            if (completedIndex !== -1 && completedIndex < COURSE_MAP.length - 1) {
              const nextModule = COURSE_MAP[completedIndex + 1];
              if (nextModule?.lessonIds?.length > 0) {
                onAdvanceLesson(nextModule.lessonIds[0]);
                return;
              }
            }
            onAdvanceLesson(null);
          }}
        />
      </Suspense>
    </div>
  );
};

export default CertificateModal;
