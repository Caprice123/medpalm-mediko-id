import styled from 'styled-components'

export const NodeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  padding-left: ${props => (props.$depth * 2) + 1}rem;
  border-bottom: 1px solid #f3f4f6;
  background: ${props => props.$depth === 0 ? '#f9fafb' : 'white'};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f0f9ff;
  }
`

export const NodeLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const NodeIndent = styled.span`
  color: #d1d5db;
  font-size: 0.85rem;
`

export const NodeName = styled.span`
  font-weight: ${props => props.$depth === 0 ? '600' : '400'};
  color: #111827;
  font-size: 0.9rem;
`

export const NodeSlug = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
  font-family: monospace;
`

export const TypeBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${props => {
    if (props.$type === 'department') return '#dbeafe'
    if (props.$type === 'topic') return '#dcfce7'
    if (props.$type === 'subtopic') return '#fef9c3'
    return '#f3f4f6'
  }};
  color: ${props => {
    if (props.$type === 'department') return '#1d4ed8'
    if (props.$type === 'topic') return '#15803d'
    if (props.$type === 'subtopic') return '#a16207'
    return '#6b7280'
  }};
`

export const NodeActions = styled.div`
  display: flex;
  gap: 0.5rem;
  opacity: 0;

  ${NodeRow}:hover & {
    opacity: 1;
  }
`

export const ActionBtn = styled.button`
  background: none;
  border: 1px solid ${props => props.$danger ? '#fca5a5' : '#e5e7eb'};
  color: ${props => props.$danger ? '#ef4444' : '#6b7280'};
  border-radius: 6px;
  padding: 0.25rem 0.6rem;
  font-size: 0.78rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s;

  &:hover {
    background: ${props => props.$danger ? '#fee2e2' : '#f3f4f6'};
    border-color: ${props => props.$danger ? '#ef4444' : '#9ca3af'};
    color: ${props => props.$danger ? '#dc2626' : '#374151'};
  }
`
