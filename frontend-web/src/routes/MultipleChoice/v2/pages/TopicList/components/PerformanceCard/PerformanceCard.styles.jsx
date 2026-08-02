import styled, { keyframes } from 'styled-components'

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`

export const PanelCard = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  margin-bottom: 1.25rem;
  animation: ${fadeSlideUp} 0.4s ease both;
  overflow: hidden;
`

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
`

export const PanelHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`

export const PanelTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const PanelFilterWrap = styled.div`
  width: 220px;
  flex-shrink: 0;
`

export const PanelTitle = styled.span`
  font-size: 1.125rem;
  font-weight: 800;
  color: #111827;
`

export const PanelSubtitle = styled.span`
  font-size: 0.9375rem;
  color: #6b7280;
`
