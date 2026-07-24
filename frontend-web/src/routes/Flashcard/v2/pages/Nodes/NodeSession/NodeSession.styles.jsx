import styled from 'styled-components'

export const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  background: #f9fafb;
`

export const ProgressBar = styled.div`
  width: 100%;
  max-width: 560px;
  margin-bottom: 1.5rem;
`

export const ProgressTrack = styled.div`
  height: 6px;
  background: #e5e7eb;
  border-radius: 99px;
  overflow: hidden;
`

export const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #a78bfa);
  border-radius: 99px;
  transition: width 0.3s ease;
  width: ${p => p.$pct}%;
`

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`

export const CardScene = styled.div`
  width: 100%;
  max-width: 560px;
  height: 320px;
  perspective: 1200px;
  cursor: pointer;
  margin-bottom: 1.75rem;
`

export const CardInner = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${p => p.$flipped ? 'rotateY(180deg)' : 'rotateY(0)'};
`

const CardFace = styled.div`
  position: absolute;
  inset: 0;
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
`

export const CardFront = styled(CardFace)`
  border-top: 4px solid #6366f1;
`

export const CardBack = styled(CardFace)`
  border-top: 4px solid #10b981;
  transform: rotateY(180deg);
`

export const CardLabel = styled.span`
  position: absolute;
  top: 1rem;
  left: 1.25rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${p => p.$back ? '#10b981' : '#6366f1'};
`

export const CardText = styled.p`
  font-size: 1.15rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.5;
  max-width: 100%;
`

export const CardImage = styled.img`
  max-width: 160px;
  max-height: 120px;
  object-fit: contain;
  border-radius: 8px;
`

export const HintText = styled.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin: -0.75rem 0 0;
`

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 560px;
  width: 100%;
`

export const NavBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  font-size: 1.2rem;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover:not(:disabled) { border-color: #a5b4fc; background: #f5f3ff; color: #4f46e5; }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`

export const FlipBtn = styled.button`
  flex: 1;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #6366f1, #818cf8);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover { opacity: 0.9; }
`

export const DoneCard = styled.div`
  text-align: center;
  background: #fff;
  border-radius: 20px;
  padding: 3rem 2.5rem;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

export const DoneTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
`

export const DoneSub = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
`

export const DoneActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`
