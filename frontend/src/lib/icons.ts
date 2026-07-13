/**
 * Icon registry — maps string keys to Lucide React components.
 * Used by categories, achievements, tiers, and leaderboard.
 */
import {
  Link2,
  Globe,
  Coins,
  Palette,
  Shield,
  FileCode,
  Target,
  BookOpen,
  Trophy,
  CheckCircle,
  Medal,
  Gem,
  Crown,
  Flame,
  Zap,
  Dumbbell,
  Star,
  Lock,
  type LucideIcon,
} from 'lucide-react';

// ── Category Icons ──────────────────────────────────

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'link': Link2,
  'globe': Globe,
  'coins': Coins,
  'palette': Palette,
  'shield': Shield,
  'file-code': FileCode,
};

// ── Achievement Icons ───────────────────────────────

export const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = {
  'target': Target,
  'book-open': BookOpen,
  'trophy': Trophy,
  'check-circle': CheckCircle,
  'medal-bronze': Medal,
  'medal-silver': Medal,
  'medal-gold': Medal,
  'gem': Gem,
  'crown': Crown,
  'flame': Flame,
  'zap': Zap,
  'dumbbell': Dumbbell,
  'star': Star,
};

// ── Tier Icons ──────────────────────────────────────

export const TIER_ICONS: Record<string, LucideIcon> = {
  bronze: Medal,
  silver: Medal,
  gold: Medal,
  platinum: Gem,
  diamond: Crown,
};

// ── Helper ──────────────────────────────────────────

/** Get a Lucide icon by string key, returns Lock as fallback */
export function getIcon(key: string): LucideIcon {
  return CATEGORY_ICONS[key] ?? ACHIEVEMENT_ICONS[key] ?? TIER_ICONS[key] ?? Lock;
}
