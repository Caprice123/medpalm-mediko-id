import styled from 'styled-components'

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
`

export const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.disabled ? '#e5e7eb' : '#0891b2'};
  color: ${props => props.disabled ? '#9ca3af' : 'white'};
  border: none;
  border-radius: 0.375rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #0e7490;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`

export const PageInfo = styled.div`
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
  min-width: 80px;
  text-align: center;
`
