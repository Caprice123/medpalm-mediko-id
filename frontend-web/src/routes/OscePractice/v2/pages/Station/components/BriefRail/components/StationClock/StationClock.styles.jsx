import styled, { css, keyframes } from 'styled-components'
import { Numeric } from '../../../../Station.styles'

const breathe = keyframes`
  from { opacity: 1; }
  to { opacity: 0.55; }
`

// The clock is the only thing on the board allowed to change colour on its own, and it earns
// it: amber at 2.5 minutes, red under a minute. Nothing else competes for that signal.
export const ClockBlock = styled.div`
  flex: none;
  padding: 1rem;
  border-bottom: 1px solid var(--color-gray-200);
  background: ${({ $urgency }) => {
    if ($urgency === 'critical' || $urgency === 'expired') return 'var(--color-danger-tint-soft)'
    if ($urgency === 'warning') return 'var(--color-warning-tint)'
    return 'linear-gradient(158deg, var(--color-brand-blue-deep) 0%, var(--color-brand-blue) 82%)'
  }};
`

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  color: ${({ $urgency }) => ($urgency === 'normal' ? 'var(--color-brand-blue-tint)' : 'var(--color-gray-600)')};

  svg {
    flex: none;
  }
`

// Muting the bell is a real control, not a setting buried in a menu: a student practising in
// a library needs it on the first screen, and the clock's colour carries the same warning.
export const MuteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.875rem;
  height: 1.875rem;
  border-radius: 8px;
  border: 1px solid ${({ $urgency }) => ($urgency === 'normal'
    ? 'rgba(255, 255, 255, 0.34)'
    : 'var(--color-gray-300)')};
  background: ${({ $urgency }) => ($urgency === 'normal'
    ? 'rgba(4, 74, 119, 0.4)'
    : 'var(--color-surface)')};
  color: inherit;

  &:hover {
    border-color: ${({ $urgency }) => ($urgency === 'normal'
    ? 'var(--color-surface)'
    : 'var(--color-brand-blue)')};
  }
`

export const Time = styled(Numeric)`
  display: block;
  margin-top: 0.375rem;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  color: ${({ $urgency }) => {
    if ($urgency === 'critical' || $urgency === 'expired') return 'var(--color-danger-dark)'
    if ($urgency === 'warning') return 'var(--color-warning-text)'
    return 'var(--color-surface)'
  }};

  /* Only the last minute breathes, and only the digits — a whole panel pulsing would make the
     worksheet beside it harder to read at exactly the wrong moment. */
  ${({ $urgency }) => $urgency === 'critical' && css`
    animation: ${breathe} 1s ease-in-out infinite alternate;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `}
`

export const Note = styled.p`
  margin: 0.375rem 0 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ $urgency }) => {
    if ($urgency === 'critical' || $urgency === 'expired') return 'var(--color-danger-dark)'
    if ($urgency === 'warning') return 'var(--color-warning-text)'
    return 'var(--color-brand-blue-tint)'
  }};
`
