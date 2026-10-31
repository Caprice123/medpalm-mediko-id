import styled, { keyframes } from 'styled-components'
import { colors } from '@routes/Home/theme'

// Four layers, bottom to top: a mesh of soft colour pools, a hairline grid,
// three slowly drifting blobs, and a grain sheet over all of it. A flat tone —
// or a two-stop diagonal — is what made earlier passes read as a template, so
// none of these is ornament that could be dropped without the ground going
// dead.
export const BackgroundRoot = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
  background: ${colors.pageBackground};
`

// Multi-point pools, not one linear ramp, so the colour has no single
// direction to read as a seam. Every stop is a landing token:
// eyebrowBackground, tickerBackground, cardNumberBackground, and a pale
// brandBlueLight.
export const MeshLayer = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(42% 52% at 10% 6%, rgba(197, 235, 255, 0.95) 0%, rgba(197, 235, 255, 0) 62%),
    radial-gradient(40% 48% at 90% 2%, rgba(234, 248, 255, 0.98) 0%, rgba(234, 248, 255, 0) 60%),
    radial-gradient(48% 58% at 74% 94%, rgba(231, 245, 226, 0.9) 0%, rgba(231, 245, 226, 0) 64%),
    radial-gradient(38% 46% at 2% 90%, rgba(214, 238, 251, 0.85) 0%, rgba(214, 238, 251, 0) 62%);
`

export const GridLayer = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(to right, rgba(30, 115, 170, 0.05) 0 1px, transparent 1px 72px),
    repeating-linear-gradient(to bottom, rgba(30, 115, 170, 0.05) 0 1px, transparent 1px 72px);
  /* Faded out before the edges so the grid reads as texture, not as a table. */
  -webkit-mask-image: radial-gradient(72% 64% at 50% 42%, #000 0%, transparent 100%);
  mask-image: radial-gradient(72% 64% at 50% 42%, #000 0%, transparent 100%);
`

const drift = keyframes`
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  50%  { transform: translate3d(3.5%, -2.5%, 0) scale(1.08); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
`

const Blob = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(72px);
  will-change: transform;
  animation: ${drift} ${(props) => props.$duration} ease-in-out infinite;
  animation-delay: ${(props) => props.$delay || '0s'};

  /* The drift is ambient, not an entrance. Anyone who asked for less motion
     gets the same composition, held still. */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const BlobBlue = styled(Blob)`
  width: 620px;
  height: 620px;
  top: -220px;
  left: -170px;
  opacity: 0.3;
  background: radial-gradient(circle, ${colors.brandBlueLight} 0%, rgba(46, 143, 194, 0) 68%);
`

export const BlobCyan = styled(Blob)`
  width: 470px;
  height: 470px;
  right: 20%;
  top: -170px;
  opacity: 0.26;
  background: radial-gradient(circle, #58b3e0 0%, rgba(88, 179, 224, 0) 68%);
`

export const BlobGreen = styled(Blob)`
  width: 540px;
  height: 540px;
  right: -150px;
  bottom: -200px;
  opacity: 0.24;
  background: radial-gradient(circle, ${colors.brandGreen} 0%, rgba(124, 179, 66, 0) 68%);
`

// Fractal noise as a data URI — no request, and it keeps the pools from looking
// like a sterile CSS gradient. Multiply so it darkens the tint rather than
// washing it out.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"

export const GrainLayer = styled.div`
  position: absolute;
  inset: 0;
  background-image: ${GRAIN};
  background-repeat: repeat;
  opacity: 0.2;
  mix-blend-mode: multiply;
`
