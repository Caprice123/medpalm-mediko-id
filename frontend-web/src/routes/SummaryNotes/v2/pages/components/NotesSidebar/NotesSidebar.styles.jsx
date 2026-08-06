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
  border-bottom: 1px solid #f1f5f9;
`

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: #374151;
  background: transparent;
  &::placeholder { color: #9ca3af; }
`

export const SearchIcon = styled.span`
  color: #9ca3af;
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
  color: #9ca3af;
`

export const FavoriteBtn = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem 0.3rem;
  font-size: 1.25rem;
  line-height: 1;
  color: ${p => p.$active ? '#f59e0b' : '#d1d5db'};
  &:hover { color: ${p => p.$active ? '#d97706' : '#9ca3af'}; }
`
