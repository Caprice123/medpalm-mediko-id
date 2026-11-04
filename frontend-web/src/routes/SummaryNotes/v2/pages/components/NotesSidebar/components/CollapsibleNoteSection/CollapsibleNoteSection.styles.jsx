import styled from 'styled-components'

export const CollapsibleWrap = styled.div`
  & + & { border-top: 1px solid var(--color-gray-100); }
`

export const Header = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  padding: 0.5rem 0.875rem;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;

  &:hover { background: var(--color-gray-50); }
`

export const HeaderIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  font-size: 0.875rem;
  color: ${p => p.$warm ? 'var(--color-warning)' : 'var(--color-gray-400)'};
`

export const HeaderLabel = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-gray-500);
`

export const HeaderCount = styled.span`
  flex-shrink: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-gray-400);
`

export const CollapseChevron = styled.span`
  display: flex;
  flex-shrink: 0;
  font-size: 0.625rem;
  color: var(--color-gray-400);
  transform: ${p => p.$open ? 'rotate(90deg)' : 'none'};
  transition: transform 0.15s;
`

// Capped and scrollable: these shortcuts must never grow tall enough to squeeze the
// topic tree above them off the screen.
export const SectionListArea = styled.div`
  max-height: ${p => p.$open ? '148px' : '0'};
  overflow-y: ${p => p.$open ? 'auto' : 'hidden'};
  transition: max-height 0.2s ease;
  padding-bottom: ${p => p.$open ? '0.25rem' : '0'};
`

export const NoteItemRow = styled.div`
  position: relative;
  padding: 0.3125rem 0.75rem 0.3125rem 1.75rem;
  margin: 0 0.375rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8125rem;
  color: ${p => p.$selected ? 'var(--color-brand-blue-deep)' : 'var(--color-gray-700)'};
  font-weight: ${p => p.$selected ? '600' : '400'};
  background: ${p => p.$selected ? 'var(--color-brand-blue-tint)' : 'transparent'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    background: ${p => p.$selected ? 'var(--color-brand-blue-tint)' : 'var(--color-gray-100)'};
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.25rem;
    bottom: 0.25rem;
    width: 2px;
    border-radius: 2px;
    background: ${p => p.$selected ? 'var(--color-brand-blue)' : 'transparent'};
  }
`
