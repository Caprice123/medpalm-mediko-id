import styled, { keyframes } from 'styled-components'

export const PageContainer = styled.div`
  min-height: calc(100vh - 90px);
  background: #f0fdfa;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #6b7280;
`

export const LoadingSpinner = styled.div`
  border: 4px solid #e5e7eb;
  border-top: 4px solid #0891b2;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: ${spin} 1s linear infinite;
`
