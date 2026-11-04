import styled from 'styled-components'

export const NavRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-gray-200);
`

export const NavButton = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background: #fff;
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  padding: 0.875rem 1.25rem;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  text-align: ${({ $align }) => $align ?? 'left'};
  flex: 1;
  max-width: 280px;
  ${({ $align }) => $align === 'right' && 'margin-left: auto;'}

  &:hover {
    border-color: var(--color-brand-blue);
    box-shadow: 0 0 0 3px rgba(30, 115, 170, 0.08);
  }

  &:disabled {
    opacity: 0;
    pointer-events: none;
  }
`

export const NavDirection = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  /* gray-400 is 2.92:1 — under the 4.5:1 that 12px text needs. */
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  justify-content: ${({ $align }) => $align === 'right' ? 'flex-end' : 'flex-start'};
`

export const NavTitle = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-gray-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
  display: block;
`
