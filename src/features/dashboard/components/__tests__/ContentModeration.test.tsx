
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ContentModeration } from '../ContentModeration';
import { supabase } from '../../../../lib/supabase';
import { ContentModerationService } from '../../../../services/ContentModerationService';

// Mock dependencies
vi.mock('../../../../lib/supabase', () => ({
    supabase: {
        channel: vi.fn(() => ({
            on: vi.fn().mockReturnThis(),
            subscribe: vi.fn().mockReturnValue({
                unsubscribe: vi.fn(),
            }),
            unsubscribe: vi.fn(),
        })),
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            range: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            gte: vi.fn().mockResolvedValue({ data: [], error: null }),
        }))
    },
}));

vi.mock('../../../../services/ContentModerationService', () => ({
    ContentModerationService: {
        loadPatterns: vi.fn().mockResolvedValue(true)
    }
}));

describe('ContentModeration', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders dashboard correctly', async () => {
        render(<ContentModeration />);
        expect(screen.getByText('Content Moderation')).toBeInTheDocument();
    });

    it('displays flagged content tabs', async () => {
        render(<ContentModeration />);
        expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('renders statistics cards', async () => {
        render(<ContentModeration />);
        // Expect generic stats to be present (might be 0/0 initially)
        await waitFor(() => {
            const stats = screen.getAllByText(/0/i);
            expect(stats.length).toBeGreaterThan(0);
        });
    });
});
