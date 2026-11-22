import styled from 'styled-components'

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.375rem;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? 'var(--color-brand-blue-tint)' : 'transparent')};

  &:hover {
    background: ${({ $active }) => ($active ? 'var(--color-brand-blue-tint)' : 'var(--color-gray-50)')};
  }
`

// The arrows stay out of the way until the row is pointed at, so the outline
// reads as a list of headings rather than as two buttons per line. On a touch
// screen there is no hover to wait for.
export const MoveActions = styled.div`
  display: inline-flex;
  flex-shrink: 0;
  gap: 0.125rem;
  opacity: 0;
  transition: opacity 0.15s ease;

  ${Row}:hover &,
  &:focus-within {
    opacity: 1;
  }

  @media (hover: none) {
    opacity: 1;
  }
`

export const MoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.5rem;
  border: none;
  border-radius: 4px;
  background: none;
  color: var(--color-gray-400);
  font-size: 0.625rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: var(--color-brand-blue);
    background: var(--color-surface);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

// Dragging is deliberately limited to this grip: the rest of the row is a
// button that jumps, and one target cannot sensibly do both.
export const Grip = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.5rem;
  border: none;
  background: none;
  color: var(--color-gray-300);
  font-size: 0.7rem;
  cursor: ${props => (props.$locked ? 'default' : 'grab')};
  touch-action: none;

  &:hover {
    color: var(--color-gray-500);
  }

  &:active {
    cursor: grabbing;
  }
`

export const Jump = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
  padding: 0.2rem 0;
  border: none;
  background: none;
  color: ${({ $active }) => ($active ? 'var(--color-brand-blue)' : 'var(--color-gray-700)')};
  font-size: 0.8125rem;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  text-align: left;
  cursor: pointer;
`

export const Number = styled.span`
  flex-shrink: 0;
  width: 1.25rem;
  color: var(--color-gray-400);
  font-size: 0.75rem;
  font-weight: 600;
`

export const Title = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

