import styled from 'styled-components'
import { Numeric } from '../../Debrief.styles'

// How the station's score was assembled. Shown as a footer under the criteria rather than as a
// second headline, because the authoritative percentage is already in the band above and two
// competing totals is how a student loses trust in both.
export const Arithmetic = styled.footer`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  border-top: 1px solid var(--color-gray-200);
  background: var(--color-gray-50);

  span {
    font-size: 0.8125rem;
    color: var(--color-gray-600);
  }
`

export const WeightedTotal = styled(Numeric)`
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-gray-800);
`
