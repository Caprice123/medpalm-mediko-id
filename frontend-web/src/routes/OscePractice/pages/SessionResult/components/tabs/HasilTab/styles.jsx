import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

export const Section = styled.div`
  margin-bottom: 2rem;
`

export const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 1rem 0;
`

export const FeedbackCard = styled.div`
  background: ${colors.background.light};
  border: 1px solid ${colors.border.light};
  border-radius: 8px;
  padding: 1.5rem;
  line-height: 1.6;
  color: ${colors.text.primary};
  white-space: pre-wrap;
  font-size: 0.9375rem;
`

export const ScoreBreakdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

export const BreakdownCard = styled.div`
  background: ${colors.background.light};
  border: 1px solid ${colors.border.light};
  border-radius: 8px;
  padding: 1.25rem;
  text-align: center;
`

export const BreakdownLabel = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-bottom: 0.5rem;
  font-weight: 500;
`

export const BreakdownScore = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${colors.primary.main};
  margin-bottom: 0.25rem;
`

export const BreakdownMax = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.tertiary};
`
