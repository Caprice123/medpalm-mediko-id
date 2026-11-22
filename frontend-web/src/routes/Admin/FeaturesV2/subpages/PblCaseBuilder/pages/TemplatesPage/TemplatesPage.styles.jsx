import styled from 'styled-components'

export const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
`

export const Heading = styled.div``

export const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-800);
  margin: 0 0 0.25rem;
`

export const Hint = styled.p`
  font-size: 0.75rem;
  color: var(--color-gray-500);
  margin: 0;
  max-width: 48ch;
`

export const SectionChips = styled.span`
  font-size: 0.78rem;
  color: var(--color-gray-500);
  word-break: break-word;
`



export const ActionGroup = styled.div`
  display: inline-flex;
  gap: 0.375rem;
`

export const LoadMoreRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`
