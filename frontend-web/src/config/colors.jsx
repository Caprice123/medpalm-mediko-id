// Semantic colour tokens for the app (everything behind PrivateRoute).
//
// This file holds no hex values of its own — it only gives the shared palette
// in `theme/palette.js` app-specific names. To change a colour, edit the
// palette, not this file. New tokens must be built from `palette` too.
//
// Styles that just need a colour should prefer the CSS custom properties the
// palette generates (`var(--color-brand-blue)`); these JS tokens exist for the
// places that need a real hex string (chart libraries, canvas, defaults).
import { palette } from '../theme/palette'

export const colors = {
  // Primary - brand blue, the main action colour
  primary: {
    main: palette.brandBlue,
    light: palette.brandBlueLight,
    dark: palette.brandBlueDeep,
    hover: palette.brandBlueMid,
  },

  // Gradient - mirrors the landing CTA gradient (blue -> lighter blue)
  gradient: {
    start: palette.brandBlue,
    end: palette.brandBlueLight,
    light1: palette.brandBlueTintStrong,
    light2: palette.brandGreenTint,
  },

  // Secondary - brand green
  secondary: {
    main: palette.brandGreen,
    light: palette.brandGreenTint,
    dark: palette.brandGreenDark,
  },

  // Accent - complementary blues
  accent: {
    main: palette.brandBlueLight,
    light: palette.brandBlueTintStrong,
    dark: palette.brandBlueDeep,
  },

  // Curio-specific colors
  curio: {
    inputBg: palette.surfacePage,
    inputText: palette.gray800,
    cardBg: palette.surface,
  },

  // OSCE Practice - used to be a standalone cyan theme, now the brand blue so
  // the feature reads as part of the same product as the landing page.
  osce: {
    primary: palette.brandBlue,
    primaryHover: palette.brandBlueDeep,
    primaryLight: palette.brandBlueTint,
    primaryLighter: palette.surfacePage,
    primaryDark: palette.brandBlueDeep,
    // Status badges
    draftBg: '#e0e7ff',       // Indigo-100
    draftText: '#4f46e5',     // Indigo-600
  },

  // Success/Health - brand green
  success: {
    main: palette.brandGreen,
    light: palette.brandGreenTintStrong,
    lighter: palette.brandGreenTint,
    dark: palette.brandGreenDark,
    darker: palette.brandGreenDarker,
  },

  // Warning - amber
  warning: {
    main: palette.warning,
    light: palette.warningLight,
    dark: palette.warningDark,
  },

  // Error - red
  error: {
    main: palette.danger,
    light: palette.dangerBorder,
    lighter: palette.dangerTintSoft,
    dark: palette.dangerDark,
  },

  // Neutral/Gray scale
  neutral: {
    white: palette.surface,
    gray50: palette.gray50,
    gray100: palette.gray100,
    gray200: palette.gray200,
    gray300: palette.gray300,
    gray400: palette.gray400,
    gray500: palette.gray500,
    gray600: palette.gray600,
    gray700: palette.gray700,
    gray800: palette.gray800,
    gray900: palette.gray900,
    black: '#000000',
  },

  // Background colors
  background: {
    default: palette.surfaceApp,
    paper: palette.surface,
    dark: palette.gray800,
    lightGradient: `linear-gradient(135deg, ${palette.brandBlueTint} 0%, ${palette.surfacePage} 100%)`,
  },

  // Text colors
  text: {
    primary: palette.gray800,
    secondary: palette.gray600,
    disabled: palette.gray400,
    inverse: palette.surface,
  },
}

export default colors
