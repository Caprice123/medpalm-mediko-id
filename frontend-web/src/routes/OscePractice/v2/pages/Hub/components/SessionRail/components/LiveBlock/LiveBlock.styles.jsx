import styled from 'styled-components'
import { Numeric } from '../../../../Hub.styles'

// The one large colour field on the board. It is reserved for a station that is actually
// live — an empty rail is white, so blue in this slot always means "you are mid-station".
export const LiveBlock = styled.div`
  padding: 1.125rem 1.25rem 1.25rem;
  border-bottom: 1px solid var(--color-gray-200);
  background: ${({ $live }) => ($live
    ? 'linear-gradient(158deg, var(--color-brand-blue-deep) 0%, var(--color-brand-blue) 78%)'
    : 'var(--color-surface)')};
`

export const BlockHead = styled.header`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;

  h2 {
    font-size: 0.9375rem;
    font-weight: 600;
    margin: 0;
    color: ${({ $live }) => ($live ? 'var(--color-surface)' : 'var(--color-gray-800)')};
  }
`

export const Clock = styled(Numeric)`
  font-size: 2.125rem;
  font-weight: 700;
  line-height: 1;
  color: ${({ $urgency }) => {
    if ($urgency === 'critical' || $urgency === 'expired') return 'var(--color-warning-tint-strong)'
    if ($urgency === 'warning') return 'var(--color-warning-tint)'
    return 'var(--color-surface)'
  }};
`

export const ClockUnit = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-align: right;
  margin-top: 0.25rem;
  color: var(--color-brand-blue-tint);
`

export const StationName = styled.p`
  font-family: 'Baloo 2', cursive;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.25;
  margin: 0.625rem 0 0.25rem;
  color: ${({ $live }) => ($live ? 'var(--color-surface)' : 'var(--color-gray-800)')};
`

export const StationMeta = styled.p`
  font-size: 0.8125rem;
  margin: 0;
  color: ${({ $live }) => ($live ? 'var(--color-brand-blue-tint)' : 'var(--color-gray-500)')};
`

// What the student still owes the rubric, read straight off the live block. An unfilled
// section is named in danger red on its own line — this is the mark the station room's
// worksheet repeats, and the reason the bell is never the first warning.
export const Marks = styled.ul`
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.24);
`

export const Mark = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4375rem 0;
  font-size: 0.8125rem;
  color: var(--color-surface);

  & + & {
    border-top: 1px solid rgba(255, 255, 255, 0.14);
  }

  svg {
    flex: none;
    color: ${({ $filled }) => ($filled
      ? 'var(--color-brand-green-tint-strong)'
      : 'var(--color-warning-tint-strong)')};
  }

  strong {
    font-weight: 600;
  }
`

export const MarkDetail = styled(Numeric)`
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ $filled }) => ($filled
    ? 'var(--color-brand-blue-tint)'
    : 'var(--color-warning-tint-strong)')};
`

export const Action = styled.div`
  margin-top: 1rem;
`

// The empty rail: no station running, so no blue and no clock. It says what the board offers
// instead of pretending there is something to resume.
export const EmptyLead = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0.625rem 0 0;
  color: var(--color-gray-600);
`

export const ExpiredNote = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 0.875rem 0 0;
  padding: 0.625rem 0.75rem;
  border-radius: 9px;
  background: var(--color-warning-tint);
  color: var(--color-warning-text);
  font-size: 0.8125rem;
  line-height: 1.5;

  svg {
    flex: none;
    margin-top: 0.125rem;
  }
`
