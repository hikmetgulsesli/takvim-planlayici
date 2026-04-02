import { describe, it, expect } from 'vitest';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, TRANSITIONS, Z_INDEX } from './constants';

describe('Design Tokens', () => {
  describe('COLORS', () => {
    it('should export COLORS object', () => {
      expect(COLORS).toBeDefined();
      expect(typeof COLORS).toBe('object');
    });

    it('should have surface colors', () => {
      expect(COLORS.surface).toBe('#131315');
      expect(COLORS.surfaceContainer).toBe('#201f21');
      expect(COLORS.background).toBe('#131315');
    });

    it('should have primary colors', () => {
      expect(COLORS.primary).toBe('#a8e8ff');
      expect(COLORS.primaryContainer).toBe('#00d4ff');
      expect(COLORS.onPrimary).toBe('#003642');
    });

    it('should have secondary colors', () => {
      expect(COLORS.secondary).toBe('#e2b6ff');
      expect(COLORS.secondaryContainer).toBe('#8900d5');
    });

    it('should have error colors', () => {
      expect(COLORS.error).toBe('#ffb4ab');
      expect(COLORS.errorContainer).toBe('#93000a');
    });

    it('should have event colors', () => {
      expect(COLORS.eventBlue).toBeDefined();
      expect(COLORS.eventPurple).toBeDefined();
      expect(COLORS.eventGreen).toBeDefined();
      expect(COLORS.eventOrange).toBeDefined();
      expect(COLORS.eventRed).toBeDefined();
      expect(COLORS.eventPink).toBeDefined();
    });
  });

  describe('SPACING', () => {
    it('should export SPACING object', () => {
      expect(SPACING).toBeDefined();
    });

    it('should have spacing values', () => {
      expect(SPACING.xs).toBe('0.25rem');
      expect(SPACING.sm).toBe('0.5rem');
      expect(SPACING.md).toBe('1rem');
      expect(SPACING.lg).toBe('1.5rem');
      expect(SPACING.xl).toBe('2rem');
    });
  });

  describe('TYPOGRAPHY', () => {
    it('should export TYPOGRAPHY object', () => {
      expect(TYPOGRAPHY).toBeDefined();
    });

    it('should have font families', () => {
      expect(TYPOGRAPHY.fontFamily.headline).toContain('Space Grotesk');
      expect(TYPOGRAPHY.fontFamily.body).toContain('Be Vietnam Pro');
    });

    it('should have font sizes', () => {
      expect(TYPOGRAPHY.fontSize.xs).toBe('0.75rem');
      expect(TYPOGRAPHY.fontSize.base).toBe('1rem');
      expect(TYPOGRAPHY.fontSize.xl).toBe('1.25rem');
    });

    it('should have font weights', () => {
      expect(TYPOGRAPHY.fontWeight.normal).toBe(400);
      expect(TYPOGRAPHY.fontWeight.bold).toBe(700);
    });
  });

  describe('BORDER_RADIUS', () => {
    it('should export BORDER_RADIUS object', () => {
      expect(BORDER_RADIUS).toBeDefined();
    });

    it('should have border radius values', () => {
      expect(BORDER_RADIUS.sm).toBe('0.25rem');
      expect(BORDER_RADIUS.lg).toBe('0.5rem');
      expect(BORDER_RADIUS.xl).toBe('0.75rem');
      expect(BORDER_RADIUS.full).toBe('9999px');
    });
  });

  describe('SHADOWS', () => {
    it('should export SHADOWS object', () => {
      expect(SHADOWS).toBeDefined();
    });

    it('should have shadow values', () => {
      expect(SHADOWS.sm).toBeDefined();
      expect(SHADOWS.md).toBeDefined();
      expect(SHADOWS.lg).toBeDefined();
      expect(SHADOWS.primary).toBeDefined();
    });
  });

  describe('TRANSITIONS', () => {
    it('should export TRANSITIONS object', () => {
      expect(TRANSITIONS).toBeDefined();
    });

    it('should have transition values', () => {
      expect(TRANSITIONS.fast).toBe('150ms ease-in-out');
      expect(TRANSITIONS.DEFAULT).toBe('200ms ease-in-out');
      expect(TRANSITIONS.slow).toBe('300ms ease-in-out');
    });
  });

  describe('Z_INDEX', () => {
    it('should export Z_INDEX object', () => {
      expect(Z_INDEX).toBeDefined();
    });

    it('should have z-index values', () => {
      expect(Z_INDEX.modal).toBe(1400);
      expect(Z_INDEX.toast).toBe(1700);
      expect(Z_INDEX.tooltip).toBe(1800);
    });
  });
});
