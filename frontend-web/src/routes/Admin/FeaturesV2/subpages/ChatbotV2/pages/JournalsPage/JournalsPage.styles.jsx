import styled from 'styled-components'

export const AddRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  align-items: flex-end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const JournalCard = styled.div`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-gray-200);
  background: var(--color-surface);
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: start;
  opacity: ${props => props.$inactive ? 0.5 : 1};
`

export const JournalName = styled.span`
  flex: 1;
  word-break: break-word;
  color: var(--color-gray-900);
  font-weight: 500;
`
