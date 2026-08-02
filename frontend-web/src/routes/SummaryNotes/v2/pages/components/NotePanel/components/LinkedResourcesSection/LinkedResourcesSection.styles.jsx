import styled from 'styled-components'

export const LinkedGroup = styled.div`
  margin-bottom: 1rem;

  &:last-child { margin-bottom: 0; }
`

const TYPE_COLORS = {
  flashcard: '#0d9488',
  mcq: '#7c3aed',
  anatomy: '#ea580c',
  topic: '#2563eb',
}

const TYPE_HOVER_BG = {
  flashcard: '#f0fdfa',
  mcq: '#faf5ff',
  anatomy: '#fff7ed',
  topic: '#eff6ff',
}

export const LinkedGroupLabel = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
`

export const LinkedGroupHint = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
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
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: ${p => TYPE_HOVER_BG[p.$type] || '#f0fdfa'};
    border-color: ${p => TYPE_COLORS[p.$type] || '#0d9488'};
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
  color: #111827;
  line-height: 1.4;
`

export const RelatedSubtitle = styled.span`
  font-size: 0.8125rem;
  color: #6b7280;
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
  background: ${p => TYPE_COLORS[p.$type] || '#0d9488'}22;
  color: ${p => TYPE_COLORS[p.$type] || '#0d9488'};
`

export const RelatedArrow = styled.span`
  flex-shrink: 0;
  color: #9ca3af;
  font-size: 1rem;
`
