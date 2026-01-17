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

  // OSCE Practice - Cyan theme
  osce: {
    primary: '#06b6d4',       // Cyan-500
    primaryHover: '#0891b2',  // Cyan-600
    primaryLight: '#e0f2fe',  // Cyan-50
    primaryLighter: '#f0fdfa', // Cyan-lighter (active tab)
    primaryDark: '#0e7490',   // Cyan-700
    // Status badges
    draftBg: '#e0e7ff',       // Indigo-100
    draftText: '#4f46e5',     // Indigo-600
  },

  // Success/Health - Green (using brand green)
  success: {
    main: '#8DC63F',      // Brand lime green
    light: '#A8D86A',     // Light green
    lighter: '#dcfce7',   // Green-100 (for badges)
    dark: '#6BA32E',      // Darker green
    darker: '#16a34a',    // Green-600 (for text)
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
    lighter: '#fef2f2',   // Red-50 (for backgrounds)
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
