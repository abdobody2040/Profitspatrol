
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { ReportsDashboard } from '../ReportsDashboard';
import { AnalyticsService } from '../../../../../services/AnalyticsService';
import { BrowserRouter } from 'react-router-dom';

// Mock AnalyticsService
vi.mock('../../../../../services/AnalyticsService', () => ({
    AnalyticsService: {
        fetchUserGrowth: vi.fn(),
        fetchEconomyStats: vi.fn(),
        fetchLearningStats: vi.fn()
    }
}));

// Mock Recharts to avoid canvas/resize issues in jsdom
vi.mock('recharts', () => {
    return {
        ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
        AreaChart: () => <div data-testid="area-chart">AreaChart</div>,
        BarChart: () => <div data-testid="bar-chart">BarChart</div>,
        ComposedChart: ({ children }: any) => <div data-testid="composed-chart">{children}</div>,
        Area: () => null,
        Bar: () => null,
        Line: () => null,
        XAxis: () => null,
        YAxis: () => null,
        CartesianGrid: () => null,
        Tooltip: () => null,
        Legend: () => null,
    };
});

describe('ReportsDashboard', () => {
    // Mock data matching the real EconomyStats interface
    const mockUserGrowth = [{ date: '2024-01-01', count: 10 }];
    const mockEconomyStats = {
        total_supply: 5000,
        avg_balance_per_user: 100,
        total_users: 50,
        tycoons_count: 3
    };
    const mockLearningStats = [{ date: '2024-01-01', avg_grade: 80, submissions_count: 5 }];

    beforeEach(() => {
        vi.clearAllMocks();
        (AnalyticsService.fetchUserGrowth as any).mockResolvedValue(mockUserGrowth);
        (AnalyticsService.fetchEconomyStats as any).mockResolvedValue(mockEconomyStats);
        (AnalyticsService.fetchLearningStats as any).mockResolvedValue(mockLearningStats);
    });

    it('renders dashboard with title', async () => {
        await act(async () => {
            render(<BrowserRouter><ReportsDashboard /></BrowserRouter>);
        });
        // Component renders 'Platform Analytics' as the h1
        expect(screen.getByText('Platform Analytics')).toBeInTheDocument();
    });

    it('fetches and displays data on mount', async () => {
        await act(async () => {
            render(<BrowserRouter><ReportsDashboard /></BrowserRouter>);
        });

        await waitFor(() => {
            expect(AnalyticsService.fetchUserGrowth).toHaveBeenCalledTimes(1);
            expect(AnalyticsService.fetchEconomyStats).toHaveBeenCalledTimes(1);
            expect(AnalyticsService.fetchLearningStats).toHaveBeenCalledTimes(1);
        });

        // Wait for economy stats to render — check for stat card labels and player count
        await waitFor(() => {
            // 'Total Players' card should show 50 (from mockEconomyStats.total_users)
            expect(screen.getByText('Total Players')).toBeInTheDocument();
            expect(screen.getByText('50')).toBeInTheDocument();
        });
    });

    it('updates data when refresh is clicked', async () => {
        await act(async () => {
            render(<BrowserRouter><ReportsDashboard /></BrowserRouter>);
        });

        await waitFor(() => {
            expect(AnalyticsService.fetchUserGrowth).toHaveBeenCalledTimes(1);
        });

        // Button uses title="Refresh Data" — query by title attribute
        const refreshBtn = screen.getByTitle('Refresh Data');
        await act(async () => {
            fireEvent.click(refreshBtn);
        });

        await waitFor(() => {
            expect(AnalyticsService.fetchUserGrowth).toHaveBeenCalledTimes(2);
        });
    });
});
