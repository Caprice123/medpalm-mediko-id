import styled from 'styled-components'

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

export const Header = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const TopicInfo = styled.div`
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #f59e0b;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6b7280;
    font-size: 0.875rem;
  }
`

export const BackButton = styled.button`
  background: #e5e7eb;
  color: #374151;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #d1d5db;
  }
`

export const QuestionCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`

export const QuestionNumber = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #06b6d4;
  margin-bottom: 1rem;
`

export const QuestionText = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`

export const AnswerInput = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #06b6d4;
  }
`

export const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`

export const NavButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
    }
  ` : `
    background: #e5e7eb;
    color: #374151;

    &:hover {
      background: #d1d5db;
    }
  `}

  &:disabled {
    background: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

export const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1rem;
`

export const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`
