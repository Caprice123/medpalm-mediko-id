import styled from 'styled-components'

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 2rem;
`

export const QuizContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`

export const ImageSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 2rem;
  height: fit-content;
`

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
`

export const QuizImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  cursor: zoom-in;
  transition: transform 0.3s ease;

  ${props => props.zoomed && `
    cursor: zoom-out;
    transform: scale(1.5);
  `}
`

export const ImageHint = styled.p`
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
  margin-top: 1rem;
`

export const QuestionsSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`

export const QuizHeader = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
`

export const QuizTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6BB9E8, #8DC63F);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`

export const QuizDescription = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 1rem;
`

export const QuestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const QuestionCard = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid ${props => props.hasError ? '#fecaca' : '#e2e8f0'};
  transition: all 0.2s;

  &:focus-within {
    border-color: #6BB9E8;
    box-shadow: 0 0 0 3px rgba(107, 185, 232, 0.1);
  }
`

export const QuestionNumber = styled.div`
  font-weight: 700;
  color: #6BB9E8;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`

export const QuestionLabel = styled.p`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.6;
`

export const AnswerInput = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6BB9E8;
    box-shadow: 0 0 0 3px rgba(107, 185, 232, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`

export const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`

export const SubmitSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const SubmitButton = styled.button`
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #6BB9E8, #8DC63F);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(107, 185, 232, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(107, 185, 232, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

export const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
  }
`

export const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  color: #6BB9E8;
  font-size: 1.25rem;
`

export const ErrorMessage = styled.div`
  max-width: 600px;
  margin: 4rem auto;
  padding: 2rem;
  background: #fee2e2;
  border-radius: 12px;
  border: 2px solid #fecaca;
  color: #991b1b;
  text-align: center;
`

export const SubscriptionGate = styled.div`
  max-width: 600px;
  margin: 4rem auto;
  padding: 3rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
`

export const GateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`

export const GateTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
`

export const GateText = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`

export const GateButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #6BB9E8, #8DC63F);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(107, 185, 232, 0.4);
  }
`
