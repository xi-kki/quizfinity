import { describe, it, expect } from 'vitest';
import { getIcon, CATEGORY_ICONS, ACHIEVEMENT_ICONS, TIER_ICONS } from '@/lib/icons';

describe('Icon Registry', () => {
  describe('getIcon', () => {
    it('returns correct category icons', () => {
      expect(getIcon('link')).toBe(CATEGORY_ICONS['link']);
      expect(getIcon('globe')).toBe(CATEGORY_ICONS['globe']);
      expect(getIcon('coins')).toBe(CATEGORY_ICONS['coins']);
      expect(getIcon('palette')).toBe(CATEGORY_ICONS['palette']);
      expect(getIcon('shield')).toBe(CATEGORY_ICONS['shield']);
      expect(getIcon('file-code')).toBe(CATEGORY_ICONS['file-code']);
    });

    it('returns correct achievement icons', () => {
      expect(getIcon('target')).toBe(ACHIEVEMENT_ICONS['target']);
      expect(getIcon('trophy')).toBe(ACHIEVEMENT_ICONS['trophy']);
      expect(getIcon('flame')).toBe(ACHIEVEMENT_ICONS['flame']);
    });

    it('returns correct tier icons', () => {
      expect(getIcon('bronze')).toBe(TIER_ICONS['bronze']);
      expect(getIcon('diamond')).toBe(TIER_ICONS['diamond']);
    });

    it('falls back to Lock for unknown keys', () => {
      const Lock = require('lucide-react').Lock;
      expect(getIcon('nonexistent')).toBe(Lock);
    });
  });
});
