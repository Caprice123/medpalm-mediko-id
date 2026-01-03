import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const PageContainer = styled.div`
  min-height: calc(100vh - 90px);
  background: #f0fdfa;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`

export const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top-color: #06b6d4;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`
