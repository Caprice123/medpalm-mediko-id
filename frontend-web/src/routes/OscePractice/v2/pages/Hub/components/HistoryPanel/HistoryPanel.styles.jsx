import styled from 'styled-components'

export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--color-gray-100);
`

// A filter chip, nothing more. It carried a count until the panel stopped reporting totals, so
// `align-items: baseline` is gone with the second line of text it was aligning.
export const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.4375rem 0.875rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-brand-blue)' : 'var(--color-gray-300)')};
  background: ${({ $active }) => ($active ? 'var(--color-brand-blue)' : 'var(--color-surface)')};
  color: ${({ $active }) => ($active ? 'var(--color-surface)' : 'var(--color-gray-700)')};

  &:hover {
    border-color: var(--color-brand-blue);
  }
`
