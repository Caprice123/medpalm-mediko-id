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

export const SectionBlock = styled.div`
  padding: 0.75rem 0;
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem 0.5rem;
`

export const SectionLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
`

export const TabGroup = styled.div`
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
`

export const Tab = styled.button`
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  background: ${p => p.$active ? '#0d9488' : 'white'};
  color: ${p => p.$active ? 'white' : '#6b7280'};
  transition: background 0.15s;
  &:hover { background: ${p => p.$active ? '#0d9488' : '#f9fafb'}; }
`

export const NodeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.35rem 1rem 0.35rem ${p => 1 + p.$depth * 1.25}rem;
  cursor: ${p => p.$clickable ? 'pointer' : 'default'};
  border-radius: 0;
  user-select: none;
  &:hover { background: ${p => p.$clickable ? '#f1f5f9' : 'transparent'}; }
`

export const ChevronIcon = styled.span`
  font-size: 0.625rem;
  color: #9ca3af;
  width: 0.75rem;
  flex-shrink: 0;
  transform: ${p => p.$open ? 'rotate(90deg)' : 'none'};
  transition: transform 0.15s;
  display: inline-block;
`

export const NodeIcon = styled.span`
  font-size: 0.75rem;
  flex-shrink: 0;
`

export const NodeLabel = styled.span`
  font-size: 0.8125rem;
  color: #374151;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const NoteRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.35rem 1rem 0.35rem ${p => 1 + p.$depth * 1.25}rem;
  cursor: pointer;
  border-radius: 0;
  background: ${p => p.$selected ? '#ccfbf1' : 'transparent'};
  &:hover { background: ${p => p.$selected ? '#99f6e4' : '#f1f5f9'}; }
`

export const NoteIcon = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  flex-shrink: 0;
`

export const NoteLabel = styled.span`
  font-size: 0.8125rem;
  color: ${p => p.$selected ? '#0f766e' : '#4b5563'};
  font-weight: ${p => p.$selected ? '600' : '400'};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const LoadingRow = styled.div`
  padding: 0.35rem 1rem 0.35rem ${p => 1 + p.$depth * 1.25}rem;
  font-size: 0.75rem;
  color: ${p => p.$clickable ? '#0d9488' : '#9ca3af'};
  cursor: ${p => p.$clickable ? 'pointer' : 'default'};
  &:hover { ${p => p.$clickable && 'text-decoration: underline;'} }
`

export const Divider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 0.25rem 0;
`

export const CollapsibleSection = styled.div`
  flex-shrink: 0;
  border-top: 1px solid #e5e7eb;
  background: white;
`

export const FavoritesSection = CollapsibleSection
export const RecentSection = CollapsibleSection

export const SectionListArea = styled.div`
  max-height: ${p => p.$open ? '160px' : '0'};
  overflow: hidden;
  transition: max-height 0.22s ease;
`

export const RecentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem 0.25rem;
  cursor: pointer;
  user-select: none;
  &:hover { background: #f9fafb; }
`

export const RecentHeaderLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export const CollapseChevron = styled.span`
  font-size: 0.625rem;
  color: #9ca3af;
  transform: ${p => p.$open ? 'rotate(90deg)' : 'rotate(0deg)'};
  transition: transform 0.15s;
  display: inline-block;
`

export const RecentNoteRow = styled.div`
  padding: 0.375rem 1rem;
  cursor: pointer;
  font-size: 0.8125rem;
  color: ${p => p.$selected ? '#0f766e' : '#374151'};
  font-weight: ${p => p.$selected ? '600' : '400'};
  background: ${p => p.$selected ? '#ccfbf1' : 'transparent'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover { background: ${p => p.$selected ? '#99f6e4' : '#f1f5f9'}; }
`

export const EmptyHint = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  color: #9ca3af;
`

export const SearchNoteRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem 0.4rem 1rem;
  cursor: pointer;
  background: ${p => p.$selected ? '#ccfbf1' : 'transparent'};
  &:hover { background: ${p => p.$selected ? '#99f6e4' : '#f1f5f9'}; }
`

export const SearchNoteInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
  min-width: 0;
`

export const SearchNoteTitle = styled.span`
  font-size: 0.8125rem;
  color: ${p => p.$selected ? '#0f766e' : '#374151'};
  font-weight: ${p => p.$selected ? '600' : '400'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const SearchNotePath = styled.span`
  font-size: 0.6875rem;
  color: #9ca3af;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const FavoriteBtn = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.1rem 0.2rem;
  font-size: 0.875rem;
  line-height: 1;
  color: ${p => p.$active ? '#f59e0b' : '#d1d5db'};
  &:hover { color: ${p => p.$active ? '#d97706' : '#9ca3af'}; }
`
