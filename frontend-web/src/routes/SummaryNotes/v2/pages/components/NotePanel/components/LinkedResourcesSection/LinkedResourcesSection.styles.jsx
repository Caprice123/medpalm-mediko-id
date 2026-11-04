import styled from 'styled-components'

export const LinkedGroup = styled.div`
  margin-bottom: 1rem;

  &:last-child { margin-bottom: 0; }
`

const TYPE_COLORS = {
  flashcard: 'var(--color-brand-blue)',
  mcq: '#7c3aed',
  anatomy: '#ea580c',
  topic: 'var(--color-brand-blue-deep)',
}

const TYPE_HOVER_BG = {
  flashcard: 'var(--color-brand-blue-tint)',
  mcq: '#faf5ff',
  anatomy: '#fff7ed',
  topic: 'var(--color-brand-blue-tint)',
}

export const LinkedGroupLabel = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 0.25rem;
`

export const LinkedGroupHint = styled.p`
  font-size: 0.8125rem;
  color: var(--color-gray-500);
  margin: 0 0 0.75rem 0;
`

export const RelatedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`

export const RelatedRow = styled.button`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  padding: 0.875rem 1rem;
  background: var(--color-surface-page);
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: ${p => TYPE_HOVER_BG[p.$type] || 'var(--color-brand-blue-tint)'};
    border-color: ${p => TYPE_COLORS[p.$type] || 'var(--color-brand-blue)'};
  }
`

export const RelatedIcon = styled.span`
  font-size: 1.25rem;
  flex-shrink: 0;
`

export const RelatedInfo = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
`

export const RelatedTitle = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-gray-900);
  line-height: 1.4;
`

export const RelatedSubtitle = styled.span`
  font-size: 0.8125rem;
  color: var(--color-gray-500);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

export const RelatedBadge = styled.span`
  flex-shrink: 0;
  padding: 0.25rem 0.625rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${p => TYPE_COLORS[p.$type] || 'var(--color-brand-blue)'}22;
  color: ${p => TYPE_COLORS[p.$type] || 'var(--color-brand-blue)'};
`

export const RelatedArrow = styled.span`
  flex-shrink: 0;
  color: var(--color-gray-400);
  font-size: 1rem;
`
