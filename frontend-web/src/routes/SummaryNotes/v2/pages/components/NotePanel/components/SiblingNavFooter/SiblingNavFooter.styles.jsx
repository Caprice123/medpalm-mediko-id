import styled from 'styled-components'

export const NavFooter = styled.nav`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-gray-200);

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`

export const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 0.875rem;
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  /* The "next" button is pushed into the right-hand column even when there is no
     previous note, so the two always sit where a reader expects them. */
  grid-column: ${p => p.$direction === 'next' ? '2' : '1'};
  text-align: ${p => p.$direction === 'next' ? 'right' : 'left'};
  flex-direction: ${p => p.$direction === 'next' ? 'row-reverse' : 'row'};

  &:hover {
    background: var(--color-brand-blue-tint);
    border-color: var(--color-brand-blue);
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  @media (max-width: 560px) {
    grid-column: 1;
  }
`

export const NavArrow = styled.span`
  display: flex;
  flex-shrink: 0;
  font-size: 1.125rem;
  color: var(--color-gray-400);

  ${NavButton}:hover & { color: var(--color-brand-blue); }
`

export const NavInfo = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
`

export const NavDirection = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gray-400);
`

export const NavLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-800);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
