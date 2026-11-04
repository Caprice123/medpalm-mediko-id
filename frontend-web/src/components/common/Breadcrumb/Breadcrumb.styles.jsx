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
  color: var(--color-gray-300);
`

export const Crumb = styled.button`
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: var(--color-brand-green);
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
