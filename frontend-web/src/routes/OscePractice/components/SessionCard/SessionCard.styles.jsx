import styled from 'styled-components'
import { colors } from '@config/colors'

export const Card = styled.div`
  background: ${colors.neutral.white};
  border: 1px solid ${colors.neutral.gray200};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: ${colors.osce.primary};
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.1);
    transform: translateY(-2px);
  }
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`

export const TopicInfo = styled.div`
  flex: 1;
`

export const TopicTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.neutral.gray900};
  margin: 0 0 0.5rem 0;
`

export const TopicDescription = styled.p`
  font-size: 0.875rem;
  color: ${colors.neutral.gray600};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const DateBadge = styled.div`
  background: ${colors.neutral.gray100};
  color: ${colors.neutral.gray700};
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
`

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: ${colors.neutral.gray50};
  border-radius: 8px;
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const StatLabel = styled.span`
  font-size: 0.75rem;
  color: ${colors.neutral.gray500};
  font-weight: 600;
  text-transform: uppercase;
`

export const StatValue = styled.span`
  font-size: 1rem;
  color: ${colors.neutral.gray900};
  font-weight: 600;
`

export const ModelBadge = styled.span`
  background: ${colors.osce.primaryLight};
  color: ${colors.osce.primary};
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`

export const CardActions = styled.div`
  display: flex;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid ${colors.neutral.gray200};
`

export const ActionButton = styled.button`
  flex: 1;
  padding: 0.625rem 1rem;
  border: 1px solid ${colors.osce.primary};
  background: ${props => props.primary ? colors.osce.primary : colors.neutral.white};
  color: ${props => props.primary ? colors.neutral.white : colors.osce.primary};
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.primary ? colors.osce.primaryHover : colors.osce.primaryLight};
  }
`


export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
`

export const Tag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background: ${props => props.university ? '#ede9fe' : '#fef3c7'};
  color: ${props => props.university ? '#5b21b6' : '#92400e'};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`

