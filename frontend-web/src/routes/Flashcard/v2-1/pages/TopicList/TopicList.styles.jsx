import styled, { keyframes } from 'styled-components'

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`

export const Container = styled.div`
  padding: 2rem;
  min-height: calc(100vh - 44px);

  @media (max-width: 768px) {
    min-height: 100vh;
  }
`

export const DashboardRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.75rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

// Used by DueTodayPanel (ProgressPanel, which also used this, is currently commented out)
export const PanelCard = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  animation: ${fadeSlideUp} 0.4s ease both;
  margin-bottom: 1.75rem;
`

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`

export const PanelTitle = styled.span`
  font-size: 1.05rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`

export const EmptyText = styled.div`
  font-size: 0.9rem;
  color: #9ca3af;
  text-align: center;
  padding: 1rem 0;
`
