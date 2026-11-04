import styled from 'styled-components'
import { colors } from '@config/colors'

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

export const CalculatorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const CalculatorCard = styled.div`
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

export const CalculatorCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.75rem;
`

export const CalculatorCardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0;
  flex: 1;
`

export const CalculatorDescription = styled.p`
  color: var(--color-gray-500);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
`

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;

  ${props => props.kategori && `
    background: var(--color-brand-blue-tint);
    color: ${colors.primary.dark};
    border: 1px solid ${colors.primary.main};
  `}
`

export const CalculatorStats = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-gray-200);
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin-bottom: 0.75rem;
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const StatLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-gray-400);
  text-transform: uppercase;
  font-weight: 600;
`

export const StatValue = styled.span`
  font-size: 0.875rem;
  color: var(--color-gray-700);
  font-weight: 700;
`

export const SelectButton = styled.button`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid ${colors.primary.main};
  background: white;
  color: ${colors.primary.dark};
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: all 0.2s;

  &:hover {
    background: var(--color-brand-blue-tint);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
