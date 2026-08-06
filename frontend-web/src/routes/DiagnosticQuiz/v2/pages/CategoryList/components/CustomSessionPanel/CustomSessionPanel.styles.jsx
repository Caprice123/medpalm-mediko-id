import styled from 'styled-components'

export const Footer = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-wrap: wrap;

    > * { flex: 1 1 100%; }
  }
`

export const StartButton = styled.button`
  padding: 0.6rem 1.25rem;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
  box-shadow: 0 4px 14px rgba(107, 185, 232, 0.4);
  &:hover:not(:disabled) { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`
