import styled from 'styled-components'
import { Numeric, HairlineRow } from '../../../../../../styles/surface.styles'

export const Row = styled(HairlineRow)`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 150px 112px 104px;
  align-items: center;
  gap: 0.875rem;

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.5rem;
  }
`

export const Title = styled.h3`
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
  color: var(--color-gray-800);
`

export const When = styled(Numeric)`
  display: block;
  margin-top: 0.1875rem;
  font-size: 0.75rem;
  color: var(--color-gray-500);
`

// Session states (belum dimulai / berlangsung / selesai dinilai / waktu habis) have no common
// equivalent — the shared StatusBadge only speaks draft/testing/published — so the pill is
// local, in the palette's status colours.
export const StateBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5625rem;
  border-radius: 7px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;

  ${({ $state }) => {
    if ($state === 'started') {
      return `
        background: var(--color-warning-tint);
        color: var(--color-warning-text);
      `
    }
    if ($state === 'completed') {
      return `
        background: var(--color-brand-green-tint);
        color: var(--color-brand-green-darker);
      `
    }
    if ($state === 'expired') {
      return `
        background: var(--color-danger-tint);
        color: var(--color-danger-dark);
      `
    }
    return `
      background: var(--color-brand-blue-tint);
      color: var(--color-brand-blue-deep);
    `
  }}
`

export const Score = styled(Numeric)`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ $color }) => $color};

  small {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-gray-500);
    margin-left: 0.1875rem;
  }
`

export const NoScore = styled.span`
  font-size: 0.8125rem;
  color: var(--color-gray-500);
`

export const Action = styled.div`
  display: flex;
  justify-content: flex-end;
`
