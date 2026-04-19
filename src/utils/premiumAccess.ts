import { User, Classroom } from '../types';

/**
 * Checks if a student is eligible for premium content bypass via a school license.
 * Requires the student to be linked to a classroom whose teacher has a 'school_*' tier,
 * AND for the current time to be within school hours (M-F, 8:00 AM - 3:00 PM).
 */
export const hasSchoolBypass = (
    currentUser: User | null,
    classrooms: Classroom[],
    users: User[]
): boolean => {
    if (!currentUser || currentUser.role !== 'KID' || !currentUser.classId) {
        return false;
    }

    // Find the classroom the student belongs to
    const classroom = classrooms.find(c => c.id === currentUser.classId);
    if (!classroom || !classroom.teacherId) {
        return false;
    }

    // Find the teacher that owns the classroom
    const teacher = users.find(u => u.id === classroom.teacherId);
    if (!teacher || !teacher.subscriptionTier) {
        return false;
    }

    // Check if the teacher has a school tier
    const isSchoolTier = teacher.subscriptionTier.startsWith('school_');
    if (!isSchoolTier) {
        return false;
    }

    // Verify it is currently school hours (Monday-Friday, 8 AM - 3 PM)
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    
    // Day: 1 (Monday) to 5 (Friday)
    // Hours: 8:00 AM to 2:59 PM (hours 8 to 14)
    if (day >= 1 && day <= 5 && hours >= 8 && hours < 15) {
        return true;
    }

    return false;
};
