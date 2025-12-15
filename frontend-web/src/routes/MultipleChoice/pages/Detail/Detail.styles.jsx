import styled from 'styled-components'

export const Container = styled.div`
  min-height: calc(100vh - 63px);
  background: #f0fdfa;
  padding: 3rem 1.5rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(107, 185, 232, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(107, 185, 232, 0.06) 0%, transparent 50%);
    pointer-events: none;
  }
`

export const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`

export const QuizContainer = styled.div`
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(107, 185, 232, 0.08);
  border: 2px solid transparent;
  animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #6BB9E8, #3b82f6);
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f1f5f9;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, #6BB9E8, #3b82f6);
  }
`

export const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6BB9E8, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  flex: 1;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const Description = styled.p`
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0.5rem 0 0 0;
  line-height: 1.6;
`

export const QuizInfo = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #f0f9ff, #fff);
  border-radius: 12px;
  border: 2px solid #bfdbfe;
`

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
`

export const Timer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.warning ? '#dc2626' : '#1e40af'};
  padding: 0.5rem 1rem;
  background: ${props => props.warning ? '#fee2e2' : '#dbeafe'};
  border-radius: 8px;
  border: 2px solid ${props => props.warning ? '#fca5a5' : '#93c5fd'};
  animation: ${props => props.warning ? 'pulse 1s infinite' : 'none'};

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 2rem;
`

export const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #6BB9E8, #3b82f6);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`

export const QuestionCard = styled.div`
  margin-bottom: 2rem;
`

export const QuestionText = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
`

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const OptionButton = styled.button`
  padding: 1rem 1.25rem;
  border: 2px solid ${props =>
    props.selected && props.showResult
      ? props.isCorrect ? '#10b981' : '#ef4444'
      : props.selected
        ? '#3b82f6'
        : '#e2e8f0'};
  background: ${props =>
    props.selected && props.showResult
      ? props.isCorrect ? '#ecfdf5' : '#fef2f2'
      : props.selected
        ? '#dbeafe'
        : 'white'};
  border-radius: 12px;
  font-size: 1rem;
  color: #0f172a;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  text-align: left;
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    background: #eff6ff;
    transform: translateX(4px);
  }

  &:disabled {
    opacity: 0.7;
  }
`

export const OptionLabel = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props =>
    props.selected && props.showResult
      ? props.isCorrect ? '#10b981' : '#ef4444'
      : props.selected
        ? '#3b82f6'
        : '#e2e8f0'};
  color: ${props => props.selected ? 'white' : '#64748b'};
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
`

export const OptionText = styled.span`
  flex: 1;
`

export const OptionIcon = styled.span`
  font-size: 1.25rem;
  margin-left: auto;
`

export const ExplanationBox = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: ${props => props.isCorrect ? '#ecfdf5' : '#fef3c7'};
  border: 2px solid ${props => props.isCorrect ? '#10b981' : '#fbbf24'};
  border-radius: 12px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

export const ExplanationLabel = styled.div`
  font-weight: 700;
  color: ${props => props.isCorrect ? '#059669' : '#92400e'};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const ExplanationText = styled.p`
  color: #334155;
  margin: 0;
  line-height: 1.6;
  font-size: 0.9375rem;
`

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f1f5f9;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`

export const ResultContainer = styled.div`
  text-align: center;
`

export const ResultScore = styled.div`
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #6BB9E8, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  letter-spacing: -2px;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`

export const ResultLabel = styled.p`
  font-size: 1.125rem;
  color: #475569;
  margin: 0.75rem 0 2rem 0;
  font-weight: 600;
`

export const ResultStatus = styled.div`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 2rem;
  background: ${props => props.passed ? '#ecfdf5' : '#fef2f2'};
  color: ${props => props.passed ? '#059669' : '#dc2626'};
  border: 2px solid ${props => props.passed ? '#10b981' : '#ef4444'};
`

export const AnswerReview = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f1f5f9;
  text-align: left;
`

export const ReviewTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1.5rem 0;
`

export const ReviewItem = styled.div`
  background: ${props => props.isCorrect ? '#ecfdf5' : '#fef2f2'};
  border: 2px solid ${props => props.isCorrect ? '#10b981' : '#ef4444'};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`

export const ReviewQuestion = styled.div`
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1rem;
`

export const ReviewAnswer = styled.div`
  font-size: 0.9375rem;
  color: #334155;
  margin-bottom: 0.5rem;
  display: flex;
  gap: 0.5rem;

  strong {
    min-width: 120px;
    color: #64748b;
  }
`

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(107, 185, 232, 0.2);
  border-top: 4px solid #6BB9E8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
