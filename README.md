# 🧠 Quizfinity

> *Learn Web3. Earn Real Rewards. Own Your Progress.*

**Quizfinity** is a gamified learn-to-earn platform built on the **Internet Computer Protocol (ICP)**. Take quizzes, earn XP, unlock achievements, and compete on the leaderboard — all on-chain, gasless, and verifiable.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Interactive Quizzes** | Bite-sized Web3 topics — Blockchain, ICP, DeFi, NFTs, Security, Smart Contracts |
| ⚡ **XP & Rewards** | Earn XP for correct answers, build streaks for bonus points |
| 🏆 **Leaderboard** | Compete with other learners globally |
| 🎖️ **Achievements** | Unlock 13+ achievements as you progress |
| 🗂️ **5 Tier System** | Bronze → Silver → Gold → Platinum → Diamond |
| 🔐 **Internet Identity** | Passwordless, secure Web3 authentication |
| 🌐 **100% On-Chain** | Built on ICP — tamperproof, gasless, decentralized |

## 🎮 How It Works

```
Sign In → Browse Categories → Take Quiz → Earn XP → Unlock Achievements → Climb Leaderboard
```

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + TypeScript + Tailwind CSS |
| **Backend** | Azle (TypeScript → Wasm canisters on ICP) |
| **Identity** | Internet Identity + Google OAuth |
| **Storage** | Canister stable memory on ICP |
| **CI/CD** | GitHub Actions + Vercel |

### ICP Superpowers

- **Zero Gas Fees** — Users never pay transaction costs
- **On-Chain Data** — All progress verifiable and tamperproof
- **Internet Identity** — Secure, anonymous, passwordless auth
- **Full-Stack Decentralized** — No centralized backend infrastructure

## 📁 Project Structure

```
quizfinity/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Route pages
│   │   ├── lib/                 # ICP client & mock API
│   │   ├── hooks/               # Custom React hooks
│   │   └── types/               # TypeScript definitions
│   ├── package.json
│   └── vite.config.ts
├── backend/                     # ICP canisters (Azle)
│   ├── src/
│   │   ├── quiz_engine/         # Quiz question management
│   │   ├── scoring/             # XP, tiers, leaderboard
│   │   └── user/                # Profiles & auth
│   ├── dfx.json
│   └── package.json
├── .github/workflows/           # CI/CD pipelines
├── CLAUDE.md                    # AI rules file
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn
- [dfx](https://internetcomputer.org/docs/current/developer-docs/setup/install/) (for canister deployment)

### Local Development (Frontend Only)

```bash
# Install dependencies
cd frontend
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:5173` with mock data — no ICP setup needed for frontend development.

### Full Stack (with ICP canisters)

```bash
# Install dfx
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Start local replica
dfx start --background

# Deploy canisters
cd backend
npm install
dfx deploy

# Start frontend (connects to local canisters)
cd frontend
npm install
npm run dev
```

## 🧪 Available Quizzes

| Category | Description | Questions |
|----------|-------------|-----------|
| 🔗 Blockchain Basics | Learn blockchain fundamentals | 3 |
| 🌐 ICP Fundamentals | Master the Internet Computer | 2 |
| 💰 DeFi & Tokenomics | Decentralized finance explained | 1 |
| 🎨 NFTs & Digital Art | Digital ownership on-chain | 1 |
| 🛡️ Web3 Security | Stay safe in Web3 | Coming soon |
| 📝 Smart Contracts | Programmable blockchain contracts | Coming soon |

## 📊 Tier System

| Tier | XP Required |
|------|------------|
| 🥉 Bronze | 0+ |
| 🥈 Silver | 1,000+ |
| 🥇 Gold | 10,000+ |
| 💎 Platinum | 50,000+ |
| 👑 Diamond | 100,000+ |

## 🛡️ Security

- All user data stored on ICP canisters (tamperproof)
- Authentication via Internet Identity (no passwords stored)
- No private keys or secrets in codebase
- Input validation on both frontend and canister level
- CI/CD includes Gitleaks secret scanning

## 🗺️ Roadmap

- [x] Frontend scaffold (React + Vite + Tailwind)
- [x] Mock API layer for local development
- [x] Quiz gameplay loop (start → answer → score → complete)
- [ ] Azle canister deployment to ICP testnet
- [ ] Internet Identity integration
- [ ] Real-time leaderboard updates
- [ ] $QUIZ token rewards
- [ ] Community-created quizzes
- [ ] NFT badge minting

## 👥 Team

| Role | Name |
|------|------|
| Backend Developer | Mr Daniel |
| Product Manager | Mr Eniola |
| UI/UX Designer | Mr Fuad |
| Frontend Developer | Miss Habiba |
| Web3 Technical Writer / Builder | Mr Isaac |

## 📄 License

MIT

---

<p align="center">Built with ❤️ for the Web3 education revolution. On ICP.</p>
