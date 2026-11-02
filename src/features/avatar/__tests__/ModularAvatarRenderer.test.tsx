import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ModularAvatarRenderer } from '../components/ModularAvatarRenderer';
import { DEFAULT_AVATAR_CONFIG } from '../types/avatar';

describe('ModularAvatarRenderer Component', () => {
    it('renders the SVG container with modular layers', () => {
        render(<ModularAvatarRenderer config={DEFAULT_AVATAR_CONFIG} size="lg" />);

        const container = screen.getByTestId('modular-avatar-renderer');
        expect(container).toBeInTheDocument();

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg?.getAttribute('viewBox')).toBe('0 -100 400 620');

        // Check image layers
        const images = container.querySelectorAll('image');
        expect(images.length).toBeGreaterThanOrEqual(7); // neck, legs, shoes, pants, shirt, arms, hands, head, face, hair
    });

    it('renders complete character fallback when completeCharacterUrl is provided', () => {
        render(
            <ModularAvatarRenderer
                config={{
                    completeCharacterUrl: '/images/characters_clean/rex_idle.png',
                }}
                size="md"
            />
        );

        const img = screen.getByAltText('Character Avatar');
        expect(img).toBeInTheDocument();
        expect(img.getAttribute('src')).toBe('/images/characters_clean/rex_idle.png');
    });

    it('adapts to numerical and named sizes correctly', () => {
        const { rerender } = render(<ModularAvatarRenderer size="sm" />);
        let container = screen.getByTestId('modular-avatar-renderer');
        expect(container.style.width).toBe('80px');

        rerender(<ModularAvatarRenderer size={200} />);
        container = screen.getByTestId('modular-avatar-renderer');
        expect(container.style.width).toBe('200px');
    });
});
