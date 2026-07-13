// ── ICP Canister Types ──────────────────────────────

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface Question {
  id: string;
  categoryId: string;
  question: string;
  lesson?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: bigint;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface QuizSession {
  id: string;
  userId: string;
  categoryId: string;
  score: bigint;
  totalQuestions: bigint;
  correctAnswers: bigint;
  completed: boolean;
  startedAt: bigint;
  completedAt: [bigint] | [];
}

export interface SubmitAnswerResult {
  correct: boolean;
  correctAnswer: string;
  explanation: string;
  pointsEarned: bigint;
  totalScore: bigint;
}

export interface UserScore {
  userId: string;
  totalXP: bigint;
  quizzesCompleted: bigint;
  correctAnswers: bigint;
  totalAnswers: bigint;
  streak: bigint;
  lastQuizDate: bigint;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  rank: bigint;
  updatedAt: bigint;
}

export interface Achievement {
  id: string;
  userId: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: bigint;
}

export interface LeaderboardEntry {
  userId: string;
  totalXP: bigint;
  quizzesCompleted: bigint;
  tier: string;
  rank: bigint;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: [string] | [];
  avatar: string;
  bio: [string] | [];
  principalId: string;
  authProvider: 'internet_identity' | 'google';
  createdAt: bigint;
  updatedAt: bigint;
  isActive: boolean;
}

// ── Frontend-State Types ────────────────────────────

export type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated';

export interface QuizProgress {
  currentQuestionIndex: number;
  answers: Record<string, string>; // questionId -> answer
  sessionId: string | null;
}

export interface QuizResult {
  sessionId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  tier: string;
  xpEarned: number;
}
