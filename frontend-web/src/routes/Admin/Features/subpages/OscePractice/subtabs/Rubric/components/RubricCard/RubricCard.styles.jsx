import styled from 'styled-components'
import { colors } from '@config/colors'

export const Card = styled.div`
  background: ${colors.neutral.white};
  border: 1px solid ${colors.neutral.gray200};
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: ${colors.neutral.gray300};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.75rem;
`

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.neutral.gray800};
  margin: 0;
  flex: 1;
  line-height: 1.4;
`

export const CardContent = styled.p`
  color: ${colors.neutral.gray500};
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const CardStats = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${colors.neutral.gray200};
  font-size: 0.875rem;
  color: ${colors.neutral.gray500};
  margin-bottom: 0.75rem;
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const StatLabel = styled.span`
  font-size: 0.75rem;
  color: ${colors.neutral.gray400};
  text-transform: uppercase;
  font-weight: 600;
`

export const StatValue = styled.span`
  font-size: 0.875rem;
  color: ${colors.neutral.gray500};
  font-weight: 600;
`

export const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const CardActionButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.danger ? '#ef4444' : '#3b82f6'};
  background: white;
  color: ${props => props.danger ? '#ef4444' : '#3b82f6'};
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: ${props => props.danger ? '#fef2f2' : '#eff6ff'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
