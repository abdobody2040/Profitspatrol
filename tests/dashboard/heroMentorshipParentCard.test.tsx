import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeroMentorshipParentCard } from '../../src/features/dashboard/components/HeroMentorshipParentCard';
import { useTrustStore } from '../../src/features/characters/store/trustStore';
import { useStoryQuestStore } from '../../src/features/characters/store/questStore';

describe('HeroMentorshipParentCard Component (Parent & Teacher Dashboard)', () => {
  beforeEach(() => {
    useTrustStore.getState().resetAllTrust();
    useStoryQuestStore.getState().resetAllQuests();
  });

  it('renders all 5 character pillars and live metrics for child', () => {
    render(<HeroMentorshipParentCard childName="Sami" />);

    // Header and child name
    expect(screen.getByText(/Hero Mentorship & Mindset Growth|تطور عقلية ريادة الأعمال/i)).toBeInTheDocument();

    // Check heroes and rival
    expect(screen.getByText(/Ollie the Owl|البومة أولي/i)).toBeInTheDocument();
    expect(screen.getByText(/Reema the Fox|الثعلب ريما/i)).toBeInTheDocument();
    expect(screen.getByText(/Filo the Elephant|الفيل فيلو/i)).toBeInTheDocument();
    expect(screen.getByText(/Kami the Chameleon|الحرباء كامي/i)).toBeInTheDocument();
    expect(screen.getByText(/Rex the Rival|الراكون ريكس|ريكس/i)).toBeInTheDocument();
  });

  it('displays updated trust points and tiers when child advances in game', () => {
    // Add trust points
    useTrustStore.getState().addTrust('ollie', 120, 'Test Unit', 'وحدة اختبار');

    render(<HeroMentorshipParentCard childName="Sami" />);

    // Ollie should be Tier 2
    expect(screen.getByText(/120 TP/i)).toBeInTheDocument();
  });

  it('renders real-world dinner/classroom discussion starters for family engagement', () => {
    render(<HeroMentorshipParentCard childName="Sami" />);

    // Check discussion header
    expect(screen.getByText(/Learning Moments|مواضيع مقترحة للنقاش/i)).toBeInTheDocument();

    // Check that question text mentions child name
    expect(screen.getAllByText(/Ask Sami|اسأل Sami/i).length).toBeGreaterThan(0);
  });
});
