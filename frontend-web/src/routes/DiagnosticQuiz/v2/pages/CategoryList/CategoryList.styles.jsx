import styled from 'styled-components'

export const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
`

export const EmptyWrap = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #9ca3af;
  background: #fff;
  border-radius: 16px;
  border: 1.5px dashed #e5e7eb;
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
