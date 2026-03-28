import { User, Classroom, UniversalLessonUnit, BusinessSimulation, Book, CMSContent, Assignment, Submission, StudentGroup, Rubric } from '../../types';

export interface StorageAdapter {
    // Initialization
    initialize(): Promise<void>;

    // Core Data Sync
    // Returns the full dataset for the client to hydrate its store
    loadAllData(): Promise<{
        users: User[];
        classrooms: Classroom[];
        lessons: UniversalLessonUnit[];
        games: BusinessSimulation[];
        library: Book[];
        cmsContent: CMSContent;
        assignments: Assignment[];
        submissions: Submission[];
        studentGroups: StudentGroup[];
        rubrics: Rubric[];
    }>;

    // Granular Updates (Upsert)
    saveUser(user: User): Promise<void>;
    deleteUser(userId: string): Promise<void>;

    saveClassroom(classroom: Classroom): Promise<void>;
    deleteClassroom(classroomId: string): Promise<void>;

    saveAssignment(assignment: Assignment): Promise<void>;
    deleteAssignment(assignmentId: string): Promise<void>;

    saveSubmission(submission: Submission): Promise<void>;

    saveGame(game: BusinessSimulation): Promise<void>;
    deleteGame(gameId: string): Promise<void>;

    saveLesson(lesson: UniversalLessonUnit): Promise<void>;

    saveBook(book: Book): Promise<void>;
    removeBook(bookId: string): Promise<void>;

    saveCMSContent(content: CMSContent): Promise<void>;
}
