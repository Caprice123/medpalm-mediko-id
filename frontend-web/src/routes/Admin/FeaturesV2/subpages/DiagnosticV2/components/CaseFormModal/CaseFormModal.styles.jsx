import styled from 'styled-components'

export const SectionDivider = styled.div`
  border-top: 1px solid var(--color-gray-200);
  margin: 0.5rem 0 1rem;
`

export const SectionHeading = styled.h4`
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 0.25rem;
`

export const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`

export const RowGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const InlineRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`
