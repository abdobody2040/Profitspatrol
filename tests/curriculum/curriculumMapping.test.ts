import { describe, it, expect } from 'vitest';
import { 
  COMPETENCY_GROUPS, 
  COMPETENCIES, 
  calculateMasteryLevel, 
  getCompetency 
} from '../../src/domain/curriculum/competencyModel';
import { 
  DISTRICTS, 
  getDistrict, 
  getDistrictForModule, 
  getDistrictForLesson 
} from '../../src/domain/world/districts';
import { ALL_LESSONS, COURSE_MAP } from '../../src/features/education/data/curriculum';

describe('Competency Model (Phase 2)', () => {
  it('defines the 6 canonical competency groups', () => {
    expect(COMPETENCY_GROUPS).toHaveLength(6);
    const groupIds = COMPETENCY_GROUPS.map(g => g.id);
    expect(groupIds).toContain('money');
    expect(groupIds).toContain('business');
    expect(groupIds).toContain('marketing');
    expect(groupIds).toContain('risk_ethics');
    expect(groupIds).toContain('leadership');
    expect(groupIds).toContain('innovation');
  });

  it('defines distinct competencies with bilingual names and groups', () => {
    expect(COMPETENCIES.length).toBeGreaterThanOrEqual(12);
    for (const comp of COMPETENCIES) {
      expect(comp.id).toBeDefined();
      expect(comp.nameEn).toBeTruthy();
      expect(comp.nameAr).toBeTruthy();
      expect(comp.groupId).toBeTruthy();
      expect(getCompetency(comp.id)).toEqual(comp);
    }
  });

  it('calculates mastery level progression accurately', () => {
    // 0 XP -> Level 1 Novice
    const level1 = calculateMasteryLevel(0);
    expect(level1.level).toBe(1);
    expect(level1.titleEn).toBe('Novice');
    expect(level1.progressPercent).toBe(0);

    // 150 XP -> Level 2 Apprentice
    const level2 = calculateMasteryLevel(150);
    expect(level2.level).toBe(2);
    expect(level2.titleEn).toBe('Apprentice');

    // 400 XP -> Level 3 Expert
    const level3 = calculateMasteryLevel(400);
    expect(level3.level).toBe(3);
    expect(level3.titleEn).toBe('Expert');

    // 1000 XP -> Level 4 Master
    const level4 = calculateMasteryLevel(1000);
    expect(level4.level).toBe(4);
    expect(level4.titleEn).toBe('Master');
    expect(level4.progressPercent).toBe(100);
  });
});

describe('8-District World Architecture (Phase 2)', () => {
  it('defines all 8 canonical districts with valid metadata', () => {
    expect(DISTRICTS).toHaveLength(8);
    const expectedIds = ['money', 'builders', 'risk', 'operations', 'innovation', 'leadership', 'strategy', 'launch'];
    expect(DISTRICTS.map(d => d.id)).toEqual(expectedIds);

    DISTRICTS.forEach((d, index) => {
      expect(d.number).toBe(index + 1);
      expect(d.nameEn).toBeTruthy();
      expect(d.nameAr).toBeTruthy();
      expect(d.heroGuide).toBeDefined();
      expect(d.themeColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(d.modules.length).toBeGreaterThan(0);
    });
  });

  it('maps all 20 modules across the 8 districts with zero duplicates or omissions', () => {
    const allAssignedModules = DISTRICTS.flatMap(d => d.modules);
    expect(allAssignedModules).toHaveLength(20);

    const courseModuleIds = COURSE_MAP.map(m => m.id);
    expect(courseModuleIds).toHaveLength(20);

    for (const modId of courseModuleIds) {
      expect(allAssignedModules).toContain(modId);
      const district = getDistrictForModule(modId);
      expect(district).toBeDefined();
    }
  });

  it('correctly maps any of the 200 lessons to its corresponding district', () => {
    expect(ALL_LESSONS).toHaveLength(200);

    for (const lesson of ALL_LESSONS) {
      const district = getDistrictForLesson(lesson.id);
      expect(district).toBeDefined();
      expect(district?.id).toBeDefined();
    }
  });
});

describe('Curriculum District & Competency Association (Phase 2)', () => {
  it('enriches every lesson in ALL_LESSONS with districtId and primaryCompetencyId', () => {
    for (const lesson of ALL_LESSONS) {
      expect(lesson.districtId).toBeDefined();
      expect(['money', 'builders', 'risk', 'operations', 'innovation', 'leadership', 'strategy', 'launch']).toContain(lesson.districtId);
      expect(lesson.primaryCompetencyId).toBeDefined();
      expect(getCompetency(lesson.primaryCompetencyId!)).toBeDefined();
    }
  });
});
