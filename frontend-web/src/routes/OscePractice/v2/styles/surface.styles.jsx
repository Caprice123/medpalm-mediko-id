import styled from 'styled-components'
import Container from 'react-bootstrap/Container'

// The shell every V2 hub-side page is built from: the page ground, the container, and the panel
// parts. These sat in `Hub.styles.jsx` while the board was one page. Picking a station is now
// its own page, and both pages render the same panels — so the shell lives beside them rather
// than inside one of them, and neither page imports the other's styles file.

export const Page = styled.div`
  min-height: 100vh;
  background: var(--color-surface-app);
  padding: 1.5rem 0 3rem;

  /* Browser surfaces these pages own rather than inherit: a blue selection instead of the
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

export const Panel = styled.section`
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 14px;
  overflow: hidden;

  /* The area being worked in lifts; the others stay flat. Nothing moves — only the edge
     sharpens — so a page of several panels never reads as several competing screens. */
  transition: border-color 160ms ease-out, box-shadow 160ms ease-out;

  ${({ $active }) => $active && `
    border-color: var(--color-brand-blue-tint-strong);
    box-shadow: 0 2px 10px -4px rgba(4, 74, 119, 0.16);
  `}
`

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

// Field and column labels — never an eyebrow over a heading.
export const MicroLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-gray-500);
  white-space: nowrap;
`

// The hairline that separates data rows, instead of giving every row its own card.
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
