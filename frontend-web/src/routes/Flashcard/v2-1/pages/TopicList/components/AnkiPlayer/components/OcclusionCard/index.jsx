import { useOcclusionCard } from './hooks/useOcclusionCard'
import {
  Wrapper, ImageBox, RegionOverlay, AnswerLabel, RevealButton,
} from './OcclusionCard.styles'

function computePositionStyle(r) {
  const regionBottom = r.y + r.height
  return {
    left: `${r.x}%`,
    width: `${r.width}%`,
    top: `calc(${regionBottom}% + 18px)`,
  }
}

export default function OcclusionCard({ imageUrl, regions, onFullyRevealed }) {
  const { visible, revealRegion, revealAll } = useOcclusionCard({ regions, onFullyRevealed })
  const allRevealed = regions.length > 0 && regions.every(r => visible.includes(r.id))

  return (
    <Wrapper>
      <ImageBox>
        <img src={imageUrl} alt="" style={{ width: '100%', display: 'block' }} />

        {regions.map(r => (
          <RegionOverlay
            key={r.id}
            $revealed={visible.includes(r.id)}
            style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.width}%`, height: `${r.height}%` }}
            onClick={() => revealRegion(r.id)}
          >
            {!visible.includes(r.id) && '?'}
          </RegionOverlay>
        ))}

        {regions.map(r => {
          if (!visible.includes(r.id)) return null

          return (
            <AnswerLabel key={`${r.id}-label`} style={computePositionStyle(r)}>
              {r.label}
            </AnswerLabel>
          )
        })}
      </ImageBox>

      {!allRevealed && <RevealButton onClick={revealAll}>Buka Semua</RevealButton>}
    </Wrapper>
  )
}
