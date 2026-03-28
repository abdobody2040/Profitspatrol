import { User, UserRole, Classroom, StudentGroup, Rubric, Assignment, Submission } from '../types';

export const MOCK_USER: User = {
    id: 'kid_1',
    name: 'Leo',
    username: 'leo',
    // password removed: dev mocks use Supabase Auth — no plain-text password stored
    role: UserRole.KID,
    xp: 1250,
    level: 5,
    streak: 3,
    lastActivityDate: new Date().toISOString(),
    bizCoins: 1500,
    currentModuleId: 'mod_1',
    completedLessonIds: [],
    readBookIds: ['rich-dad-poor-dad', 'shoe-dog'],
    badges: ['First Sale', 'Bookworm'],
    inventory: ['item_sunglasses'],
    settings: { dailyGoalMinutes: 0, soundEnabled: true, musicEnabled: true, themeColor: 'blue', themeMode: 'light' },
    businessLogo: {
        companyName: 'Leo Corp',
        backgroundColor: '#FFC800',
        icon: 'rocket',
        iconColor: '#FFFFFF',
        shape: 'circle'
    },
    hqLevel: 'hq_garage',
    unlockedSkills: ['skl_silver_tongue', 'skl_fast_hands'],
    portfolio: [{ businessId: 'BIZ_01_LEMONADE', managerLevel: 1, lastCollected: new Date().toISOString() }],
    equippedItems: ['item_sunglasses'],
    placedItems: [],
    subscriptionStatus: 'FREE',
    subscriptionTier: 'intern',
    energy: 5,
    lastEnergyRefill: Date.now(),
    classId: 'class_1',
    properties: []
};

export const MOCK_PARENT: User = {
    ...MOCK_USER,
    id: 'parent_1',
    username: 'mom',
    // password removed: dev mocks use Supabase Auth
    role: UserRole.PARENT,
    name: 'Mom',
    linkedChildId: 'kid_1',
    subscriptionStatus: 'FREE',
    subscriptionTier: 'intern',
};

export const MOCK_TEACHER: User = {
    ...MOCK_USER,
    id: 'teacher_1',
    username: 'teacher',
    // password removed: dev mocks use Supabase Auth
    role: UserRole.TEACHER,
    name: 'Mr. Stark',
    classId: 'class_1',
    subscriptionStatus: 'PREMIUM',
    subscriptionTier: 'tycoon',
};

export const MOCK_ADMIN: User = {
    ...MOCK_USER,
    id: 'admin_1',
    username: 'admin',
    // password removed: dev mocks use Supabase Auth
    role: UserRole.ADMIN,
    name: 'Super Admin',
    subscriptionStatus: 'PREMIUM',
    subscriptionTier: 'tycoon',
};

export const MOCK_CLASSROOM: Classroom = {
    id: 'class_1',
    name: 'Future Founders 101',
    code: 'BIZ101',
    teacherId: 'teacher_1',
    studentIds: ['kid_1', 'kid_2', 'kid_3'],
    lockedModules: [],
    schoolHoursOnly: false
};


export const MOCK_STUDENT_GROUPS: StudentGroup[] = [
    { id: 'grp_1', classId: 'class_1', name: 'Advanced Math', studentIds: ['kid_1'], color: '#dbeafe' },
    { id: 'grp_2', classId: 'class_1', name: 'Need Support', studentIds: ['kid_2', 'kid_3'], color: '#fef3c7' }
];

export const MOCK_RUBRICS: Rubric[] = [
    {
        id: 'rubric_1',
        teacherId: 'teacher_1',
        title: 'Standard Business Pitch',
        criteria: [
            { id: 'crit_1', title: 'Clarity', description: 'Was the business idea easy to understand?', maxScore: 5 },
            { id: 'crit_2', title: 'Creativity', description: 'Was the logo and name unique?', maxScore: 5 },
            { id: 'crit_3', title: 'Feasibility', description: 'Could this business actually work?', maxScore: 5 }
        ]
    }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
    {
        id: 'assign_1',
        classId: 'class_1',
        lessonId: 'MB_01',
        title: 'Barter System Challenge',
        description: 'Read the lesson on the Barter System. Then, find 3 items in your house you would trade for a new video game. List them in your submission.',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        status: 'PUBLISHED',
        maxPoints: 100,
        createdAt: new Date().toISOString()
    },
    {
        id: 'assign_2',
        classId: 'class_1',
        lessonId: 'ENT_14',
        title: 'Design Your Logo (Advanced)',
        description: 'Use the Brand Builder tool to create a logo. Submit a screenshot or describe your color choices here.',
        studentGroupId: 'grp_1',
        rubricId: 'rubric_1',
        status: 'PUBLISHED',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        maxPoints: 15,
        createdAt: new Date().toISOString()
    }
];

export const MOCK_SUBMISSIONS: Submission[] = [];
