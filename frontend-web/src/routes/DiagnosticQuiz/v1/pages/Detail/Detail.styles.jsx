import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  min-height: 100vh;
  background: var(--color-brand-blue-tint);
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
      radial-gradient(circle at 20% 30%, rgba(30, 115, 170, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(30, 115, 170, 0.06) 0%, transparent 50%);
    pointer-events: none;
  }
`

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`

export const QuizForm = styled.div`
  background: ${colors.background.paper};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const FormHeader = styled.div`
  background: ${colors.background.paper};
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`

export const BackButton = styled.button`
  background: white;
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-300);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: var(--color-gray-50);
    border-color: var(--color-gray-400);
  }
`

export const TopicInfo = styled.div`
  flex: 1;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-gray-900);
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }

  p {
    font-size: 0.875rem;
    color: var(--color-gray-500);
    margin: 0;
    line-height: 1.5;
  }
`

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;

  ${props => props.university && `
    background: var(--color-brand-blue-tint);
    color: ${colors.primary.dark};
    border: 1px solid ${colors.primary.main};
  `}

  ${props => props.semester && `
    background: var(--color-brand-green-tint);
    color: ${colors.success.dark};
    border: 1px solid ${colors.success.main};
  `}

  ${props => props.topic && `
    background: var(--color-warning-tint);
    color: #92400e;
    border: 1px solid var(--color-warning);
  `}
`

export const FormTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-brand-blue), var(--color-brand-blue));
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
  color: var(--color-gray-500);
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
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(30, 115, 170, 0.12);
  background: var(--color-surface-page);
  height: fit-content;
  position: sticky;
  top: 0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 32px rgba(30, 115, 170, 0.18);
    border-color: rgba(30, 115, 170, 0.2);
  }


  @media (max-width: 1024px) {
    flex: none;
    max-height: initial;
    position: relative;
  }
`

export const QuizImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  background: var(--color-surface-page);
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.95;
  }
`

export const EmbedFrame = styled.iframe`
  width: 100%;
  height: 100%;
  min-height: 520px;
  border: none;
  display: block;
  border-radius: 18px;

  @media (max-width: 1024px) {
    min-height: 70vh;
  }

  @media (max-width: 768px) {
    min-height: 65vh;
    border-radius: 12px;
  }
`

export const QuestionsContainer = styled.div`
  flex: 1;
  display: flex;
  max-height: 100vh;
  flex-direction: column;
  min-width: 0;

  @media (max-width: 1024px) {
    overflow: visible;
    max-height: initial;
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
    background: var(--color-gray-100);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-gray-300);
    border-radius: 4px;

    &:hover {
      background: var(--color-gray-400);
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
  border-top: 2px solid var(--color-gray-100);
  flex-shrink: 0;
`

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 1.25rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-gray-100);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;

  &::before {
    content: '';
    width: 3px;
    height: 20px;
    background: linear-gradient(180deg, var(--color-brand-blue), var(--color-brand-blue));
    border-radius: 2px;
  }

  @media (max-width: 1024px) {
    font-size: 1.125rem;
  }
`

export const QuestionCard = styled.div`
  background: white;
  border: 2px solid var(--color-gray-200);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(30, 115, 170, 0.05);
  position: relative;

  &:hover {
    box-shadow: 0 8px 20px rgba(30, 115, 170, 0.15);
    transform: translateX(4px);

    &::before {
      opacity: 1;
    }
  }

  &:last-child {
    margin-bottom: 0.5rem;
  }
`

export const QuestionLabel = styled.label`
  display: block;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: 0.75rem;
  line-height: 1.5;
`

export const QuestionInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--color-gray-200);
  border-radius: 12px;
  font-size: 0.9375rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  background: white;
  color: var(--color-gray-800);
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: var(--color-brand-blue);
    background: white;
    box-shadow: 0 0 0 4px rgba(30, 115, 170, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: var(--color-gray-400);
    font-weight: 400;
  }

  &:hover:not(:focus) {
    border-color: var(--color-gray-300);
  }
`

export const ResultHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, rgba(30, 115, 170, 0.08), rgba(30, 115, 170, 0.05));
  border-radius: 20px;
  border: 2px solid rgba(30, 115, 170, 0.2);
  position: relative;
  overflow: hidden;
  animation: resultPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-brand-blue), var(--color-brand-blue));
  }

  &::after {
    content: '🎉';
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 2rem;
    opacity: 0.3;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes resultPop {
    0% {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    60% {
      transform: scale(1.02) translateY(0);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`

export const ResultScoreSection = styled.div`
  text-align: center;
`

export const CelebrationHeader = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--color-brand-blue), var(--color-brand-blue-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

export const ScoreDisplay = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--color-brand-blue), var(--color-brand-blue-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
  letter-spacing: -1px;
  position: relative;
  display: inline-block;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  &::after {
    content: attr(data-score);
    position: absolute;
    left: 0;
    top: 0;
    filter: blur(20px);
    opacity: 0.3;
    z-index: -1;
  }

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`

export const ScoreLabel = styled.p`
  font-size: 0.9375rem;
  color: var(--color-gray-600);
  margin: 0.5rem 0 1.25rem 0;
  font-weight: 600;
`

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin: 1.5rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const StatCard = styled.div`
  background: ${props => {
    if (props.type === 'correct') return 'var(--color-brand-green-tint)';
    if (props.type === 'wrong') return 'var(--color-danger-tint-soft)';
    return 'var(--color-brand-blue-tint)';
  }};
  border: 2px solid ${props => {
    if (props.type === 'correct') return 'var(--color-brand-green)';
    if (props.type === 'wrong') return 'var(--color-danger)';
    return 'var(--color-brand-blue)';
  }};
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`

export const StatIcon = styled.div`
  font-size: 1.125rem;
  margin-bottom: 0.375rem;
`

export const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 900;
  color: ${props => {
    if (props.type === 'correct') return 'var(--color-brand-green-darker)';
    if (props.type === 'wrong') return 'var(--color-danger-dark)';
    return 'var(--color-brand-blue-deep)';
  }};
  margin-bottom: 0.25rem;
`

export const StatLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-gray-600);
`

export const AnswersReview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 1rem;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-gray-100);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-gray-300);
    border-radius: 4px;

    &:hover {
      background: var(--color-gray-400);
    }
  }

  @media (max-width: 1024px) {
    overflow-y: visible;
    padding-right: 0;
  }
`

export const AnswerCard = styled.div`
  background: ${props => props.isCorrect
    ? 'linear-gradient(135deg, var(--color-brand-green-tint) 0%, var(--color-brand-green-tint) 100%)'
    : 'linear-gradient(135deg, var(--color-danger-tint-soft) 0%, var(--color-danger-tint) 100%)'};
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid ${props => props.isCorrect ? 'var(--color-brand-green)' : 'var(--color-danger)'};
  box-shadow: 0 4px 12px ${props => props.isCorrect
    ? 'rgba(124, 179, 66, 0.1)'
    : 'rgba(239, 68, 68, 0.1)'};
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: ${props => props.isCorrect ? "'✓'" : "'✗'"};
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${props => props.isCorrect ? 'var(--color-brand-green)' : 'var(--color-danger)'};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 700;
    box-shadow: 0 4px 12px ${props => props.isCorrect
      ? 'rgba(124, 179, 66, 0.3)'
      : 'rgba(239, 68, 68, 0.3)'};
    z-index: 10;
  }

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 8px 20px ${props => props.isCorrect
      ? 'rgba(124, 179, 66, 0.2)'
      : 'rgba(239, 68, 68, 0.2)'};
  }
`

export const AnswerQuestion = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
  padding-right: 3rem;
  line-height: 1.5;
`

export const AnswerRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.9375rem;
`

export const AnswerItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.6);
  padding: 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
  }
`

export const AnswerItemLabel = styled.span`
  font-weight: 700;
  color: var(--color-gray-600);
  font-size: 0.875rem;

  @media (min-width: 640px) {
    min-width: 120px;
  }
`

export const AnswerItemValue = styled.span`
  color: ${props =>
    props.type === 'correct' ? 'var(--color-brand-green-dark)' :
    props.type === 'wrong' ? 'var(--color-danger-dark)' :
    'var(--color-gray-700)'};
  font-weight: 600;
  flex: 1;
  padding: 0.625rem 0.875rem;
  background: white;
  border-radius: 8px;
  border: 2px solid ${props =>
    props.type === 'correct' ? 'var(--color-brand-green-tint)' :
    props.type === 'wrong' ? 'var(--color-danger-tint)' :
    'var(--color-gray-200)'};
  word-break: break-word;
`

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
`

export const OptionButton = styled.button`
  padding: 0.875rem 1rem;
  border: 2px solid ${props => props.selected ? 'var(--color-brand-blue)' : 'var(--color-gray-200)'};
  background: ${props => props.selected ? 'var(--color-surface-page)' : 'white'};
  border-radius: 12px;
  font-size: 0.9375rem;
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

export const ErrorText = styled.p`
  color: var(--color-danger);
  font-size: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 0;
  font-weight: 500;
`

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(30, 115, 170, 0.2);
  border-top: 3px solid var(--color-brand-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
