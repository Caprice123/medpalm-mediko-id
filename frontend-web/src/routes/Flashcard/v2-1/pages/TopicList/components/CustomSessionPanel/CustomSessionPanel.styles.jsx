import styled from 'styled-components'

export const StartButton = styled.button`
  padding: 0.6rem 2rem;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s, transform 0.15s;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(107, 185, 232, 0.4);
  letter-spacing: 0.01em;

  &:hover { opacity: 0.92; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
`
