import styled from 'styled-components'

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  background: var(--color-surface-app);
`

// The top bar already carries Simpan and Export Word. On a phone it is far
// from the document, so the pair reappears here; on a wide screen showing both
// would just be the same two buttons twice.
export const PanelActions = styled.div`
  display: none;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-gray-200);

  @media (max-width: 768px) {
    display: flex;
  }
`

export const Canvas = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1rem 3rem;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem 2.5rem;
  }
`

// Side by side once the pane can afford it: the sheet takes the room it needs
// for a readable line, the outline sits in what is left over on the right.
// Below that width they stack, and the outline becomes a strip across the top.
export const Layout = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ $rail }) => ($rail ? '1rem' : '0')};
  flex-direction: ${({ $rail }) => ($rail ? 'row' : 'column')};
`

export const SheetColumn = styled.div`
  flex: 1;
  min-width: 0;
  width: 100%;
`

// Sticky against the top of the scrolling canvas, and scrolling on its own
// once the report has more sections than fit beside it.
export const Rail = styled.div`
  position: sticky;
  top: 0;
  flex-shrink: 0;
  width: 240px;
  max-height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
`

// One sheet of paper for the whole report, filling whatever width the split
// gives this pane. The sections inside it are blocks on that page, separated
// by a rule — a card each would turn one document into a stack of forms.
export const Sheet = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(11, 20, 25, 0.04);
  padding: 0.5rem 1.25rem 1.25rem;

  @media (max-width: 768px) {
    padding: 0.5rem 0.85rem 1rem;
  }
`
export const EmptyWrapper = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 14px;
  padding: 1.5rem;
`
