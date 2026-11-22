import styled from 'styled-components'

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`



export const SectionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`

export const SectionsTitle = styled.p`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-gray-700);
  margin: 0;
`

export const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const SectionRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 0.5rem;
  align-items: center;
`

export const RowActions = styled.div`
  display: inline-flex;
  gap: 0.25rem;
`

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  border: 1px solid var(--color-gray-200);
  background: var(--color-surface);
  color: ${({ $danger }) => ($danger ? 'var(--color-danger-dark)' : 'var(--color-gray-500)')};
  font-size: 0.75rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${({ $danger }) => ($danger ? 'var(--color-danger-border)' : 'var(--color-brand-blue)')};
    color: ${({ $danger }) => ($danger ? 'var(--color-danger-dark)' : 'var(--color-brand-blue)')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`

export const Hint = styled.p`
  font-size: 0.75rem;
  color: var(--color-gray-500);
  margin: 0;
`
