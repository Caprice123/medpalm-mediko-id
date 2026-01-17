import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  display: flex;
  height: 100vh;
  background: ${colors.neutral.gray50};
  overflow: hidden;
`

// Left Sidebar
export const Sidebar = styled.div`
  width: 400px;
  background: ${colors.neutral.white};
  border-right: 1px solid ${colors.neutral.gray200};
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    width: 320px;
  }
`

export const TimerCard = styled.div`
  background: linear-gradient(135deg, ${colors.osce.primary} 0%, ${colors.osce.primaryDark} 100%);
  color: ${colors.neutral.white};
  padding: 1.5rem;
  margin: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
`

export const TimerLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const TimerDisplay = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
`

export const TaskSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 1rem 1rem 1rem;
`

export const TaskHeader = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.osce.primary};
  margin: 0 0 1rem 0;
  padding: 1rem 0.5rem 0.5rem 0.5rem;
  border-bottom: 2px solid ${colors.osce.primaryLight};
`

export const TaskContent = styled.div`
  background: ${colors.neutral.gray50};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${colors.neutral.gray700};
  max-height: 400px;
  overflow-y: auto;

  p {
    margin: 0 0 0.75rem 0;
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
  margin: 0 0.5rem 1rem 0.5rem;
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
      background-color: ${colors.osce.primary};
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
`

// Main Content Area
export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const TabBar = styled.div`
  background: ${colors.neutral.white};
  border-bottom: 2px solid ${colors.neutral.gray200};
  display: flex;
  padding: 0 2rem;
  gap: 0.5rem;
`

export const Tab = styled.button`
  background: transparent;
  border: none;
  border-bottom: 3px solid ${props => props.active ? colors.osce.primary : 'transparent'};
  color: ${props => props.active ? colors.osce.primary : colors.neutral.gray600};
  padding: 1rem 1.5rem;
  font-weight: ${props => props.active ? 600 : 500};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  bottom: -2px;

  &:hover {
    color: ${colors.osce.primary};
    background: ${colors.osce.primaryLight};
  }
`

export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: ${colors.neutral.white};
`

export const GuideSection = styled.div`
  background: ${colors.osce.primaryLight};
  border-left: 4px solid ${colors.osce.primary};
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`

export const GuideTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.osce.primary};
  margin: 0 0 0.75rem 0;
`

export const GuideText = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${colors.neutral.gray700};
  margin: 0;
`

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1200px;
`

export const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  min-height: 200px;
`

export const Message = styled.div`
  background: ${props => props.isUser ? colors.osce.primaryLight : colors.neutral.gray100};
  padding: 1rem 1.25rem;
  border-radius: 12px;
  max-width: 80%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  border: 1px solid ${props => props.isUser ? colors.osce.primary : colors.neutral.gray200};
`

export const MessageAuthor = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${colors.neutral.gray600};
  margin-bottom: 0.375rem;
`

export const MessageText = styled.div`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${colors.neutral.gray800};
`

export const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const TextInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 2px solid ${colors.osce.primary};
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${colors.osce.primaryHover};
    box-shadow: 0 0 0 3px ${colors.osce.primaryLight};
  }

  &::placeholder {
    color: ${colors.neutral.gray400};
  }
`

export const InputActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`

export const RecordButton = styled.button`
  flex: 1;
  background: ${colors.osce.primary};
  color: ${colors.neutral.white};
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: ${colors.osce.primaryHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => props.recording && `
    background: ${colors.error.main};
    animation: pulse 1.5s infinite;

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `}
`

export const SendButton = styled.button`
  background: ${colors.neutral.gray200};
  color: ${colors.neutral.gray600};
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${colors.neutral.gray300};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const HelpText = styled.div`
  font-size: 0.75rem;
  color: ${colors.neutral.gray500};
  text-align: center;
  padding: 0.5rem;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${colors.neutral.gray400};
  font-size: 0.875rem;
`

// Diagnosis & Therapy Tabs
export const FormContainer = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  height: 100%;
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
    border-color: ${colors.osce.primary};
    box-shadow: 0 0 0 3px ${colors.osce.primaryLight};
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
  background: ${colors.osce.primaryLight};
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
`

export const ObservationTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.osce.primary};
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
    border-color: ${colors.osce.primary};
    box-shadow: 0 0 0 3px ${colors.osce.primaryLight};
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
  color: ${colors.osce.primary};
  border-bottom: 2px solid ${colors.osce.primary};
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`

export const ObservationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`

export const ObservationCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${props => props.checked ? colors.osce.primaryLight : colors.neutral.white};
  border: 2px solid ${props => props.checked ? colors.osce.primary : colors.neutral.gray200};
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not([disabled]) {
    border-color: ${colors.osce.primary};
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
  background: ${colors.osce.primary};
  color: ${colors.neutral.white};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${colors.osce.primaryHover};
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const ObservationResultCard = styled.div`
  background: ${colors.neutral.white};
  border: 1px solid ${colors.neutral.gray200};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`

export const ResultTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.osce.primary};
  border-bottom: 2px solid ${colors.osce.primary};
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
    border-color: ${colors.osce.primary};
    box-shadow: 0 0 0 3px ${colors.osce.primaryLight};
  }

  &::placeholder {
    color: ${colors.neutral.gray400};
  }
`
