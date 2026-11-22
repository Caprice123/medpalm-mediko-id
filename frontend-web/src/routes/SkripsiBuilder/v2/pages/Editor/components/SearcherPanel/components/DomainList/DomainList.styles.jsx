import styled from 'styled-components'

export const AddRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.4rem;
  align-items: start;
`

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`

export const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem 0.35rem 0.65rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  background: var(--color-surface);
`

export const Domain = styled.span`
  flex: 1;
  font-size: 0.8rem;
  color: var(--color-gray-700);
  word-break: break-all;
`

export const RemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-gray-400);
  font-size: 0.7rem;
  cursor: pointer;

  &:hover {
    color: var(--color-danger-dark);
    background: var(--color-danger-tint-soft);
  }
`

export const EmptyNote = styled.p`
  font-size: 0.75rem;
  color: var(--color-gray-500);
  margin: 0;
`
