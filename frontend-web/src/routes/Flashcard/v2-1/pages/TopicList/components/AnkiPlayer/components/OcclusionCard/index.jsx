import { useOcclusionCard } from './hooks/useOcclusionCard'
import {
  Wrapper, ImageBox, RegionOverlay, AnswerInput, AnswerLabel, CorrectAnswer, Divider, UserAnswerText, Hint,
} from './OcclusionCard.styles'

// The revealed answer card is taller (two lines + more padding) than the plain
// input, so it needs more room below to avoid overflowing the image — hence
// separate, stricter threshold before flipping it to sit above the box.
const INPUT_BELOW_MAX_BOTTOM = 85
const ANSWER_BELOW_MAX_BOTTOM = 65

function computePositionStyle(r, belowMaxBottom) {
  const regionBottom = r.y + r.height
  const placeAbove = regionBottom > belowMaxBottom
  return {
    left: `${r.x}%`,
    width: `${r.width}%`,
    ...(placeAbove
      ? { top: `${r.y}%`, transform: 'translateY(calc(-100% - 18px))' }
      : { top: `calc(${regionBottom}% + 18px)` }),
  }
}

const normalize = (value) => (value || '').trim().toLowerCase()

export default function OcclusionCard({ imageUrl, regions, onFullyRevealed }) {
  const { visible, revealRegion, userAnswers, setUserAnswer } = useOcclusionCard({ regions, onFullyRevealed })
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
          if (!visible.includes(r.id)) {
            return (
              <AnswerInput
                key={`${r.id}-input`}
                style={computePositionStyle(r, INPUT_BELOW_MAX_BOTTOM)}
                value={userAnswers[r.id] || ''}
                onChange={e => setUserAnswer(r.id, e.target.value)}
                onClick={e => e.stopPropagation()}
                onKeyDown={e => e.key === 'Enter' && revealRegion(r.id)}
                placeholder="Jawaban Anda..."
                autoComplete="off"
              />
            )
          }

          const isCorrect = normalize(userAnswers[r.id]) === normalize(r.label)
          return (
            <AnswerLabel key={`${r.id}-label`} style={computePositionStyle(r, ANSWER_BELOW_MAX_BOTTOM)} $correct={isCorrect}>
              {isCorrect
                ? <CorrectAnswer $correct>{userAnswers[r.id]}</CorrectAnswer>
                : (
                  <>
                    <CorrectAnswer $correct={false}>{r.label}</CorrectAnswer>
                    <Divider />
                    <UserAnswerText $correct={false}>{userAnswers[r.id] || 'Tidak dijawab'}</UserAnswerText>
                  </>
                )}
            </AnswerLabel>
          )
        })}
      </ImageBox>

      {!allRevealed && <Hint>Klik area pada gambar untuk melihat jawaban</Hint>}
    </Wrapper>
  )
}
