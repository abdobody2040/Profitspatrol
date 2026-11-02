import { describe, it, expect, beforeEach } from 'vitest';
import { useEducationStore } from '../src/store/educationStore';
import { Classroom, Assignment, Submission, Rubric } from '../src/types';

describe('Teacher Grading & Reports System (Roadmap Step 2)', () => {
  beforeEach(() => {
    // Reset education store state
    useEducationStore.setState({
      classrooms: [
        {
          id: 'test_class_1',
          name: 'Young Tycoons Cohort A',
          code: 'PATROL123',
          teacherId: 'teacher_1',
          studentIds: ['student_1', 'student_2'],
          disabledModules: [],
          lockedModules: [],
          gradeLevel: 'Grade 5',
          academicYear: '2025-2026',
        } as Classroom,
      ],
      assignments: [
        {
          id: 'assign_1',
          classId: 'test_class_1',
          title: 'Lemonade Stand Business Model',
          description: 'Outline your cost of goods sold and target customer.',
          dueDate: '2026-04-15',
          maxPoints: 100,
          rubricId: 'rubric_1',
          createdAt: '2026-03-01',
          status: 'PUBLISHED',
        } as Assignment,
      ],
      submissions: [
        {
          id: 'sub_1',
          assignmentId: 'assign_1',
          studentId: 'student_1',
          submittedAt: '2026-03-10T10:00:00Z',
          status: 'PENDING',
          content: 'My lemonade stand sells cups for $1.50 with a COGS of $0.40.',
        } as Submission,
      ],
      rubrics: [
        {
          id: 'rubric_1',
          teacherId: 'teacher_1',
          title: 'Business Model Rubric',
          criteria: [
            { id: 'crit_cogs', title: 'COGS Understanding', description: 'Calculates ingredient costs accurately', maxScore: 50 },
            { id: 'crit_strategy', title: 'Marketing Strategy', description: 'Defines target customer and location', maxScore: 50 },
          ],
        } as Rubric,
      ],
    });
  });

  it('updates pending submission to GRADED with numerical grade, feedback, and rubric criteria', () => {
    const { updateSubmission } = useEducationStore.getState();

    updateSubmission('sub_1', {
      status: 'GRADED',
      grade: 95,
      feedback: 'Outstanding financial planning! 🌟',
      rubricScores: {
        crit_cogs: 48,
        crit_strategy: 47,
      },
    });

    const updated = useEducationStore.getState().submissions.find((s) => s.id === 'sub_1');
    expect(updated).toBeDefined();
    expect(updated?.status).toBe('GRADED');
    expect(updated?.grade).toBe(95);
    expect(updated?.feedback).toContain('Outstanding financial planning!');
    expect(updated?.rubricScores?.crit_cogs).toBe(48);
  });

  it('calculates class average grade correctly across submissions', () => {
    const { addSubmission, updateSubmission } = useEducationStore.getState();

    // Grade sub_1
    updateSubmission('sub_1', { status: 'GRADED', grade: 90 });

    // Add and grade sub_2
    addSubmission({
      id: 'sub_2',
      assignmentId: 'assign_1',
      studentId: 'student_2',
      submittedAt: '2026-03-11T12:00:00Z',
      status: 'GRADED',
      grade: 80,
    });

    const graded = useEducationStore.getState().submissions.filter((s) => s.status === 'GRADED');
    const avg = graded.reduce((sum, s) => sum + (s.grade || 0), 0) / graded.length;
    expect(avg).toBe(85);
  });
});
