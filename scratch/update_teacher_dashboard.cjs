const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/features/education/components/TeacherDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import for CreateClassModal
if (!content.includes("import { CreateClassModal }")) {
  content = content.replace(
    'import { HeroMentorshipParentCard }',
    "import { CreateClassModal } from './CreateClassModal';\nimport { HeroMentorshipParentCard }"
  );
}

// 2. Add selectedClassId and teacherClasses resolution
const oldClassroomLookup = `    const classroom = classrooms.find(c => c.teacherId === user?.id || c.id === adminViewingClassroomId);`;

const newClassroomLookup = `    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

    const teacherClasses = useMemo(() => {
        return classrooms.filter(c => c.teacherId === user?.id || (user?.role === 'ADMIN' && c.id === adminViewingClassroomId));
    }, [classrooms, user?.id, user?.role, adminViewingClassroomId]);

    const classroom = useMemo(() => {
        if (selectedClassId) {
            const found = classrooms.find(c => c.id === selectedClassId);
            if (found) return found;
        }
        if (teacherClasses.length > 0) return teacherClasses[0];
        return classrooms.find(c => c.teacherId === user?.id || c.id === adminViewingClassroomId);
    }, [selectedClassId, teacherClasses, classrooms, user?.id, adminViewingClassroomId]);

    const handleCreateClassroom = (newClass: Classroom) => {
        addClassroom(newClass);
        setSelectedClassId(newClass.id);
        setShowCreateModal(false);
    };`;

content = content.replace(oldClassroomLookup, newClassroomLookup);

// 3. Update empty state to include CreateClassModal
const oldEmptyState = `        return (
            <div className="p-8 flex items-center justify-center flex-col gap-4 text-gray-500">
                <School size={48} className="text-gray-300" />
                <h2 className="text-xl font-bold text-gray-700">{t('teacher.no_classroom_title', 'No Classroom Found')}</h2>
                <p>{t('teacher.no_classroom_desc', "You haven't set up a classroom yet.")}</p>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <PlusCircle size={20} />
                    {t('teacher.create_classroom', 'Create My Classroom')}
                </button>
            </div>
        );`;

const newEmptyState = `        return (
            <div className="p-8 flex items-center justify-center flex-col gap-5 text-gray-500 min-h-[50vh]">
                <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center">
                    <School size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 dark:text-white">{t('teacher.no_classroom_title', 'No Classroom Found')}</h2>
                <p className="text-sm font-bold text-gray-400 max-w-sm text-center">{t('teacher.no_classroom_desc', "You haven't set up a classroom yet.")}</p>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-[0_4px_0_0_rgba(37,99,235,1)] active:translate-y-0.5 transition-all"
                >
                    <PlusCircle size={20} />
                    <span>{t('teacher.create_classroom', 'Create My Classroom')}</span>
                </button>
                <CreateClassModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateClassroom}
                    teacherId={user?.id || ''}
                />
            </div>
        );`;

content = content.replace(oldEmptyState, newEmptyState);
content = content.replace(oldEmptyState.replace(/\n/g, '\r\n'), newEmptyState.replace(/\n/g, '\r\n'));

// 4. Update header to include class switcher and "+ Create New Class" button
const oldHeaderTitle = `<div className="flex items-center gap-4">
                                <h2 className="text-4xl font-black text-gray-800 dark:text-white tracking-tight uppercase">{classroom.name}</h2>`;

const newHeaderTitle = `<div className="flex items-center gap-4 flex-wrap">
                                <h2 className="text-4xl font-black text-gray-800 dark:text-white tracking-tight uppercase">{classroom.name}</h2>
                                {teacherClasses.length > 1 && (
                                    <select
                                        value={classroom.id}
                                        onChange={(e) => setSelectedClassId(e.target.value)}
                                        className="bg-gray-100 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white text-xs font-black rounded-2xl px-3 py-2 outline-none cursor-pointer hover:border-blue-500 transition-colors"
                                    >
                                        {teacherClasses.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                                        ))}
                                    </select>
                                )}
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-4 py-2 rounded-2xl text-xs font-black transition-all active:scale-95 flex items-center gap-1.5"
                                >
                                    <PlusCircle size={15} />
                                    <span>{t('teacher.new_class_button', '+ New Class')}</span>
                                </button>`;

content = content.replace(oldHeaderTitle, newHeaderTitle);
content = content.replace(oldHeaderTitle.replace(/\n/g, '\r\n'), newHeaderTitle.replace(/\n/g, '\r\n'));

// 5. Add CreateClassModal at bottom of component return
const oldComponentEnd = `            {/* EDIT STUDENT MODAL */}`;
const newComponentEnd = `            {/* CREATE CLASSROOM MODAL */}
            <CreateClassModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={handleCreateClassroom}
                teacherId={user?.id || ''}
            />

            {/* EDIT STUDENT MODAL */}`;

content = content.replace(oldComponentEnd, newComponentEnd);

fs.writeFileSync(filePath, content, 'utf8');
console.log('TeacherDashboard.tsx updated successfully');
