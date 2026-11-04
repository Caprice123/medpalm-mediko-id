import styled from 'styled-components'

export const RewardBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`

/**
 * One good the event hands out. In the live data this is always a single
 * feature for two days, so the row is sized to read well on its own rather
 * than as one entry in a long list.
 */
export const RewardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5625rem;
  padding: 0.5625rem 0.6875rem;
  border-radius: 10px;
  background: var(--color-brand-blue-tint);
  color: var(--color-brand-blue-deep);

  svg {
    flex-shrink: 0;
    color: var(--color-brand-blue);
  }
`

export const RewardName = styled.span`
  font-size: 0.9375rem;
  font-weight: 700;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const CreditAmount = styled.span`
  font-size: 0.9375rem;
  font-weight: 700;
  display: inline-flex;
  align-items: baseline;
  gap: 0.3125rem;

  b {
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1;
    font-variant-numeric: tabular-nums lining-nums;
  }
`

export const Qualifier = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-brand-blue-deep);
`

export const DurationPill = styled.span`
  margin-left: auto;
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  background: var(--color-surface);
  border: 1px solid var(--color-brand-blue-tint-strong);
  border-radius: 999px;
  padding: 0.1875rem 0.5625rem;
`
