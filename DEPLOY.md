# Quizfinity Deployment Guide

## Prerequisites

1. Install dfx (ICP SDK):
```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

2. Node.js 18+

## Step 1: Deploy Backend Canisters

```bash
# Start local replica (for testing)
dfx start --background

# Deploy canisters locally
cd backend
npm install
dfx deploy

# Note the canister IDs from output
```

## Step 2: Deploy to ICP Testnet

```bash
# Create a testnet wallet (if needed)
dfx identity --network testnet get-wallet

# Deploy to testnet
dfx deploy --network testnet

# Copy canister IDs to frontend/.env
```

## Step 3: Deploy Frontend to Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_CANISTER_ID_QUIZ_ENGINE`
   - `VITE_CANISTER_ID_SCORING`
   - `VITE_CANISTER_ID_USER`

## Step 4: Configure Internet Identity

1. Go to https://ii.org
2. Register your app for production
3. Update `VITE_II_PROVIDER` to production II URL

## Local Development

```bash
# Frontend only (mock mode)
cd frontend
npm install
npm run dev

# Full stack (with canisters)
dfx start --background
dfx deploy
cd frontend
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_CANISTER_ID_QUIZ_ENGINE` | Quiz Engine canister ID | (empty = mock mode) |
| `VITE_CANISTER_ID_SCORING` | Scoring canister ID | (empty = mock mode) |
| `VITE_CANISTER_ID_USER` | User canister ID | (empty = mock mode) |
| `VITE_ICP_HOST` | ICP network host | `https://icp0.io` |
| `VITE_II_PROVIDER` | Internet Identity URL | `https://identity.ic0.app` |
