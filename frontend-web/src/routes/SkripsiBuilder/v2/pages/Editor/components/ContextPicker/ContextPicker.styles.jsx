import styled from 'styled-components'

export const Group = styled.div`
  & + & {
    margin-top: 1rem;
  }
`

export const GroupHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`

export const GroupLabel = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-gray-700);
`

export const Counter = styled.span`
  font-size: 0.72rem;
  color: ${({ $active }) => ($active ? 'var(--color-brand-blue-deep)' : 'var(--color-gray-500)')};
`

export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`

export const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-brand-blue)' : 'var(--color-gray-300)')};
  background: ${({ $active }) => ($active ? 'var(--color-brand-blue-tint)' : 'var(--color-surface)')};
  color: ${({ $active }) => ($active ? 'var(--color-brand-blue-deep)' : 'var(--color-gray-600)')};
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;

  &:hover:not(:disabled) {
    border-color: var(--color-brand-blue);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

// Why a chip is off when it cannot be turned on. A tooltip is the usual place
// for this and it is the wrong one: the student never hovers a control they
// already read as broken.
export const Reason = styled.p`
  margin: 0.4rem 0 0;
  font-size: 0.72rem;
  color: var(--color-gray-500);
`

// Every section of the report, so the pick is made against the real document
// rather than against a remembered one. It scrolls: a long report should not
// push the buttons below the fold.
export const SectionList = styled.div`
  max-height: 15rem;
  overflow-y: auto;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  background: var(--color-surface);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-gray-300);
    border-radius: 3px;
  }
`

export const SectionRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.45 : 1)};
  transition: background 0.15s ease;

  & + & {
    border-top: 1px solid var(--color-gray-100);
  }

  &:hover {
    background: ${({ $disabled }) => ($disabled ? 'transparent' : 'var(--color-gray-50)')};
  }
`

export const SectionIndex = styled.span`
  flex-shrink: 0;
  width: 1.25rem;
  font-size: 0.72rem;
  color: var(--color-gray-400);
  text-align: right;
`

export const SectionTitle = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 0.8rem;
  color: var(--color-gray-800);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const OwnBadge = styled.span`
  flex-shrink: 0;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  background: var(--color-brand-blue-tint);
  color: var(--color-brand-blue-deep);
  font-size: 0.65rem;
  font-weight: 600;
`

export const EmptyNote = styled.p`
  margin: 0;
  padding: 0.75rem;
  font-size: 0.78rem;
  color: var(--color-gray-500);
`
