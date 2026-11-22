import styled from 'styled-components'

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  padding: 1.1rem;
`

export const MemberRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) auto;
  gap: 0.5rem;
  align-items: start;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export const RemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  margin-top: 0.1rem;
  border-radius: 8px;
  border: 1px solid var(--color-gray-200);
  background: var(--color-surface);
  color: var(--color-gray-500);
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: var(--color-danger-border);
    color: var(--color-danger-dark);
  }
`

export const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const FieldLabel = styled.p`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-gray-700);
  margin: 0 0 0.35rem;
`

export const FieldHint = styled.p`
  font-size: 0.75rem;
  color: var(--color-gray-500);
  margin: 0.4rem 0 0;
`
