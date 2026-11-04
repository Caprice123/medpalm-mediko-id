import styled from 'styled-components'

export const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-gray-100);
`

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: var(--color-gray-700);
  background: transparent;
  &::placeholder { color: var(--color-gray-400); }
`

export const SearchIcon = styled.span`
  color: var(--color-gray-400);
  font-size: 0.875rem;
  flex-shrink: 0;
`

export const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 1rem;
`

// Shared by TopicTree and SearchResults
export const SectionBlock = styled.div`
  padding: 0.75rem 0;
`

export const EmptyHint = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  color: var(--color-gray-400);
`

export const FavoriteBtn = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem 0.3rem;
  font-size: 1.25rem;
  line-height: 1;
  color: ${p => p.$active ? 'var(--color-warning)' : 'var(--color-gray-300)'};
  &:hover { color: ${p => p.$active ? 'var(--color-warning-dark)' : 'var(--color-gray-400)'}; }
`
