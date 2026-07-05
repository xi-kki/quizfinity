import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  BookOpen,
  Trophy,
  User,
  Award,
  LogIn,
  LogOut,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/categories', label: 'Learn', icon: BookOpen },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/achievements', label: 'Achievements', icon: Award },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Layout() {
  const location = useLocation();
  const { status, user, login, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-icp-500 text-white shadow-lg shadow-brand-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-icp-600 bg-clip-text text-transparent">
              Quizfinity
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth Button */}
          <div className="flex items-center gap-3">
            {status === 'authenticated' && user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="h-7 w-7 rounded-full"
                  />
                  <span className="hidden font-medium sm:inline">{user.displayName}</span>
                </Link>
                <button onClick={logout} className="btn-ghost text-sm" title="Logout">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button onClick={login} className="btn-primary text-sm">
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── Mobile Nav ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/90 backdrop-blur-xl md:hidden dark:border-gray-800 dark:bg-gray-950/90">
        <div className="flex justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-colors',
                  isActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-gray-500 dark:text-gray-500'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ─── Main Content ─── */}
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 md:pb-6">
        <Outlet />
      </main>
    </div>
  );
}
