import styled from 'styled-components'

export const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
`

export const SidebarTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 0.875rem 0;
  flex-shrink: 0;
`

export const SidebarTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-gray-800);

  svg { color: var(--color-brand-blue); font-size: 1.125rem; }
`

// Only on mobile, where the sidebar is a drawer over the reader and therefore
// needs its own way out. On desktop the reader's own toggle handles it.
export const DrawerCloseButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    border: none;
    border-radius: 7px;
    background: var(--color-gray-100);
    color: var(--color-gray-600);
    font-size: 1rem;
    cursor: pointer;

    &:hover { background: var(--color-gray-200); color: var(--color-gray-800); }
  }
`

export const ScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 0.5rem;
`

// Favourites and Terakhir Dilihat sit below the scroll area rather than inside it.
// Inside, a reader with a long list of topics had to scroll to the very bottom of
// the whole tree to reach them, which defeats the point of a shortcut.
export const PinnedFooter = styled.div`
  flex-shrink: 0;
  border-top: 1px solid var(--color-gray-200);
  background: var(--color-surface);
`

// Shared by TreeNode and SearchResults
export const FavoriteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0.125rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9375rem;
  line-height: 1;
  color: ${p => p.$active ? 'var(--color-warning)' : 'var(--color-gray-400)'};
  opacity: ${p => p.$alwaysVisible ? 1 : 0};
  transition: opacity 0.15s, color 0.15s;

  /* Hidden until the row is hovered or focused unless it is already favourited:
     a column of grey stars down the whole tree reads as noise, and competes with
     the subtopic names a reader is actually scanning. */
  *:hover > &,
  &:focus-visible {
    opacity: 1;
  }

  &:hover {
    color: ${p => p.$active ? 'var(--color-warning-dark)' : 'var(--color-gray-600)'};
  }
`

// Shared by TopicTree and SearchResults
export const EmptyHint = styled.div`
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
  color: var(--color-gray-400);
`
