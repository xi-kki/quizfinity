/**
 * ICP Canister Client — mock + real adapter
 * 
 * In development (no dfx), this returns mock data.
 * When deployed to ICP, swap in the real canister actor.
 */

import type {
  QuizCategory,
  Question,
  QuizSession,
  SubmitAnswerResult,
  UserScore,
  Achievement,
  LeaderboardEntry,
  UserProfile,
} from '@/types';

// ── Mock Data ────────────────────────────────────────

const MOCK_CATEGORIES: QuizCategory[] = [
  { id: 'cat-1', name: 'Blockchain Basics', description: 'Learn the fundamentals of blockchain technology', icon: '🔗', createdAt: 0n, updatedAt: 0n },
  { id: 'cat-2', name: 'ICP Fundamentals', description: 'Master the Internet Computer Protocol', icon: '🌐', createdAt: 0n, updatedAt: 0n },
  { id: 'cat-3', name: 'DeFi & Tokenomics', description: 'Understand decentralized finance and tokens', icon: '💰', createdAt: 0n, updatedAt: 0n },
  { id: 'cat-4', name: 'NFTs & Digital Art', description: 'Explore non-fungible tokens', icon: '🎨', createdAt: 0n, updatedAt: 0n },
  { id: 'cat-5', name: 'Web3 Security', description: 'Stay safe in the decentralized web', icon: '🛡️', createdAt: 0n, updatedAt: 0n },
  { id: 'cat-6', name: 'Smart Contracts', description: 'Dive into programmable contracts', icon: '📝', createdAt: 0n, updatedAt: 0n },
];

const MOCK_QUESTIONS: Record<string, Question[]> = {
  'cat-1': [
    { id: 'q-1', categoryId: 'cat-1', question: 'What is a blockchain?', options: ['A centralized database', 'A distributed ledger technology', 'A social media platform', 'A type of cryptocurrency'], correctAnswer: 'A distributed ledger technology', explanation: 'A blockchain is a decentralized, distributed ledger that records transactions across many computers.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-2', categoryId: 'cat-1', question: 'What is a consensus mechanism?', options: ['A way to reach agreement in a network', 'A type of smart contract', 'A wallet address', 'A mining pool'], correctAnswer: 'A way to reach agreement in a network', explanation: 'Consensus mechanisms are protocols that ensure all nodes in a network agree on the state of the blockchain.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-3', categoryId: 'cat-1', question: 'What makes blockchain secure?', options: ['Centralized control', 'Encryption and decentralization', 'Firewalls', 'Antivirus software'], correctAnswer: 'Encryption and decentralization', explanation: 'Blockchain security comes from cryptographic hashing, decentralization, and consensus mechanisms.', difficulty: 'beginner', points: 15n, createdAt: 0n, updatedAt: 0n },
  ],
  'cat-2': [
    { id: 'q-4', categoryId: 'cat-2', question: 'What is the Internet Computer?', options: ['A traditional cloud provider', 'A blockchain that hosts smart contracts and dApps', 'A web browser', 'A cryptocurrency exchange'], correctAnswer: 'A blockchain that hosts smart contracts and dApps', explanation: 'ICP is a blockchain network that provides a decentralized cloud computing platform for hosting software.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-5', categoryId: 'cat-2', question: 'What are canisters on ICP?', options: ['Storage containers', 'Smart contracts that run on ICP', 'Network nodes', 'Wallet addresses'], correctAnswer: 'Smart contracts that run on ICP', explanation: 'Canisters are computational units (smart contracts) that run on the Internet Computer network.', difficulty: 'beginner', points: 15n, createdAt: 0n, updatedAt: 0n },
  ],
  'cat-3': [
    { id: 'q-6', categoryId: 'cat-3', question: 'What does DeFi stand for?', options: ['Decentralized Finance', 'Digital Finance', 'Distributed File System', 'Direct Financing'], correctAnswer: 'Decentralized Finance', explanation: 'DeFi refers to financial services built on blockchain technology without traditional intermediaries.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
  ],
  'cat-4': [
    { id: 'q-7', categoryId: 'cat-4', question: 'What is an NFT?', options: ['A type of cryptocurrency', 'A non-fungible token representing unique ownership', 'A network protocol', 'A database system'], correctAnswer: 'A non-fungible token representing unique ownership', explanation: 'NFTs are unique digital tokens that represent ownership of specific items or content on the blockchain.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
  ],
};

// ── Mock Store (in-memory for dev) ───────────────────

let mockSessions: QuizSession[] = [];
let mockScores: Record<string, UserScore> = {};
let mockAchievements: Achievement[] = [];
let mockUsers: UserProfile[] = [];

// ── API Client ───────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const api = {
  // ─── Categories ───
  async getCategories(): Promise<QuizCategory[]> {
    await delay(300);
    return MOCK_CATEGORIES;
  },

  async getCategory(id: string): Promise<QuizCategory | null> {
    await delay(200);
    return MOCK_CATEGORIES.find((c) => c.id === id) ?? null;
  },

  // ─── Questions ───
  async getQuestionsByCategory(categoryId: string): Promise<Question[]> {
    await delay(400);
    return MOCK_QUESTIONS[categoryId] ?? [];
  },

  async getQuestion(id: string): Promise<Question | null> {
    await delay(200);
    for (const qs of Object.values(MOCK_QUESTIONS)) {
      const q = qs.find((q) => q.id === id);
      if (q) return q;
    }
    return null;
  },

  // ─── Quiz Sessions ───
  async startQuiz(userId: string, categoryId: string): Promise<QuizSession> {
    await delay(500);
    const questions = await api.getQuestionsByCategory(categoryId);
    const session: QuizSession = {
      id: `session-${Date.now()}`,
      userId,
      categoryId,
      score: 0n,
      totalQuestions: BigInt(questions.length),
      correctAnswers: 0n,
      completed: false,
      startedAt: BigInt(Date.now()),
      completedAt: [],
    };
    mockSessions.push(session);
    return session;
  },

  async submitAnswer(
    sessionId: string,
    questionId: string,
    selectedAnswer: string
  ): Promise<SubmitAnswerResult> {
    await delay(300);
    const question = await api.getQuestion(questionId);
    if (!question) throw new Error('Question not found');

    const correct = selectedAnswer === question.correctAnswer;
    const session = mockSessions.find((s) => s.id === sessionId);
    const pointsEarned = correct ? Number(question.points) : 0;

    if (session) {
      session.score = BigInt(Number(session.score) + pointsEarned);
      session.correctAnswers = BigInt(
        Number(session.correctAnswers) + (correct ? 1 : 0)
      );
    }

    return {
      correct,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      pointsEarned: BigInt(pointsEarned),
      totalScore: session?.score ?? 0n,
    };
  },

  async completeQuiz(sessionId: string): Promise<QuizSession> {
    await delay(300);
    const session = mockSessions.find((s) => s.id === sessionId);
    if (!session) throw new Error('Session not found');
    session.completed = true;
    session.completedAt = [BigInt(Date.now())];
    return session;
  },

  async getSession(id: string): Promise<QuizSession | null> {
    await delay(200);
    return mockSessions.find((s) => s.id === id) ?? null;
  },

  async getUserSessions(userId: string): Promise<QuizSession[]> {
    await delay(200);
    return mockSessions.filter((s) => s.userId === userId);
  },

  // ─── Scoring ───
  async updateScore(
    userId: string,
    xpEarned: number,
    correct: boolean,
    totalQuestions: number
  ): Promise<UserScore> {
    await delay(300);
    const existing = mockScores[userId];
    const now = BigInt(Date.now());

    const score: UserScore = existing
      ? {
          ...existing,
          totalXP: existing.totalXP + BigInt(xpEarned),
          quizzesCompleted: existing.quizzesCompleted + 1n,
          correctAnswers: existing.correctAnswers + (correct ? 1n : 0n),
          totalAnswers: existing.totalAnswers + BigInt(totalQuestions),
          updatedAt: now,
        }
      : {
          userId,
          totalXP: BigInt(xpEarned),
          quizzesCompleted: 1n,
          correctAnswers: correct ? 1n : 0n,
          totalAnswers: BigInt(totalQuestions),
          streak: 1n,
          lastQuizDate: now,
          tier: xpEarned >= 100 ? 'gold' : xpEarned >= 50 ? 'silver' : 'bronze',
          rank: 0n,
          updatedAt: now,
        };

    mockScores[userId] = score;
    return score;
  },

  async getScore(userId: string): Promise<UserScore | null> {
    await delay(200);
    return mockScores[userId] ?? null;
  },

  async getLeaderboard(limit = 10, offset = 0): Promise<LeaderboardEntry[]> {
    await delay(300);
    return Object.values(mockScores)
      .sort((a, b) => Number(b.totalXP - a.totalXP))
      .slice(offset, offset + limit)
      .map((s, i) => ({
        userId: s.userId,
        totalXP: s.totalXP,
        quizzesCompleted: s.quizzesCompleted,
        tier: s.tier,
        rank: BigInt(offset + i + 1),
      }));
  },

  // ─── Achievements ───
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    await delay(200);
    return mockAchievements.filter((a) => a.userId === userId);
  },

  // ─── Users ───
  async createUser(
    username: string,
    displayName: string,
    principalId: string,
    authProvider: string,
    avatar: string
  ): Promise<UserProfile> {
    await delay(400);
    const user: UserProfile = {
      id: `user-${Date.now()}`,
      username,
      displayName,
      email: [],
      avatar,
      bio: [],
      principalId,
      authProvider: authProvider as 'internet_identity' | 'google',
      createdAt: BigInt(Date.now()),
      updatedAt: BigInt(Date.now()),
      isActive: true,
    };
    mockUsers.push(user);
    return user;
  },

  async getUserByPrincipal(principalId: string): Promise<UserProfile | null> {
    await delay(200);
    return mockUsers.find((u) => u.principalId === principalId) ?? null;
  },
};
