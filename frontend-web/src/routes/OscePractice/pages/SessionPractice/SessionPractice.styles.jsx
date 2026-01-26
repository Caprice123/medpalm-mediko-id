import styled, { keyframes, css } from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  background: #f0fdfa;
`

export const Content = styled.div`
    display: flex;
    margin: 0 auto;
    max-width: 1200px;
    height: calc(100vh - 93px);
    background: #f0fdfa;
    overflow: hidden;

    @media (max-width: 768px) {
      flex-direction: column;
      height: auto;
      min-height: calc(100vh - 93px);
    }
`

// Left Sidebar
export const Sidebar = styled.div`
  width: 400px;
  background: ${colors.neutral.white};
  border-right: 2px solid ${colors.neutral.gray200};
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    width: 320px;
  }

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 2px solid ${colors.neutral.gray200};
    max-height: 100vh;
    overflow-y: auto;
  }
`

// Timer animations
const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 12px 30px rgba(16, 185, 129, 0.25);
  }
  50% {
    box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4),
                0 0 20px rgba(16, 185, 129, 0.3);
  }
`

const pulseWarning = keyframes`
  0%, 100% {
    box-shadow: 0 12px 30px rgba(245, 158, 11, 0.25);
  }
  50% {
    box-shadow: 0 12px 30px rgba(245, 158, 11, 0.4),
                0 0 20px rgba(245, 158, 11, 0.3);
  }
`

const pulseCritical = keyframes`
  0%, 100% {
    box-shadow: 0 12px 30px rgba(239, 68, 68, 0.25);
  }
  50% {
    box-shadow: 0 12px 30px rgba(239, 68, 68, 0.5),
                0 0 25px rgba(239, 68, 68, 0.4);
  }
`

export const TimerCard = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1.25rem 1.75rem;
  margin: 1rem;
  border-radius: 16px;
  color: white;
  border: 2px solid;
  transition: all 0.3s ease;

  ${({ $state }) => {
    switch ($state) {
      case 'critical':
        return css`
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-color: #dc2626;
          box-shadow: 0 12px 30px rgba(239, 68, 68, 0.25);
          animation: ${pulseCritical} 1s infinite ease-in-out;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 16px 40px rgba(239, 68, 68, 0.35);
          }
        `
      case 'warning':
        return css`
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-color: #d97706;
          box-shadow: 0 12px 30px rgba(245, 158, 11, 0.25);
          animation: ${pulseWarning} 1.5s infinite ease-in-out;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 16px 40px rgba(245, 158, 11, 0.35);
          }
        `
      case 'normal':
      default:
        return css`
          background: linear-gradient(135deg, #10b981, #059669);
          border-color: #059669;
          box-shadow: 0 12px 30px rgba(16, 185, 129, 0.25);
          animation: ${pulseGlow} 2s infinite ease-in-out;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 16px 40px rgba(16, 185, 129, 0.35);
          }
        `
    }
  }}

  @media (max-width: 768px) {
    padding: 1rem 1.25rem;
  }
`

export const TimerIcon = styled.div`
    color: white;
    font-size: 2rem;
    flex-shrink: 0;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`

export const TimerLabel = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  opacity: 0.95;
  text-transform: uppercase;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`

export const TimerDisplay = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.2;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: "Outfit,Outfit Fallback";
  letter-spacing: 2px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const TaskSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 1rem 1rem 1rem;
`

export const TaskHeader = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.primary.main};
  margin: 0 0 1rem 0;
`

export const TaskContent = styled.div`
  background: ${colors.neutral.gray100};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${colors.neutral.gray700};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  
  p {
      margin: 0 0 0.75rem 0;
      overflow-y: auto;
      max-height: 300px;
  }

  ul, ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin: 0.375rem 0;
  }
`

export const AutoSubmitToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: ${colors.neutral.gray100};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${colors.neutral.gray700};
`

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + span {
      background-color: ${colors.primary.main};
    }

    &:checked + span:before {
      transform: translateX(24px);
    }
  }
`

export const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${colors.neutral.gray300};
  transition: 0.4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`

export const EndSessionButton = styled.button`
  background: ${colors.error.main};
  color: ${colors.neutral.white};
  border: none;
  padding: 1rem;
  margin: 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${colors.error.dark};
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  @media (max-width: 768px) {
    margin: 0;
    width: 100%;
  }
`

export const MobileButtonWrapper = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    background: ${colors.neutral.white};
    border-top: 2px solid ${colors.neutral.gray200};
    padding: 1rem;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }
`

export const DesktopButtonWrapper = styled.div`
  display: block;

  @media (max-width: 768px) {
    display: none;
  }
`

// Main Content Area
export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    min-height: calc(100vh - 93px);
    height: calc(100vh - 93px);
  }
`

export const TabBar = styled.div`
  background: ${colors.neutral.white};
  border-bottom: 2px solid ${colors.neutral.gray200};
  display: flex;
  padding: 2px 1rem;
  gap: 0.5rem;
  overflow-x: auto;

  @media (max-width: 768px) {
    padding: 2px 0.5rem;
    gap: 0.25rem;
  }
`

export const Tab = styled.button`
  background: transparent;
  border: none;
  border-bottom: 3px solid ${props => props.active ? colors.primary.main : 'transparent'};
  color: ${props => props.active ? colors.primary.main : colors.neutral.gray600};
  padding: 1rem 1.5rem;
  font-weight: ${props => props.active ? 600 : 500};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  bottom: -2px;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 0.8125rem;
  }
`

export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  padding-bottom: 0;
  background: ${colors.neutral.white};
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    min-height: calc(100vh - 200px);
    height: 100%;
    overflow: hidden;
  }
`

export const GuideSection = styled.div`
  background: ${colors.neutral.gray100};
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
`

export const GuideTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.primary.main};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;

  &:hover {
    color: ${colors.primary.hover};
  }

  span {
    font-size: 0.875rem;
    transition: transform 0.2s;
  }
`

export const GuideText = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${colors.neutral.gray700};
  margin: 0;
  padding-top: 0.5rem;
  white-space: pre-line;
  max-height: 100px;
  overflow: auto;
`

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  height: 100%;
  flex: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    min-height: calc(100vh - 200px);
  }
`

export const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  padding-bottom: 1rem;
  min-height: 200px;
  overflow-y: auto;

  @media (max-width: 768px) {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
`

export const Message = styled.div`
  background: ${props => props.isUser ? '#3b82f6' : 'white'};
  color: ${props => props.isUser ? 'white' : colors.neutral.gray800};
  padding: 0.875rem 1.125rem;
  border-radius: 12px;
  border-bottom-right-radius: ${props => props.isUser ? '4px' : '12px'};
  border-bottom-left-radius: ${props => props.isUser ? '12px' : '4px'};
  max-width: 70%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  border: ${props => props.isUser ? 'none' : '1px solid #e5e7eb'};
  word-wrap: break-word;

  @media (max-width: 768px) {
    max-width: 85%;
    padding: 0.75rem 1rem;
  }

  @media (max-width: 480px) {
    max-width: 90%;
    padding: 0.75rem;
  }
`

export const MessageAuthor = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: inherit;
  margin-bottom: 0.375rem;
  opacity: 0.9;
`

export const MessageText = styled.div`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: inherit;
`

// Input animations
const recordingPulse = keyframes`
  0%, 100% {
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.5), 0 0 0 4px rgba(239, 68, 68, 0.1);
  }
`

const iconBounce = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`

export const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #ffffff;
  border-radius: 0;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
  margin-top: 0;
  border-top: 1px solid rgba(0, 124, 240, 0.1);

  @media (max-width: 768px) {
    padding: 16px;
  }
`

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 16px;
`

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;

  @media (max-width: 480px) {
    gap: 8px;
  }
`

export const TextInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 16px 20px;
  border: 2px solid rgba(0, 124, 240, 0.15);
  border-radius: 12px;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  color: ${colors.neutral.gray800};
  background: rgba(245, 247, 250, 0.5);
  transition: all 0.2s ease;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 3px rgba(0, 124, 240, 0.1);
    background: #ffffff;
  }

  &::placeholder {
    color: ${colors.neutral.gray500};
    opacity: 0.7;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    min-height: 70px;
    padding: 14px 16px;
  }
`

export const InterimOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px 20px;
  pointer-events: none;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  color: transparent;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 12px;
  white-space: pre-wrap;
  overflow: hidden;
  z-index: 1;
`

export const InputActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`

export const RecordButton = styled.button`
  flex: 1;
  height: 56px;
  gap: 12px;
  background: ${props => props.recording ? 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)' : colors.primary.main};
  color: white;
  font-size: 1rem;
  box-shadow: ${props => props.recording
    ? '0 4px 16px rgba(239, 68, 68, 0.3)'
    : '0 4px 16px rgba(0, 124, 240, 0.25)'};
  border: none;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 180px;

  ${props => props.recording && css`
    animation: ${recordingPulse} 2s infinite;

    svg {
      animation: ${iconBounce} 1s infinite;
    }

    &:hover {
      box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
      background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
    }
  `}

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.recording
      ? '0 8px 24px rgba(239, 68, 68, 0.4)'
      : '0 8px 24px rgba(0, 124, 240, 0.35)'};

    svg {
      transform: scale(1.1);
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: ${props => props.recording
      ? '0 4px 12px rgba(239, 68, 68, 0.3)'
      : '0 4px 12px rgba(0, 124, 240, 0.3)'};
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 8px rgba(0, 124, 240, 0.1);
    background: #94a3b8;

    &:hover {
      transform: none;
      box-shadow: 0 2px 8px rgba(0, 124, 240, 0.1);
    }
  }

  @media (max-width: 768px) {
    height: 52px;
    font-size: 0.95rem;
    min-width: 160px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    height: 48px;
    font-size: 0.9rem;
    min-width: 140px;
    gap: 8px;
  }
`

export const SendButton = styled.button`
  height: 56px;
  width: 56px;
  background: linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.hover} 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(0, 124, 240, 0.25);
  border: none;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 124, 240, 0.35);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(0, 124, 240, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 8px rgba(0, 124, 240, 0.1);
    background: #94a3b8;

    &:hover {
      transform: none;
      box-shadow: 0 2px 8px rgba(0, 124, 240, 0.1);
    }
  }

  @media (max-width: 768px) {
    height: 52px;
    width: 52px;
  }

  @media (max-width: 480px) {
    height: 48px;
    width: 48px;
  }
`

export const HelpText = styled.div`
  color: ${colors.neutral.gray600};
  font-size: 0.9rem;
  margin-top: 12px;
  text-align: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(0, 124, 240, 0.06) 0%, rgba(0, 223, 216, 0.06) 100%);
  border-radius: 10px;
  border: 1px solid rgba(0, 124, 240, 0.15);
  font-weight: 500;
  line-height: 1.4;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${colors.neutral.gray400};
  font-size: 0.875rem;
`

// Typing animation keyframes
const typingAnimation = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
`

// Blinking cursor animation
const blinkAnimation = keyframes`
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
`

export const TypingIndicator = styled.div`
  display: flex;
  gap: 0.375rem;
  padding: 0.5rem 0;
`

export const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  animation: ${typingAnimation} 1.4s infinite;
  animation-delay: ${props => props.delay};
`

export const StreamingCursor = styled.span`
  margin-left: 4px;
  animation: ${blinkAnimation} 1s infinite;
`

// Diagnosis & Therapy Tabs
export const FormContainer = styled.div`
  padding-bottom: 1rem;
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const FormSection = styled.div`
  margin-bottom: 2rem;
`

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${colors.neutral.gray800};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${colors.neutral.gray300};
  border-radius: 8px;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 3px ${colors.primary.light};
  }

  &::placeholder {
    color: ${colors.neutral.gray400};
  }

  &:disabled {
    background: ${colors.neutral.gray100};
    cursor: not-allowed;
  }
`

export const HintText = styled.p`
  font-size: 0.75rem;
  color: ${colors.neutral.gray500};
  margin-top: 0.5rem;
  margin-bottom: 0;
`

export const AddItemContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

export const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.disabled ? colors.neutral.gray300 : colors.success.main};
  color: ${colors.neutral.white};
  border: none;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: ${colors.success.dark};
  }

  &:disabled {
    opacity: 0.6;
  }
`

export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const ItemCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: ${colors.neutral.gray50};
  border-radius: 8px;
  border: 1px solid ${colors.neutral.gray200};
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.neutral.gray300};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`

export const ItemText = styled.span`
  font-size: 0.875rem;
  color: ${colors.neutral.gray800};
  flex: 1;
`

export const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.error.main};
  cursor: pointer;
  font-size: 1.125rem;
  padding: 0 0.5rem;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`

export const EmptyListText = styled.p`
  font-size: 0.875rem;
  color: ${colors.neutral.gray400};
  font-style: italic;
  text-align: center;
  padding: 1.5rem;
  margin: 0;
`

// Supporting Data (Observations) Tab
export const ObservationHeader = styled.div`
  border: 2px solid ${colors.neutral.gray200};
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
`

export const ObservationTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.primary.main};
  margin: 0 0 0.5rem 0;
`

export const ObservationSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${colors.neutral.gray600};
  margin: 0;
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid ${colors.neutral.gray300};
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 3px ${colors.primary.light};
  }

  &::placeholder {
    color: ${colors.neutral.gray400};
  }
`

export const SelectionCounter = styled.div`
  background: ${colors.neutral.gray100};
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: ${colors.neutral.gray700};
  font-weight: 500;
  display: inline-block;
  margin-bottom: 1rem;
`

export const ObservationGroup = styled.div`
  margin-bottom: 2rem;
`

export const GroupHeader = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.primary.main};
  border-bottom: 2px solid ${colors.primary.main};
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`

export const ObservationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const ObservationCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${colors.neutral.white};
  border: 2px solid ${props => props.checked ? colors.primary.main : colors.neutral.gray200};
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not([disabled]) {
    border-color: ${colors.primary.main};
    box-shadow: 0 2px 4px rgba(6, 182, 212, 0.1);
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  }

  span {
    font-size: 0.875rem;
    color: ${colors.neutral.gray800};
    flex: 1;
  }
`

export const SaveObservationsButton = styled.button`
  width: 100%;
  max-width: 400px;
  margin: 2rem auto 0 auto;
  display: block;
  padding: 1rem 2rem;
  background: ${colors.primary.main};
  color: ${colors.neutral.white};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${colors.primary.hover};
    box-shadow: 0 4px 12px rgba(107, 185, 232, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const ObservationResultCard = styled.div`
  background: ${colors.neutral.white};
  border: 2px solid ${colors.neutral.gray200};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`

export const ResultTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.primary.main};
  border-bottom: 2px solid ${colors.primary.main};
  padding-bottom: 0.5rem;
  margin: 0 0 1rem 0;
`

export const ResultContent = styled.div`
  font-size: 0.875rem;
  color: ${colors.neutral.gray600};
  padding: 1rem;
  background: ${colors.neutral.gray50};
  border-radius: 6px;
  margin-bottom: 1rem;
`

export const InterpretationTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 2px solid ${colors.neutral.gray300};
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 3px ${colors.primary.light};
  }

  &::placeholder {
    color: ${colors.neutral.gray400};
  }
`
