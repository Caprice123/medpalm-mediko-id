import styled from 'styled-components'

export const ModalContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const WarningIcon = styled.div`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
`

export const ProcessingIcon = styled.div`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
  animation: spin 2s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

export const Message = styled.p`
  font-size: 1.125rem;
  color: #1f2937;
  text-align: center;
  line-height: 1.6;
  margin: 0;
`

export const BulletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
`

export const BulletItem = styled.div`
  color: #4b5563;
  font-size: 0.938rem;
  line-height: 1.5;
`

export const ProcessingSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
`

export const ProcessingStep = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  opacity: ${props => props.completed ? 1 : 0.7};
`

export const StepIcon = styled.div`
  font-size: 1.25rem;
  min-width: 1.5rem;
  text-align: center;
`

export const StepText = styled.div`
  font-size: 1rem;
  color: ${props => props.completed ? '#10b981' : '#4b5563'};
  font-weight: ${props => props.completed ? '600' : '400'};
  transition: all 0.3s ease;
`

export const SubMessage = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  font-style: italic;
  margin: 0;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`
