/**
 * ICP Canister Actor Factory
 * 
 * Creates typed actors for interacting with deployed canisters.
 * Uses mock API when canister IDs are not configured.
 */

import { Actor, HttpAgent } from '@dfinity/agent';
import { CANISTER_IDS, isLocal } from './canister.config';

// ── IDL Types (matching backend canisters) ──────────────

// We use inline IDL definitions for simplicity
// In production, generate from .did files using didc

const QuizEngineIDL = ({ IDL }: any) => {
  const QuizCategory = IDL.Record({
    id: IDL.Text,
    name: IDL.Text,
    description: IDL.Text,
    icon: IDL.Text,
    createdAt: IDL.Nat64,
    updatedAt: IDL.Nat64,
  });
  const Question = IDL.Record({
    id: IDL.Text,
    categoryId: IDL.Text,
    question: IDL.Text,
    options: IDL.Vec(IDL.Text),
    correctAnswer: IDL.Text,
    explanation: IDL.Text,
    difficulty: IDL.Text,
    points: IDL.Nat64,
    createdAt: IDL.Nat64,
    updatedAt: IDL.Nat64,
  });
  const QuizSession = IDL.Record({
    id: IDL.Text,
    userId: IDL.Text,
    categoryId: IDL.Text,
    score: IDL.Nat64,
    totalQuestions: IDL.Nat64,
    correctAnswers: IDL.Nat64,
    completed: IDL.Bool,
    startedAt: IDL.Nat64,
    completedAt: IDL.Opt(IDL.Nat64),
  });
  const SubmitAnswerResult = IDL.Record({
    correct: IDL.Bool,
    correctAnswer: IDL.Text,
    explanation: IDL.Text,
    pointsEarned: IDL.Nat64,
    totalScore: IDL.Nat64,
  });
  return IDL.Service({
    getAllCategories: IDL.Func([], [IDL.Vec(QuizCategory)], ['query']),
    getCategory: IDL.Func([IDL.Text], [IDL.Opt(QuizCategory)], ['query']),
    getQuestionsByCategory: IDL.Func([IDL.Text], [IDL.Vec(Question)], ['query']),
    getQuestion: IDL.Func([IDL.Text], [IDL.Opt(Question)], ['query']),
    startQuiz: IDL.Func([IDL.Text, IDL.Text], [QuizSession], []),
    submitAnswer: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [SubmitAnswerResult], []),
    completeQuiz: IDL.Func([IDL.Text], [QuizSession], []),
    getUserSessions: IDL.Func([IDL.Text], [IDL.Vec(QuizSession)], ['query']),
  });
};

const ScoringIDL = ({ IDL }: any) => {
  const UserScore = IDL.Record({
    userId: IDL.Text,
    totalXP: IDL.Nat64,
    quizzesCompleted: IDL.Nat64,
    correctAnswers: IDL.Nat64,
    totalAnswers: IDL.Nat64,
    streak: IDL.Nat64,
    lastQuizDate: IDL.Nat64,
    tier: IDL.Text,
    rank: IDL.Nat64,
    updatedAt: IDL.Nat64,
  });
  const Achievement = IDL.Record({
    id: IDL.Text,
    userId: IDL.Text,
    name: IDL.Text,
    description: IDL.Text,
    icon: IDL.Text,
    unlockedAt: IDL.Nat64,
  });
  const LeaderboardEntry = IDL.Record({
    userId: IDL.Text,
    totalXP: IDL.Nat64,
    quizzesCompleted: IDL.Nat64,
    tier: IDL.Text,
    rank: IDL.Nat64,
  });
  return IDL.Service({
    updateScore: IDL.Func([IDL.Text, IDL.Nat64, IDL.Bool, IDL.Nat64], [UserScore], []),
    getScore: IDL.Func([IDL.Text], [IDL.Opt(UserScore)], ['query']),
    getLeaderboard: IDL.Func([IDL.Nat64, IDL.Nat64], [IDL.Vec(LeaderboardEntry)], ['query']),
    getUserAchievements: IDL.Func([IDL.Text], [IDL.Vec(Achievement)], ['query']),
  });
};

const UserIDL = ({ IDL }: any) => {
  const UserProfile = IDL.Record({
    id: IDL.Text,
    username: IDL.Text,
    displayName: IDL.Text,
    email: IDL.Opt(IDL.Text),
    avatar: IDL.Text,
    bio: IDL.Opt(IDL.Text),
    principalId: IDL.Text,
    authProvider: IDL.Text,
    createdAt: IDL.Nat64,
    updatedAt: IDL.Nat64,
    isActive: IDL.Bool,
  });
  return IDL.Service({
    createUser: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [UserProfile], []),
    getUser: IDL.Func([IDL.Text], [IDL.Opt(UserProfile)], ['query']),
    getUserByPrincipal: IDL.Func([IDL.Text], [IDL.Opt(UserProfile)], ['query']),
    updateProfile: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [UserProfile], []),
  });
};

// ── Actor Factory ───────────────────────────────────────

function createActor(idlFactory: any, canisterId: string, identity?: any) {
  const host = isLocal ? 'http://localhost:8000' : 'https://icp0.io';
  
  const agent = new HttpAgent({
    host,
    identity,
  });

  // Fetch root key for local development
  if (isLocal) {
    agent.fetchRootKey().catch(console.error);
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
}

// ── Exported Actors ─────────────────────────────────────

export function getQuizEngineActor(identity?: any) {
  if (!CANISTER_IDS.quizEngine) return null;
  return createActor(QuizEngineIDL, CANISTER_IDS.quizEngine, identity);
}

export function getScoringActor(identity?: any) {
  if (!CANISTER_IDS.scoring) return null;
  return createActor(ScoringIDL, CANISTER_IDS.scoring, identity);
}

export function getUserActor(identity?: any) {
  if (!CANISTER_IDS.user) return null;
  return createActor(UserIDL, CANISTER_IDS.user, identity);
}
