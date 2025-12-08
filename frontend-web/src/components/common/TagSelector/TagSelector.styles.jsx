import styled from 'styled-components'

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`

export const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #ede9fe;
  color: #5b21b6;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;

  span {
    line-height: 1;
  }
`

export const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: #5b21b6;
  cursor: pointer;
  font-size: 1.125rem;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`

export const SelectTagContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`

export const AddTagButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.625rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const EmptyTagsMessage = styled.div`
  color: #9ca3af;
  font-size: 0.875rem;
  font-style: italic;
  margin-bottom: 0.75rem;
`

export const HelpText = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 0.75rem;
  color: #6b7280;
`
