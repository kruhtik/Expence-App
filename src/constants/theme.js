// Colors
export const COLORS = {
  // Primary colors
  primary: '#4CAF50',
  primaryLight: '#81C784',
  primaryDark: '#388E3C',
  
  // Accent colors
  accent: '#FFC107',
  
  // Text colors
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#F5F5F5',
  
  // Background colors
  background: '#FFFFFF',
  surface: '#F5F5F5',
  
  // Status colors
  success: '#4CAF50',
  info: '#2196F3',
  warning: '#FFC107',
  error: '#F44336',
  
  // Grayscale
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  lightGray2: '#EEEEEE',
  gray: '#9E9E9E',
  darkGray: '#757575',
  dark: '#212121',
  black: '#000000',
  
  // Transparent
  transparent: 'transparent',
};

// Typography
export const FONTS = {
  // Font sizes
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  h3: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  h5: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
  },
  body3: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  body4: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  body5: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  overline: {
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
};

// Spacing
export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 8,
  padding: 16,
  margin: 16,

  // Font sizes
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  h5: 16,
  h6: 14,
  body1: 16,
  body2: 14,
  body3: 12,
  body4: 10,
};

// App theme
export const appTheme = { COLORS, FONTS, SIZES };

export default appTheme;
