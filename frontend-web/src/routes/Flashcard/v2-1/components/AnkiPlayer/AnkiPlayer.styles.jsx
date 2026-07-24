import styled from 'styled-components'

export const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
`

export const DeckContainer = styled.div`
  width: 100%;
  max-width: 720px;
  background: white;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 48px rgba(0, 0, 0, 0.18);
  padding: 2rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow: hidden;
`

export const DeckHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`

export const DeckTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

export const BackBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  color: #6b7280;
  font-size: 1rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;

  &:hover { background: #fee2e2; color: #ef4444; }
`

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
  background: linear-gradient(90deg, #6BB9E8, #8DC63F);
  border-radius: 99px;
  transition: width 0.3s ease;
`

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
    border-color: #6BB9E8;
  }
`

export const CardBack = styled(CardFaceBase)`
  background: #f0f9ff;
  transform: rotateY(180deg);
  border-color: #bae6fd;
`

export const CardLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6BB9E8;
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

export const CardNodePath = styled.div`
  position: absolute;
  top: 0.875rem;
  left: 0.875rem;
  right: 3rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const NewBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #dcfce7;
  color: #16a34a;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.5rem;
  border-radius: 99px;
  border: 1px solid #86efac;
  pointer-events: none;
`

export const FlipHint = styled.div`
  position: absolute;
  bottom: 0.875rem;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6BB9E8;
  letter-spacing: 0.01em;
`

export const ShowAnswerBtn = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
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
  transition: opacity 0.15s;
  box-shadow: 0 4px 12px rgba(107, 185, 232, 0.35);

  &:hover { opacity: 0.9; }
`

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

  &:hover:not(:disabled) {
    background: ${p => p.$color};
    color: white;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`
