import styled from 'styled-components'

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
