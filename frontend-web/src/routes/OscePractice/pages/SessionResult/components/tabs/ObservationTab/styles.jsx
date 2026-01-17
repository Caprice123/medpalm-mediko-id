import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

export const GroupSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const GroupTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${colors.primary.main};
`

export const ObservationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const ObservationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.checked ? colors.success.lighter : colors.neutral.gray50};
  border: 1px solid ${props => props.checked ? colors.success.main : colors.neutral.gray200};
  border-radius: 8px;
  transition: all 0.2s ease;
`

export const Checkbox = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${props => props.checked ? colors.success.main : colors.neutral.gray400};
  background: ${props => props.checked ? colors.success.main : 'white'};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;

  &::after {
    content: '✓';
    color: white;
    font-size: 1rem;
    font-weight: 700;
    display: ${props => props.checked ? 'block' : 'none'};
  }
`

export const ObservationContent = styled.div`
  flex: 1;
`

export const ObservationName = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${colors.text.primary};
  margin-bottom: 0.25rem;
`

export const ObservationNotes = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  font-style: italic;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid ${colors.neutral.gray200};
`

export const SummaryCard = styled.div`
  background: ${colors.primary.light};
  border: 1px solid ${colors.primary.main};
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const SummaryText = styled.div`
  font-size: 0.9375rem;
  color: ${colors.text.primary};
  font-weight: 500;
`

export const SummaryCount = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.primary.main};
`
