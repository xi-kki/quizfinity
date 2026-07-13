import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/icp';
import type { QuizCategory } from '@/types';
import {
  Sparkles,
  ArrowRight,
  Users,
  Trophy,
  Zap,
  BookOpen,
  Shield,
  Coins,
} from 'lucide-react';

export default function HomePage() {
  const { status, login } = useAuth();
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-icp-600 to-purple-600 p-8 text-white md:p-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6bTAtMzB2Mkgydi0yaDM0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="relative">
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm w-fit mb-6">
            <Zap className="h-4 w-4" />
            <span>Learn Web3. Earn Rewards. Own Your Progress.</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight md:text-6xl md:leading-tight">
            Master Web3
            <br />
            <span className="text-brand-200">One Quiz at a Time</span>
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-white/80 md:text-xl">
            Gamified learning platform on the Internet Computer. Take quizzes,
            earn XP, unlock achievements, and compete on the leaderboard.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {status === 'authenticated' ? (
              <Link to="/categories" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 font-semibold text-brand-700 shadow-lg transition-all hover:shadow-xl active:scale-95">
                Start Learning
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <button onClick={login} className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 font-semibold text-brand-700 shadow-lg transition-all hover:shadow-xl active:scale-95">
                Get Started Free
                <Sparkles className="h-5 w-5" />
              </button>
            )}
            <Link to="/leaderboard" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 px-8 py-3.5 font-semibold text-white/90 backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95">
              View Leaderboard
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: Users, label: 'Learners', value: '1,234+' },
              { icon: BookOpen, label: 'Quizzes', value: '48+' },
              { icon: Trophy, label: 'XP Earned', value: '89K' },
              { icon: Shield, label: 'On ICP', value: 'Secure' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/5 p-4 backdrop-blur-sm">
                <stat.icon className="h-5 w-5 text-brand-200" />
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          How It Works
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            {
              step: '01',
              icon: BookOpen,
              title: 'Learn',
              desc: 'Browse curated quiz categories — Blockchain, ICP, DeFi, NFTs, Security, and more.',
            },
            {
              step: '02',
              icon: Zap,
              title: 'Earn',
              desc: 'Answer questions correctly to earn XP. Build streaks for bonus points.',
            },
            {
              step: '03',
              icon: Trophy,
              title: 'Compete',
              desc: 'Climb the leaderboard, unlock achievements, and prove your Web3 knowledge.',
            },
          ].map((item) => (
            <div key={item.step} className="card-hover">
              <span className="text-4xl font-black text-brand-200">0{item.step}</span>
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Why ICP ─── */}
      <section className="rounded-2xl border border-icp-100 bg-gradient-to-br from-icp-50 to-white p-8 dark:border-icp-900/30 dark:from-icp-950/50 dark:to-gray-900">
        <div className="flex items-center gap-3">
          <Coins className="h-6 w-6 text-icp-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Built on the Internet Computer
          </h2>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Quizfinity runs entirely on ICP — fully on-chain, gasless for users, 
          and tamperproof. Your progress, achievements, and rewards are verifiable 
          and owned by you.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Zero Gas Fees', desc: 'No transaction costs — ever' },
            { label: 'On-Chain Data', desc: 'Your progress is verifiable' },
            { label: 'Internet Identity', desc: 'Secure, passwordless auth' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white/60 p-4 dark:bg-gray-800/60">
              <p className="font-semibold text-gray-900 dark:text-white">{item.label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Categories ─── */}
      {categories.length > 0 && (
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Start Learning
            </h2>
            <Link to="/categories" className="btn-ghost text-sm">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((cat) => (
              <Link key={cat.id} to={`/quiz/${cat.id}`} className="card-hover group">
                <span className="text-3xl">{cat.icon}</span>
                <h3 className="mt-3 font-bold text-gray-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                  {cat.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{cat.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
