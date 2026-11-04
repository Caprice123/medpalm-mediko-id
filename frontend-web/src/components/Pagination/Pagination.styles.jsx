import styled from 'styled-components'

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`

export const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: ${props => props.$variant === 'admin' ? '6px' : '0.375rem'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  /* Default variant (cyan background) */
  ${props => props.$variant !== 'admin' && `
    background-color: ${props.disabled ? 'var(--color-gray-200)' : 'var(--color-brand-blue-deep)'};
    color: ${props.disabled ? 'var(--color-gray-400)' : 'white'};
    border: none;

    &:hover:not(:disabled) {
      background-color: var(--color-brand-blue-deep);
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  `}

  /* Admin variant (white background with cyan border) */
  ${props => props.$variant === 'admin' && `
    background: white;
    color: var(--color-brand-blue);
    border: 1px solid var(--color-brand-blue);

    &:hover:not(:disabled) {
      background: var(--color-brand-blue);
      color: white;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}
`

export const PageInfo = styled.div`
  color: var(--color-gray-500);
  font-weight: 500;
  font-size: 0.875rem;
  min-width: 100px;
  text-align: center;
`
