import styled from 'styled-components'

export const StartButton = styled.button`
  padding: 0.6rem 1.25rem;
  background: linear-gradient(135deg, #0d9488 0%, #059669 100%);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover:not(:disabled) { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`
