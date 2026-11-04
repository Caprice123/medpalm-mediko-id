import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const PageContainer = styled.div`
  min-height: calc(100vh - 44px);
  background: var(--color-brand-blue-tint);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
    min-height: 100vh;
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
  border: 4px solid var(--color-gray-200);
  border-top-color: var(--color-brand-blue);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`
