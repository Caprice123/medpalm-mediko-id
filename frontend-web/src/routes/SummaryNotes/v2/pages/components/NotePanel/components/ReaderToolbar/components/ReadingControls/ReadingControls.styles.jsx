import styled from 'styled-components'

export const Popover = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 30;
  width: 220px;
  padding: 0.75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  box-shadow: 0 10px 28px rgba(11, 20, 25, 0.14);
`

export const ControlGroup = styled.div`
  & + & { margin-top: 0.875rem; }
`

export const ControlLabel = styled.div`
  margin-bottom: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-gray-500);
`

export const SegmentedRow = styled.div`
  display: flex;
  gap: 0.25rem;
  padding: 0.1875rem;
  border-radius: 8px;
  background: var(--color-gray-100);
`

export const SegmentButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.3125rem 0.375rem;
  border: none;
  border-radius: 6px;
  background: ${p => p.$active ? 'var(--color-surface)' : 'transparent'};
  box-shadow: ${p => p.$active ? '0 1px 3px rgba(11, 20, 25, 0.12)' : 'none'};
  color: ${p => p.$active ? 'var(--color-brand-blue-deep)' : 'var(--color-gray-600)'};
  font-size: 0.75rem;
  font-weight: ${p => p.$active ? '600' : '500'};
  cursor: pointer;

  svg { font-size: 0.9375rem; }

  &:hover:not(:disabled) { color: var(--color-brand-blue); }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`

export const FontSizePreview = styled.span`
  min-width: 2.5rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-700);
`
