import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/icp';
import type { Achievement } from '@/types';
import { Award, Loader2, Sparkles } from 'lucide-react';
import clsx from 'clsx';

// All possible achievements (for showing locked ones)
const ALL_ACHIEVEMENTS = [
  { name: 'First Quiz', desc: 'Complete your first quiz', icon: '🎯' },
  { name: 'Quick Learner', desc: 'Complete 10 quizzes', icon: '📚' },
  { name: 'Quiz Master', desc: 'Complete 50 quizzes', icon: '🏆' },
  { name: 'Perfect Score', desc: 'Get 100% on any quiz', icon: '💯' },
  { name: 'Bronze Tier', desc: 'Reach Bronze tier', icon: '🥉' },
  { name: 'Silver Tier', desc: 'Reach Silver tier', icon: '🥈' },
  { name: 'Gold Tier', desc: 'Reach Gold tier', icon: '🥇' },
  { name: 'Platinum Tier', desc: 'Reach Platinum tier', icon: '💎' },
  { name: 'Diamond Tier', desc: 'Reach Diamond tier', icon: '👑' },
  { name: 'On Fire', desc: '7-day quiz streak', icon: '🔥' },
  { name: 'Unstoppable', desc: '30-day quiz streak', icon: '⚡' },
  { name: 'Century', desc: 'Earn 100 XP', icon: '💪' },
  { name: 'Thousand', desc: 'Earn 1,000 XP', icon: '🌟' },
];

export default function AchievementsPage() {
  const { status, user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api
      .getUserAchievements(user.id)
      .then(setAchievements)
      .finally(() => setLoading(false));
  }, [user]);

  const unlockedNames = new Set(achievements.map((a) => a.name));

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
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
          <Award className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Achievements
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {achievements.length} of {ALL_ACHIEVEMENTS.length} unlocked
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500"
          style={{
            width: `${(achievements.length / ALL_ACHIEVEMENTS.length) * 100}%`,
          }}
        />
      </div>

      {/* Achievement Grid */}
      {status === 'authenticated' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_ACHIEVEMENTS.map((ach) => {
            const unlocked = unlockedNames.has(ach.name);
            const userAch = achievements.find((a) => a.name === ach.name);

            return (
              <div
                key={ach.name}
                className={clsx(
                  'card relative overflow-hidden transition-all',
                  unlocked
                    ? 'border-brand-200 bg-gradient-to-br from-brand-50 to-white dark:border-brand-800 dark:from-brand-950/20 dark:to-gray-900'
                    : 'opacity-60 grayscale'
                )}
              >
                {unlocked && (
                  <div className="absolute right-3 top-3">
                    <Sparkles className="h-4 w-4 text-brand-500" />
                  </div>
                )}
                <span className="text-4xl">{unlocked ? ach.icon : '🔒'}</span>
                <h3 className="mt-3 font-bold text-gray-900 dark:text-white">
                  {ach.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {ach.desc}
                </p>
                {unlocked && userAch && (
                  <p className="mt-2 text-xs text-brand-600 dark:text-brand-400">
                    Unlocked
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-24 dark:border-gray-700">
          <Award className="h-16 w-16 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-xl font-semibold text-gray-500 dark:text-gray-400">
            Sign in to track achievements
          </h3>
          <p className="mt-1 text-gray-400">
            Your progress is saved on-chain with Internet Identity
          </p>
          <Link to="/" className="btn-primary mt-6">
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
}
