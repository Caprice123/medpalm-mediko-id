import styled from 'styled-components'
import Container from 'react-bootstrap/Container'

// Page layout, plus the three shells every panel on this board is built from. Those three are
// shared by SessionRail, StationPanel and HistoryPanel, which is why they live here rather
// than in one component's styles file.

export const Page = styled.div`
  min-height: 100vh;
  background: var(--color-surface-app);
  padding: 1.5rem 0 3rem;

  /* Browser surfaces this board owns rather than inherits: a blue selection instead of the
     UA's, and panel scrollbars in the neutral ramp. */
  ::selection {
    background: var(--color-brand-blue-tint-strong);
    color: var(--color-brand-blue-deep);
  }

  scrollbar-color: var(--color-gray-300) transparent;
`

export const PageContainer = styled(Container)`
  max-width: 1480px;
`

// The board. A declared two-column grid that folds by whole columns: the rail drops above the
// work area at tablet width rather than squeezing to an unreadable 180px.
export const Board = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 340px) minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const WorkColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
`

// ---------------------------------------------------------------- shared panel shell
// Shared by SessionRail, StationPanel and HistoryPanel.
export const Panel = styled.section`
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 14px;
  overflow: hidden;

  /* The area being worked in lifts; the others stay flat. Nothing moves — only the edge
     sharpens — so a board of three panels never reads as three competing screens. */
  transition: border-color 160ms ease-out, box-shadow 160ms ease-out;

  ${({ $active }) => $active && `
    border-color: var(--color-brand-blue-tint-strong);
    box-shadow: 0 2px 10px -4px rgba(4, 74, 119, 0.16);
  `}
`

// Shared by StationPanel and HistoryPanel.
export const PanelHead = styled.header`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.125rem 1.25rem 0.875rem;
  border-bottom: 1px solid var(--color-gray-200);

  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-gray-800);
    margin: 0;
  }
`

// Shared by SessionRail, StationPanel and HistoryPanel. Field and column labels — never an
// eyebrow over a heading.
export const MicroLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-gray-500);
  white-space: nowrap;
`

// Shared by StationPanel and HistoryPanel: the hairline that separates data rows, instead of
// giving every row its own card.
export const HairlineRow = styled.div`
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--color-gray-100);

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    background: var(--color-brand-blue-tint);
  }
`

// Shared by StationPanel and HistoryPanel.
export const PanelFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--color-gray-100);
`

// Every number read under time pressure — clocks, scores, durations — is tabular, so the
// digits hold their width as the clock ticks instead of jittering the row.
export const Numeric = styled.span`
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
  letter-spacing: -0.01em;
`
