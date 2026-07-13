/**
 * Internet Identity Authentication
 * 
 * Uses @dfinity/auth-client for passwordless WebAuthn auth.
 * Falls back to mock auth in development without II.
 */

import { AuthClient } from '@dfinity/auth-client';
import { ICP_NETWORK } from './canister.config';

let authClient: AuthClient | null = null;

export interface IIAuthResult {
  principal: string;
  identity: any;
}

/**
 * Initialize the auth client (call once on app load)
 */
export async function initAuth(): Promise<AuthClient> {
  if (authClient) return authClient;
  
  authClient = await AuthClient.create({
    idleOptions: {
      disableIdle: true,
    },
  });
  
  return authClient;
}

/**
 * Login with Internet Identity
 */
export async function loginWithII(): Promise<IIAuthResult> {
  const client = await initAuth();
  
  return new Promise((resolve, reject) => {
    client.login({
      identityProvider: ICP_NETWORK.identityProvider,
      onSuccess: () => {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal().toText();
        resolve({ principal, identity });
      },
      onError: (error) => {
        reject(new Error(`Internet Identity login failed: ${error}`));
      },
    });
  });
}

/**
 * Check if user is already authenticated
 */
export async function checkAuthStatus(): Promise<IIAuthResult | null> {
  const client = await initAuth();
  
  const isAuthenticated = await client.isAuthenticated();
  if (isAuthenticated) {
    const identity = client.getIdentity();
    const principal = identity.getPrincipal().toText();
    return { principal, identity };
  }
  
  return null;
}

/**
 * Logout
 */
export async function logoutII(): Promise<void> {
  const client = await initAuth();
  await client.logout();
  authClient = null;
}
