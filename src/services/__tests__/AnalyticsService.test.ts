
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AnalyticsService } from '../AnalyticsService';
import { supabase } from '../../lib/supabase';

// Mock the supabase client
vi.mock('../../lib/supabase', () => ({
    supabase: {
        rpc: vi.fn(),
    },
}));

// Cast supabase to any to avoid "possibly null" errors in tests since we've mocked it
const mockSupabase = supabase as any;

describe('AnalyticsService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('fetchUserGrowth', () => {
        it('should return user growth data on success', async () => {
            const mockData = [
                { date: '2024-01-01', count: 10 },
                { date: '2024-01-02', count: 15 },
            ];
            mockSupabase.rpc.mockResolvedValue({ data: mockData, error: null });

            const result = await AnalyticsService.fetchUserGrowth(30);

            expect(mockSupabase.rpc).toHaveBeenCalledWith('get_user_growth_stats', { days_lookback: 30 });
            expect(result).toEqual(mockData);
        });

        it('should return empty array on error', async () => {
            mockSupabase.rpc.mockResolvedValue({ data: null, error: { message: 'RPC Error' } });

            // Mock console.error to keep test output clean
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            const result = await AnalyticsService.fetchUserGrowth();

            expect(mockSupabase.rpc).toHaveBeenCalledWith('get_user_growth_stats', { days_lookback: 30 });
            expect(result).toEqual([]);
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('fetchEconomyStats', () => {
        it('should return economy stats on success', async () => {
            // Mock data matches the real EconomyStats interface:
            // { total_supply, avg_balance_per_user, total_users, tycoons_count }
            const mockStats = {
                total_supply: 10000,
                avg_balance_per_user: 500,
                total_users: 20,
                tycoons_count: 3
            };
            mockSupabase.rpc.mockResolvedValue({ data: mockStats, error: null });

            const result = await AnalyticsService.fetchEconomyStats();
            expect(mockSupabase.rpc).toHaveBeenCalledWith('get_economy_stats');
            expect(result).toEqual(mockStats);
        });

        it('should return null on error', async () => {
            mockSupabase.rpc.mockResolvedValue({ data: null, error: { message: 'RPC Error' } });
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            const result = await AnalyticsService.fetchEconomyStats();
            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('fetchLearningStats', () => {
        it('should return learning stats on success', async () => {
            const mockData = [{ date: '2024-01-01', avg_grade: 85, submissions_count: 20 }];
            mockSupabase.rpc.mockResolvedValue({ data: mockData, error: null });

            const result = await AnalyticsService.fetchLearningStats(7);
            expect(mockSupabase.rpc).toHaveBeenCalledWith('get_learning_stats', { days_lookback: 7 });
            expect(result).toEqual(mockData);
        });

        it('should return empty array on error', async () => {
            mockSupabase.rpc.mockResolvedValue({ data: null, error: { message: 'RPC Error' } });
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            const result = await AnalyticsService.fetchLearningStats();
            expect(result).toEqual([]);
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

});
