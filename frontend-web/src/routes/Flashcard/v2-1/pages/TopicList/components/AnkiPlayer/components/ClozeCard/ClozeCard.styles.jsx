import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
`

export const Eyebrow = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6BB9E8;
`

export const TextBlock = styled.p`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
  row-gap: 0.5rem;
  font-size: 1.3125rem;
  font-weight: 600;
  color: #111827;
  line-height: 2.4;
  margin: 0;
  text-align: center;
  white-space: pre-wrap;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const Blank = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 0.25rem;
  min-width: 5rem;
  padding: 0.375rem 0;
  margin: 0 0.1875rem;
  border-radius: 8px;
  border: 1.5px solid ${p => (p.$correct ? '#22c55e' : '#ef4444')};
  background: ${p => (p.$correct ? '#f0fdf4' : '#fef2f2')};
  line-height: 1.3;

  @media (max-width: 768px) {
    min-width: 3.75rem;
  }
`

export const CorrectAnswer = styled.span`
  font-size: 1.3125rem;
  font-weight: 700;
  text-align: center;
  padding: 0 0.5rem;
  color: ${p => (p.$correct ? '#15803d' : '#b91c1c')};

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const Divider = styled.span`
  width: 100%;
  height: 0;
  border-top: 1.5px dashed rgba(0, 0, 0, 0.25);
`

export const UserAnswer = styled.span`
  font-size: 1.3125rem;
  font-weight: 700;
  text-align: center;
  padding: 0 0.5rem;
  color: #374151;
  text-decoration: ${p => (p.$correct ? 'none' : 'line-through')};

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const BlankInput = styled.input`
  display: inline-block;
  width: 7rem;
  padding: 0.125rem 0.5rem;
  margin: 0 0.125rem;
  border: none;
  border-bottom: 2px dashed #9ca3af;
  border-radius: 4px 4px 0 0;
  background: #f3f4f6;
  font-size: 1.25rem;
  font-weight: 600;
  font-family: inherit;
  color: #111827;
  text-align: center;

  &:focus {
    outline: none;
    background: #f0f9ff;
    border-bottom: 2px solid #6BB9E8;
  }

  @media (max-width: 768px) {
    width: 5.5rem;
    font-size: 1rem;
  }
`

export const RevealButton = styled.button`
  padding: 0.625rem 1.5rem;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  box-shadow: 0 4px 12px rgba(107, 185, 232, 0.35);

  &:hover { opacity: 0.9; }
`
