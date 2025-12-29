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
`

export const TopicInfo = styled.div`
  margin-top: 0.5rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #06b6d4;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.5;
  }
`

export const BackButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    color: #374151;
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

export const InlineInput = styled.input`
  display: inline-block;
  min-width: 200px;
  padding: 0.5rem 0.75rem;
  margin: 0 0.25rem;
  border: none;
  border-bottom: 2px solid #06b6d4;
  background: transparent;
  font-size: 1.125rem;
  font-weight: 600;
  font-family: inherit;
  color: #06b6d4;
  text-align: center;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-bottom: 2px solid #0891b2;
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`

export const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1.5rem;
`

export const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`

export const ResultContainer = styled.div`
  text-align: center;
  padding: 2rem 0;
`

export const ResultScore = styled.div`
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
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
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  line-height: 1.6;

  .blank {
    background: #fef3c7;
    color: #92400e;
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    font-weight: 600;
    border: 1px solid #fde047;
  }
`

export const ReviewAnswer = styled.div`
  margin-bottom: 0.5rem;
  font-size: 0.9375rem;
  color: #475569;
  line-height: 1.5;

  strong {
    color: #0f172a;
    margin-right: 0.5rem;
  }

  span {
    color: #334155;
  }
`

export const ExplanationBox = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.isCorrect ? '#ecfdf5' : '#fef3c7'};
  border: 2px solid ${props => props.isCorrect ? '#10b981' : '#fbbf24'};
  border-radius: 8px;
`

export const ExplanationLabel = styled.div`
  font-weight: 700;
  color: ${props => props.isCorrect ? '#059669' : '#92400e'};
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

export const ExplanationText = styled.p`
  color: #334155;
  margin: 0;
  line-height: 1.6;
  font-size: 0.9375rem;
`
