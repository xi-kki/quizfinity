import {
  Canister,
  Opt,
  Principal,
  Query,
  Record,
  Result,
  StableBTreeMap,
  Update,
  Vec,
  ic,
  nat64,
  text,
  bool,
} from 'azle';
import { v4 as uuidv4 } from 'uuid';

// ── Types ──────────────────────────────────────────────

const UserProfile = Record({
  id: text,
  username: text,
  displayName: text,
  email: Opt(text),
  avatar: text,
  bio: Opt(text),
  principalId: text,
  authProvider: text, // 'internet_identity' | 'google'
  createdAt: nat64,
  updatedAt: nat64,
  isActive: bool,
});

const UpdateProfileInput = Record({
  displayName: Opt(text),
  avatar: Opt(text),
  bio: Opt(text),
});

// ── State ──────────────────────────────────────────────

let users = StableBTreeMap<string, typeof UserProfile>(0);
let principalIndex = StableBTreeMap<string, string>(1); // principalId -> userId

// ── Canister ───────────────────────────────────────────

export default Canister({
  // ─── User Management ───
  createUser: Update(
    [text, text, text, text, text],
    Result(UserProfile, text),
    (username, displayName, principalId, authProvider, avatar) => {
      // Check if principal already registered
      const existingId = principalIndex.get(principalId);
      if (existingId !== null) {
        const existing = users.get(existingId);
        if (existing) {
          return Result.Ok(existing);
        }
      }

      // Check username uniqueness
      const allUsers = users.values();
      if (allUsers.some((u) => u.username === username)) {
        return Result.Err('Username already taken');
      }

      const id = uuidv4();
      const now = ic.time();
      const profile = {
        id,
        username,
        displayName,
        email: Opt.None,
        avatar,
        bio: Opt.None,
        principalId,
        authProvider,
        createdAt: now,
        updatedAt: now,
        isActive: true,
      };

      users.insert(id, profile);
      principalIndex.insert(principalId, id);

      return Result.Ok(profile);
    },
  ),

  getUser: Query([text], Result(UserProfile, text), (id) => {
    const user = users.get(id);
    if (user === null) {
      return Result.Err('User not found');
    }
    return Result.Ok(user);
  }),

  getUserByPrincipal: Query([text], Result(UserProfile, text), (principalId) => {
    const userId = principalIndex.get(principalId);
    if (userId === null) {
      return Result.Err('User not found for this principal');
    }
    const user = users.get(userId);
    if (user === null) {
      return Result.Err('User not found');
    }
    return Result.Ok(user);
  }),

  updateProfile: Update([text, UpdateProfileInput], Result(UserProfile, text), (userId, input) => {
    const user = users.get(userId);
    if (user === null) {
      return Result.Err('User not found');
    }

    const updated = {
      ...user,
      displayName: input.displayName !== null ? input.displayName : user.displayName,
      avatar: input.avatar !== null ? input.avatar : user.avatar,
      bio: input.bio !== null ? input.bio : user.bio,
      updatedAt: ic.time(),
    } as typeof UserProfile;

    // Handle Opt types properly
    if ('displayName' in input && input.displayName !== null) {
      (updated as any).displayName = input.displayName;
    }
    if ('avatar' in input && input.avatar !== null) {
      (updated as any).avatar = input.avatar;
    }
    if ('bio' in input && input.bio !== null) {
      (updated as any).bio = input.bio;
    }

    users.insert(userId, updated);
    return Result.Ok(updated);
  }),

  deactivateUser: Update([text], Result(UserProfile, text), (userId) => {
    const user = users.get(userId);
    if (user === null) {
      return Result.Err('User not found');
    }
    const updated = { ...user, isActive: false, updatedAt: ic.time() };
    users.insert(userId, updated);
    return Result.Ok(updated);
  }),

  getUserCount: Query([], nat64, () => {
    return BigInt(users.values().length);
  }),

  // ─── Admin ───
  getAllUsers: Query([], Vec(UserProfile), () => {
    return users.values();
  }),
});
