import { create } from 'zustand';
import type { AuthStatus, UserProfile } from '@/types';

// Simple auth store (no zustand dependency — uses React state pattern)
// Replace with actual Internet Identity + Google OAuth when deployed

interface AuthState {
  status: AuthStatus;
  user: UserProfile | null;
  principalId: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

// For dev/demo — stores in memory
// In production, swap for @dfinity/auth-client + Google OAuth
export const useAuth = create<AuthState>((set) => ({
  status: 'unauthenticated',
  user: null,
  principalId: null,

  login: async () => {
    set({ status: 'loading' });
    try {
      // Simulate auth delay
      await new Promise((r) => setTimeout(r, 800));

      // Demo: create or get a mock user
      const mockPrincipal = 'principal-abc123';
      const mockUser: UserProfile = {
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

      set({
        status: 'authenticated',
        user: mockUser,
        principalId: mockPrincipal,
      });
    } catch (err) {
      console.error('Auth error:', err);
      set({ status: 'unauthenticated' });
    }
  },

  logout: () => {
    set({
      status: 'unauthenticated',
      user: null,
      principalId: null,
    });
  },
}));
