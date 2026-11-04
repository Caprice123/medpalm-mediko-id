import styled from 'styled-components'

// Gap between the rail's line and an item's text. One constant, used by both the
// items and the heading, so the two can never drift apart.
const RAIL_GUTTER = '0.875rem'

// Wide: a quiet sticky rail beside the prose, marked only by the line it hangs on.
// Narrow: the same list stacked above the article, where it has to read as a
// self-contained card instead — a bare left rule there looks like a stray line.
export const TocRail = styled.nav`
  position: sticky;
  top: 1.5rem;
  align-self: start;
  max-height: calc(100vh - 10rem);
  overflow-y: auto;

  @media (min-width: 1280px) {
    grid-column: 2;
    /* Spans both article rows, headline and body. Confined to row 1 it stretched
       that row to the height of the whole outline, leaving a page-high gap between
       the note's description and its first paragraph. */
    grid-row: 1 / span 2;
  }

  @media (max-width: 1279px) {
    position: static;
    align-self: stretch;
    width: 100%;
    max-height: none;
    overflow: visible;
    padding: 0.25rem 0.875rem;
    border: 1px solid var(--color-gray-200);
    border-radius: 10px;
    background: var(--color-surface);
  }
`

// One element for both presentations: a disclosure button when stacked, an inert
// label when it is the rail's heading. Keeping it a single node avoids rendering two
// headings and having to keep their text in step.
export const TocHeader = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  text-align: left;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-gray-400);

  @media (min-width: 1280px) {
    /* Lines up with the items' text: their 2px marker sits over the rail line, so
       their text starts a marker-width plus the gutter in from the rail's edge. */
    padding-left: calc(${RAIL_GUTTER} + 2px);
    margin-bottom: 0.5rem;
    cursor: default;
    pointer-events: none;
  }

  @media (max-width: 1279px) {
    padding: 0.5rem 0;
    cursor: pointer;

    &:hover { color: var(--color-gray-600); }
  }
`

export const TocHeaderChevron = styled.span`
  display: flex;
  flex-shrink: 0;
  font-size: 0.625rem;
  transform: ${p => p.$open ? 'rotate(90deg)' : 'none'};
  transition: transform 0.15s;

  @media (min-width: 1280px) {
    display: none;
  }
`

export const TocHeaderLabel = styled.span`
  flex: 1;
  min-width: 0;
`

export const TocHeaderCount = styled.span`
  flex-shrink: 0;
  font-weight: 600;

  @media (min-width: 1280px) {
    display: none;
  }
`

// The rail line lives on the list, and each item carries its own left border that
// overlaps it. The active item therefore lands exactly on the line by construction —
// the previous version positioned a pseudo-element with a hand-computed negative
// offset against the parent's border, which left it a pixel adrift and, for a deeply
// indented heading, reading as a mark floating far from its own text.
export const TocList = styled.div`
  @media (min-width: 1280px) {
    border-left: 1px solid var(--color-gray-200);
  }

  @media (max-width: 1279px) {
    max-height: ${p => p.$open ? '15rem' : '0'};
    overflow-y: ${p => p.$open ? 'auto' : 'hidden'};
    transition: max-height 0.2s ease;
    padding-bottom: ${p => p.$open ? '0.5rem' : '0'};
  }
`

export const TocItem = styled.button`
  display: block;
  width: 100%;
  padding: 0.25rem 0 0.25rem calc(${RAIL_GUTTER} + ${p => (p.$level - 1) * 0.75}rem);
  border: none;
  border-left: 2px solid ${p => p.$active ? 'var(--color-brand-blue)' : 'transparent'};
  background: none;
  cursor: pointer;
  text-align: left;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: ${p => p.$active ? 'var(--color-brand-blue)' : 'var(--color-gray-500)'};
  font-weight: ${p => p.$active ? '600' : '400'};
  transition: color 0.15s;

  @media (min-width: 1280px) {
    /* Pulls the item's 2px border over the list's 1px line so the two share an edge
       instead of sitting next to each other. */
    margin-left: -1px;
  }

  /* Stacked there is no rail line, so the marker is simply an accent inside the card
     and the text sits closer in. */
  @media (max-width: 1279px) {
    padding-left: calc(0.5rem + ${p => (p.$level - 1) * 0.75}rem);
  }

  &:hover { color: var(--color-brand-blue); }
`
