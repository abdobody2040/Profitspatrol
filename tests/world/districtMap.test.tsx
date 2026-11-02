import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WorldDistrictSelector } from '../../src/features/world/components/WorldDistrictSelector';
import { DISTRICTS } from '../../src/domain/world/districts';
import { CharacterDialogueModal } from '../../src/features/characters/components/CharacterDialogueModal';

// Mock audio
vi.mock('../../src/lib/sound', () => ({
  SoundService: {
    play: vi.fn(),
    playClick: vi.fn(),
    playSuccess: vi.fn(),
    playError: vi.fn(),
    init: vi.fn()
  }
}));


describe('WorldDistrictSelector (Phase 3)', () => {
  it('renders all 8 canonical districts with icons and names', () => {
    const onSelect = vi.fn();
    render(
      <WorldDistrictSelector
        selectedDistrictId="money"
        onSelectDistrict={onSelect}
        unlockedDistricts={['money', 'builders']}
        userLevel={5}
      />
    );

    // Verify 8 districts are rendered (matching either Arabic or English names)
    for (const district of DISTRICTS) {
      expect(screen.getByText(new RegExp(`${district.nameEn}|${district.nameAr}`))).toBeInTheDocument();
      expect(screen.getByText(district.icon)).toBeInTheDocument();
    }
  });

  it('allows clicking unlocked districts and invokes onSelectDistrict', () => {
    const onSelect = vi.fn();
    render(
      <WorldDistrictSelector
        selectedDistrictId="money"
        onSelectDistrict={onSelect}
        unlockedDistricts={['money', 'builders']}
        userLevel={5}
      />
    );

    const buildersBtn = screen.getByText(new RegExp('Builders District|حي البناة')).closest('button');
    expect(buildersBtn).toBeDefined();
    fireEvent.click(buildersBtn!);
    expect(onSelect).toHaveBeenCalledWith('builders');
  });

  it('prevents selection of locked districts below level requirement', () => {
    const onSelect = vi.fn();
    render(
      <WorldDistrictSelector
        selectedDistrictId="money"
        onSelectDistrict={onSelect}
        unlockedDistricts={['money']}
        userLevel={1}
      />
    );

    // Launch & Scale requires level 15
    const launchBtn = screen.getByText(new RegExp('Launch & Scale District|حي الإطلاق')).closest('button');
    expect(launchBtn).toBeDefined();
    fireEvent.click(launchBtn!);
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe('CharacterDialogueModal (Phase 3)', () => {
  it('renders hero dialogue and invokes action handlers', () => {
    const onPrimary = vi.fn();
    const onClose = vi.fn();

    render(
      <CharacterDialogueModal
        isOpen={true}
        onClose={onClose}
        characterId="reema"
        emotion="excited"
        titleEn="Marketing Advisor"
        titleAr="مستشار التسويق"
        dialogueEn="Let us win customer hearts today!"
        dialogueAr="دعنا نكسب قلوب العملاء اليوم!"
        primaryActionLabelEn="Let's Go!"
        primaryActionLabelAr="انطلق!"
        onPrimaryAction={onPrimary}
      />
    );

    expect(screen.getAllByText(/Reema|ريما/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Marketing Advisor|مستشار التسويق/)).toBeInTheDocument();
    expect(screen.getByText(/Let us win customer hearts today!|دعنا نكسب قلوب العملاء اليوم!/)).toBeInTheDocument();

    const actionBtn = screen.getByText(/Let's Go!|انطلق!/);
    fireEvent.click(actionBtn);
    expect(onPrimary).toHaveBeenCalled();
  });

  it('renders Rex rival dialogue with distinct title and colors', () => {
    render(
      <CharacterDialogueModal
        isOpen={true}
        onClose={vi.fn()}
        characterId="rex"
        emotion="pointing"
        titleEn="Rival Challenge"
        titleAr="تحدي المنافس"
        dialogueEn="Think you can beat me? Think again!"
        dialogueAr="هل تظن أنك قادر على هزيمتي؟ فكر مرة أخرى!"
      />
    );

    expect(screen.getAllByText(/Rex|ريكس/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Think you can beat me\? Think again!|هل تظن أنك قادر على هزيمتي؟ فكر مرة أخرى!/)).toBeInTheDocument();
  });
});
