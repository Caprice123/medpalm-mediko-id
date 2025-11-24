// Medical theme color palette - Blue and Green theme
export const colors = {
  // Primary colors - Blue
  primary: {
    main: '#6BB9E8',      // Primary light blue
    light: '#8ECDF0',     // Lighter blue
    dark: '#4A9ED4',      // Darker blue
    hover: '#5AAFE5',     // Blue hover state
  },

  // Gradient colors
  gradient: {
    start: '#6BB9E8',     // Gradient start (light blue)
    end: '#8DC63F',       // Gradient end (lime green)
    light1: '#A8D8F0',    // Light blue for accents
    light2: '#B8E986',    // Light green for accents
  },

  // Secondary colors - Green shades
  secondary: {
    main: '#8DC63F',      // Lime green
    light: '#A8D86A',     // Light green
    dark: '#6BA32E',      // Darker green
  },

  // Accent colors - Complementary
  accent: {
    main: '#4A9ED4',      // Deeper blue
    light: '#8ECDF0',     // Light blue
    dark: '#3B7EAA',      // Dark blue
  },

  // Curio-specific colors
  curio: {
    inputBg: '#F8FAFC',   // Very light gray for input backgrounds
    inputText: '#1E293B', // Dark slate for input text
    cardBg: '#ffffff',    // White for cards
  },

  // Success/Health - Green (using brand green)
  success: {
    main: '#8DC63F',      // Brand lime green
    light: '#A8D86A',     // Light green
    dark: '#6BA32E',      // Darker green
  },

  // Warning - Amber
  warning: {
    main: '#F59E0B',      // Amber-500
    light: '#FBBF24',     // Amber-400
    dark: '#D97706',      // Amber-600
  },

  // Error - Red
  error: {
    main: '#EF4444',      // Red-500
    light: '#F87171',     // Red-400
    dark: '#DC2626',      // Red-600
  },

  // Neutral/Gray scale
  neutral: {
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    black: '#000000',
  },

  // Background colors
  background: {
    default: '#F8FAFC',        // Light slate background
    paper: '#FFFFFF',          // Card/Paper background
    dark: '#0F172A',           // Dark mode background
    lightGradient: 'linear-gradient(135deg, #F0F9FF 0%, #F0FDF4 100%)', // Light blue to green gradient
  },

  // Text colors
  text: {
    primary: '#111827',   // Main text
    secondary: '#6B7280', // Secondary text
    disabled: '#9CA3AF',  // Disabled text
    inverse: '#FFFFFF',   // Text on dark backgrounds
  },
}

export default colors
