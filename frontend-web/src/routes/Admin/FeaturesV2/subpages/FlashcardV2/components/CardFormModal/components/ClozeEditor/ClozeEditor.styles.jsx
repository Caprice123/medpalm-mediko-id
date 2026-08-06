import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const FieldLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 0.375rem;
`

export const AnswersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const AnswerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  > span {
    flex-shrink: 0;
    min-width: 2.75rem;
    font-family: monospace;
    font-size: 0.8125rem;
    color: #6b7280;
  }

  > div {
    flex: 1;
  }
`
