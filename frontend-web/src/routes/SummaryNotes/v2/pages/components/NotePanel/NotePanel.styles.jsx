import styled from 'styled-components'

export const ReaderShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: var(--color-surface-reader);
`

// The one scroll container in the reader. Keeping it here rather than on the page
// shell is what lets the toolbar, the progress bar and the table of contents stay
// put while the note moves, and gives the progress hook a single element to measure.
export const ReaderScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  --reader-font-scale: ${p => p.$fontScale};
`

// The article and the table of contents. The article fills the pane — no reading
// measure cap, so a reader who widens the window or collapses the tree gets the
// space back, and wide tables and diagrams are not boxed in.
//
// The article is two items, its headline and its body, with the outline between
// them in the DOM. Wide, grid placement puts headline and body in one column and
// the outline in a rail beside them. Narrow, this becomes a plain flex column and
// that same DOM order reads as headline → outline → body, so the outline lands
// under the note's description rather than above its title.
export const ReaderLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) ${p => p.$withToc ? '13.75rem' : ''};
  /* Explicit tracks so the headline row is sized by the headline alone: the outline
     spans both rows, and on a note shorter than the outline a spanning item would
     otherwise distribute its leftover height across both — reopening the gap under
     the description. The 1fr row absorbs it instead. */
  grid-template-rows: auto 1fr;
  column-gap: 2.5rem;
  row-gap: 1.75rem;
  padding: 2rem 2.5rem 4rem;

  @media (max-width: 1279px) {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1.25rem 1rem 3rem;
  }
`

/* Explicit placement only while the layout is a grid: the outline sits between the
   two in the DOM, so without this the body would land in the outline's slot. */
export const ArticleHeader = styled.header`
  min-width: 0;

  @media (min-width: 1280px) {
    grid-column: 1;
    grid-row: 1;
  }
`

export const Article = styled.article`
  min-width: 0;

  @media (min-width: 1280px) {
    grid-column: 1;
    grid-row: 2;
  }
`

// Shared by NoteReferenceSection and LinkedResourcesSection
export const SectionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 2.5rem 0 1rem;
`

export const SectionLabel = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-gray-500);
  white-space: nowrap;

  svg { font-size: 1rem; color: var(--color-gray-400); }
`

export const SectionLine = styled.div`
  flex: 1;
  height: 1px;
  background: var(--color-gray-200);
`
