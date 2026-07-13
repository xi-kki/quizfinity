import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/icp';
import type { QuizCategory } from '@/types';
import { BookOpen, ArrowRight, Search, Loader2 } from 'lucide-react';
import { getIcon } from '@/lib/icons';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Learn Web3
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Choose a category and start earning XP
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      {/* Categories Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cat) => (
            <Link
              key={cat.id}
              to={`/quiz/${cat.id}`}
              className="card-hover group relative overflow-hidden"
            >
              <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                <ArrowRight className="h-5 w-5 text-brand-500" />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                {(() => {
                  const Icon = getIcon(cat.icon);
                  return <Icon className="h-6 w-6" />;
                })()}
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                {cat.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {cat.description}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400">
                <BookOpen className="h-4 w-4" />
                <span>Start Quiz</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <BookOpen className="h-12 w-12" />
          <p className="mt-4 text-lg font-medium">No categories found</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
