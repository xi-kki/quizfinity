import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/lib/icp';

// Mock the canister config to force mock mode
vi.mock('@/lib/canister.config', () => ({
  isProduction: false,
  isLocal: true,
  CANISTER_IDS: { quizEngine: '', scoring: '', user: '' },
  ICP_NETWORK: { host: '', identityProvider: '' },
}));

// Mock the actor module
vi.mock('@/lib/actor', () => ({
  getQuizEngineActor: () => null,
  getScoringActor: () => null,
  getUserActor: () => null,
}));

describe('Mock API — Quizfinity', () => {
  describe('getCategories', () => {
    it('returns 6 categories', async () => {
      const categories = await api.getCategories();
      expect(categories).toHaveLength(6);
    });

    it('each category has required fields', async () => {
      const categories = await api.getCategories();
      for (const cat of categories) {
        expect(cat.id).toBeTruthy();
        expect(cat.name).toBeTruthy();
        expect(cat.description).toBeTruthy();
        expect(cat.icon).toBeTruthy();
      }
    });

    it('includes Blockchain Basics', async () => {
      const categories = await api.getCategories();
      const names = categories.map((c) => c.name);
      expect(names).toContain('Blockchain Basics');
    });
  });

  describe('getCategory', () => {
    it('returns a category by id', async () => {
      const cat = await api.getCategory('cat-1');
      expect(cat).not.toBeNull();
      expect(cat?.name).toBe('Blockchain Basics');
    });

    it('returns null for unknown id', async () => {
      const cat = await api.getCategory('cat-999');
      expect(cat).toBeNull();
    });
  });

  describe('getQuestionsByCategory', () => {
    it('returns questions for Blockchain Basics', async () => {
      const questions = await api.getQuestionsByCategory('cat-1');
      expect(questions.length).toBeGreaterThan(0);
    });

    it('each question has options and correctAnswer', async () => {
      const questions = await api.getQuestionsByCategory('cat-1');
      for (const q of questions) {
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.correctAnswer).toBeTruthy();
        expect(q.explanation).toBeTruthy();
      }
    });

    it('returns empty for unknown category', async () => {
      const questions = await api.getQuestionsByCategory('cat-999');
      expect(questions).toHaveLength(0);
    });
  });

  describe('startQuiz / submitAnswer / completeQuiz', () => {
    it('creates a session and completes quiz flow', async () => {
      const session = await api.startQuiz('user-1', 'cat-1');
      expect(session.id).toBeTruthy();
      expect(session.userId).toBe('user-1');
      expect(session.completed).toBe(false);

      // Get first question
      const questions = await api.getQuestionsByCategory('cat-1');
      const firstQuestion = questions[0];

      // Submit correct answer
      const result = await api.submitAnswer(
        session.id,
        firstQuestion.id,
        firstQuestion.correctAnswer
      );
      expect(result.correct).toBe(true);
      expect(result.pointsEarned).toBeGreaterThan(0n);

      // Complete quiz
      const completed = await api.completeQuiz(session.id);
      expect(completed.completed).toBe(true);
    });

    it('returns incorrect for wrong answer', async () => {
      const session = await api.startQuiz('user-2', 'cat-1');
      const questions = await api.getQuestionsByCategory('cat-1');
      const firstQuestion = questions[0];

      const wrongAnswer = firstQuestion.options.find(
        (o) => o !== firstQuestion.correctAnswer
      );
      const result = await api.submitAnswer(
        session.id,
        firstQuestion.id,
        wrongAnswer!
      );
      expect(result.correct).toBe(false);
      expect(result.pointsEarned).toBe(0n);
    });
  });

  describe('getLeaderboard', () => {
    it('returns array (may be empty in fresh mock)', async () => {
      const leaderboard = await api.getLeaderboard(10, 0);
      expect(Array.isArray(leaderboard)).toBe(true);
    });
  });
});
