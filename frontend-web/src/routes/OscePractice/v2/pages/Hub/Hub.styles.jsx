import styled from 'styled-components'

// The page's own layout. Everything else it renders — the page ground, the panel shell, the
// row hairline — is shared with `/osce-practice/stations` and lives in `v2/styles`.

// A single column. The two-column board went with the rail: once the five performance rows
// became a chart of their own, that 340px column held only the live station and two counters,
// and left roughly 340px of empty rail beneath them. Each part spans the page instead, in the
// order a returning student reads them — what is running, what it adds up to, how each topic
// is going, and what came before.
export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`
