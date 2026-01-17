import styled from 'styled-components'
import { colors } from '@config/colors'

export const ModalContent = styled.div`
  max-height: 70vh;
  overflow-y: auto;
`

export const SearchBox = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${colors.neutral.gray300};
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;

  &:focus {
    outline: none;
    border-color: ${colors.osce.primary};
    box-shadow: 0 0 0 3px ${colors.osce.primaryLight};
  }

  &::placeholder {
    color: ${colors.neutral.gray400};
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

export const TopicCard = styled.button`
  background: ${colors.neutral.white};
  border: 2px solid ${props => props.selected ? colors.osce.primary : colors.neutral.gray200};
  border-radius: 12px;
  padding: 1.25rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &:hover {
    border-color: ${colors.osce.primary};
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.15);
    transform: translateY(-2px);
  }

  ${props => props.selected && `
    background: ${colors.osce.primaryLight};
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.2);
  `}
`

export const TopicHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
`

export const TopicTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.neutral.gray900};
  margin: 0;
  flex: 1;
`

export const SelectionIndicator = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.selected ? colors.osce.primary : colors.neutral.gray300};
  background: ${props => props.selected ? colors.osce.primary : colors.neutral.white};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &::after {
    content: ${props => props.selected ? '"✓"' : '""'};
    color: ${colors.neutral.white};
    font-size: 0.75rem;
    font-weight: 700;
  }
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

export const TopicMeta = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`

export const MetaItem = styled.span`
  font-size: 0.75rem;
  color: ${colors.neutral.gray500};
  display: flex;
  align-items: center;
  gap: 0.375rem;
`

export const ModelBadge = styled.span`
  background: ${colors.osce.primaryLight};
  color: ${colors.osce.primary};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
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
    background: ${colors.osce.primary};
    color: ${colors.neutral.white};
    border: 1px solid ${colors.osce.primary};

    &:hover:not(:disabled) {
      background: ${colors.osce.primaryHover};
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
