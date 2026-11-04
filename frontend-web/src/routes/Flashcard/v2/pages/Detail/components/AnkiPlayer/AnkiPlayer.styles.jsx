import styled from 'styled-components'

// ── Page Shell ───────────────────────────────────────────────────────────────

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1.5rem;
  background: var(--color-brand-blue-tint);
  min-height: calc(100vh - 44px);

  @media (max-width: 768px) {
    min-height: 100vh;
  }
`

export const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  color: var(--color-gray-500);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;

  &:hover { color: var(--color-brand-blue); }
`

export const DeckContainer = styled.div`
  width: 100%;
  max-width: 720px;
  background: white;
  border-radius: 20px;
  border: 1px solid var(--color-gray-200);
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.07);
  padding: 2rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

// ── Deck Header ───────────────────────────────────────────────────────────────

export const DeckHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`

export const DeckMetaLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-gray-400);
  margin-bottom: 0.25rem;
`

export const DeckTitle = styled.h1`
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 0.25rem;
`

export const DeckSubtags = styled.div`
  font-size: 0.8125rem;
  color: var(--color-gray-400);
`

// ── Stats Row ─────────────────────────────────────────────────────────────────

export const StatsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const CardCounter = styled.div`
  font-size: 0.8125rem;
  color: var(--color-gray-500);

  b { color: var(--color-gray-900); }
`

export const ReviewedCount = styled.div`
  font-size: 0.8125rem;
  color: var(--color-gray-400);
`

// ── Progress ──────────────────────────────────────────────────────────────────

export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: var(--color-gray-100);
  border-radius: 99px;
  overflow: hidden;
`

export const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, var(--color-brand-blue), var(--color-brand-blue-light));
  border-radius: 99px;
  transition: width 0.3s ease;
`

// ── Node Tags ─────────────────────────────────────────────────────────────────

export const NodeTagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const NodeTag = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.3125rem 0.75rem;
  background: var(--color-brand-blue-tint);
  color: var(--color-brand-blue);
  border-radius: 99px;
  border: 1px solid var(--color-brand-blue-tint-strong);
`

// ── Flip Card ─────────────────────────────────────────────────────────────────

export const FlipArea = styled.div`
  width: 100%;
  height: 320px;
  perspective: 1200px;
  cursor: ${p => p.$clickable ? 'pointer' : 'default'};
`

export const FlipCard = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${p => p.$flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`

const CardFaceBase = styled.div`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 12px;
  border: 2px dashed var(--color-gray-300);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.75rem;
  text-align: center;
  overflow: hidden;
  transition: border-color 0.15s;
`

export const CardFront = styled(CardFaceBase)`
  background: white;

  ${FlipArea}:hover & {
    border-color: var(--color-brand-blue-light);
  }
`

export const CardBack = styled(CardFaceBase)`
  background: var(--color-brand-blue-tint);
  transform: rotateY(180deg);
  border-color: var(--color-brand-blue-tint-strong);
`

export const CardLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-brand-blue);
  margin-bottom: 0.625rem;
`

export const CardText = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-900);
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
`

export const CardImage = styled.img`
  display: block;
  max-width: 300px;
  height: 160px;
  object-fit: contain;
  border-radius: 6px;
  margin-top: 0.75rem;
  background: var(--color-gray-100);
  flex-shrink: 0;
`

export const FlipHint = styled.div`
  position: absolute;
  bottom: 0.875rem;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-brand-blue);
  opacity: 0.7;
`

// ── Show Answer Button ────────────────────────────────────────────────────────

export const ShowAnswerBtn = styled.button`
  width: 100%;
  padding: 1rem;
  background: var(--color-brand-blue-deep);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.15s;

  &:hover { background: var(--color-brand-blue); }
`

// ── Rating Buttons ────────────────────────────────────────────────────────────

export const ActionRow = styled.div`
  display: flex;
  gap: 0.75rem;
`

export const RatingBtn = styled.button`
  flex: 1;
  padding: 0.75rem 0.5rem;
  border: 2px solid ${p => p.$color};
  background: white;
  color: ${p => p.$color};
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: ${p => p.$color};
    color: white;
  }
`

// ── Done Screen ───────────────────────────────────────────────────────────────

export const DoneWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  text-align: center;
`

export const DoneBanner = styled.div`
  width: 100%;
  padding: 2.5rem 2rem 2rem;
  background: linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%);
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`

export const DoneIcon = styled.div`
  font-size: 3rem;
  line-height: 1;
`

export const DoneTitle = styled.h2`
  font-size: 1.375rem;
  font-weight: 700;
  color: white;
  margin: 0;
`

export const DoneSub = styled.p`
  font-size: 0.875rem;
  color: rgba(255,255,255,0.8);
  margin: 0;
`

export const DoneBody = styled.div`
  width: 100%;
  padding: 1.75rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  background: white;
  border-radius: 0 0 16px 16px;
  border: 1px solid var(--color-gray-200);
  border-top: none;
`

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  width: 100%;
`

export const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem 0.5rem;
  background: ${p => p.$color}12;
  border: 1.5px solid ${p => p.$color}40;
  border-radius: 12px;
`

export const SummaryValue = styled.span`
  font-size: 1.625rem;
  font-weight: 800;
  color: ${p => p.$color};
`

export const SummaryLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const DoneActions = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;
`

export const DoneSecondaryBtn = styled.button`
  flex: 1;
  padding: 0.875rem;
  background: white;
  color: var(--color-gray-700);
  border: 1.5px solid var(--color-gray-200);
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-color: var(--color-brand-blue);
    color: var(--color-brand-blue);
  }
`

// ── Related Content ───────────────────────────────────────────────────────────

export const RelatedSection = styled.div`
  width: 100%;
  border-top: 1px solid var(--color-gray-200);
  padding-top: 1.25rem;
`

export const RelatedSectionTitle = styled.h3`
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-gray-400);
  margin: 0 0 0.875rem;
  text-align: left;
`

export const RelatedGroup = styled.div`
  margin-bottom: 1rem;

  &:last-child { margin-bottom: 0; }
`

export const RelatedGroupLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${p => p.$type === 'mcq_topic' ? '#7c3aed' : 'var(--color-warning-dark)'};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
`

export const RelatedCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
`

export const RelatedCard = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.125rem;
  background: white;
  border: 1.5px solid var(--color-gray-200);
  border-left: 4px solid ${p => p.$type === 'mcq_topic' ? '#7c3aed' : 'var(--color-warning-dark)'};
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: box-shadow 0.15s, background 0.15s;
  width: 100%;

  &:hover {
    background: ${p => p.$type === 'mcq_topic' ? '#faf5ff' : '#fffbeb'};
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
`

export const RelatedCardTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-900);
  line-height: 1.4;
  flex: 1;
  text-align: left;
`

export const RelatedCardArrow = styled.span`
  font-size: 0.875rem;
  color: var(--color-gray-400);
  flex-shrink: 0;
`
