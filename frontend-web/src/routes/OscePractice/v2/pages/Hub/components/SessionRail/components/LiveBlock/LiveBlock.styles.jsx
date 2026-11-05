import styled from 'styled-components'
import { Numeric } from '../../../../../../styles/surface.styles'

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

  /* Station titles are written to describe a case, not to fit a rail — "Interpretasi
     Pemeriksaan Radiologi Sistem Muskuloskeletal dan Tulang Belakang Abnormal - Pasien 5" is
     five lines of this type at 340px, which pushes the Lanjutkan button off the fold. Three
     lines is enough to tell two stations apart; the full title is on hover, and the station's
     own brief rail shows it whole. */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const StationMeta = styled.p`
  font-size: 0.8125rem;
  margin: 0;
  color: ${({ $live }) => ($live ? 'var(--color-brand-blue-tint)' : 'var(--color-gray-500)')};
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

  a {
    font-weight: 600;
    color: var(--color-brand-blue);

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
`

