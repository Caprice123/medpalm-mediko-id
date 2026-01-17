import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  max-width: 800px;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const Badge = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  background: ${props => props.primary ? colors.primary.main : colors.secondary.main};
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const DiagnosisCard = styled.div`
  background: ${colors.neutral.gray50};
  border: 1px solid ${colors.neutral.gray200};
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  font-size: 0.9375rem;
  color: ${colors.text.primary};
  line-height: 1.6;
  min-height: 60px;
  display: flex;
  align-items: center;
`

export const DiagnosisList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const DiagnosisItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: ${colors.neutral.gray50};
  border: 1px solid ${colors.neutral.gray200};
  border-radius: 8px;
  padding: 1rem 1.25rem;
`

export const DiagnosisNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${colors.primary.main};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
`

export const DiagnosisText = styled.div`
  flex: 1;
  font-size: 0.9375rem;
  color: ${colors.text.primary};
  line-height: 1.6;
  padding-top: 0.25rem;
`
