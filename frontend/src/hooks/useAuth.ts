import { useState, useCallback, useEffect } from 'react';
import type { AuthStatus, UserProfile } from '@/types';
import { loginWithII, logoutII, checkAuthStatus } from '@/lib/ii-auth';
import { isProduction } from '@/lib/canister.config';

interface AuthState {
  status: AuthStatus;
  user: UserProfile | null;
  principalId: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

// Module-level singleton state
let _status: AuthStatus = 'loading';
let _user: UserProfile | null = null;
let _principalId: string | null = null;
let _listeners: Array<() => void> = [];

function notify() {
  for (const fn of _listeners) fn();
}

/**
 * Create mock user for development
 */
function createMockUser(): UserProfile {
  return {
    id: 'demo-user-1',
    username: 'crypto_learner',
    displayName: 'Crypto Learner',
    email: [],
    avatar: 'https://api.dicebear.com/9.x/thumbs/svg?seed=crypto_learner',
    bio: [],
    principalId: 'principal-mock-dev',
    authProvider: 'internet_identity',
    createdAt: BigInt(Date.now()),
    updatedAt: BigInt(Date.now()),
    isActive: true,
  };
}

/**
 * Check for existing II session on mount
 */
async function initAuthState() {
  try {
    if (isProduction) {
      // Check if already logged in with II
      const result = await checkAuthStatus();
      if (result) {
        _principalId = result.principal;
        _user = {
          id: `user-${result.principal.slice(0, 8)}`,
          username: `learner_${result.principal.slice(0, 6)}`,
          displayName: 'Web3 Learner',
          email: [],
          avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${result.principal}`,
          bio: [],
          principalId: result.principal,
          authProvider: 'internet_identity',
          createdAt: BigInt(Date.now()),
          updatedAt: BigInt(Date.now()),
          isActive: true,
        };
        _status = 'authenticated';
      } else {
        _status = 'unauthenticated';
      }
    } else {
      // Dev mode: check localStorage for mock auth
      const mockAuth = localStorage.getItem('quizfinity_mock_auth');
      if (mockAuth === 'true') {
        _user = createMockUser();
        _principalId = _user.principalId;
        _status = 'authenticated';
      } else {
        _status = 'unauthenticated';
      }
    }
  } catch {
    _status = 'unauthenticated';
  }
  notify();
}

// Initialize on module load
initAuthState();

export function useAuth(): AuthState {
  const [, rerender] = useState(0);

  // Subscribe to changes
  useEffect(() => {
    const listener = () => rerender((n) => n + 1);
    _listeners.push(listener);
    return () => {
      _listeners = _listeners.filter((l) => l !== listener);
    };
  }, []);

  const login = useCallback(async () => {
    _status = 'loading';
    notify();

    try {
      if (isProduction) {
        // Real Internet Identity login
        const result = await loginWithII();
        _principalId = result.principal;
        _user = {
          id: `user-${result.principal.slice(0, 8)}`,
          username: `learner_${result.principal.slice(0, 6)}`,
          displayName: 'Web3 Learner',
          email: [],
          avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${result.principal}`,
          bio: [],
          principalId: result.principal,
          authProvider: 'internet_identity',
          createdAt: BigInt(Date.now()),
          updatedAt: BigInt(Date.now()),
          isActive: true,
        };
        _status = 'authenticated';
      } else {
        // Mock login for development
        await new Promise((r) => setTimeout(r, 500));
        _user = createMockUser();
        _principalId = _user.principalId;
        localStorage.setItem('quizfinity_mock_auth', 'true');
        _status = 'authenticated';
      }
    } catch (error) {
      console.error('Login failed:', error);
      _status = 'unauthenticated';
    }
    notify();
  }, []);

  const logout = useCallback(async () => {
    if (isProduction) {
      await logoutII();
    }
    localStorage.removeItem('quizfinity_mock_auth');
    _status = 'unauthenticated';
    _user = null;
    _principalId = null;
    notify();
  }, []);

  return {
    status: _status,
    user: _user,
    principalId: _principalId,
    login,
    logout,
  };
}
