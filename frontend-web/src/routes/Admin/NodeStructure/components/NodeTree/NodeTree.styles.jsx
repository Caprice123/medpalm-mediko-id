import styled from 'styled-components'

export const TreeContainer = styled.div`
  font-size: 0.875rem;
`

export const NodeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 1rem;
  padding-left: ${props => (props.$depth * 1.5) + 0.75}rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  background: white;

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
  gap: 0.4rem;
  flex: 1;
  min-width: 0;
`

export const Chevron = styled.span`
  font-size: 0.65rem;
  color: #9ca3af;
  width: 14px;
  flex-shrink: 0;
  transition: transform 0.15s;
  transform: ${props => props.$open ? 'rotate(90deg)' : 'rotate(0deg)'};
  visibility: ${props => props.$hasChildren ? 'visible' : 'hidden'};
`

export const NodeIcon = styled.span`
  font-size: 0.95rem;
  flex-shrink: 0;
`

export const NodeName = styled.span`
  font-weight: ${props => props.$depth === 0 ? '600' : '400'};
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const NodeSlug = styled.span`
  font-size: 0.72rem;
  color: #9ca3af;
  font-family: monospace;
  white-space: nowrap;
  flex-shrink: 0;
`

export const TypeBadge = styled.span`
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.1rem 0.45rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  flex-shrink: 0;
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
  gap: 0.35rem;
  opacity: 0;
  flex-shrink: 0;

  ${NodeRow}:hover & {
    opacity: 1;
  }
`

export const ActionBtn = styled.button`
  background: none;
  border: 1px solid ${props => props.$danger ? '#fca5a5' : '#e5e7eb'};
  color: ${props => props.$danger ? '#ef4444' : '#6b7280'};
  border-radius: 5px;
  padding: 0.2rem 0.5rem;
  font-size: 0.73rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s;
  white-space: nowrap;

  &:hover {
    background: ${props => props.$danger ? '#fee2e2' : '#f3f4f6'};
    border-color: ${props => props.$danger ? '#ef4444' : '#9ca3af'};
    color: ${props => props.$danger ? '#dc2626' : '#374151'};
  }
`
