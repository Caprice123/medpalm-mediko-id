import styled from 'styled-components'

export const SectionWrapper = styled.div`
  margin-bottom: 1.5rem;
`

export const SectionLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

export const SectionHint = styled.p`
  color: #9ca3af;
  font-size: 0.75rem;
  margin: 0 0 0.75rem 0;
`

export const RelationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`

export const RelationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #15803d;
  font-weight: 500;
`

export const RelationItemTitle = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 0.75rem;
`

export const RemoveRelationButton = styled.button`
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
  transition: background 0.15s;
  flex-shrink: 0;
  line-height: 1;

  &:hover:not(:disabled) {
    background: #fee2e2;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

export const SearchRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`

export const SearchInput = styled.input`
  flex: 1;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #6BB9E8;
    box-shadow: 0 0 0 3px rgba(107, 185, 232, 0.1);
  }
`

export const SearchButton = styled.button`
  padding: 0.625rem 1rem;
  background: #6BB9E8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: #5aa8d7;
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`

export const SearchResults = styled.div`
  margin-top: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`

export const SearchResultItem = styled.div`
  padding: 0.6rem 0.875rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f0f9ff;
    color: #0ea5e9;
  }

  &.disabled {
    color: #9ca3af;
    cursor: default;
    background: #fafafa;
    font-style: italic;

    &:hover {
      background: #fafafa;
      color: #9ca3af;
    }
  }
`

export const EmptyRelations = styled.p`
  font-size: 0.8125rem;
  color: #9ca3af;
  font-style: italic;
  margin: 0 0 0.75rem 0;
`
