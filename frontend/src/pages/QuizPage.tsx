import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/icp';
import type {
  QuizCategory,
  Question,
  QuizSession,
  SubmitAnswerResult,
} from '@/types';
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Zap,
  Sparkles,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import clsx from 'clsx';

type Phase = 'loading' | 'ready' | 'playing' | 'review' | 'complete' | 'error';

export default function QuizPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { status, user, login } = useAuth();

  const [phase, setPhase] = useState<Phase>('loading');
  const [category, setCategory] = useState<QuizCategory | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<SubmitAnswerResult | null>(null);
  const [results, setResults] = useState<SubmitAnswerResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Load quiz data
  useEffect(() => {
    if (!categoryId) return;
    setPhase('loading');

    Promise.all([
      api.getCategory(categoryId),
      api.getQuestionsByCategory(categoryId),
    ])
      .then(([cat, qs]) => {
        if (!cat) {
          setError('Category not found');
          setPhase('error');
          return;
        }
        if (qs.length === 0) {
          setError('No questions in this category yet');
          setPhase('error');
          return;
        }
        setCategory(cat);
        setQuestions(qs);
        setPhase('ready');
      })
      .catch((err) => {
        setError(err.message);
        setPhase('error');
      });
  }, [categoryId]);

  // Start quiz
  const startQuiz = useCallback(async () => {
    if (!user) {
      login();
      return;
    }
    if (!categoryId) return;

    setPhase('loading');
    try {
      const s = await api.startQuiz(user.id, categoryId);
      setSession(s);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setLastResult(null);
      setResults([]);
      setShowExplanation(false);
      setPhase('playing');
    } catch (err: any) {
      setError(err.message);
      setPhase('error');
    }
  }, [user, categoryId, login]);

  // Submit answer
  const submitAnswer = useCallback(async () => {
    if (!selectedAnswer || !session) return;

    const question = questions[currentIndex];
    if (!question) return;

    try {
      const result = await api.submitAnswer(
        session.id,
        question.id,
        selectedAnswer
      );
      setLastResult(result);
      setResults((prev) => [...prev, result]);
      setShowExplanation(true);
    } catch (err: any) {
      setError(err.message);
      setPhase('error');
    }
  }, [selectedAnswer, session, questions, currentIndex]);

  // Next question or finish
  const nextQuestion = useCallback(async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setLastResult(null);
      setShowExplanation(false);
    } else {
      // Complete the quiz
      if (!session) return;
      try {
        const completedSession = await api.completeQuiz(session.id);

        // Calculate score
        const correctCount = results.filter((r) => r.correct).length;
        const xpEarned = results.reduce((sum, r) => sum + Number(r.pointsEarned), 0);

        // Update user score
        await api.updateScore(
          user!.id,
          xpEarned,
          correctCount > 0,
          questions.length
        );

        setSession(completedSession);
        setFinalScore(xpEarned);
        setPhase('complete');
      } catch (err: any) {
        setError(err.message);
        setPhase('error');
      }
    }
  }, [currentIndex, questions.length, session, results, user]);

  const correctCount = results.filter((r) => r.correct).length;

  // ── Error State ──
  if (phase === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <AlertTriangle className="h-16 w-16 text-amber-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Oops!
        </h2>
        <p className="mt-2 text-gray-500">{error || 'Something went wrong'}</p>
        <Link to="/categories" className="btn-primary mt-6">
          Browse Categories
        </Link>
      </div>
    );
  }

  // ── Loading ──
  if (phase === 'loading') {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  // ── Complete ──
  if (phase === 'complete') {
    const percentage = Math.round((correctCount / questions.length) * 100);
    const grade =
      percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : percentage >= 40 ? 'Keep Trying!' : 'Let\'s Review!';
    const gradeColor =
      percentage >= 80
        ? 'text-green-500'
        : percentage >= 60
          ? 'text-blue-500'
          : percentage >= 40
            ? 'text-amber-500'
            : 'text-red-500';

    return (
      <div className="mx-auto max-w-2xl py-8">
        <div className="card text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/20">
            <Trophy className={clsx('h-10 w-10', gradeColor)} />
          </div>

          <h1 className={clsx('mt-6 text-4xl font-bold', gradeColor)}>
            {grade}
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            {category?.name || 'Quiz'} Complete!
          </p>

          {/* Score Circle */}
          <div className="mx-auto mt-8 flex h-32 w-32 items-center justify-center rounded-full border-4 border-brand-200 dark:border-brand-800">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {percentage}%
              </p>
              <p className="text-xs text-gray-500">
                {correctCount}/{questions.length} correct
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
              <CheckCircle2 className="mx-auto h-6 w-6 text-green-500" />
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                {correctCount}
              </p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
              <XCircle className="mx-auto h-6 w-6 text-red-500" />
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                {questions.length - correctCount}
              </p>
              <p className="text-xs text-gray-500">Wrong</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
              <Zap className="mx-auto h-6 w-6 text-amber-500" />
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                {finalScore}
              </p>
              <p className="text-xs text-gray-500">XP Earned</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={startQuiz}
              className="btn-primary"
            >
              <RotateCcw className="h-4 w-4" />
              Retry Quiz
            </button>
            <Link to="/categories" className="btn-secondary">
              More Categories
            </Link>
            <Link to="/leaderboard" className="btn-ghost">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Ready Screen ──
  if (phase === 'ready') {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <span className="text-6xl">{category?.icon}</span>
        <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          {category?.name}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {category?.description}
        </p>
        <p className="mt-4 text-sm text-gray-500">
          {questions.length} questions ·{' '}
          {questions.reduce((sum, q) => sum + Number(q.points), 0)} XP available
        </p>

        <button
          onClick={startQuiz}
          className="btn-primary mt-8 text-lg"
        >
          <Zap className="h-5 w-5" />
          {status === 'authenticated' ? 'Start Quiz' : 'Sign In to Start'}
        </button>

        {status !== 'authenticated' && (
          <p className="mt-3 text-sm text-gray-400">
            Sign in to track your progress and earn XP
          </p>
        )}
      </div>
    );
  }

  // ── Playing / Review ──
  const question = questions[currentIndex];
  if (!question) return null;

  return (
    <div className="mx-auto max-w-3xl py-4">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="font-medium text-brand-600 dark:text-brand-400">
            {correctCount} correct so far
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-icp-500 transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="card">
        <div className="flex items-center gap-2">
          <span className="badge-blue">{question.difficulty}</span>
          <span className="badge-gold">{Number(question.points)} XP</span>
        </div>

        <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
          {question.question}
        </h2>

        {/* Options */}
        <div className="mt-6 space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption =
              showExplanation && option === question.correctAnswer;
            const isWrongSelection =
              showExplanation && isSelected && option !== question.correctAnswer;

            return (
              <button
                key={option}
                onClick={() => {
                  if (!showExplanation) setSelectedAnswer(option);
                }}
                disabled={showExplanation}
                className={clsx(
                  'w-full rounded-xl border-2 px-5 py-4 text-left font-medium transition-all duration-200',
                  isCorrectOption &&
                    'border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900/20 dark:text-green-400',
                  isWrongSelection &&
                    'border-red-500 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-900/20 dark:text-red-400',
                  !showExplanation &&
                    isSelected &&
                    'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900/20 dark:text-brand-400',
                  !showExplanation &&
                    !isSelected &&
                    'border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-brand-50/50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-brand-500 dark:hover:bg-brand-900/10',
                  showExplanation && !isCorrectOption && !isWrongSelection &&
                    'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isCorrectOption && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {isWrongSelection && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && lastResult && (
          <div
            className={clsx(
              'mt-6 rounded-xl border p-4',
              lastResult.correct
                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10'
                : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10'
            )}
          >
            <div className="flex items-center gap-2">
              {lastResult.correct ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-green-700 dark:text-green-400">
                    Correct! +{Number(lastResult.pointsEarned)} XP
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="font-semibold text-red-700 dark:text-red-400">
                    Incorrect
                  </span>
                </>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {lastResult.explanation}
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          {!showExplanation ? (
            <button
              onClick={submitAnswer}
              disabled={!selectedAnswer}
              className="btn-primary"
            >
              Submit Answer
            </button>
          ) : (
            <button onClick={nextQuestion} className="btn-primary">
              {currentIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  See Results
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
