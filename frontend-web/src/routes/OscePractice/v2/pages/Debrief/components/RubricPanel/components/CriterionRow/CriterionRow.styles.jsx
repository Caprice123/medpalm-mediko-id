import styled from 'styled-components'
import { Numeric } from '../../../../Debrief.styles'

export const Row = styled.article`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-gray-100);

  &:last-of-type {
    border-bottom: none;
  }
`

export const Head = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 0.75rem;

  h3 {
    font-size: 0.9375rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-gray-800);
  }
`

export const Mark = styled(Numeric)`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ $color }) => $color};
  white-space: nowrap;
`

export const Bar = styled.div`
  height: 7px;
  margin: 0.5rem 0 0.4375rem;
  border-radius: 4px;
  background: var(--color-gray-100);
  overflow: hidden;

  i {
    display: block;
    height: 100%;
    border-radius: 4px;
    width: ${({ $value }) => Math.max(2, Math.min(100, $value))}%;
    background: ${({ $color }) => $color};
  }
`

// The arithmetic, shown rather than hidden: a student contesting a mark needs to see how the
// weight turned raw points into the station's score.
export const Arithmetic = styled(Numeric)`
  display: block;
  font-size: 0.75rem;
  color: var(--color-gray-500);
`

export const Comment = styled.p`
  margin: 0.625rem 0 0;
  font-size: 0.875rem;
  line-height: 1.65;
  color: var(--color-gray-700);
`

// The examiner's reasoning. Set apart because it is the part a student actually learns from,
// and separated by a rule rather than put in a box inside the row.
export const Reason = styled.div`
  margin-top: 0.625rem;
  padding-top: 0.625rem;
  border-top: 1px solid var(--color-gray-100);

  h4 {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 0 0 0.3125rem;
    color: var(--color-gray-500);
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.65;
    color: var(--color-gray-700);
  }
`
