import { describe, it, expect } from 'vitest';
import { ALL_LESSONS, COURSE_MAP, getLessonBatch } from '../curriculum';

// ─── Data Integrity Tests ─────────────────────────────────────────────────────

describe('curriculum data integrity', () => {

  // ── Total count ──────────────────────────────────────────────────────────

  it('should have exactly 160 lessons (S1: 100, S2: 30, S3: 30)', () => {
    expect(ALL_LESSONS).toHaveLength(160);
  });

  it('should have 16 modules in COURSE_MAP', () => {
    expect(COURSE_MAP).toHaveLength(16);
  });

  // ── ID uniqueness ─────────────────────────────────────────────────────────

  it('should have all unique lesson IDs', () => {
    const ids = ALL_LESSONS.map(l => l.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  // ── Topic tag coverage ────────────────────────────────────────────────────

  it('should have at least 10 lessons per module', () => {
    COURSE_MAP.forEach(mod => {
      expect(mod.lessonIds.length).toBeGreaterThanOrEqual(10);
    });
  });

  it('every lesson topic_tag should be covered by a COURSE_MAP module', () => {
    const allTagsInMap = new Set(COURSE_MAP.map(m => m.title));
    const topicTags = ALL_LESSONS.map(l => l.topic_tag);
    const uniqueTags = [...new Set(topicTags)];
    uniqueTags.forEach(tag => {
      // topic_tag should have SOME matching in COURSE_MAP title or a prefix filter
      const found = COURSE_MAP.some(m =>
        m.lessonIds.includes(ALL_LESSONS.find(l => l.topic_tag === tag)!.id)
      );
      expect(found, `topic_tag "${tag}" not covered in COURSE_MAP`).toBe(true);
    });
  });

  // ── Lesson payload validation ─────────────────────────────────────────────

  it('every lesson should have a headline', () => {
    ALL_LESSONS.forEach(l => {
      expect(l.lesson_payload.headline, `Missing headline for ${l.id}`).toBeTruthy();
    });
  });

  it('every lesson should have a non-empty body_text', () => {
    ALL_LESSONS.forEach(l => {
      expect(l.lesson_payload.body_text.length, `Empty body for ${l.id}`).toBeGreaterThan(10);
    });
  });

  it('every lesson should have a key_term', () => {
    ALL_LESSONS.forEach(l => {
      expect(l.lesson_payload.key_term, `Missing key_term for ${l.id}`).toBeTruthy();
    });
  });

  // ── Challenge payload validation ──────────────────────────────────────────

  it('every lesson should have a quiz question', () => {
    ALL_LESSONS.forEach(l => {
      expect(l.challenge_payload.question_text, `Missing question for ${l.id}`).toBeTruthy();
    });
  });

  it('every lesson should have exactly 3 distractors', () => {
    ALL_LESSONS.forEach(l => {
      expect(l.challenge_payload.distractors, `Missing distractors for ${l.id}`)
        .toHaveLength(3);
    });
  });

  it('correct answer should not match any distractor', () => {
    ALL_LESSONS.forEach(l => {
      const { correct_answer, distractors } = l.challenge_payload;
      expect(distractors, `Correct answer is in distractors for ${l.id}`)
        .not.toContain(correct_answer);
    });
  });

  // ── Reward validation ─────────────────────────────────────────────────────

  it('every lesson should award at least 1 XP', () => {
    ALL_LESSONS.forEach(l => {
      expect(l.game_rewards.base_xp, `Zero XP for ${l.id}`).toBeGreaterThan(0);
    });
  });

  it('Season 3 lessons should award at least 40 XP (harder content)', () => {
    const s3Tags = ['Venture Capital', 'Corporate Strategy', 'Global Trade'];
    const s3Lessons = ALL_LESSONS.filter(l => s3Tags.includes(l.topic_tag));
    s3Lessons.forEach(l => {
      expect(l.game_rewards.base_xp, `Season 3 lesson ${l.id} has too little XP`)
        .toBeGreaterThanOrEqual(40);
    });
  });

  // ── Difficulty range ──────────────────────────────────────────────────────

  it('difficulty should be 1, 2, or 3', () => {
    ALL_LESSONS.forEach(l => {
      expect([1, 2, 3], `Invalid difficulty for ${l.id}`).toContain(l.difficulty);
    });
  });

  // ── Season 2 & 3 unlock flags ─────────────────────────────────────────────

  it('Season 3 modules should require unlockLevel >= 8', () => {
    const s3Modules = COURSE_MAP.filter(m => m.season === 3);
    expect(s3Modules.length).toBe(3);
    s3Modules.forEach(m => {
      expect(m.unlockLevel, `S3 module ${m.id} missing unlockLevel`).toBeGreaterThanOrEqual(8);
    });
  });

  it('Season 2 modules should have season=2', () => {
    const s2Modules = COURSE_MAP.filter(m => m.season === 2);
    expect(s2Modules.length).toBe(3);
  });

  // ── getLessonBatch utility ────────────────────────────────────────────────

  describe('getLessonBatch', () => {
    it('fetches all lessons for a given module ID', () => {
      const batch = getLessonBatch('MOD_MB');
      expect(batch.length).toBe(10);
      batch.forEach(l => expect(l.topic_tag).toBe('Money Basics'));
    });

    it('fetches a single lesson when given a lesson ID', () => {
      const batch = getLessonBatch('MB_01');
      expect(batch).toHaveLength(1);
      expect(batch[0].id).toBe('MB_01');
    });

    it('returns empty array for unknown ID', () => {
      const batch = getLessonBatch('UNKNOWN_999');
      expect(batch).toHaveLength(0);
    });

    it('fetches Season 3 VC module correctly', () => {
      const batch = getLessonBatch('MOD_VC');
      expect(batch.length).toBe(10);
      batch.forEach(l => expect(l.topic_tag).toBe('Venture Capital'));
    });

    it('fetches Season 2 Crypto module correctly', () => {
      const batch = getLessonBatch('MOD_CRYPTO');
      expect(batch.length).toBe(10);
      batch.forEach(l => expect(l.topic_tag).toBe('Crypto & Blockchain'));
    });
  });
});
