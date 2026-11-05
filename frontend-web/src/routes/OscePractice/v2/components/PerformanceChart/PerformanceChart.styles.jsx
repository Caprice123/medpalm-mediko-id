import styled from 'styled-components'

// The chart keeps its column width and scrolls instead of squeezing; see BAR_SIZE.
export const ChartScroll = styled.div`
  width: 100%;
  overflow-x: auto;
  scrollbar-color: var(--color-gray-300) transparent;
`

export const ChartWidth = styled.div`
  min-width: ${({ $minWidth }) => $minWidth}px;
`

export const EmptyChart = styled.div`
  width: 100%;
  text-align: center;
  padding: 2.5rem 1rem;
  color: var(--color-gray-500);
  font-size: 0.875rem;
  line-height: 1.6;
`

export const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;
`

export const LegendItem = styled.div`
  display: flex;
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

export const TooltipBox = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  padding: 0.625rem 0.875rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

export const TooltipTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 0.375rem;
`

export const TooltipRow = styled.div`
  font-size: 0.8125rem;
  color: var(--color-gray-700);
  line-height: 1.5;

  strong {
    font-variant-numeric: tabular-nums;
  }
`
