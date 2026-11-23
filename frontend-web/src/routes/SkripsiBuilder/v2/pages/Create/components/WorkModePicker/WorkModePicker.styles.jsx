import styled from 'styled-components'

export const ModeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const ModeCard = styled.button`
  width: 100%;
  text-align: left;
  background: var(--color-surface);
  border: 1.5px solid ${({ $selected }) => ($selected ? 'var(--color-brand-blue)' : 'var(--color-gray-200)')};
  box-shadow: ${({ $selected }) => ($selected ? '0 0 0 3px var(--color-brand-blue-tint)' : 'none')};
  border-radius: 12px;
  padding: 1rem 1.1rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  &:not(:disabled) {
    cursor: pointer;
  }

  &:not(:disabled):hover {
    border-color: var(--color-brand-blue-light);
  }
`

export const ModeHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gray-800);
  margin-bottom: 0.3rem;
`

export const ModeIcon = styled.span`
  display: inline-flex;
  color: var(--color-brand-blue);
  font-size: 0.95rem;
`

export const ModeDescription = styled.p`
  font-size: 0.85rem;
  color: var(--color-gray-500);
  margin: 0;
`
