import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/icp';
import type { UserScore, QuizSession, Achievement } from '@/types';
import {
  User,
  Loader2,
  Zap,
  BookOpen,
  LogIn,
  Flame,
  Target,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';

const TIER_BADGES: Record<string, { color: string; bg: string; label: string }> = {
  bronze: { color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30', label: '🥉 Bronze' },
  silver: { color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', label: '🥈 Silver' },
  gold: { color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', label: '🥇 Gold' },
  platinum: { color: 'text-sky-500', bg: 'bg-sky-100 dark:bg-sky-900/30', label: '💎 Platinum' },
  diamond: { color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30', label: '👑 Diamond' },
};

export default function ProfilePage() {
  const { status, user, login } = useAuth();
  const [score, setScore] = useState<UserScore | null>(null);
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    Promise.all([
      api.getScore(user.id),
      api.getUserSessions(user.id),
      api.getUserAchievements(user.id),
    ])
      .then(([s, sess, ach]) => {
        setScore(s);
        setSessions(sess);
        setAchievements(ach);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (status !== 'authenticated' || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <User className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
          Sign In
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Connect with Internet Identity or Google to view your profile
        </p>
        <button onClick={login} className="btn-primary mt-6">
          <LogIn className="h-4 w-4" />
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const completedCount = sessions.filter((s) => s.completed).length;
  const accuracy = score
    ? Math.round((Number(score.correctAnswers) / Math.max(Number(score.totalAnswers), 1)) * 100)
    : 0;

  return (
    <div className="space-y-8 py-6">
      {/* Profile Card */}
      <div className="card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-icp-500/5" />
        <div className="relative flex items-start gap-6">
          <img
            src={user.avatar}
            alt={user.displayName}
            className="h-20 w-20 rounded-2xl"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.displayName}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              @{user.username}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {score && (
                <span className={clsx('badge', TIER_BADGES[score.tier]?.bg, TIER_BADGES[score.tier]?.color)}>
                  {TIER_BADGES[score.tier]?.label}
                </span>
              )}
              <span className="badge-blue">
                <Sparkles className="h-3 w-3" />
                {user.authProvider === 'internet_identity' ? 'Internet Identity' : 'Google'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Zap, label: 'Total XP', value: score ? Number(score.totalXP).toLocaleString() : '0', bg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' },
          { icon: BookOpen, label: 'Quizzes Done', value: String(completedCount), bg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
          { icon: Target, label: 'Accuracy', value: `${accuracy}%`, bg: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
          { icon: Flame, label: 'Day Streak', value: score ? String(Number(score.streak)) : '0', bg: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' },
        ].map((stat) => (
          <div key={stat.label} className="card">
            <div className={clsx('flex h-10 w-10 items-center justify-center rounded-xl', stat.bg)}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Achievements Preview */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Achievements ({achievements.length})
          </h2>
          <Link to="/achievements" className="btn-ghost text-sm">
            View All
          </Link>
        </div>
        {achievements.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {achievements.slice(0, 6).map((ach) => (
              <div
                key={ach.id}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-brand-50 to-white px-4 py-2 dark:from-brand-950/20 dark:to-gray-900"
              >
                <span className="text-xl">{ach.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {ach.name}
                </span>
              </div>
            ))}
            {achievements.length > 6 && (
              <span className="flex items-center text-sm text-gray-400">
                +{achievements.length - 6} more
              </span>
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-400">
            Complete quizzes to unlock achievements
          </p>
        )}
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Sessions
          </h2>
          <div className="mt-4 space-y-2">
            {sessions.slice(0, 5).map((s) => (
              <div
                key={s.id}
                className="card flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Session #{s.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {Number(s.correctAnswers)}/{Number(s.totalQuestions)} correct ·{' '}
                    {Number(s.score)} XP
                  </p>
                </div>
                {s.completed ? (
                  <span className="badge-green">Completed</span>
                ) : (
                  <span className="badge bg-gray-100 text-gray-500 dark:bg-gray-800">In Progress</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
