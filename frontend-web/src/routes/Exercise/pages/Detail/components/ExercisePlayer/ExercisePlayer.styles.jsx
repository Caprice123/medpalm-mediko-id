import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
`

export const Header = styled.div`
  background: ${colors.background.paper};
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  position: relative;
`

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

export const ProgressBadge = styled.div`
  background: linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main});
  color: ${colors.text.inverse};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(107, 185, 232, 0.3);
`

export const TopicInfo = styled.div`
  margin-bottom: 1rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${colors.primary.main};
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    color: ${colors.text.secondary};
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.6;
  }
`

export const BackButton = styled.button`
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
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
    background: #EFF6FF;
    color: ${colors.primary.dark};
    border: 1px solid ${colors.primary.main};
  `}

  ${props => props.semester && `
    background: #ECFDF5;
    color: ${colors.success.dark};
    border: 1px solid ${colors.success.main};
  `}
`

export const ProgressBarContainer = styled.div`
  margin-top: 1rem;
`

export const ProgressBarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const ProgressBar = styled.div`
  flex: 1;
  height: 12px;
  background: ${colors.neutral.gray200};
  border-radius: 6px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
`

export const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main});
  transition: width 0.4s ease;
  width: ${props => props.progress}%;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba(107, 185, 232, 0.4);
`

export const ProgressPercentage = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${colors.primary.main};
  min-width: 45px;
  text-align: right;
`

export const QuestionCard = styled.div`
  background: ${colors.background.paper};
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`

export const QuestionNumber = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main});
  color: ${colors.text.inverse};
  box-shadow: 0 2px 8px rgba(107, 185, 232, 0.3);
`

export const CategoryBadge = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  background: ${colors.success.light};
  color: ${colors.success.dark};
  border: 1px solid ${colors.success.main};
`

export const QuestionText = styled.div`
  font-size: 1.0625rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 2rem;
  line-height: 1.8;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const InlineInput = styled.input`
  display: inline-block;
  min-width: 200px;
  padding: 0.5rem 0.75rem;
  margin: 0 0.5rem;
  border: none;
  border-bottom: 3px solid ${colors.primary.main};
  background: ${colors.curio.inputBg};
  font-size: 1.0625rem;
  font-weight: 600;
  font-family: inherit;
  color: ${colors.primary.main};
  text-align: center;
  transition: all 0.3s ease;
  border-radius: 4px 4px 0 0;

  &:focus {
    outline: none;
    border-bottom: 3px solid ${colors.primary.dark};
    background: ${colors.neutral.white};
    box-shadow: 0 4px 12px rgba(107, 185, 232, 0.2);
  }

  &::placeholder {
    color: ${colors.text.disabled};
    font-weight: 400;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    min-width: 150px;
  }
`

export const HintBox = styled.div`
  background: #EFF6FF;
  border-left: 4px solid ${colors.primary.main};
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  span {
    color: ${colors.primary.dark};
    font-size: 0.9375rem;
    line-height: 1.5;
  }
`

export const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const NavButton = styled.button`
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 48px;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main});
    color: ${colors.text.inverse};
    border: none;
    box-shadow: 0 4px 12px rgba(107, 185, 232, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(107, 185, 232, 0.4);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      background: ${colors.neutral.gray300};
      color: ${colors.text.disabled};
      cursor: not-allowed;
      box-shadow: none;
    }
  ` : `
    background: transparent;
    color: ${colors.text.secondary};
    border: 2px solid ${colors.neutral.gray300};

    &:hover:not(:disabled) {
      background: ${colors.neutral.gray100};
      border-color: ${colors.neutral.gray400};
      color: ${colors.text.primary};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}
`

export const SubmitSection = styled.div`
  background: ${colors.background.paper};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  text-align: center;
  margin-bottom: 1.5rem;
`

export const SubmitStatus = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.incomplete ? colors.warning.main : colors.success.main};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`

export const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main});
  color: ${colors.text.inverse};
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(107, 185, 232, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(107, 185, 232, 0.5);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: ${colors.neutral.gray300};
    color: ${colors.text.disabled};
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.6;
  }
`

export const ResultContainer = styled.div`
  text-align: center;
  padding: 1.5rem 0;
`

export const CelebrationHeader = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

export const ResultScore = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

export const ResultLabel = styled.p`
  font-size: 0.9375rem;
  color: ${colors.text.secondary};
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
    if (props.type === 'correct') return '#ECFDF5'
    if (props.type === 'wrong') return '#FEF2F2'
    return '#EFF6FF'
  }};
  border: 2px solid ${props => {
    if (props.type === 'correct') return colors.success.main
    if (props.type === 'wrong') return colors.error.main
    return colors.primary.main
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
    if (props.type === 'correct') return colors.success.dark
    if (props.type === 'wrong') return colors.error.dark
    return colors.primary.dark
  }};
  margin-bottom: 0.25rem;
`

export const StatLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${colors.text.secondary};
`

export const Divider = styled.div`
  height: 2px;
  background: ${colors.neutral.gray200};
  margin: 2rem 0;
`

export const AnswerReview = styled.div`
  margin-top: 2rem;
  text-align: left;
`

export const ReviewTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const ReviewItem = styled.div`
  background: ${props => props.isCorrect ? '#ECFDF5' : '#FEF2F2'};
  border-left: 4px solid ${props => props.isCorrect ? colors.success.main : colors.error.main};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

export const ReviewBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.125rem;
`

export const ReviewQuestion = styled.div`
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 0.75rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  padding-right: 2rem;

  .blank {
    background: #FEF3C7;
    color: ${colors.warning.dark};
    padding: 0.25rem 0.625rem;
    border-radius: 6px;
    font-weight: 700;
    border: 2px solid ${colors.warning.main};
    display: inline-block;
  }
`

export const ReviewAnswer = styled.div`
  margin-bottom: 0.625rem;
  font-size: 0.875rem;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;

  strong {
    color: ${colors.text.primary};
    min-width: 130px;
    font-size: 0.875rem;
  }

  span {
    color: ${colors.text.primary};
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .icon {
    font-size: 1.125rem;
  }
`

export const ExplanationBox = styled.div`
  margin-top: 0.75rem;
  padding: 1rem;
  background: ${props => props.isCorrect ? '#D1FAE5' : '#FEF3C7'};
  border: 2px solid ${props => props.isCorrect ? colors.success.main : colors.warning.main};
  border-radius: 8px;
`

export const ExplanationLabel = styled.div`
  font-weight: 700;
  color: ${props => props.isCorrect ? colors.success.dark : colors.warning.dark};
  margin-bottom: 0.5rem;
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`

export const ExplanationText = styled.p`
  color: ${colors.text.primary};
  margin: 0;
  line-height: 1.6;
  font-size: 0.875rem;
`

export const ReturnButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main});
  color: ${colors.text.inverse};
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(107, 185, 232, 0.3);
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(107, 185, 232, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`
