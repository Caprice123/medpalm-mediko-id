import styled from 'styled-components'

export const AddRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  align-items: flex-end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const DomainCard = styled.div`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-gray-200);
  background: var(--color-surface);
  font-size: 0.8125rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-self: start;
`

export const DomainRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`

export const DomainName = styled.span`
  flex: 1;
  word-break: break-all;
  color: var(--color-gray-900);
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
`

export const JournalRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const JournalLabel = styled.span`
  font-size: 0.7rem;
  color: var(--color-gray-500);
  white-space: nowrap;
`

export const JournalInput = styled.input`
  flex: 1;
  padding: 0.3rem 0.5rem;
  border: 1px solid ${props => props.$invalid ? 'var(--color-danger)' : 'var(--color-gray-200)'};
  border-radius: 6px;
  font-size: 0.75rem;
  color: var(--color-gray-700);
  outline: none;

  &::placeholder {
    color: var(--color-gray-400);
  }

  &:focus {
    border-color: ${props => props.$invalid ? 'var(--color-danger)' : 'var(--color-brand-blue)'};
  }
`

export const FieldError = styled.span`
  font-size: 0.7rem;
  color: var(--color-danger);
`
