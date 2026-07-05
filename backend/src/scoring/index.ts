import {
  Canister,
  Query,
  Record,
  Result,
  StableBTreeMap,
  Update,
  Vec,
  ic,
  nat64,
  text,
  bool,
  float64,
  nat8,
} from 'azle';
import { v4 as uuidv4 } from 'uuid';

// ── Types ──────────────────────────────────────────────

const UserScore = Record({
  userId: text,
  totalXP: nat64,
  quizzesCompleted: nat64,
  correctAnswers: nat64,
  totalAnswers: nat64,
  streak: nat64,
  lastQuizDate: nat64,
  tier: text, // 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  rank: nat64,
  updatedAt: nat64,
});

const Achievement = Record({
  id: text,
  userId: text,
  name: text,
  description: text,
  icon: text,
  unlockedAt: nat64,
});

const LeaderboardEntry = Record({
  userId: text,
  totalXP: nat64,
  quizzesCompleted: nat64,
  tier: text,
  rank: nat64,
});

const ScoreUpdateInput = Record({
  userId: text,
  xpEarned: nat64,
  correct: bool,
  totalQuestions: nat64,
});

// ── Helpers ────────────────────────────────────────────

function calculateTier(xp: nat64): text {
  if (xp >= 100000n) return 'diamond';
  if (xp >= 50000n) return 'platinum';
  if (xp >= 10000n) return 'gold';
  if (xp >= 1000n) return 'silver';
  return 'bronze';
}

function calculateRank(userId: text): nat64 {
  const allScores = scores.values().sort((a, b) => {
    if (b.totalXP > a.totalXP) return 1;
    if (b.totalXP < a.totalXP) return -1;
    return 0;
  });
  const idx = allScores.findIndex((s) => s.userId === userId);
  return BigInt(idx + 1);
}

// ── State ──────────────────────────────────────────────

let scores = StableBTreeMap<string, typeof UserScore>(0);
let achievements = StableBTreeMap<string, typeof Achievement>(1);

// ── Canister ───────────────────────────────────────────

export default Canister({
  // ─── Score Management ───
  updateScore: Update([ScoreUpdateInput], Result(UserScore, text), (input) => {
    const existing = scores.get(input.userId);
    const now = ic.time();

    const updated: typeof UserScore = existing
      ? {
          ...existing,
          totalXP: existing.totalXP + input.xpEarned,
          quizzesCompleted: existing.quizzesCompleted + 1n,
          correctAnswers: existing.correctAnswers + (input.correct ? 1n : 0n),
          totalAnswers: existing.totalAnswers + input.totalQuestions,
          streak: existing.lastQuizDate + 86400000000000n >= now
            ? existing.streak + 1n
            : 1n,
          lastQuizDate: now,
          tier: calculateTier(existing.totalXP + input.xpEarned),
          rank: 0n, // will update below
          updatedAt: now,
        }
      : {
          userId: input.userId,
          totalXP: input.xpEarned,
          quizzesCompleted: 1n,
          correctAnswers: input.correct ? 1n : 0n,
          totalAnswers: input.totalQuestions,
          streak: 1n,
          lastQuizDate: now,
          tier: calculateTier(input.xpEarned),
          rank: 0n,
          updatedAt: now,
        };

    scores.insert(input.userId, updated);

    // Calculate rank
    const ranked = { ...updated, rank: calculateRank(input.userId) };
    scores.insert(input.userId, ranked);

    // Check for achievements
    checkAchievements(input.userId, ranked);

    return Result.Ok(ranked);
  }),

  getScore: Query([text], Result(UserScore, text), (userId) => {
    const score = scores.get(userId);
    if (score === null) {
      return Result.Err('User score not found');
    }
    // Update rank on query (fresh)
    const withRank = { ...score, rank: calculateRank(userId) };
    return Result.Ok(withRank);
  }),

  getLeaderboard: Query([nat64, nat64], Vec(LeaderboardEntry), (limit, offset) => {
    const all = scores
      .values()
      .sort((a, b) => {
        if (b.totalXP > a.totalXP) return 1;
        if (b.totalXP < a.totalXP) return -1;
        return 0;
      })
      .slice(Number(offset), Number(offset + limit))
      .map((s, i) => ({
        userId: s.userId,
        totalXP: s.totalXP,
        quizzesCompleted: s.quizzesCompleted,
        tier: s.tier,
        rank: BigInt(Number(offset) + i + 1),
      }));

    return all;
  }),

  getUserCount: Query([], nat64, () => {
    return BigInt(scores.values().length);
  }),

  // ─── Achievements ───
  getUserAchievements: Query([text], Vec(Achievement), (userId) => {
    return achievements.values().filter((a) => a.userId === userId);
  }),

  getAllAchievements: Query([], Vec(Achievement), () => {
    return achievements.values();
  }),
});

// ─── Achievement Logic ─────────────────────────────────

function checkAchievements(userId: text, score: typeof UserScore) {
  const existing = achievements.values().filter((a) => a.userId === userId);
  const existingNames = new Set(existing.map((a) => a.name));

  const now = ic.time();
  const newAchievements: typeof Achievement[] = [];

  const definitions = [
    { name: 'First Quiz', desc: 'Complete your first quiz', icon: '🎯', check: () => score.quizzesCompleted >= 1n },
    { name: 'Quick Learner', desc: 'Complete 10 quizzes', icon: '📚', check: () => score.quizzesCompleted >= 10n },
    { name: 'Quiz Master', desc: 'Complete 50 quizzes', icon: '🏆', check: () => score.quizzesCompleted >= 50n },
    { name: 'Perfect Score', desc: 'Get 100% on any quiz', icon: '💯', check: () => score.correctAnswers === score.totalAnswers && score.totalAnswers > 0n },
    { name: 'Bronze Tier', desc: 'Reach Bronze tier', icon: '🥉', check: () => score.tier === 'bronze' },
    { name: 'Silver Tier', desc: 'Reach Silver tier', icon: '🥈', check: () => score.tier === 'silver' },
    { name: 'Gold Tier', desc: 'Reach Gold tier', icon: '🥇', check: () => score.tier === 'gold' },
    { name: 'Platinum Tier', desc: 'Reach Platinum tier', icon: '💎', check: () => score.tier === 'platinum' },
    { name: 'Diamond Tier', desc: 'Reach Diamond tier', icon: '👑', check: () => score.tier === 'diamond' },
    { name: 'On Fire', desc: '7-day quiz streak', icon: '🔥', check: () => score.streak >= 7n },
    { name: 'Unstoppable', desc: '30-day quiz streak', icon: '⚡', check: () => score.streak >= 30n },
    { name: 'Century', desc: 'Earn 100 XP', icon: '💪', check: () => score.totalXP >= 100n },
    { name: 'Thousand', desc: 'Earn 1,000 XP', icon: '🌟', check: () => score.totalXP >= 1000n },
  ];

  for (const def of definitions) {
    if (!existingNames.has(def.name) && def.check()) {
      const achievement = {
        id: uuidv4(),
        userId,
        name: def.name,
        description: def.desc,
        icon: def.icon,
        unlockedAt: now,
      };
      achievements.insert(achievement.id, achievement);
      newAchievements.push(achievement);
    }
  }
}
