import styled from 'styled-components'
import Container from 'react-bootstrap/Container'

export const Page = styled.div`
  min-height: 100vh;
  background: var(--color-surface-app);
  padding: 1.5rem 0 3rem;

  ::selection {
    background: var(--color-brand-blue-tint-strong);
    color: var(--color-brand-blue-deep);
  }
`

export const PageContainer = styled(Container)`
  max-width: 1480px;
`

// The same board as the station it debriefs: the rubric on the left, the evidence that earned
// it on the right. V1 stacked six tabs and made the student hunt between them.
export const Board = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;

  @media (max-width: 1180px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

// Shared by RubricPanel and EvidencePanel.
export const Panel = styled.section`
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 14px;
  overflow: hidden;
`

// Shared by RubricPanel and EvidencePanel.
export const PanelHead = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.25rem 0.875rem;
  border-bottom: 1px solid var(--color-gray-200);

  h2 {
    font-size: 1.0625rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-gray-800);
  }
`

// Shared by RubricPanel and EvidencePanel.
export const MicroLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-gray-500);
  white-space: nowrap;
`

export const Numeric = styled.span`
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
`

// Shared by every evidence view: the notice shown when a station has nothing of that kind.
export const EvidenceEmpty = styled.p`
  margin: 0;
  padding: 2.5rem 1.25rem;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--color-gray-500);
`

export const BackRow = styled.div`
  margin-bottom: 1rem;
`
