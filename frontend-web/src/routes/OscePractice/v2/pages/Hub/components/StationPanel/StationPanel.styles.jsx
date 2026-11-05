import styled from 'styled-components'

export const Filters = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 190px 190px auto;
  align-items: end;
  gap: 0.625rem;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--color-gray-100);

  @media (max-width: 920px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

/* Each common control renders its own label, so this only reserves the column and stops a
   long option name from forcing the grid wider than the panel. */
export const FilterField = styled.div`
  min-width: 0;
`

export const ActiveFilterNote = styled.p`
  grid-column: 1 / -1;
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-gray-600);

  strong {
    color: var(--color-brand-blue-deep);
  }
`
