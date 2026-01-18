import styled from 'styled-components'
import { colors } from '@config/colors'

export const ModalContent = styled.div`
  max-height: 70vh;
  height: 100%;
  overflow-y: auto;
`

export const SearchWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`

export const SearchBox = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${colors.neutral.gray300};
  border-radius: 8px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 3px ${colors.primary.main};
  }

  &::placeholder {
    color: ${colors.neutral.gray400};
  }
`

export const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${colors.primary.main};
  color: ${colors.neutral.white};
  border: 1px solid ${colors.primary.main};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${colors.primary.main};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const TopicCard = styled.div`
  background: ${colors.neutral.white};
  border: 2px solid ${colors.neutral.gray200};
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

export const StatusBadge = styled.span`
  background: ${props => props.selected ? colors.primary.main : colors.neutral.gray100};
  color: ${props => props.selected ? colors.primary.main : colors.neutral.gray600};
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  white-space: nowrap;
`

export const CardDescription = styled.p`
  color: ${colors.neutral.gray500};
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
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
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background: ${props => props.university ? '#ede9fe' : '#fef3c7'};
  color: ${props => props.university ? '#5b21b6' : '#92400e'};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
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
  border: 1px solid ${props => props.variant === 'primary' ? colors.primary.main : colors.neutral.gray300};
  background: ${props => props.variant === 'primary' ? colors.primary.main : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : colors.neutral.gray700};
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.variant === 'primary' ? colors.primary.main : colors.neutral.gray50};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${colors.neutral.gray200};
`

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;

  ${props => props.variant === 'primary' && `
    background: ${colors.primary.main};
    color: ${colors.neutral.white};
    border: 1px solid ${colors.primary.main};

    &:hover:not(:disabled) {
      background: ${colors.primary.main};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: ${colors.neutral.white};
    color: ${colors.neutral.gray700};
    border: 1px solid ${colors.neutral.gray300};

    &:hover {
      background: ${colors.neutral.gray50};
    }
  `}
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${colors.neutral.gray500};

  p {
    font-size: 1rem;
    margin-top: 0.5rem;
  }
`
