import styled from 'styled-components'

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  flex-wrap: wrap;
`

export const Sep = styled.span`
  color: #d1d5db;
`

export const Crumb = styled.button`
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: #10b981;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`

export const CurrentCrumb = styled.span`
  color: #374151;
  font-weight: 500;
`
