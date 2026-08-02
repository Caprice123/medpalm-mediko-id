import styled from 'styled-components'

export const CollapsibleWrap = styled.div`
  flex-shrink: 0;
  border-top: 1px solid #e5e7eb;
  background: white;
`

export const SectionListArea = styled.div`
  max-height: ${p => p.$open ? '160px' : '0'};
  overflow: hidden;
  transition: max-height 0.22s ease;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem 0.25rem;
  cursor: pointer;
  user-select: none;
  &:hover { background: #f9fafb; }
`

export const HeaderLabel = styled.span`
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

export const NoteItemRow = styled.div`
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
