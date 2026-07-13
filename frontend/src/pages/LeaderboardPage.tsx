import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/icp';
import type { LeaderboardEntry } from '@/types';
import { Trophy, Loader2, User } from 'lucide-react';
import clsx from 'clsx';

const TIER_ICONS: Record<string, string> = {
  diamond: '👑',
  platinum: '💎',
  gold: '🥇',
  silver: '🥈',
  bronze: '🥉',
};

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit] = useState(20);

  useEffect(() => {
    api
      .getLeaderboard(limit, 0)
      .then(setEntries)
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
          <Trophy className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Leaderboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Top Web3 learners on Quizfinity
          </p>
        </div>
      </div>

      {/* Leaderboard */}
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <div
              key={entry.userId}
              className={clsx(
                'flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md',
                index < 3
                  ? 'border-amber-200 bg-gradient-to-r from-amber-50 to-white dark:border-amber-800 dark:from-amber-950/20 dark:to-gray-900'
                  : 'border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900'
              )}
            >
              {/* Rank */}
              <div className="flex w-10 justify-center">
                {index < 3 ? (
                  <span className="text-2xl">{RANK_MEDALS[index]}</span>
                ) : (
                  <span className="text-lg font-bold text-gray-400">
                    #{Number(entry.rank)}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <User className="h-5 w-5 text-gray-400" />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {entry.userId.slice(0, 8)}...
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{Number(entry.quizzesCompleted)} quizzes</span>
                  <span>·</span>
                  <span>{TIER_ICONS[entry.tier] || '🔵'} {entry.tier}</span>
                </div>
              </div>

              {/* XP */}
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {Number(entry.totalXP).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">XP</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-24 dark:border-gray-700">
          <Trophy className="h-16 w-16 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-xl font-semibold text-gray-500 dark:text-gray-400">
            No scores yet
          </h3>
          <p className="mt-1 text-gray-400">
            Be the first to take a quiz and earn XP!
          </p>
          <Link to="/categories" className="btn-primary mt-6">
            Start Learning
          </Link>
        </div>
      )}
    </div>
  );
}
