import styled from 'styled-components'

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

export const Header = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

export const TopicTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ec4899;
  margin: 0 0 1rem 0;
`

export const ProgressBar = styled.div`
  position: relative;
  width: 100%;
  height: 32px;
  background: #f3f4f6;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 1rem;
`

export const ProgressFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(90deg, #ec4899 0%, #f472b6 100%);
  transition: width 0.3s;
`

export const ProgressText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  z-index: 1;
`

export const TimerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.warning ? '#fee2e2' : '#ecfdf5'};
  border: 2px solid ${props => props.warning ? '#ef4444' : '#10b981'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
`

export const TimerText = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.warning ? '#991b1b' : '#065f46'};
`

export const QuestionContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

export const QuestionNumber = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 1rem;
`

export const QuestionText = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
`

export const QuestionImage = styled.img`
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 2px solid #e5e7eb;
`

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const OptionCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#ec4899' : '#e5e7eb'};
  border-radius: 8px;
  background: ${props => props.selected ? '#fdf2f8' : 'white'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #ec4899;
    background: #fdf2f8;
  }
`

export const OptionLabel = styled.div`
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ec4899;
  color: white;
  font-weight: 700;
  border-radius: 50%;
  flex-shrink: 0;
`

export const OptionText = styled.div`
  flex: 1;
  font-size: 1rem;
  color: #374151;
  line-height: 1.5;
  padding-top: 0.25rem;
`

export const NavigationContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
  }
`

export const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 640px) {
    width: 100%;
  }
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    flex: 1;
  }
`

export const BackButton = styled(Button)`
  background: #f3f4f6;
  color: #374151;

  &:hover:not(:disabled) {
    background: #e5e7eb;
  }
`

export const PreviousButton = styled(Button)`
  background: #f3f4f6;
  color: #374151;

  &:hover:not(:disabled) {
    background: #e5e7eb;
  }
`

export const NextButton = styled(Button)`
  background: #ec4899;
  color: white;

  &:hover:not(:disabled) {
    background: #db2777;
  }
`

export const SubmitButton = styled(Button)`
  background: #10b981;
  color: white;

  &:hover:not(:disabled) {
    background: #059669;
  }
`

export const WarningText = styled.div`
  background: #fef3c7;
  border: 2px solid #f59e0b;
  color: #92400e;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
`
