import styled from 'styled-components'

export const EmptyChart = styled.div`
  width: 100%;
  text-align: center;
  padding: 1.5rem 0;
  color: #9ca3af;
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
  font-size: 0.72rem;
  color: #6b7280;
`

export const LegendDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.$color};
  flex-shrink: 0;
`
