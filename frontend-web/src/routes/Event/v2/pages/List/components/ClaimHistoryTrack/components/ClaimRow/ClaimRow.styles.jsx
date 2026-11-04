import styled from 'styled-components'

const TONE = {
  approved: { bg: 'var(--color-brand-green-tint)', fg: 'var(--color-brand-green-darker)' },
  pending: { bg: 'var(--color-warning-tint)', fg: 'var(--color-warning-text)' },
  rejected: { bg: 'var(--color-danger-tint)', fg: 'var(--color-danger-dark)' },
}

export const RowFrame = styled.article`
  background: var(--color-surface);
  border-radius: 13px;
  padding: 0.9375rem 1.0625rem;
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  box-shadow: 0 1px 3px rgba(11, 20, 25, 0.06);

  @media (max-width: 640px) {
    flex-wrap: wrap;
  }
`

/**
 * A tinted status disc rather than a coloured left border: a thick accent edge
 * on a card is a tell, and the disc carries the same state at a glance while
 * leaving room for a real icon.
 */
export const StatusDisc = styled.div`
  width: 2.375rem;
  height: 2.375rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: ${({ $status }) => TONE[$status]?.bg ?? 'var(--color-gray-100)'};
  color: ${({ $status }) => TONE[$status]?.fg ?? 'var(--color-gray-700)'};
`

export const RowBody = styled.div`
  flex: 1;
  min-width: 0;
`

export const RowTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--color-gray-900);
  margin: 0 0 0.125rem;
`

export const RowMeta = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-gray-500);
`

/** What was actually disbursed — its own field, and often the reason to return. */
export const GrantedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5625rem;
`

export const GrantedTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  font-size: 0.8125rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 0.375rem 0.625rem;
  background: ${({ $expired }) => ($expired ? 'var(--color-gray-100)' : 'var(--color-brand-green-tint)')};
  color: ${({ $expired }) => ($expired ? 'var(--color-gray-600)' : 'var(--color-brand-green-darker)')};
  border: 1px solid
    ${({ $expired }) => ($expired ? 'var(--color-gray-200)' : 'var(--color-brand-green-tint-strong)')};

  svg { flex-shrink: 0; }

  b {
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-size: 1rem;
    line-height: 1;
    font-variant-numeric: tabular-nums lining-nums;
  }
`

export const WaitingNote = styled.p`
  margin: 0.5625rem 0 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.375rem 0.625rem;
  border-radius: 8px;
  background: var(--color-warning-tint);
  color: var(--color-warning-text);

  svg { flex-shrink: 0; }
`

export const AdminNote = styled.p`
  margin: 0.5625rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-gray-700);
  background: var(--color-gray-50);
  border-radius: 9px;
  padding: 0.5625rem 0.6875rem;

  b { font-weight: 700; }
`

export const EvidenceList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5625rem;
`

export const EvidenceLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  max-width: 15rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-700);
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 7px;
  padding: 0.25rem 0.5rem;

  &:hover {
    border-color: var(--color-border-strong);
    color: var(--color-gray-900);
  }

  svg { flex-shrink: 0; }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const RowSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5625rem;
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

export const StatusBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 999px;
  padding: 0.3125rem 0.6875rem;
  white-space: nowrap;
  background: ${({ $status }) => TONE[$status]?.bg ?? 'var(--color-gray-100)'};
  color: ${({ $status }) => TONE[$status]?.fg ?? 'var(--color-gray-700)'};
`
