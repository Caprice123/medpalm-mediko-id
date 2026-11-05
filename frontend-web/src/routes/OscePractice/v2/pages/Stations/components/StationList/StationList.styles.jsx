import styled from 'styled-components'

// A header row for the four columns, which the panel could do without while it was 300px wide
// and cannot now: at full width the tag and duration columns are far enough from the title that
// they need saying what they are. It mirrors `StationRow`'s grid exactly.
export const ColumnLabels = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px 110px 140px;
  align-items: center;
  gap: 1rem;
  padding: 0.625rem 1.25rem;
  background: var(--color-surface-app);
  border-bottom: 1px solid var(--color-gray-200);

  @media (max-width: 860px) {
    display: none;
  }
`
