import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  min-height: calc(100vh - 90px);
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

export const Header = styled.div`
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
  color: #374151;
  border: 1px solid #d1d5db;
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
    background: #f9fafb;
    border-color: #9ca3af;
  }
`

export const TopicInfo = styled.div`
  flex: 1;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
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
    color: #6b7280;
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
  width: 100%;
  gap: 1.5rem;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #f0f9ff, #fff);
  border-radius: 12px;
  border: 2px solid #bfdbfe;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
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
