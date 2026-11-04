import styled from 'styled-components'

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 0.875rem;
  }
`

export const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: var(--color-gray-500);

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const PageButton = styled.button`
  min-width: 36px;
  min-height: 36px;
  padding: 0.375rem 0.625rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--color-gray-300);
  background: ${props => props.active ? 'linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--color-gray-700)'};
  transition: all 0.2s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:hover:not(:disabled) {
    background: ${props => props.active
      ? 'linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%)'
      : 'rgba(30, 115, 170, 0.08)'};
    border-color: ${props => props.active ? 'transparent' : 'var(--color-brand-blue)'};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    min-width: 40px;
    min-height: 40px;
    font-size: 0.9375rem;
  }
`

export const PageEllipsis = styled.span`
  padding: 0.375rem 0.5rem;
  color: var(--color-gray-500);
  font-size: 0.875rem;
`
