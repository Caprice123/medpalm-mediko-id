import {
  BackgroundRoot,
  MeshLayer,
  GridLayer,
  BlobBlue,
  BlobCyan,
  BlobGreen,
  GrainLayer,
} from './AuroraBackground.styles'

// Purely decorative, so the whole stack is hidden from assistive tech and
// takes no pointer events — the card is the only thing here to use. The
// staggered negative delays mean the three blobs are never in phase.
function AuroraBackground() {
  return (
    <BackgroundRoot aria-hidden="true">
      <MeshLayer />
      <GridLayer />
      <BlobBlue $duration="26s" />
      <BlobCyan $duration="32s" $delay="-8s" />
      <BlobGreen $duration="38s" $delay="-16s" />
      <GrainLayer />
    </BackgroundRoot>
  )
}

export default AuroraBackground
