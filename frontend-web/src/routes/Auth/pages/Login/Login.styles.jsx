import styled from 'styled-components'
// The landing page owns the public-facing design tokens (Figma file
// 6wb6ON3pKs0TwuKS0cHQTN). Sign-in is the other half of that public surface —
// it reads the same module rather than keeping a second copy of the palette.
import { colors, fonts, media } from '@routes/Home/theme'

export const LoginContainer = styled.div`
  position: relative;
  min-height: 100vh;
  background: ${colors.pageBackground};
  color: ${colors.textPrimary};
  font-family: ${fonts.body};
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
`

// Everything above the decorative ground sits in here. With no header row to
// clear, the padding is symmetrical and the block simply centres in the
// viewport.
export const Stage = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  /* 1240, not 1440: the left column only ever carries a headline, a line of
     copy and the art, so a wider shell just spread the two halves apart and
     left the card stranded against the right edge. */
  max-width: 1240px;
  margin: 0 auto;
  padding: 64px 72px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 56px;
  align-items: center;

  ${media.desktop} {
    padding: 56px 48px;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 40px;
  }

  ${media.tablet} {
    grid-template-columns: minmax(0, 1fr);
    gap: 40px;
    padding: 56px 24px;
  }

  ${media.small} {
    padding: 40px 16px;
  }
`
