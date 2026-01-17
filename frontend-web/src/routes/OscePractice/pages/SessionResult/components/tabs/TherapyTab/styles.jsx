import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

export const TherapyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const TherapyItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: ${colors.neutral.gray50};
  border: 1px solid ${colors.neutral.gray200};
  border-radius: 8px;
  padding: 1rem 1.25rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.primary.main};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`

export const TherapyNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${colors.secondary.main};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
`

export const TherapyText = styled.div`
  flex: 1;
  font-size: 0.9375rem;
  color: ${colors.text.primary};
  line-height: 1.6;
  padding-top: 0.25rem;
`

export const SummaryCard = styled.div`
  background: ${colors.secondary.light};
  border: 1px solid ${colors.secondary.main};
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
  color: ${colors.secondary.main};
`
