import styled from 'styled-components'
import { colors } from '@config/colors'

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: ${colors.text.secondary};
`

export const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${colors.neutral.gray200};
  border-top-color: ${colors.primary.main};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${colors.text.disabled};
  font-size: 0.9375rem;
`
