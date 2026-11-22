import styled from 'styled-components'

// The same card in both places. As a rail it fills the column beside the
// sheet; as a strip it pins itself to the top of the pane so the outline is
// still reachable from anywhere in a long report.
export const Outline = styled.div`
  ${({ $rail }) => ($rail ? `
    display: flex;
    flex-direction: column;
    min-height: 0;
  ` : `
    position: sticky;
    top: 0;
    z-index: 3;
    margin-bottom: 0.75rem;
  `)}
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(11, 20, 25, 0.04);
  overflow: hidden;
`

// As a rail there is nothing to toggle — the outline is simply there — so the
// same header is rendered as a plain row rather than as a button.
export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.875rem;
  color: var(--color-gray-700);
  font-size: 0.8125rem;
  font-weight: 600;

  svg {
    color: var(--color-gray-400);
  }
`

export const ToggleRow = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.6rem 0.875rem;
  border: none;
  background: var(--color-surface);
  color: var(--color-gray-700);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: var(--color-gray-50);
  }

  svg {
    color: var(--color-gray-400);
  }
`

export const ToggleLabel = styled.span`
  flex: 1;
  text-align: left;
`

export const Count = styled.span`
  color: var(--color-gray-400);
  font-weight: 500;
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  /* As a rail it takes whatever height the column has; as a strip it stops
     well short of filling the pane. */
  ${({ $rail }) => ($rail ? 'flex: 1; min-height: 0;' : 'max-height: 320px;')}
  overflow-y: auto;
  padding: 0.25rem 0.5rem 0.5rem;
  border-top: 1px solid var(--color-gray-200);
`

export const Hint = styled.p`
  margin: 0;
  padding: 0.5rem 0.875rem 0.75rem;
  font-size: 0.6875rem;
  color: var(--color-gray-400);
  border-top: 1px solid var(--color-gray-200);
`
