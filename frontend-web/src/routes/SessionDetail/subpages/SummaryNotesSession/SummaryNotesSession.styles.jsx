import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%);
`

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%);
`

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e0f2fe;
  border-top: 4px solid #0891b2;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`
