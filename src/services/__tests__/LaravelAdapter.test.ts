import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LaravelAdapter } from '../persistence/LaravelAdapter';
import { api } from '../../lib/api';

describe('LaravelAdapter', () => {
    let adapter: LaravelAdapter;

    beforeEach(() => {
        adapter = new LaravelAdapter();
        vi.restoreAllMocks();
    });

    it('initializes and checks connection', () => {
        expect(adapter.isConnected()).toBe(true);
    });

    it('returns empty lists when not authenticated', async () => {
        vi.spyOn(api, 'getToken').mockReturnValue(null);
        const data = await adapter.loadAllData();
        expect(data.users).toEqual([]);
        expect(data.classrooms).toEqual([]);
    });

    it('calls profile update on saveUser', async () => {
        const putSpy = vi.spyOn(api, 'put').mockResolvedValue({ success: true } as any);

        const mockUser: any = {
            id: '123',
            name: 'Test Kid',
            avatar: 'avatar1.png',
            settings: { themeColor: 'green' },
            hqLevel: 'hq_garage',
            businessLogo: undefined,
            equippedItems: [],
            placedItems: [],
            unlockedSkills: [],
        };

        await adapter.saveUser(mockUser);
        expect(putSpy).toHaveBeenCalledWith('/profile', expect.objectContaining({
            name: 'Test Kid',
            hq_level: 'hq_garage',
            hq_theme: 'green',
        }));
    });

    it('calls classroom assignment creation on saveAssignment', async () => {
        const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ success: true } as any);

        const mockAssignment: any = {
            id: 'asg_1',
            classId: 'cls_1',
            lessonId: 'mod_1_l1',
            title: 'Lemonade Stand 101',
            maxPoints: 100,
            status: 'PUBLISHED',
            createdAt: new Date().toISOString(),
        };

        await adapter.saveAssignment(mockAssignment);
        expect(postSpy).toHaveBeenCalledWith('/classrooms/cls_1/assignments', mockAssignment);
    });

    it('calls submission endpoint on saveSubmission', async () => {
        const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ success: true } as any);

        const mockSubmission: any = {
            id: 'sub_1',
            assignmentId: 'asg_1',
            studentId: 'usr_1',
            submittedAt: new Date().toISOString(),
            status: 'PENDING',
            content: 'My completed financial plan',
        };

        await adapter.saveSubmission(mockSubmission);
        expect(postSpy).toHaveBeenCalledWith('/assignments/asg_1/submit', {
            content: 'My completed financial plan',
        });
    });
});
