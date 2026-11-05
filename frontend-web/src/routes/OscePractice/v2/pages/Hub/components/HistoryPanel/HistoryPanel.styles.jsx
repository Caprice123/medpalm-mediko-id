import styled from 'styled-components'

export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--color-gray-100);
`

// A counted filter chip. Not a card and not a badge: the count is the point, so it sits inside
// the control that filters by it.
export const Chip = styled.button`
  display: inline-flex;
  align-items: baseline;
  gap: 0.4375rem;
  padding: 0.4375rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-brand-blue)' : 'var(--color-gray-300)')};
  background: ${({ $active }) => ($active ? 'var(--color-brand-blue)' : 'var(--color-surface)')};
  color: ${({ $active }) => ($active ? 'var(--color-surface)' : 'var(--color-gray-700)')};

  &:hover {
    border-color: var(--color-brand-blue);
  }

  b {
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    color: ${({ $active }) => ($active ? 'var(--color-surface)' : 'var(--color-gray-800)')};
  }
`
