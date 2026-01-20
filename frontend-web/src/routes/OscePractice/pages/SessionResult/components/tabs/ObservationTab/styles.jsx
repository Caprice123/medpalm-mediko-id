import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

export const ObservationCheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${props => props.checked ? colors.success.lighter || '#d1fae5' : colors.neutral.white};
  border: 2px solid ${props => props.checked ? colors.success.main || '#10b981' : colors.neutral.gray200};
  border-radius: 8px;
  cursor: default;
  transition: all 0.2s;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: default;
    accent-color: ${colors.success.main || '#10b981'};
  }

  span {
    font-size: 0.875rem;
    color: ${colors.neutral.gray800};
    flex: 1;
  }
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

export const SectionHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.primary.main};
  margin: 2rem 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid ${colors.primary.main};
`

export const Divider = styled.hr`
  border: none;
  height: 2px;
  background: ${colors.neutral.gray300};
  margin: 3rem 0;
`

export const SelectedObservationCard = styled.div`
  background: ${colors.neutral.white};
  border: 2px solid ${colors.primary.main};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

export const SelectedObservationTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.primary.main};
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${colors.neutral.gray200};
`

export const SelectedObservationImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 1rem;
  cursor: pointer;
  border: 1px solid ${colors.neutral.gray300};
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`

export const SelectedObservationText = styled.div`
  background: ${colors.neutral.gray50};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${colors.text.primary};

  strong {
    display: block;
    margin-bottom: 0.5rem;
    color: ${colors.text.primary};
  }

  p {
    margin: 0.5rem 0;
  }

  ul, ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
`

export const InterpretationSection = styled.div`
  background: ${colors.primary.lighter || '#e0f2fe'};
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid ${colors.primary.main};
`

export const InterpretationLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.primary.main};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const InterpretationText = styled.div`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${props => props.hasInterpretation ? colors.text.primary : colors.text.secondary};
  font-style: ${props => props.hasInterpretation ? 'normal' : 'italic'};
  white-space: pre-line;
`
