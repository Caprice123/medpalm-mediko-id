import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.75rem;
`

export const ImageBox = styled.div`
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  line-height: 0;
`

export const RegionOverlay = styled.div`
  position: absolute;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8125rem;
  line-height: normal;
  text-align: center;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.15s;

  ${p => p.$revealed
    ? `
      background: rgba(0, 0, 0, 0.15);
      border: 2px solid #22c55e;
      color: #15803d;
      cursor: default;
    `
    : `
      background: #6BB9E8;
      border: 2px solid #3a8fc9;
      color: white;

      &:hover { background: #5aa8d9; }
    `}
`

export const AnswerInput = styled.input`
  position: absolute;
  box-sizing: border-box;
  padding: 0.5rem 0.75rem;
  border: none;
  border-bottom: 2px dashed #9ca3af;
  border-radius: 6px 6px 0 0;
  background: #f3f4f6;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: normal;
  font-family: inherit;
  color: #111827;
  text-align: center;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:focus {
    outline: none;
    background: #f0f9ff;
    border-bottom: 2px solid #6BB9E8;
  }

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`

export const AnswerLabel = styled.div`
  position: absolute;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 0.25rem;
  line-height: 1.3;
  background: white;
  border: 1.5px solid ${p => (p.$correct ? '#22c55e' : '#ef4444')};
  padding: 0.75rem 0;
  border-radius: 8px;
  text-align: center;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  pointer-events: none;
  z-index: 2;
`

export const CorrectAnswer = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
  padding: 0 0.5rem;
  color: ${p => (p.$correct ? '#15803d' : '#b91c1c')};

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`

export const Divider = styled.span`
  width: 100%;
  height: 0;
  border-top: 1.5px dashed rgba(0, 0, 0, 0.25);
`

export const UserAnswerText = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
  padding: 0 0.5rem;
  color: #374151;
  text-decoration: ${p => (p.$correct ? 'none' : 'line-through')};

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`

export const Hint = styled.div`
  text-align: center;
  font-size: 0.8125rem;
  color: #9ca3af;
`
