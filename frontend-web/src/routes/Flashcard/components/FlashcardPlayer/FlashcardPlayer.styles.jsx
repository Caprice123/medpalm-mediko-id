import styled from 'styled-components'
import { colors } from '@config/colors'

export const PlayerContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const Header = styled.div`
  background: ${colors.background.paper};
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
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

export const ProgressBarFill = styled.div`
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

export const CardContainer = styled.div`
  perspective: 1000px;
  margin-bottom: 1.5rem;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    min-height: 300px;
  }
`

export const Flashcard = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${props => props.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};

  @media (max-width: 768px) {
    height: 300px;
  }
`

export const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: white;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const CardFront = styled(CardFace)`
  background: linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark});
  color: ${colors.text.inverse};
`

export const CardBack = styled(CardFace)`
  background: linear-gradient(135deg, ${colors.secondary.main}, ${colors.secondary.dark});
  color: ${colors.text.inverse};
  transform: rotateY(180deg);
`

export const CardLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
  opacity: 0.95;
`

export const CardContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`

export const CardContentInner = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;

  p {
    font-size: 1.25rem;
    line-height: 1.6;
    margin: 0;
    font-weight: 500;
    width: 100%;

    @media (max-width: 768px) {
      font-size: 1.0625rem;
    }
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`

export const CardImage = styled.img`
  max-width: 100%;
  max-height: 180px;
  margin-top: 8px;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  }
`

export const AnswerSection = styled.div`
  background: ${colors.background.paper};
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
`

export const AnswerLabel = styled.label`
  display: block;
  font-size: 0.9375rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: ${colors.text.primary};
`

export const AnswerInput = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 2px solid ${colors.neutral.gray300};
  border-radius: 12px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s;
  background: ${colors.curio.inputBg};
  color: ${colors.curio.inputText};
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 4px 12px rgba(107, 185, 232, 0.2);
    background: ${colors.neutral.white};
  }

  &:disabled {
    background: ${colors.neutral.gray100};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${colors.text.disabled};
  }
`

export const ShowAnswerSection = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`

export const ShowAnswerButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(135deg, ${colors.success.main}, ${colors.success.dark});
  color: ${colors.text.inverse};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(141, 198, 63, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(141, 198, 63, 0.4);
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

export const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
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

// Feedback Section Styles
export const FeedbackSection = styled.div`
  background: ${colors.background.paper};
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
`

export const FeedbackBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9375rem;
  margin-bottom: 1rem;

  ${props => {
    switch (props.type) {
      case 'correct':
        return `
          background: #ECFDF5;
          color: ${colors.success.dark};
          border: 2px solid ${colors.success.main};
        `
      case 'almost':
        return `
          background: #FEF3C7;
          color: ${colors.warning.dark};
          border: 2px solid ${colors.warning.main};
        `
      case 'incorrect':
        return `
          background: #FEF2F2;
          color: ${colors.error.dark};
          border: 2px solid ${colors.error.main};
        `
      default:
        return ''
    }
  }}
`

export const FeedbackText = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-bottom: 1.25rem;
  line-height: 1.6;

  strong {
    color: ${colors.text.primary};
    display: block;
    margin-top: 0.5rem;
  }
`

export const AnswerComparison = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`

export const ComparisonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const ComparisonLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const ComparisonValue = styled.div`
  padding: 0.875rem 1rem;
  border-radius: 10px;
  font-size: 0.9375rem;
  line-height: 1.6;
  font-weight: 500;

  ${props => {
    if (props.correct) {
      return `
        background: #ECFDF5;
        color: ${colors.success.dark};
        border-left: 4px solid ${colors.success.main};
      `
    }
    if (props.wrong) {
      return `
        background: #FEF2F2;
        color: ${colors.error.dark};
        border-left: 4px solid ${colors.error.main};
      `
    }
    return `
      background: ${colors.neutral.gray100};
      color: ${colors.text.primary};
      border-left: 4px solid ${colors.neutral.gray400};
    `
  }}
`

// Not used in current implementation but kept for compatibility
export const ProgressText = styled.div``
export const ProgressBarBg = styled.div``
export const CardDots = styled.div``
export const Dot = styled.div``
export const Button = styled.button``
export const PrimaryButton = styled.button``
export const SecondaryButton = styled.button``
