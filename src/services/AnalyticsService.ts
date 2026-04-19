import { supabase } from '../lib/supabase';
import { Logger } from './logger';

export interface UserGrowthData {
    date: string;
    count: number;
}

export interface EconomyStats {
    total_supply: number;
    avg_balance_per_user: number;
    total_users: number;
    tycoons_count: number;
}

export interface LearningStats {
    date: string;
    avg_grade: number;
    submissions_count: number;
}

export class AnalyticsService {
    /**
     * Fetch new user registrations over time
     * @param daysLookback Number of days to include in the report
     */
    static async fetchUserGrowth(daysLookback: number = 30): Promise<UserGrowthData[]> {
        try {
            if (!supabase) throw new Error('Supabase client not initialized');

            const { data, error } = await supabase.rpc('get_user_growth_stats', {
                days_lookback: daysLookback
            });

            if (error) throw error;

            return (data || []).map((row: any) => ({
                date: row.date,
                count: Number(row.count) // Postgres COUNT returns bigint (string)
            }));
        } catch (error) {
            Logger.error('Failed to fetch user growth stats', { error });
            return [];
        }
    }

    /**
     * Fetch current economy snapshot
     */
    static async fetchEconomyStats(): Promise<EconomyStats | null> {
        try {
            if (!supabase) throw new Error('Supabase client not initialized');

            const { data, error } = await supabase.rpc('get_economy_stats');

            if (error) throw error;

            return data as EconomyStats;
        } catch (error) {
            Logger.error('Failed to fetch economy stats', { error });
            return null;
        }
    }

    /**
     * Fetch learning performance trends
     * @param daysLookback Number of days to include
     */
    static async fetchLearningStats(daysLookback: number = 30): Promise<LearningStats[]> {
        try {
            if (!supabase) throw new Error('Supabase client not initialized');

            const { data, error } = await supabase.rpc('get_learning_stats', {
                days_lookback: daysLookback
            });

            if (error) throw error;

            return (data || []).map((row: any) => ({
                date: row.date,
                avg_grade: Number(row.avg_grade),
                submissions_count: Number(row.submissions_count)
            }));
        } catch (error) {
            Logger.error('Failed to fetch learning stats', { error });
            return [];
        }
    }
}
