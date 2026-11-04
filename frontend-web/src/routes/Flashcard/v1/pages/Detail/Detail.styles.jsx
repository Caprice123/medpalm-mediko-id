import styled from 'styled-components'

export const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--color-brand-blue-tint);
`

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
`

export const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-gray-200);
  border-top-color: var(--color-brand-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`
