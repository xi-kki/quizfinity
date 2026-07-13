/**
 * Canister Configuration
 * 
 * Set CANISTER_ID_* env vars for production.
 * Falls back to mock mode when canister IDs are not set.
 */

export const CANISTER_IDS = {
  quizEngine: import.meta.env.VITE_CANISTER_ID_QUIZ_ENGINE || '',
  scoring: import.meta.env.VITE_CANISTER_ID_SCORING || '',
  user: import.meta.env.VITE_CANISTER_ID_USER || '',
};

export const ICP_NETWORK = {
  host: import.meta.env.VITE_ICP_HOST || 'https://icp0.io',
  identityProvider: import.meta.env.VITE_II_PROVIDER || 'https://identity.ic0.app',
};

export const isLocal = import.meta.env.DEV && !CANISTER_IDS.quizEngine;
export const isProduction = !!CANISTER_IDS.quizEngine;
