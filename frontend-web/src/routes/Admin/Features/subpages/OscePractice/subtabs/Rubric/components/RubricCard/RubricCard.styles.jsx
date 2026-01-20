import styled from 'styled-components'
import { colors } from '@config/colors'

export const Card = styled.div`
  background: ${colors.neutral.white};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid ${colors.neutral.gray200};
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0;
  flex: 1;
`

export const CardContent = styled.div`
  background: ${colors.neutral.gray50};
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid ${colors.primary.main};
  max-height: 200px;
  overflow: hidden;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${colors.neutral.gray700};
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`

export const CardStats = styled.div`
  display: flex;
  gap: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${colors.neutral.gray200};
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const StatLabel = styled.span`
  font-size: 0.75rem;
  color: ${colors.neutral.gray500};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`

export const StatValue = styled.span`
  font-size: 0.9375rem;
  color: ${colors.text.primary};
  font-weight: 500;
`

export const CardActions = styled.div`
  display: flex;
  gap: 0.75rem;
`

export const CardActionButton = styled.button`
  flex: 1;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${props => props.danger ? `
    background: ${colors.error.lighter || '#fee2e2'};
    color: ${colors.error.main};

    &:hover:not(:disabled) {
      background: ${colors.error.main};
      color: white;
    }
  ` : `
    background: ${colors.primary.lighter || '#e0f2fe'};
    color: ${colors.primary.main};

    &:hover:not(:disabled) {
      background: ${colors.primary.main};
      color: white;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
