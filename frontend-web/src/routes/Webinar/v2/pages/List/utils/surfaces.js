// Shared background fragments. Plain strings, no React — kept out of
// List.styles.jsx so that file only ever exports components (react-refresh).

/**
 * The scrim that makes a thumbnail safe to set type over. The billboard lays it
 * across the frame at 100deg; the narrow layout turns it vertical so the text
 * block at the bottom still has a dark ground under it.
 */
export const scrimLayer = (angle = '100deg') => `
  linear-gradient(
    ${angle},
    rgba(4, 74, 119, 0.94) 0%,
    rgba(30, 115, 170, 0.82) 46%,
    rgba(46, 143, 194, 0.38) 100%
  )
`

/** The brand field that stands in wherever a webinar has no thumbnail. */
export const brandField = `
  linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%)
`
