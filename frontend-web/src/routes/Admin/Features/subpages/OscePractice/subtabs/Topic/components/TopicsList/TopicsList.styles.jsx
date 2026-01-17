import styled from 'styled-components'
import { colors } from '@config/colors'

export const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: ${colors.neutral.gray500};
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${colors.neutral.gray500};
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

export const ActionButton = styled.button`
  background: ${colors.osce.primary};
  color: ${colors.neutral.white};
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: ${colors.osce.primaryHover};
  }
`

export const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`
