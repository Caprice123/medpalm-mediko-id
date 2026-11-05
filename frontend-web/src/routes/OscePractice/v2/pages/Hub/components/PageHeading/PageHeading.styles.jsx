import styled from 'styled-components'
import { Numeric } from '../../../../styles/surface.styles'

// A named-area grid rather than a wrapping flex row, because the two layouts want different
// orders: wide reads title / last result / action across one line, and a phone wants the action
// pulled up beside the title in the corner, with the last result on its own line below. Flex
// can only reorder by fighting the DOM order; areas just name where each part goes.
export const Heading = styled.header`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  grid-template-areas: 'titles result action';
  align-items: end;
  gap: 0.875rem 1.25rem;
  margin-bottom: 1.125rem;

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      'titles action'
      'result result';
    align-items: start;
  }
`

export const Titles = styled.div`
  grid-area: titles;

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.15;
    margin: 0;
    color: var(--color-gray-800);
  }

  p {
    margin: 0.3125rem 0 0;
    font-size: 0.875rem;
    color: var(--color-gray-600);
  }
`

// The last mark, read as a sentence rather than as a tile. It sits at the end of the heading
// row because it is the one number a returning student looks for before anything else.
export const LastResult = styled.a`
  grid-area: result;
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  min-width: 0;
  font-size: 0.875rem;
  color: var(--color-gray-600);

  &:hover {
    color: var(--color-brand-blue);
  }

  /* The station title is the one part of this sentence with no length limit, so it is the part
     that truncates — capped and ellipsised rather than allowed to wrap the heading and crush
     the Pilih kasus button beside it. The score stays whole: it is what the line is read
     for, and it must never be the half that gets cut. */
  strong {
    max-width: 22ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--color-gray-800);
    font-weight: 600;
  }
`

export const ResultScore = styled(Numeric)`
  font-weight: 700;
  color: ${({ $color }) => $color};
`

// Not a `Button`: it goes somewhere rather than doing something, and the student must be able
// to open the catalogue in a new tab. Styled to carry the weight of the page's main action.
export const StationsLink = styled.a`
  grid-area: action;
  /* Hard right in both layouts: the grid own auto track already ends at the right edge on a
     wide screen, and this is what holds it in the corner once the phone layout gives it a
     two-column row to share with the heading. */
  justify-self: end;
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  padding: 0.625rem 1.125rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-surface);
  background: var(--color-brand-blue);
  border: 1px solid var(--color-brand-blue);
  transition: background 140ms ease-out, box-shadow 140ms ease-out;

  &:hover {
    color: var(--color-surface);
    background: var(--color-brand-blue-deep);
    box-shadow: 0 4px 12px -6px rgba(4, 74, 119, 0.5);
  }

  svg {
    flex: none;
  }
`
