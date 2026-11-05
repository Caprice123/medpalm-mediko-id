import styled from 'styled-components'

// Not a `Panel`: that shell clips its overflow, and an ancestor that clips overflow cancels
// sticky positioning outright. So this carries its own surface.
export const Bar = styled.form`
  position: sticky;
  top: 0;
  z-index: 3;
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 14px;
  padding: 0.875rem 1.25rem;

  /* Rows scrolling underneath pass behind a hairline rather than touching the controls. */
  box-shadow: 0 1px 0 var(--color-gray-100), 0 6px 14px -12px rgba(4, 74, 119, 0.28);
`

export const Fields = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px 220px auto;
  align-items: end;
  gap: 0.625rem;

  @media (max-width: 920px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

/* Each common control renders its own label, so this only reserves the column and stops a
   long option name from forcing the grid wider than the bar. */
export const FilterField = styled.div`
  min-width: 0;
`

export const ActiveFilterNote = styled.p`
  margin: 0.75rem 0 0;
  font-size: 0.8125rem;
  color: var(--color-gray-600);

  strong {
    color: var(--color-brand-blue-deep);
    font-weight: 600;
  }
`

export const ClearFilter = styled.button`
  border: none;
  background: none;
  padding: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-brand-blue);

  &:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`
