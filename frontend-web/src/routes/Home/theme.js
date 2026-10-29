// Design tokens for the public landing page.
//
// Extracted from Figma file 6wb6ON3pKs0TwuKS0cHQTN, frame 1:2
// ("Landing Page FIx MedPal.id"). That file defines no Figma Variables, so every
// value below was read off the individual layers — this module is the single
// place those raw hex values live. Styled-components in this route import from
// here instead of hardcoding colours.

export const colors = {
  // Surfaces
  pageBackground: '#f6fafb',
  tickerBackground: '#eaf8ff',
  surface: '#ffffff',
  eyebrowBackground: '#c5ebff',

  // Brand
  brandBlue: '#1e73aa',
  brandBlueLight: '#2e8fc2',
  brandBlueMid: '#2682b7',
  brandBlueDeep: '#044a77',
  brandGreen: '#7cb342',

  // Text
  headingDark: '#15242e',
  headingDarker: '#0e2a38',
  textPrimary: '#111111',
  textSecondary: '#3d5a68',
  textMuted: '#555555',
  textNav: '#2c3b45',

  // Lines
  border: '#e7ecef',
  divider: '#e2ecef',

  // "Kenapa MedPal.id?" numbered cards
  cardNumberBackground: '#e7f5e2',
  cardNumber: '#759963',
  sectionSubheading: '#325871',

  // Body copy in the lower sections (FAQ, testimonials, events, challenges)
  bodyText: '#5c6b74',
  metaText: '#8c99a2',

  // Small surfaces: FAQ toggle chip, testimonial avatar, hairline rules
  chipBackground: '#f4f6f7',
  avatarBackground: '#eef1f3',
  avatarBorder: '#dde3e6',
  hairline: '#eff3f5',

  // Event + Challenge cards
  eventBackground: '#f7fafc',
  cardTitle: '#16211d',
  cardBody: '#56635f',
  freeBadgeBackground: '#699a3d',
  dateBadgeBackground: '#ededed',
  dateBadgeText: '#717171',
  imagePlaceholder: '#eceef2',
  statDivider: '#cfdffa',
  statLabel: '#8a938f',
  statusBadgeBackground: '#ffdba6',
  statusBadgeText: '#9d7438',
}

export const gradients = {
  // Primary call-to-action buttons (hero "Coba Gratis Sekarang", CTA banner)
  cta: `linear-gradient(103deg, ${colors.brandBlue} 0%, ${colors.brandBlueLight} 100%)`,
  // Navbar "Coba Gratis" button — three stops, slightly different angle
  navButton: `linear-gradient(109.6deg, ${colors.brandBlueLight} 0%, ${colors.brandBlueMid} 65%, ${colors.brandBlue} 100%)`,
  // Closing CTA banner — lighter and bluer than the button gradients
  ctaBanner: 'linear-gradient(101.8deg, #58b3e0 0%, #2689c5 100%)',
  // "Free Event" heading, painted onto the text itself
  eventHeading: `linear-gradient(103.36deg, ${colors.brandBlue} 0%, ${colors.brandBlueLight} 100%)`,
}

export const fonts = {
  // Section and hero headings
  heading: "'Baloo 2', system-ui, -apple-system, sans-serif",
  // Wordmark and the running statistics ticker
  display: "'Fredoka', system-ui, -apple-system, sans-serif",
  // Body copy, labels, trust-card figures
  body: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
}

// The design is drawn at a fixed 1440px desktop width. These are the breakpoints
// we scale it down through — Figma provides no mobile frames, so the narrower
// layouts are derived rather than specified.
export const breakpoints = {
  desktop: '1200px',
  tablet: '992px',
  mobile: '768px',
  small: '480px',
}

export const layout = {
  // Figma lays the content out on a 1440px frame with 90px side gutters, so the
  // content column itself is 1260px. ContentWidth adds 24px of inner padding on
  // each side for narrow screens, so its max-width carries that padding on top
  // (1260 + 48) — otherwise every section would sit 24px inside the design.
  maxWidth: '1308px',
  gutter: '90px',

  // The sticky header and the hero's stats ticker. Both are fixed-height, and
  // the hero sizes itself against the pair so that together they fill exactly
  // one screen — so the numbers live here rather than inside one component's
  // own stylesheet, where the hero could not see them.
  headerHeight: '75px',
  tickerHeight: '89px',
}

export const media = {
  desktop: `@media (max-width: ${breakpoints.desktop})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  small: `@media (max-width: ${breakpoints.small})`,
}
