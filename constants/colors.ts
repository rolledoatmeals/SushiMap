// Primary brand palette — never reference hex strings outside this file.
export const Colors = {
  // Brand
  salmon: '#E8553E',
  wasabiGreen: '#4CAF7A',
  offWhite: '#F5EFE0',
  charcoal: '#1A1A1A',

  // Semantic
  openGreen: '#4CAF7A',
  closedRed: '#E85555',

  // Theme-adaptive — use useColors() hook to get the correct variant
  light: {
    surface: '#FFFFFF',
    surface2: '#F5F5F0',
    border: '#E8E8E3',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B6B6B',
    textTertiary: '#ABABAB',
    background: '#F5EFE0',
  },

  dark: {
    surface: '#1A1A1A',
    surface2: '#242424',
    border: '#2E2E2E',
    textPrimary: '#F5EFE0',
    textSecondary: '#9A9A9A',
    textTertiary: '#666666',
    background: '#121212',
  },
} as const;

export type ThemeColors = typeof Colors.light;
