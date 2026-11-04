import styled from 'styled-components'

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-surface-page) 0%, var(--color-brand-blue-tint) 100%);
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
  border: 2px solid var(--color-gray-200);
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
  color: var(--color-gray-400);
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
  border-bottom: 2px solid var(--color-gray-200);
`

export const QuizTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-brand-blue), var(--color-brand-blue-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`

export const QuizDescription = styled.p`
  color: var(--color-gray-500);
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
  background: var(--color-surface-page);
  border-radius: 12px;
  border: 2px solid ${props => props.hasError ? '#fecaca' : 'var(--color-gray-200)'};
  transition: all 0.2s;
  margin: 1rem 0;

  &:focus-within {
    border-color: var(--color-brand-blue);
    box-shadow: 0 0 0 3px rgba(30, 115, 170, 0.1);
  }
`

export const QuestionNumber = styled.div`
  font-weight: 700;
  color: var(--color-brand-blue);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`

export const QuestionLabel = styled.p`
  font-size: 1rem;
  color: var(--color-gray-800);
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.6;
`

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.75rem;
`

export const OptionButton = styled.button`
  padding: 1rem 1.25rem;
  border: 2px solid ${props => props.selected ? 'var(--color-brand-blue)' : 'var(--color-gray-200)'};
  background: ${props => props.selected ? 'var(--color-surface-page)' : 'white'};
  border-radius: 12px;
  font-size: 1rem;
  color: var(--color-gray-900);
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;

  &:hover {
    border-color: var(--color-brand-blue);
    background: var(--color-surface-page);
    transform: translateY(-2px);
  }
`

export const OptionLabel = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.selected ? 'var(--color-brand-blue)' : 'var(--color-gray-200)'};
  color: ${props => props.selected ? 'white' : 'var(--color-gray-500)'};
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
`

export const OptionText = styled.span`
  flex: 1;
`

export const AnswerInput = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-brand-blue);
    box-shadow: 0 0 0 3px rgba(30, 115, 170, 0.1);
  }

  &::placeholder {
    color: var(--color-gray-400);
  }
`

export const ErrorText = styled.p`
  color: var(--color-danger);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`

export const SubmitSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--color-gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  color: var(--color-brand-blue);
  font-size: 1.25rem;
`

export const ErrorMessage = styled.div`
  max-width: 600px;
  margin: 4rem auto;
  padding: 2rem;
  background: var(--color-danger-tint);
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
  color: var(--color-gray-800);
  margin-bottom: 1rem;
`

export const GateText = styled.p`
  color: var(--color-gray-500);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`
