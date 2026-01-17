import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSessionMessages } from '@store/oscePractice/userAction'
import { LoadingContainer, LoadingSpinner, EmptyState } from '../../../styles/shared'
import {
  Container,
  MessagesContainer,
  MessageBubble,
  MessageHeader,
  SenderLabel,
  MessageTime,
  MessageContent,
} from './styles'

function ChatsTab({ sessionId }) {
  const dispatch = useDispatch()
  const { sessionMessages, loading } = useSelector(state => state.oscePractice)

  useEffect(() => {
    if (sessionId) {
      dispatch(fetchSessionMessages(sessionId))
    }
  }, [sessionId, dispatch])

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (loading.isLoadingSessionMessages) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    )
  }

  if (sessionMessages.length === 0) {
    return (
      <EmptyState>
        💬 Belum ada percakapan dalam sesi ini.
      </EmptyState>
    )
  }

  return (
    <Container>
      <MessagesContainer>
        {sessionMessages.map((message) => {
          const isUser = message.senderType === 'user'
          return (
            <MessageBubble key={message.id} isUser={isUser}>
              <MessageHeader>
                <SenderLabel isUser={isUser}>
                  {isUser ? 'Dokter' : 'Pasien'}
                </SenderLabel>
                <MessageTime>{formatTime(message.createdAt)}</MessageTime>
              </MessageHeader>
              <MessageContent isUser={isUser}>
                {message.content}
              </MessageContent>
            </MessageBubble>
          )
        })}
      </MessagesContainer>
    </Container>
  )
}

export default ChatsTab
