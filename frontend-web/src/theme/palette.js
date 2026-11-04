// THE single place to adjust the product's colour theme.
//
// Every colour in the app resolves back to this file. Components never write a
// brand/neutral/status hex of their own any more — they use the CSS custom
// properties generated below (`var(--color-brand-blue)`, `var(--color-gray-200)`,
// …), and JS-side tokens (`@config/colors`) read the same values. So changing a
// hex here restyles the whole product, landing page and app alike.
//
// The brand values come from the landing page design (Figma file
// 6wb6ON3pKs0TwuKS0cHQTN, frame 1:2). `routes/Home/theme.js` maps them onto the
// landing page's own naming; `config/colors.jsx` maps them onto the app's
// semantic tokens. Neither holds hex values of its own.
export const palette = {
  // ---------------------------------------------------------------- brand
  // Blue — the primary action colour.
  brandBlue: '#1e73aa',             // main: buttons, links, active states
  brandBlueLight: '#2e8fc2',        // lighter accents, gradient end
  brandBlueMid: '#2682b7',          // hover on a blue surface
  brandBlueDeep: '#044a77',         // pressed/dark variants, dark headings
  brandBlueTint: '#eaf8ff',         // lightest blue wash (hover backgrounds)
  brandBlueTintStrong: '#c5ebff',   // blue badge/border tint

  // Green — the secondary/success colour.
  brandGreen: '#7cb342',            // main green
  brandGreenDark: '#699a3d',        // darker green (badges, solid fills)
  brandGreenDarker: '#3f6b1f',      // green text/icons on a green tint
  brandGreenTint: '#e7f5e2',        // light green wash
  brandGreenTintStrong: '#cfe6bf',  // green badge/border tint

  // -------------------------------------------------------------- surface
  surface: '#ffffff',               // cards, panels, modals
  surfacePage: '#f6fafb',           // landing page background
  // The app sits on the same near-white as the landing page rather than on a
  // stronger blue: every card and panel is `surface` white, and a tinted page
  // behind them is what gives them an edge without a border or shadow. Pure
  // white here would flatten that separation; a saturated blue is too loud to
  // read against all day.
  surfaceApp: '#f6fafb',

  // ------------------------------------------------------- neutral ramp
  // A single cool grey ramp. The app previously mixed Tailwind's `gray` and
  // `slate` ramps; both now resolve here so greys stay consistent.
  gray50: '#f6fafb',
  gray100: '#eff3f5',
  gray200: '#e7ecef',
  gray300: '#dde3e6',
  gray400: '#8c99a2',
  gray500: '#5c6b74',
  gray600: '#3d5a68',
  gray700: '#2c3b45',
  gray800: '#15242e',
  gray900: '#0b1419',

  // The boundary colour for interactive surfaces (cards, inputs, pickers).
  // The ramp above cannot draw one: a card is #ffffff on a #f6fafb page, which
  // is 1.05:1, and gray-200 as its border is 1.19:1 — WCAG 1.4.11 asks 3:1 for
  // a boundary that identifies a component. Measured, this value is 3.36:1
  // against the card and 3.19:1 against the page, so it clears on both sides;
  // gray-400 (2.92:1) and gray-300 (1.26:1) clear on neither.
  borderStrong: '#828e96',

  // --------------------------------------------------------------- status
  danger: '#ef4444',
  dangerDark: '#dc2626',
  dangerBorder: '#fca5a5',
  dangerTint: '#fee2e2',
  dangerTintSoft: '#fef2f2',

  warning: '#f59e0b',
  warningLight: '#fbbf24',
  warningDark: '#d97706',
  warningText: '#9d7438',
  warningTint: '#fef3c7',
  warningTintStrong: '#ffdba6',
}

// camelCase key -> `--color-kebab-case` custom property name.
// gray50 -> --color-gray-50, brandBlueTint -> --color-brand-blue-tint
export const toCssVarName = (key) =>
  '--color-' + key.replace(/([A-Z])/g, '-$1').replace(/(\d+)/g, '-$1').toLowerCase()

// The `:root` body injected by GlobalStyles, so the same values are available
// to every stylesheet as `var(--color-…)`.
export const cssVariables = Object.entries(palette)
  .map(([key, value]) => `${toCssVarName(key)}: ${value};`)
  .join('\n    ')

export default palette
