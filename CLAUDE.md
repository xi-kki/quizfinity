# Quizfinity — CLAUDE.md

## 🎯 Overview
- **One-liner:** Gamified learn-to-earn quiz platform on ICP — learn Web3, earn rewards, own your progress
- **Type:** Web3 (ICP) + Web2 hybrid
- **Status:** 🟢 Building — MVP Phase 1

## 🏗️ Tech Stack
- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS
- **Backend:** Azle (TypeScript → Wasm canisters on ICP)
- **Identity:** Internet Identity (II) + Google OAuth
- **Hosting:** Vercel (frontend) + ICP mainnet (canisters)
- **Testing:** Vitest + Playwright

## 📁 Structure
```
quizfinity/
├── frontend/              # React SPA
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── lib/           # Utilities, ICP client, API
│   │   ├── hooks/         # Custom React hooks
│   │   └── types/         # TypeScript type definitions
│   └── ...
├── backend/               # ICP canisters (Azle)
│   └── src/
│       ├── quiz_engine/   # Quiz question management
│       ├── scoring/       # Answer validation & XP scoring
│       └── user/          # User profiles & progress
├── .github/workflows/     # CI/CD pipelines
└── ...
```

## 🧠 Architecture
- **Data flow:** User → Internet Identity Login → Browse Quizzes → Submit Answers → Canister Validates → XP + Tokens Awarded → Leaderboard Updated
- **Key modules:**
  1. Quiz Engine Canister — question bank, randomization, category management
  2. Scoring Canister — answer validation, XP calculation, token minting
  3. User Canister — profiles, progress tracking, achievements
  4. Frontend — React SPA with Tailwind, responsive, dark/light mode

## ⚡ Build Phases
- **Phase 1 (Now):** Frontend scaffold + mock quiz flow + GitHub setup
- **Phase 2:** Azle canisters + Internet Identity integration
- **Phase 3:** Token rewards + leaderboards + community quizzes
- **Phase 4:** Deploy to ICP mainnet + Vercel

## 🔐 Security (NON-NEGOTIABLE)
1. NEVER commit .env or canister private keys
2. Validate ALL user inputs on frontend AND backend canisters
3. No console.log in production
4. Handle loading/empty/error states on every page
5. Rate-limit public endpoints
6. Internet Identity handles auth — no custom wallet code

## ✅ Quality Gates Before Ship
- [ ] TypeScript strict mode passes
- [ ] Linter clean (ESLint)
- [ ] Happy path: register → take quiz → see score → view leaderboard
- [ ] Error states don't crash app
- [ ] Mobile responsive
- [ ] README updated

## 🚫 What NOT To Do
- Don't chase edge cases before core flow works
- Don't optimize prematurely (no premature canister splitting)
- Don't write custom auth — use II + Google OAuth libraries
- Don't hardcode canister IDs
- Don't add features outside current phase
