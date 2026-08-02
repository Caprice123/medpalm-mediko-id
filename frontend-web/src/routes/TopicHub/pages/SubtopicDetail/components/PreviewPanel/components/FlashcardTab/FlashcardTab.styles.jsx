import styled from 'styled-components'

export const PlayerFlipArea = styled.div`
  width: 100%;
  min-height: 200px;
  perspective: 1000px;
  cursor: ${p => p.$clickable ? 'pointer' : 'default'};
`

export const PlayerFlipCard = styled.div`
  width: 100%;
  min-height: 200px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${p => p.$flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`

const PlayerCardFaceBase = styled.div`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 10px;
  border: 2px dashed #d1d5db;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  text-align: center;
  overflow: hidden;
  min-height: 200px;
`

export const PlayerFront = styled(PlayerCardFaceBase)`
  background: #fff;
  ${PlayerFlipArea}:hover & { border-color: #6BB9E8; }
`

export const PlayerBack = styled(PlayerCardFaceBase)`
  background: #f0f9ff;
  transform: rotateY(180deg);
  border-color: #bae6fd;
`

export const PlayerCardLabel = styled.div`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6BB9E8;
  margin-bottom: 0.5rem;
`

export const PlayerCardText = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
`

export const PlayerFlipHint = styled.div`
  position: absolute;
  bottom: 0.75rem;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6BB9E8;
`

export const PlayerActionRow = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const PlayerRatingBtn = styled.button`
  flex: 1;
  padding: 0.625rem 0.25rem;
  border: 2px solid ${p => p.$color};
  background: #fff;
  color: ${p => p.$color};
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) { background: ${p => p.$color}; color: #fff; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

export const PlayerDoneWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
  text-align: center;
`

export const PlayerDoneText = styled.p`
  font-size: 0.9375rem;
  color: #374151;
  margin: 0;
  font-weight: 500;
`
