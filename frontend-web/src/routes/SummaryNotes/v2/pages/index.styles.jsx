import styled from 'styled-components'

// The app shell reserves a 44px top bar on desktop and hides it on mobile, so the
// reader claims the rest of the viewport and owns the only scroll container inside
// it. Nothing here scrolls: the sidebar tree and the reader each scroll internally,
// which is what keeps the toolbar, the progress bar and the table of contents fixed
// while a long note moves underneath them.
export const PageShell = styled.div`
  display: flex;
  height: calc(100vh - 44px);
  overflow: hidden;
  background: var(--color-surface-reader-shell);

  @media (max-width: 768px) {
    height: 100vh;
  }
`

// Collapses to zero width rather than unmounting, so closing and reopening the list
// keeps the tree's expanded topics and scroll position instead of rebuilding them.
// The width transition is dropped while dragging, where it would lag the pointer.
export const SidebarPane = styled.aside`
  width: ${p => p.$open ? `${p.$width}px` : '0'};
  flex-shrink: 0;
  background: var(--color-surface);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: ${p => p.$dragging ? 'none' : 'width 0.2s ease'};

  /* On mobile the tree is a drawer over the reader instead of a column beside it.
     Stacking them put a full viewport of navigation above the text, so a reader on
     a phone had to scroll past the whole sidebar to reach the note. */
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: min(86vw, 340px);
    z-index: 140;
    box-shadow: 0 0 40px rgba(11, 20, 25, 0.18);
    transform: ${p => p.$open ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.24s ease;
  }
`

export const ResizeHandle = styled.div`
  width: 5px;
  flex-shrink: 0;
  cursor: col-resize;
  background: ${p => p.$active ? 'var(--color-brand-blue)' : 'var(--color-gray-200)'};
  transition: background 0.15s;

  &:hover { background: var(--color-brand-blue); }

  @media (max-width: 768px) {
    display: none;
  }
`

export const NavScrim = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${p => p.$open ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    z-index: 130;
    background: rgba(11, 20, 25, 0.45);
  }
`

export const ReaderPane = styled.main`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-left: 1px solid var(--color-gray-200);

  @media (max-width: 768px) {
    border-left: none;
  }
`
