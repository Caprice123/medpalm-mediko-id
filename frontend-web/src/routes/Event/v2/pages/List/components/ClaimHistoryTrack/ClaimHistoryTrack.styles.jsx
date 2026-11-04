import styled from 'styled-components'

export const RowList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`

export const SummaryChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`

export const SummaryChip = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 999px;
  padding: 0.1875rem 0.5625rem;
  font-variant-numeric: tabular-nums lining-nums;
  background: ${({ $status }) =>
    $status === 'approved' ? 'var(--color-brand-green-tint)'
      : $status === 'pending' ? 'var(--color-warning-tint)'
        : 'var(--color-danger-tint)'};
  color: ${({ $status }) =>
    $status === 'approved' ? 'var(--color-brand-green-darker)'
      : $status === 'pending' ? 'var(--color-warning-text)'
        : 'var(--color-danger-dark)'};
`

export const EmptyNotice = styled.div`
  background: var(--color-surface);
  border-radius: 14px;
  padding: 1.375rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(11, 20, 25, 0.06);

  > svg {
    flex-shrink: 0;
    color: var(--color-gray-400);
  }

  h3 {
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--color-gray-900);
    margin: 0 0 0.1875rem;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--color-gray-500);
  }
`
