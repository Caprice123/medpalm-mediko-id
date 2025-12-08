import styled from 'styled-components'

export const Container = styled.div`
  min-height: calc(100vh - 63px);
  background: #f0f9ff;
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
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`

export const QuizForm = styled.div`
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(107, 185, 232, 0.1);
  border: 1px solid rgba(107, 185, 232, 0.1);
  animation: slideIn 0.5s ease;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 8rem);

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const FormHeader = styled.div`
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

export const FormTitle = styled.h2`
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

export const FormDescription = styled.p`
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0.5rem 0 0 0;
  line-height: 1.6;
`

export const QuizMainContent = styled.div`
  display: flex;
  gap: 2rem;
  flex: 1;
  overflow: hidden;
  margin-top: 1rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    overflow: visible;
  }
`

export const QuizImageSection = styled.div`
  flex: 0 0 45%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  max-height: calc(100vh - 20rem);
  position: sticky;
  top: 0;

  @media (max-width: 1024px) {
    flex: none;
    max-height: 400px;
    position: relative;
  }
`

export const QuizImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  background: #f8fafc;
`

export const QuestionsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 1024px) {
    overflow: visible;
  }
`

export const QuestionsSection = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 1rem;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;

    &:hover {
      background: #94a3b8;
    }
  }

  @media (max-width: 1024px) {
    overflow-y: visible;
    padding-right: 0;
  }
`

export const SubmitButtonContainer = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f1f5f9;
  flex-shrink: 0;
`

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1.25rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;

  &::before {
    content: '';
    width: 3px;
    height: 20px;
    background: linear-gradient(180deg, #6BB9E8, #3b82f6);
    border-radius: 2px;
  }

  @media (max-width: 1024px) {
    font-size: 1.125rem;
  }
`

export const QuestionCard = styled.div`
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: #6BB9E8;
    box-shadow: 0 4px 12px rgba(107, 185, 232, 0.1);
  }

  &:last-child {
    margin-bottom: 0.5rem;
  }
`

export const QuestionLabel = styled.label`
  display: block;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.75rem;
  line-height: 1.5;
`

export const QuestionInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9375rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  background: white;
  color: #1e293b;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: #6BB9E8;
    background: white;
    box-shadow: 0 0 0 4px rgba(107, 185, 232, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }

  &:hover:not(:focus) {
    border-color: #cbd5e1;
  }
`

export const ResultSection = styled.div`
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 3px solid #6BB9E8;
  border-radius: 24px;
  padding: 2.5rem;
  margin-top: 2.5rem;
  box-shadow: 0 20px 60px rgba(107, 185, 232, 0.15);
  animation: resultPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  @keyframes resultPop {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`

export const ResultHeader = styled.div`
  text-align: center;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid rgba(107, 185, 232, 0.2);
`

export const ScoreDisplay = styled.div`
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #6BB9E8, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`

export const ScoreLabel = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
`

export const AnswersReview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const AnswerCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border-left: 4px solid ${props => props.isCorrect ? '#10b981' : '#ef4444'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`

export const AnswerQuestion = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.75rem;
`

export const AnswerRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
`

export const AnswerItem = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`

export const AnswerItemLabel = styled.span`
  font-weight: 600;
  color: #64748b;
  min-width: 120px;
`

export const AnswerItemValue = styled.span`
  color: ${props =>
    props.type === 'correct' ? '#10b981' :
    props.type === 'wrong' ? '#ef4444' :
    '#334155'};
  font-weight: ${props => props.type ? '600' : '500'};
`

export const Explanation = styled.div`
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f0f9ff;
  border-radius: 8px;
  border-left: 3px solid #6BB9E8;
`

export const ExplanationLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #6BB9E8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
`

export const ExplanationText = styled.div`
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;
`

export const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  border: 2px solid #ef4444;
  border-radius: 12px;
  padding: 16px 20px;
  color: #991b1b;
  font-size: 14px;
  margin: 20px 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: '⚠️';
    font-size: 20px;
  }
`

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(107, 185, 232, 0.2);
  border-top: 3px solid #6BB9E8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
