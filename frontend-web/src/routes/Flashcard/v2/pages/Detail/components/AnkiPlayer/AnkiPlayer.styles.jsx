import styled from 'styled-components'

// ── Page Shell ───────────────────────────────────────────────────────────────

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1.5rem;
  min-height: 100vh;
  background: #f0fdfa;
`

export const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;

  &:hover { color: #0d9488; }
`

export const DeckContainer = styled.div`
  width: 100%;
  max-width: 720px;
  background: white;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
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
  color: #9ca3af;
  margin-bottom: 0.25rem;
`

export const DeckTitle = styled.h1`
  font-size: 1.375rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem;
`

export const DeckSubtags = styled.div`
  font-size: 0.8125rem;
  color: #9ca3af;
`

// ── Stats Row ─────────────────────────────────────────────────────────────────

export const StatsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const CardCounter = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;

  b { color: #111827; }
`

export const ReviewedCount = styled.div`
  font-size: 0.8125rem;
  color: #9ca3af;
`

// ── Progress ──────────────────────────────────────────────────────────────────

export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #f3f4f6;
  border-radius: 99px;
  overflow: hidden;
`

export const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, #0d9488, #2dd4bf);
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
  background: #f0fdfa;
  color: #0d9488;
  border-radius: 99px;
  border: 1px solid #99f6e4;
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
  border: 2px dashed #d1d5db;
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
    border-color: #2dd4bf;
  }
`

export const CardBack = styled(CardFaceBase)`
  background: #f0fdfa;
  transform: rotateY(180deg);
  border-color: #99f6e4;
`

export const CardLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #0d9488;
  margin-bottom: 0.625rem;
`

export const CardText = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
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
  background: #f3f4f6;
  flex-shrink: 0;
`

export const FlipHint = styled.div`
  position: absolute;
  bottom: 0.875rem;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.75rem;
  color: #0d9488;
  opacity: 0.7;
`

// ── Show Answer Button ────────────────────────────────────────────────────────

export const ShowAnswerBtn = styled.button`
  width: 100%;
  padding: 1rem;
  background: #0f766e;
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

  &:hover { background: #0d9488; }
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
  background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
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
  border: 1px solid #e5e7eb;
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
  color: #6b7280;
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
  color: #374151;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-color: #0d9488;
    color: #0d9488;
  }
`

// ── Related Content ───────────────────────────────────────────────────────────

export const RelatedSection = styled.div`
  width: 100%;
  border-top: 1px solid #e5e7eb;
  padding-top: 1.25rem;
`

export const RelatedSectionTitle = styled.h3`
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9ca3af;
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
  color: ${p => p.$type === 'mcq_topic' ? '#7c3aed' : '#d97706'};
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
  border: 1.5px solid #e5e7eb;
  border-left: 4px solid ${p => p.$type === 'mcq_topic' ? '#7c3aed' : '#d97706'};
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
  color: #111827;
  line-height: 1.4;
  flex: 1;
  text-align: left;
`

export const RelatedCardArrow = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
  flex-shrink: 0;
`
