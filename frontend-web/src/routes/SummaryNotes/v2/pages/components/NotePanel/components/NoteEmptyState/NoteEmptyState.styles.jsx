import styled from 'styled-components'

export const EmptyPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
  color: #9ca3af;
  padding: 3rem;
  text-align: center;
  position: relative;

  @media (max-width: 768px) {
    min-height: 100vh;
  }
`

export const EmptyIcon = styled.div`
  font-size: 3rem;
  opacity: 0.5;
`

export const EmptyText = styled.p`
  font-size: 1rem;
  margin: 0;
`
