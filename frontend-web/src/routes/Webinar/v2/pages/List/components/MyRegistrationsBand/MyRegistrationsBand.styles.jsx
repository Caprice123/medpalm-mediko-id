import styled from 'styled-components'
import { Strip } from '../../List.styles'

const TONE = {
  approved: {
    bg: 'var(--color-brand-green-tint)',
    fg: 'var(--color-brand-green-darker)',
    on: 'var(--color-brand-green-dark)',
  },
  pending: {
    bg: 'var(--color-warning-tint)',
    fg: 'var(--color-warning-text)',
    on: 'var(--color-warning-dark)',
  },
  rejected: {
    bg: 'var(--color-danger-tint)',
    fg: 'var(--color-danger-dark)',
    on: 'var(--color-danger-dark)',
  },
}

export const BandStrip = styled(Strip)`
  padding: 0.875rem 1.25rem;
`

export const BandHeader = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.625rem;
`

export const BandLabel = styled.h2`
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-gray-700);
  margin: 0 0.25rem 0 0;
`

export const StatusChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  padding: 0.4375rem 0.75rem;
  border-radius: 10px;
  border: 1px solid transparent;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  background: ${({ $status }) => TONE[$status].bg};
  color: ${({ $status }) => TONE[$status].fg};
  border-color: ${({ $status, $active }) => ($active ? TONE[$status].on : 'transparent')};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover { box-shadow: 0 1px 4px rgba(11, 20, 25, 0.12); }

  svg { flex-shrink: 0; }

  b {
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-size: 1.0625rem;
    font-weight: 700;
    line-height: 1;
    /* Counts sit beside words; lining figures keep the baseline honest. */
    font-variant-numeric: tabular-nums lining-nums;
  }
`

export const JoinAction = styled.a`
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-brand-blue-deep);
  background: var(--color-brand-blue-tint);
  border: 1px solid var(--color-brand-blue-tint-strong);

  &:hover {
    background: var(--color-brand-blue-tint-strong);
    color: var(--color-brand-blue-deep);
  }

  svg { flex-shrink: 0; }

  span {
    max-width: 22rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
`

export const EmptyLine = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-gray-500);
`

export const Drawer = styled.div`
  margin-top: 0.875rem;
  padding-top: 0.875rem;
  border-top: 1px solid var(--color-gray-100);
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`

export const RegistrationRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0.875rem;
  border-radius: 10px;
  background: var(--color-gray-50);

  @media (max-width: 640px) {
    flex-direction: column;
  }
`

export const RowBody = styled.div`
  min-width: 0;
  flex: 1;

  h3 {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--color-gray-900);
    margin: 0 0 0.25rem;
    line-height: 1.35;
  }
`

export const RowMeta = styled.p`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0 0 0.125rem;
  font-size: 0.8125rem;
  color: var(--color-gray-500);

  svg { flex-shrink: 0; }
`

export const AdminNote = styled.p`
  margin: 0.4375rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--color-gray-700);
  background: var(--color-surface);
  border-radius: 8px;
  padding: 0.5rem 0.625rem;

  strong { font-weight: 700; }
`

export const LinkRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5rem;
`

export const EvidenceLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-700);
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 7px;
  padding: 0.25rem 0.5rem;
  max-width: 14rem;

  &:hover { border-color: var(--color-border-strong); color: var(--color-gray-900); }

  svg { flex-shrink: 0; }

  span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`

export const JoinLink = styled(EvidenceLink)`
  color: var(--color-brand-blue-deep);
  background: var(--color-brand-blue-tint);
  border-color: var(--color-brand-blue-tint-strong);

  &:hover {
    background: var(--color-brand-blue-tint-strong);
    border-color: var(--color-brand-blue);
    color: var(--color-brand-blue-deep);
  }
`

export const RowAction = styled.div`
  flex-shrink: 0;
`
