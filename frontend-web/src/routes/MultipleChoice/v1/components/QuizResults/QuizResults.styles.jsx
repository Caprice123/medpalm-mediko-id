import styled from 'styled-components'

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

export const Header = styled.div`
  margin-bottom: 2rem;
`

export const ResultCard = styled.div`
  background: ${props => props.passed ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'};
  border: 3px solid ${props => props.passed ? '#10b981' : '#ef4444'};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

export const ScoreCircle = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: ${props => props.passed ? '#10b981' : '#ef4444'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`

export const ScoreText = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: white;
`

export const ScoreLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  opacity: 0.9;
`

export const ResultStatus = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`

export const StatusText = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.passed ? '#065f46' : '#991b1b'};
  margin: 0;
`

export const ResultSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`

export const SummaryItem = styled.div`
  text-align: center;
  background: white;
  padding: 1rem;
  border-radius: 8px;
`

export const SummaryLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`

export const SummaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`

export const QuestionReview = styled.div`
  margin-bottom: 1.5rem;
`

export const ReviewTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1.5rem 0;
`

export const QuestionCard = styled.div`
  background: white;
  border: 2px solid ${props => props.correct ? '#10b981' : '#ef4444'};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

export const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

export const QuestionNumber = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
`

export const ResultBadge = styled.div`
  background: ${props => props.correct ? '#d1fae5' : '#fee2e2'};
  color: ${props => props.correct ? '#065f46' : '#991b1b'};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 700;
`

export const QuestionText = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.6;
  margin-bottom: 1rem;
`

export const QuestionImage = styled.img`
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 2px solid #e5e7eb;
`

export const OptionsReview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`

export const OptionReviewCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid ${props => {
    if (props.correctAnswer) return '#10b981'
    if (props.userAnswer) return '#ef4444'
    return '#e5e7eb'
  }};
  border-radius: 8px;
  background: ${props => {
    if (props.correctAnswer) return '#ecfdf5'
    if (props.userAnswer) return '#fee2e2'
    return 'white'
  }};
`

export const OptionLabel = styled.div`
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    if (props.correctAnswer) return '#10b981'
    if (props.userAnswer) return '#ef4444'
    return '#9ca3af'
  }};
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

export const ExplanationBox = styled.div`
  background: #fef3c7;
  border: 2px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`

export const ExplanationTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 0.5rem;
`

export const ExplanationText = styled.div`
  font-size: 0.875rem;
  color: #78350f;
  line-height: 1.6;
`

export const ActionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  @media (max-width: 640px) {
    width: 100%;
  }
`

export const RetryButton = styled(Button)`
  background: #ec4899;
  color: white;

  &:hover {
    background: #db2777;
  }
`

export const BackButton = styled(Button)`
  background: #f3f4f6;
  color: #374151;

  &:hover {
    background: #e5e7eb;
  }
`
