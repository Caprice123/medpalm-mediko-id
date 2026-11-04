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
  gap: 1.875rem;

  @media (max-width: 768px) {
    padding-block: 1.5rem 2.5rem;
    gap: 1.5rem;
  }
`

// ─── Shared by ClaimableTrack and ClaimHistoryTrack ────────────────────────
// Both tracks are introduced the same way, so the heading lives in one place
// rather than being rebuilt twice and drifting.
export const TrackHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 0.875rem;

  h2 {
    font-size: 1.1875rem;
    font-weight: 700;
    color: var(--color-gray-800);
    margin: 0;
  }
`

export const TrackCount = styled.span`
  font-family: 'Baloo 2', system-ui, sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  background: var(--color-brand-blue-tint);
  color: var(--color-brand-blue-deep);
  padding: 0.125rem 0.625rem;
  border-radius: 999px;
  font-variant-numeric: tabular-nums lining-nums;
`

export const TrackRule = styled.span`
  flex: 1;
  height: 1px;
  background: var(--color-gray-200);
`
