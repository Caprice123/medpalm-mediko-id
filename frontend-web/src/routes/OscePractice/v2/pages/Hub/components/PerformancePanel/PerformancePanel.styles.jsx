import styled from 'styled-components'
import { Numeric } from '../../../../styles/surface.styles'

// The plot's column widths live here as custom properties because three things have to agree
// on them: every row, the scale under them, and the 75 rule drawn over the whole block. A
// number repeated in three rules is a number that drifts.
export const Plot = styled.div`
  --name-w: 13.125rem;
  --score-w: 2rem;
  --cases-w: 5rem;
  --col-gap: 0.875rem;
  --edge: 1.25rem;

  position: relative;
  padding: 1.75rem 0 0.625rem;

  @media (max-width: 760px) {
    --name-w: 6.75rem;
    --cases-w: 0rem;
    --col-gap: 0.625rem;
  }
`

const columns = `
  display: grid;
  grid-template-columns: var(--name-w) minmax(0, 1fr) var(--score-w) var(--cases-w);
  gap: 0 var(--col-gap);
`

// A row, not a card: the hairline is the only separator, and the whole row is the control.
export const Row = styled.button`
  ${columns}
  align-items: center;
  width: 100%;
  text-align: left;
  /* The edge padding sits on the row rather than on the plot, so the hover reaches the panel
     edge on its own instead of having to paint outside the row and be clipped back. */
  padding: 0.4375rem var(--edge);
  border: none;
  background: transparent;

  & + & {
    border-top: 1px solid var(--color-gray-100);
  }

  &:hover {
    background: var(--color-brand-blue-tint);
  }
`

export const Name = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-gray-700);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Bar = styled.span`
  display: block;
  height: 0.625rem;
  border-radius: 4px;
  background: var(--color-gray-100);

  i {
    display: block;
    height: 100%;
    border-radius: 4px;
    width: ${({ $value }) => Math.max(2, Math.min(100, $value))}%;
    background: ${({ $color }) => $color};
    /* Two pixels of surface between the fill and the track it sits in, so a bar that nearly
       fills its track still reads as a measured length rather than as a full track. */
    box-shadow: 0 0 0 2px var(--color-surface);
  }
`

export const Score = styled(Numeric)`
  font-size: 0.8125rem;
  font-weight: 700;
  text-align: right;
  color: ${({ $color }) => $color};
`

export const Cases = styled.span`
  font-size: 0.75rem;
  text-align: right;
  white-space: nowrap;
  color: var(--color-gray-400);

  @media (max-width: 760px) {
    display: none;
  }
`

// The 0–100 scale, so every label names a value the chart can actually reach. It sits under
// the bars in the same grid, so its ticks line up with the track rather than with the panel.
export const Scale = styled.div`
  ${columns}
  margin-top: 0.5rem;
  padding: 0 var(--edge);

  > span {
    grid-column: 2;
    display: flex;
    justify-content: space-between;
    font-size: 0.6875rem;
    color: var(--color-gray-400);
  }
`

// The mark a station is expected to clear, drawn over the plot.
//
// The band colours alone cannot carry this. Measured, the amber and the red of the score bands
// sit 1.5 ΔE apart under protanopia — for a red-blind reader they are the same colour — so
// "did this topic clear 75" has to be readable from position as well as from hue. The score
// printed at the end of every row is the third encoding.
export const TargetRule = styled.div`
  position: absolute;
  top: 1.0625rem;
  bottom: 1.875rem;
  left: calc(
    var(--edge) + var(--name-w) + var(--col-gap)
    + (100% - var(--edge) * 2 - var(--name-w) - var(--score-w) - var(--cases-w)
       - var(--col-gap) * 3) * 0.75
  );
  width: 0;
  border-left: 1px dashed var(--color-gray-400);
  pointer-events: none;

  span {
    position: absolute;
    top: -1rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0 0.25rem;
    font-size: 0.625rem;
    font-weight: 600;
    white-space: nowrap;
    color: var(--color-gray-500);
    background: var(--color-surface);
  }
`

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem 1rem;
  padding: 0.625rem 1.25rem 1rem;
`

export const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-gray-500);
`

export const LegendDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`

export const Hint = styled.span`
  flex-basis: 100%;
  font-size: 0.75rem;
  color: var(--color-gray-400);
`

export const EmptyRows = styled.p`
  margin: 0;
  padding: 0.25rem 1.25rem 1.25rem;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--color-gray-500);
`

export const Count = styled.span`
  font-size: 0.8125rem;
  color: var(--color-gray-500);
`
