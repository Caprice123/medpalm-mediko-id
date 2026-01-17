import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

export const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 0.5rem;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${colors.neutral.gray100};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.neutral.gray400};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${colors.neutral.gray500};
  }
`

export const MessageBubble = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  gap: 0.5rem;
`

export const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.5rem;
`

export const SenderLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.isUser ? colors.primary.main : colors.secondary.main};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const MessageTime = styled.span`
  font-size: 0.75rem;
  color: ${colors.text.disabled};
`

export const MessageContent = styled.div`
  background: ${props => props.isUser ? colors.primary.main : colors.neutral.gray100};
  color: ${props => props.isUser ? 'white' : colors.text.primary};
  padding: 0.875rem 1.125rem;
  border-radius: ${props => props.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
  max-width: 70%;
  word-wrap: break-word;
  line-height: 1.5;
  font-size: 0.9375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
`
