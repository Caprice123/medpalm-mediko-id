import styled from 'styled-components'
import { Numeric } from '../../../../styles/surface.styles'

// The one large colour field on the page, reserved for a station that is actually live — with
// nothing running the band is white, so blue in this slot always means "you are mid-station".
//
// It was a card in a 340px rail and is a band across the page now. The content did not change,
// only its direction: label, station, clock and the way back read along one line instead of
// stacking, which is why the gradient runs across it rather than down.
export const Band = styled.section`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 0 1.25rem;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  border: 1px solid ${({ $live }) => ($live ? 'transparent' : 'var(--color-gray-200)')};
  background: ${({ $live }) => ($live
    ? 'linear-gradient(104deg, var(--color-brand-blue-deep) 0%, var(--color-brand-blue) 82%)'
    : 'var(--color-surface)')};

  /* The clock and the action keep their own column; the station name is the part with no
     length limit, so it is the part that gives up width first. */
  @media (max-width: 860px) {
    grid-template-columns: minmax(0, 1fr) auto;
    row-gap: 0.875rem;
  }
`

export const Label = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--color-brand-blue-tint);

  @media (max-width: 860px) {
    grid-column: 1 / -1;
  }
`

// Static, not a blinking dot. The clock beside it already counts down — a second thing moving
// in the same band is noise, and it would have to be unwound again under reduced motion.
export const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
  background: var(--color-surface);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.28);
`

export const StationName = styled.p`
  font-family: 'Baloo 2', cursive;
  font-size: 1.1875rem;
  font-weight: 600;
  line-height: 1.25;
  margin: 0;
  color: var(--color-surface);

  /* Station titles describe a case rather than fit a band — "Interpretasi Pemeriksaan
     Radiologi Sistem Muskuloskeletal dan Tulang Belakang Abnormal - Pasien 5" is long enough
     to wrap the band to three lines on a laptop. Two is enough to tell two stations apart;
     the full title is on hover, and the station's own brief rail shows it whole. */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const StationMeta = styled.p`
  font-size: 0.8125rem;
  margin: 0.125rem 0 0;
  color: var(--color-brand-blue-tint);
`

export const ClockSlot = styled.div`
  text-align: right;
`

export const Clock = styled(Numeric)`
  font-family: 'Baloo 2', cursive;
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 1.1;
  color: ${({ $urgency }) => {
    if ($urgency === 'critical' || $urgency === 'expired') return 'var(--color-warning-tint-strong)'
    if ($urgency === 'warning') return 'var(--color-warning-tint)'
    return 'var(--color-surface)'
  }};
`

export const ClockUnit = styled.span`
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 0.125rem;
  color: var(--color-brand-blue-tint);
`

export const Action = styled.div`
  @media (max-width: 860px) {
    grid-column: 1 / -1;
  }
`

// Nothing running, so no blue and no clock. The band says what the page offers instead of
// pretending there is something to resume.
export const EmptyLead = styled.p`
  grid-column: 1 / -1;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  color: var(--color-gray-600);

  a {
    font-weight: 600;
    color: var(--color-brand-blue);

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
`
