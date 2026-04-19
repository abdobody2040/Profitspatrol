import { create } from 'zustand';
import { GradeResult, Submission, Rubric } from '../../../types';
import { gradeProjectWithOllie } from '../../../lib/gemini';
import { useAppStore } from '../../../store'; // Import main store
import { useEducationStore } from '../../../store/educationStore';

interface GradingState {
    submissionStatus: 'idle' | 'uploading' | 'grading' | 'complete' | 'error';
    currentProject: {
        text: string;
        files: File[];
        lessonId: string;
    } | null;
    gradeResult: GradeResult | null;
    error: string | null;

    // Actions
    startSubmission: (lessonId: string) => void;
    setProjectText: (text: string) => void;
    setProjectFiles: (files: File[]) => void;
    submitProject: (lessonId: string, data: { text: string, files: File[], difficulty?: 'EASY' | 'MEDIUM' | 'HARD' }) => Promise<void>;
    setGradingStatus: (status: GradingState['submissionStatus']) => void;
    setGradeResult: (result: GradeResult) => void;
    setError: (error: string) => void;
    reset: () => void;
}

export const useGradingStore = create<GradingState>((set, get) => ({
    submissionStatus: 'idle',
    currentProject: null,
    gradeResult: null,
    error: null,

    startSubmission: (lessonId) => set({
        submissionStatus: 'idle',
        currentProject: { lessonId, text: '', files: [] },
        gradeResult: null,
        error: null
    }),

    setProjectText: (text) => set((state) => ({
        currentProject: state.currentProject ? { ...state.currentProject, text } : null
    })),

    setProjectFiles: (files) => set((state) => ({
        currentProject: state.currentProject ? { ...state.currentProject, files } : null
    })),

    submitProject: async (lessonId, { text, files, difficulty = 'MEDIUM' }: { text: string, files: File[], difficulty?: 'EASY' | 'MEDIUM' | 'HARD' }) => {
        // RACE CONDITION LOCK: Prevent double submission
        if (get().submissionStatus === 'grading' || get().submissionStatus === 'uploading') return;

        set({ submissionStatus: 'grading', error: null });
        try {
            // 1. Get Rubric (Mock or from Assignment)
            const rubric: Rubric = {
                id: 'default_rubric',
                teacherId: 'system',
                title: 'Project Rubric',
                criteria: [
                    { id: 'c1', title: 'Creativity', description: 'Originality of the idea', maxScore: 40 },
                    { id: 'c2', title: 'Details', description: 'Depth of business plan', maxScore: 30 },
                    { id: 'c3', title: 'Feasibility', description: 'Is it realistic?', maxScore: 30 }
                ]
            };

            // 2. Call AI with Difficulty
            const result = await gradeProjectWithOllie(text, rubric, difficulty);

            // 3. Persist to App Store (Mock DB)
            const appStore = useAppStore.getState();
            const educationStore = useEducationStore.getState();
            const user = appStore.user;

            if (user) {
                const newSubmission: Submission = {
                    id: `sub_${Date.now()}`,
                    assignmentId: `ass_project_${lessonId}`,
                    studentId: user.id,
                    submittedAt: new Date().toISOString(),
                    // ✅ FIX: Use 'PENDING' status instead of 'GRADED'.
                    // AI grading is a suggested grade only — it bypasses teacher review
                    // if we set status=GRADED immediately. The teacher must confirm
                    // via the GradeReview UI before this becomes the official grade.
                    status: 'PENDING',
                    content: text,
                    // Store AI result as a suggestion, not the authoritative grade
                    grade: undefined,
                    feedback: `[AI Suggestion] ${result.feedback}`,
                    rubricScores: result.rubricScores,
                    letterGrade: undefined,
                    bizCoinsAwarded: 0,
                    xpGained: 0,
                };
                educationStore.addSubmission(newSubmission);
            }

            set({
                gradeResult: result,
                submissionStatus: 'complete'
            });

        } catch (err: any) {
            set({ error: err.message || "Grading failed", submissionStatus: 'error' });
        }
    },

    setGradingStatus: (status) => set({ submissionStatus: status }),

    setGradeResult: (result) => set({
        gradeResult: result,
        submissionStatus: 'complete'
    }),

    setError: (error) => set({
        error,
        submissionStatus: 'error'
    }),

    reset: () => set({
        submissionStatus: 'idle',
        currentProject: null,
        gradeResult: null,
        error: null
    })
}));
