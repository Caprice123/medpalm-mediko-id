import styled from 'styled-components'

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-gray-500);
  flex-wrap: wrap;
`

export const Sep = styled.span`
  /* gray-300 is 1.26:1 against the page — the separator was effectively
     invisible, so the trail read as two unrelated words. */
  color: var(--color-gray-400);
`

export const Crumb = styled.button`
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  /* The last green left in the app: it survived the re-theme because it was
     already a token rather than a hex, so the sweep never saw it. */
  color: var(--color-brand-blue);
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`

export const CurrentCrumb = styled.span`
  color: var(--color-gray-700);
  font-weight: 500;
`
