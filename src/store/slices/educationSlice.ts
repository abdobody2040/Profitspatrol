import { StateCreator } from 'zustand';
import { useAppStore } from '../index';
import type { EducationState } from '../educationStore';
import {
    Classroom, UniversalLessonUnit, StudentGroup, Rubric, Assignment, Submission, UserRole
} from '../../types';
import { ALL_LESSONS } from '../../features/education/data/curriculum';
import {
    MOCK_CLASSROOM, MOCK_STUDENT_GROUPS, MOCK_RUBRICS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS
} from '../../data/mocks';
import { getLevel } from '../../utils/gameUtils';
import { SoundService } from '../../lib/sound';
import { supabaseAdapter } from '../../services/persistence/SupabaseAdapter';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Logger } from '../../services/logger';

export interface EducationSlice {
    // Classrooms
    classroom: Classroom | null;
    classrooms: Classroom[];

    // Content State
    lessons: UniversalLessonUnit[];

    // Teacher Feature State
    studentGroups: StudentGroup[];
    rubrics: Rubric[];
    assignments: Assignment[];
    submissions: Submission[];

    completeLesson: (lessonId: string, xpReward?: number, coinReward?: number) => void;

    // SaaS / Admin Actions
    joinClass: (code: string) => boolean;
    toggleModuleLock: (moduleId: string) => void;
    toggleSchoolHours: () => void;

    // Content CRUD
    addLesson: (lesson: UniversalLessonUnit) => void;
    updateLesson: (id: string, updates: Partial<UniversalLessonUnit>) => void;
    deleteLesson: (id: string) => void;

    // Teacher Feature Actions
    addStudentGroup: (group: StudentGroup) => void;
    updateStudentGroup: (id: string, updates: Partial<StudentGroup>) => void;
    deleteStudentGroup: (id: string) => void;

    addRubric: (rubric: Rubric) => void;
    updateRubric: (id: string, updates: Partial<Rubric>) => void;
    deleteRubric: (id: string) => void;

    addAssignment: (assignment: Assignment) => void;
    updateAssignment: (id: string, updates: Partial<Assignment>) => void;
    deleteAssignment: (id: string) => void;

    addSubmission: (submission: Submission) => void;
    updateSubmission: (id: string, updates: Partial<Submission>) => void;
    deleteSubmission: (id: string) => void;

    addClassroom: (classroom: Classroom) => void;
    updateClassroom: (id: string, updates: Partial<Classroom>) => void;
    deleteClassroom: (id: string) => void;
    fetchAllClassrooms: () => Promise<void>;
    setViewingClassroom: (classroomId: string | null) => void;
}

export const createEducationSlice: StateCreator<EducationState, [], [], EducationSlice> = (set, get) => ({
    classroom: null,
    classrooms: [MOCK_CLASSROOM],
    lessons: ALL_LESSONS,

    studentGroups: MOCK_STUDENT_GROUPS,
    rubrics: MOCK_RUBRICS,
    assignments: MOCK_ASSIGNMENTS,
    submissions: MOCK_SUBMISSIONS,

    completeLesson: (lessonId, xpReward, coinReward) => {
        const state = get();
        const appState = useAppStore.getState();
        const user = appState.user;
        if (!user) return;
        if (user.completedLessonIds.includes(lessonId)) return;

        const lesson = state.lessons.find(l => l.id === lessonId);
        if (lesson && user.classId) {
            const classroom = state.classrooms.find(c => c.id === user.classId);
            if (classroom && classroom.lockedModules.length > 0) {
                if (classroom.lockedModules.includes(lesson.topic_tag)) {
                    Logger.warn('EducationSlice: Attempt to complete lesson in locked module blocked', {
                        moduleId: lesson.topic_tag,
                        lessonId,
                        userId: user.id
                    });
                    return;
                }
            }
        }

        const modifiers = appState.getSkillModifiers();
        const baseXp = xpReward !== undefined ? xpReward : 50;
        const baseCoins = coinReward !== undefined ? coinReward : 20;

        const newXp = user.xp + Math.round(baseXp * modifiers.xpMultiplier);
        const oldLevel = user.level;
        const newLevel = getLevel(newXp);
        const leveledUp = newLevel > oldLevel;

        if (leveledUp && user.settings.soundEnabled) SoundService.playLevelUp();
        else if (user.settings.soundEnabled) SoundService.playSuccess();

        const updatedUser = {
            ...user,
            completedLessonIds: [...user.completedLessonIds, lessonId],
            xp: newXp,
            level: newLevel,
            bizCoins: user.bizCoins + baseCoins
        };

        useAppStore.setState({
            user: updatedUser,
            users: appState.users.map(u => u.id === updatedUser.id ? updatedUser : u),
            showLevelUpModal: leveledUp,
            levelUpData: leveledUp ? { level: newLevel, xp: newXp } : null
        });

        appState.trackMissionProgress('COMPLETE_LESSON', 1);
        if (baseCoins > 0) appState.trackMissionProgress('EARN_COINS', baseCoins);
        appState.trackWeeklyChallengeProgress('LESSON_SPRINT', 1);
        if (baseCoins > 0) appState.trackWeeklyChallengeProgress('COIN_GRIND', baseCoins);
        appState.trackSeasonalProgress('LESSON_MARATHON', 1);
        if (baseCoins > 0) appState.trackSeasonalProgress('COIN_SPRINT', baseCoins);
    },

    joinClass: (code) => {
        const { classrooms } = get();
        const appState = useAppStore.getState();
        const user = appState.user;
        const targetClass = classrooms.find(c => c.code === code);

        if (targetClass && user) {
            const updatedUser = { ...user, classId: targetClass.id };
            useAppStore.setState({
                user: updatedUser,
                users: appState.users.map(u => u.id === updatedUser.id ? updatedUser : u)
            });
            set({ classroom: targetClass });
            return true;
        }
        return false;
    },

    toggleModuleLock: (moduleId) => set((state) => {
        if (!state.classroom) return {};
        const isLocked = state.classroom.lockedModules.includes(moduleId);
        const newLocked = isLocked
            ? state.classroom.lockedModules.filter(id => id !== moduleId)
            : [...state.classroom.lockedModules, moduleId];

        const updatedClassroom = { ...state.classroom, lockedModules: newLocked };
        return {
            classroom: updatedClassroom,
            classrooms: state.classrooms.map(c => c.id === updatedClassroom.id ? updatedClassroom : c)
        };
    }),

    toggleSchoolHours: () => set((state) => {
        if (!state.classroom) return {};
        const updatedClassroom = { ...state.classroom, schoolHoursOnly: !state.classroom.schoolHoursOnly };
        return {
            classroom: updatedClassroom,
            classrooms: state.classrooms.map(c => c.id === updatedClassroom.id ? updatedClassroom : c)
        };
    }),

    // CRUD
    addLesson: (lesson) => set((state) => ({ lessons: [...state.lessons, lesson] })),
    updateLesson: (id, updates) => set((state) => ({
        lessons: state.lessons.map(l => l.id === id ? { ...l, ...updates } : l)
    })),
    deleteLesson: (id) => set((state) => ({
        lessons: state.lessons.filter(l => l.id !== id)
    })),

    // Teacher CRUD
    addStudentGroup: (group) => set((state) => ({ studentGroups: [...state.studentGroups, group] })),
    updateStudentGroup: (id, updates) => set((state) => ({
        studentGroups: state.studentGroups.map(x => x.id === id ? { ...x, ...updates } : x)
    })),
    deleteStudentGroup: (id) => set((state) => ({
        studentGroups: state.studentGroups.filter(x => x.id !== id)
    })),

    addRubric: (rubric) => set((state) => ({ rubrics: [...state.rubrics, rubric] })),
    updateRubric: (id, updates) => set((state) => ({
        rubrics: state.rubrics.map(x => x.id === id ? { ...x, ...updates } : x)
    })),
    deleteRubric: (id) => set((state) => ({
        rubrics: state.rubrics.filter(x => x.id !== id)
    })),

    addAssignment: (assignment) => set((state) => ({ assignments: [...state.assignments, assignment] })),
    updateAssignment: (id, updates) => set((state) => ({
        assignments: state.assignments.map(x => x.id === id ? { ...x, ...updates } : x)
    })),
    deleteAssignment: (id) => set((state) => ({
        assignments: state.assignments.filter(x => x.id !== id)
    })),

    addSubmission: (submission) => set((state) => {
        let secureSubmission = { ...submission };
        if (useAppStore.getState().user?.role === UserRole.KID) {
            secureSubmission.status = 'PENDING';
            secureSubmission.grade = undefined;
        }
        return { submissions: [...state.submissions, secureSubmission] };
    }),
    updateSubmission: (id, updates) => set((state) => {
        if (useAppStore.getState().user?.role === UserRole.KID) {
            Logger.warn('EducationSlice: KID attempted to update submission — blocked', {
                userId: useAppStore.getState().user?.id, submissionId: id
            });
            return {};
        }
        return { submissions: state.submissions.map(x => x.id === id ? { ...x, ...updates } : x) };
    }),
    deleteSubmission: (id) => set((state) => {
        if (useAppStore.getState().user?.role === UserRole.KID) {
            Logger.warn('EducationSlice: KID attempted to delete submission — blocked', {
                userId: useAppStore.getState().user?.id, submissionId: id
            });
            return {};
        }
        return { submissions: state.submissions.filter(x => x.id !== id) };
    }),

    addClassroom: (classroom) => {
        set((state) => ({ classrooms: [...state.classrooms, classroom] }));
        if (isSupabaseConfigured()) {
            supabaseAdapter.saveClassroom(classroom).catch(err => Logger.error("Supabase: addClassroom failed", err));
        }
    },
    updateClassroom: (id, updates) => {
        set((state) => ({
            classrooms: state.classrooms.map(c => c.id === id ? { ...c, ...updates } : c)
        }));
        if (isSupabaseConfigured()) {
            const updated = get().classrooms.find(c => c.id === id);
            if (updated) supabaseAdapter.saveClassroom(updated).catch(err => Logger.error("Supabase: updateClassroom failed", err));
        }
    },
    deleteClassroom: (id) => {
        set((state) => ({
            classrooms: state.classrooms.filter(c => c.id !== id)
        }));
        if (isSupabaseConfigured()) {
            supabaseAdapter.deleteClassroom(id).catch(err => Logger.error("Supabase: deleteClassroom failed", err));
        }
    },

    fetchAllClassrooms: async () => {
        if (!isSupabaseConfigured()) return;
        try {
            const { data, error } = await supabaseAdapter.client!.from('classrooms').select('*');
            if (error) { Logger.error("Admin: fetchAllClassrooms failed", error); return; }
            const classrooms = (data || []).map((row: any) => supabaseAdapter.mapRowToClassroom(row));
            set({ classrooms });
        } catch (e) {
            Logger.error("Admin: fetchAllClassrooms exception", e);
        }
    },

    setViewingClassroom: (classroomId) => useAppStore.setState({ adminViewingClassroomId: classroomId })
});
