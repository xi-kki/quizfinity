import {
  Canister,
  Opt,
  Principal,
  Query,
  Record,
  Result,
  StableBTreeMap,
  Tuple,
  Update,
  Vec,
  ic,
  nat64,
  text,
  bool,
  float64,
} from 'azle';
import { v4 as uuidv4 } from 'uuid';

// ── Types ──────────────────────────────────────────────

const QuizCategory = Record({
  id: text,
  name: text,
  description: text,
  icon: text,
  createdAt: nat64,
  updatedAt: nat64,
});

const Question = Record({
  id: text,
  categoryId: text,
  question: text,
  options: Vec(text),
  correctAnswer: text,
  explanation: text,
  difficulty: text, // 'beginner' | 'intermediate' | 'advanced'
  points: nat64,
  createdAt: nat64,
  updatedAt: nat64,
});

const QuizSession = Record({
  id: text,
  userId: text,
  categoryId: text,
  score: nat64,
  totalQuestions: nat64,
  correctAnswers: nat64,
  completed: bool,
  startedAt: nat64,
  completedAt: Opt(nat64),
});

const CreateCategoryInput = Record({
  name: text,
  description: text,
  icon: text,
});

const CreateQuestionInput = Record({
  categoryId: text,
  question: text,
  options: Vec(text),
  correctAnswer: text,
  explanation: text,
  difficulty: text,
  points: nat64,
});

const StartQuizInput = Record({
  userId: text,
  categoryId: text,
});

const SubmitAnswerInput = Record({
  sessionId: text,
  questionId: text,
  selectedAnswer: text,
});

const SubmitAnswerResult = Record({
  correct: bool,
  correctAnswer: text,
  explanation: text,
  pointsEarned: nat64,
  totalScore: nat64,
});

// ── State ──────────────────────────────────────────────

let categories = StableBTreeMap<string, typeof QuizCategory>(0);
let questions = StableBTreeMap<string, typeof Question>(1);
let sessions = StableBTreeMap<string, typeof QuizSession>(2);
let categoryQuestions = StableBTreeMap<string, Vec<string>>(3); // categoryId -> questionIds

// ── Canister ───────────────────────────────────────────

export default Canister({
  // ─── Categories ───
  createCategory: Update([CreateCategoryInput], Result(QuizCategory, text), (input) => {
    const id = uuidv4();
    const now = ic.time();
    const category = {
      id,
      name: input.name,
      description: input.description,
      icon: input.icon,
      createdAt: now,
      updatedAt: now,
    };
    categories.insert(id, category);
    return Result.Ok(category);
  }),

  getCategory: Query([text], Result(QuizCategory, text), (id) => {
    const category = categories.get(id);
    if (category === null) {
      return Result.Err('Category not found');
    }
    return Result.Ok(category);
  }),

  getAllCategories: Query([], Vec(QuizCategory), () => {
    return categories.values();
  }),

  // ─── Questions ───
  createQuestion: Update([CreateQuestionInput], Result(Question, text), (input) => {
    // Validate category exists
    if (categories.get(input.categoryId) === null) {
      return Result.Err('Category not found');
    }

    const id = uuidv4();
    const now = ic.time();
    const question = {
      id,
      categoryId: input.categoryId,
      question: input.question,
      options: input.options,
      correctAnswer: input.correctAnswer,
      explanation: input.explanation,
      difficulty: input.difficulty,
      points: input.points,
      createdAt: now,
      updatedAt: now,
    };

    questions.insert(id, question);

    // Link question to category
    const existing = categoryQuestions.get(input.categoryId);
    const updated = existing ? [...existing, id] : [id];
    categoryQuestions.insert(input.categoryId, updated);

    return Result.Ok(question);
  }),

  getQuestionsByCategory: Query([text], Result(Vec(Question), text), (categoryId) => {
    if (categories.get(categoryId) === null) {
      return Result.Err('Category not found');
    }
    const questionIds = categoryQuestions.get(categoryId) || [];
    const result = questionIds
      .map((qid) => questions.get(qid))
      .filter((q): q is typeof Question => q !== null);
    return Result.Ok(result);
  }),

  getQuestion: Query([text], Result(Question, text), (id) => {
    const question = questions.get(id);
    if (question === null) {
      return Result.Err('Question not found');
    }
    return Result.Ok(question);
  }),

  getAllQuestions: Query([], Vec(Question), () => {
    return questions.values();
  }),

  // ─── Quiz Sessions ───
  startQuiz: Update([StartQuizInput], Result(QuizSession, text), (input) => {
    // Verify category has questions
    const questionIds = categoryQuestions.get(input.categoryId);
    if (!questionIds || questionIds.length === 0) {
      return Result.Err('No questions available in this category');
    }

    const id = uuidv4();
    const now = ic.time();
    const session = {
      id,
      userId: input.userId,
      categoryId: input.categoryId,
      score: 0n,
      totalQuestions: BigInt(questionIds.length),
      correctAnswers: 0n,
      completed: false,
      startedAt: now,
      completedAt: Opt.None,
    };

    sessions.insert(id, session);
    return Result.Ok(session);
  }),

  submitAnswer: Update([SubmitAnswerInput], Result(SubmitAnswerResult, text), (input) => {
    const session = sessions.get(input.sessionId);
    if (session === null) {
      return Result.Err('Quiz session not found');
    }
    if (session.completed) {
      return Result.Err('Quiz session already completed');
    }

    const question = questions.get(input.questionId);
    if (question === null) {
      return Result.Err('Question not found');
    }

    const correct = input.selectedAnswer === question.correctAnswer;
    const pointsEarned = correct ? question.points : 0n;

    // Update session
    const updatedSession = {
      ...session,
      score: session.score + pointsEarned,
      correctAnswers: session.correctAnswers + (correct ? 1n : 0n),
    };
    sessions.insert(input.sessionId, updatedSession);

    return Result.Ok({
      correct,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      pointsEarned,
      totalScore: updatedSession.score,
    });
  }),

  completeQuiz: Update([text], Result(QuizSession, text), (sessionId) => {
    const session = sessions.get(sessionId);
    if (session === null) {
      return Result.Err('Quiz session not found');
    }

    const updated = {
      ...session,
      completed: true,
      completedAt: Opt.Some(ic.time()),
    };
    sessions.insert(sessionId, updated);
    return Result.Ok(updated);
  }),

  getQuizSession: Query([text], Result(QuizSession, text), (id) => {
    const session = sessions.get(id);
    if (session === null) {
      return Result.Err('Session not found');
    }
    return Result.Ok(session);
  }),

  getUserSessions: Query([text], Vec(QuizSession), (userId) => {
    return sessions.values().filter((s) => s.userId === userId);
  }),

  // ─── Seed data (dev helper) ───
  seedCategories: Update([], Vec(QuizCategory), () => {
    const defaults = [
      { name: 'Blockchain Basics', description: 'Learn the fundamentals of blockchain technology', icon: '🔗' },
      { name: 'ICP Fundamentals', description: 'Master the Internet Computer Protocol', icon: '🌐' },
      { name: 'DeFi & Tokenomics', description: 'Understand decentralized finance and tokens', icon: '💰' },
      { name: 'NFTs & Digital Art', description: 'Explore non-fungible tokens and digital ownership', icon: '🎨' },
      { name: 'Web3 Security', description: 'Stay safe in the decentralized web', icon: '🛡️' },
      { name: 'Smart Contracts', description: 'Dive into programmable blockchain contracts', icon: '📝' },
    ];

    const created: typeof QuizCategory[] = [];
    for (const cat of defaults) {
      const result = categories.get(
        // Check if already exists by name
        categories.values().find((c) => c.name === cat.name)?.id || ''
      );
      if (!result) {
        const id = uuidv4();
        const now = ic.time();
        const category = { id, ...cat, createdAt: now, updatedAt: now };
        categories.insert(id, category);
        created.push(category);
      }
    }
    return created;
  }),
});
