import styled from 'styled-components'
import { colors } from '@config/colors'

// The chart keeps its column width and scrolls instead of squeezing; see BAR_SIZE.
export const ChartScroll = styled.div`
  width: 100%;
  overflow-x: auto;
`

export const ChartWidth = styled.div`
  min-width: ${p => p.$minWidth}px;
`

export const EmptyChart = styled.div`
  width: 100%;
  text-align: center;
  padding: 2rem 1rem;
  color: ${colors.neutral.gray400};
  font-size: 0.875rem;
`

export const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: ${colors.neutral.gray500};
`

export const LegendDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.$color};
  flex-shrink: 0;
`

export const TooltipBox = styled.div`
  background: ${colors.neutral.white};
  border: 1px solid ${colors.neutral.gray200};
  border-radius: 10px;
  padding: 0.6rem 0.875rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

export const TooltipTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${colors.neutral.gray900};
  margin-bottom: 0.35rem;
`

export const TooltipRow = styled.div`
  font-size: 0.8125rem;
  color: ${colors.neutral.gray700};
  line-height: 1.5;
`
