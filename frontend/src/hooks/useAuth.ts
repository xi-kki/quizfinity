import { useState, useCallback } from 'react';
import type { AuthStatus, UserProfile } from '@/types';

// Simple auth hook — zero dependencies
// Replace with @dfinity/auth-client + Google OAuth when deployed to ICP

interface AuthState {
  status: AuthStatus;
  user: UserProfile | null;
  principalId: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

// Module-level singleton state (shared across all useAuth callers)
let _status: AuthStatus = 'unauthenticated';
let _user: UserProfile | null = null;
let _principalId: string | null = null;
let _listeners: Array<() => void> = [];

function notify() {
  for (const fn of _listeners) fn();
}

export function useAuth(): AuthState {
  const [, rerender] = useState(0);

  // Subscribe to changes
  if (!_listeners.length || !_listeners.includes(() => rerender((n) => n + 1))) {
    const listener = () => rerender((n) => n + 1);
    _listeners.push(listener);
  }

  const login = useCallback(async () => {
    _status = 'loading';
    notify();

    try {
      // Simulate auth delay
      await new Promise((r) => setTimeout(r, 800));

      // Demo: create or get a mock user
      const mockPrincipal = 'principal-abc123';
      _user = {
        id: 'demo-user-1',
        username: 'crypto_learner',
        displayName: 'Crypto Learner',
        email: [],
        avatar: 'https://api.dicebear.com/9.x/thumbs/svg?seed=crypto_learner',
        bio: [],
        principalId: mockPrincipal,
        authProvider: 'internet_identity',
        createdAt: BigInt(Date.now()),
        updatedAt: BigInt(Date.now()),
        isActive: true,
      };
      _principalId = mockPrincipal;
      _status = 'authenticated';
      notify();
    } catch {
      _status = 'unauthenticated';
      notify();
    }
  }, []);

  const logout = useCallback(() => {
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
