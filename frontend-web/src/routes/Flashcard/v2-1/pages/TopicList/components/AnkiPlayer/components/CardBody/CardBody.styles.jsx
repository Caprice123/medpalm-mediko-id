import styled from 'styled-components'

export const FlipArea = styled.div`
  width: 100%;
  height: 320px;
  flex-shrink: 0;
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
