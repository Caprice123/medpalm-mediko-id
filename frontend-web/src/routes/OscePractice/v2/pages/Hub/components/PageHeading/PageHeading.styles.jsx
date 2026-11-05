import styled from 'styled-components'
import { Numeric } from '../../Hub.styles'

export const Heading = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.75rem 1.25rem;
  margin-bottom: 1.125rem;

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.15;
    margin: 0;
    color: var(--color-gray-800);
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-gray-600);
  }
`

// The last mark, read as a sentence rather than as a tile. It sits at the end of the heading
// row because it is the one number a returning student looks for before anything else.
export const LastResult = styled.a`
  margin-left: auto;
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-gray-600);

  &:hover {
    color: var(--color-brand-blue);
  }

  strong {
    color: var(--color-gray-800);
    font-weight: 600;
  }
`

export const ResultScore = styled(Numeric)`
  font-weight: 700;
  color: ${({ $color }) => $color};
`
