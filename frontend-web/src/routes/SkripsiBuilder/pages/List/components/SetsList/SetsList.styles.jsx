import styled from 'styled-components'

export const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: var(--color-gray-500);
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--color-gray-500);
`

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
`

export const EmptyStateText = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
`

export const SetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const SetCard = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  padding: 1.25rem;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-gray-300);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`

export const SetCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.75rem;
`

export const SetCardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0;
  flex: 1;
`

export const SetDescription = styled.p`
  color: var(--color-gray-500);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.5rem;
`

export const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.75rem;
`

export const CardActionButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-brand-blue);
  background: white;
  color: var(--color-brand-blue);
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--color-brand-blue-tint);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`


export const UpdatedText = styled.div`
  font-size: 0.75rem;
  color: var(--color-gray-400);
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`
