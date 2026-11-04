import styled from 'styled-components'
import { Container } from 'react-bootstrap'

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--color-surface-app);

  /* Browser surfaces belong to the design too. Scoped to this page rather than
     dropped into GlobalStyles, which every other route shares. */
  ::selection {
    background: var(--color-brand-blue-tint-strong);
    color: var(--color-brand-blue-deep);
  }

  input {
    caret-color: var(--color-brand-blue);
  }
`

export const PageContainer = styled(Container)`
  padding-block: 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: 768px) {
    padding-block: 1.5rem 2.5rem;
  }
`

// ─── Shared by MyRegistrationsBand and WebinarFilters ──────────────────────
// Both sit on the page as a white strip of the same weight; keeping the surface
// in one place stops the two from drifting apart.
export const Strip = styled.div`
  background: var(--color-surface);
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(11, 20, 25, 0.06);
`

// The background fragments Billboard and WebinarCard share live in
// `utils/surfaces.js` — this file exports components only.
