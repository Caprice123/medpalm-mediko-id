import styled from 'styled-components'

// The page's own layout. Everything else it renders — the page ground, the panel shell, the
// row hairline — is shared with `/osce-practice/stations` and lives in `v2/styles`.

// A declared two-column grid that folds by whole columns: the rail drops above the history at
// tablet width rather than squeezing to an unreadable 180px.
export const Board = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 340px) minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
  }
`
