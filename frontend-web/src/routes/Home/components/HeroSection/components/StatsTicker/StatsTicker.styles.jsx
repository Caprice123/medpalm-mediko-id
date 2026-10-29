import styled, { keyframes } from 'styled-components'
import { colors, fonts, layout } from '../../../../theme'

// The track holds TRACK_COPIES identical copies and shifts by exactly one of
// them, so the end state is visually identical to the start.
//
// One copy must not be the whole shift budget: after moving by 1/N of the
// track, (N-1)/N of it still has to cover the viewport, or the tail runs out
// and leaves a gap on the right. With 4 copies of a ~1300px list that is
// ~3900px of cover — enough for any realistic screen.
const scroll = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-25%); }
`

export const TickerBar = styled.div`
  background: ${colors.tickerBackground};
  /* The hero subtracts this from the viewport so the two fill one screen. */
  height: ${layout.tickerHeight};
  display: flex;
  align-items: center;
  overflow: hidden;
`

export const TickerTrack = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  animation: ${scroll} 38s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const TickerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 28px;
  white-space: nowrap;
`

export const TickerValue = styled.span`
  font-family: ${fonts.display};
  font-weight: 600;
  font-size: 20px;
  line-height: 1.6;
  letter-spacing: -0.2px;
  color: ${colors.textPrimary};
`

export const TickerLabel = styled.span`
  font-family: ${fonts.body};
  font-weight: 500;
  font-size: 15px;
  line-height: 1.6;
  color: ${colors.textMuted};
`

export const TickerDivider = styled.img`
  height: 28px;
  width: 1px;
  flex-shrink: 0;
`
