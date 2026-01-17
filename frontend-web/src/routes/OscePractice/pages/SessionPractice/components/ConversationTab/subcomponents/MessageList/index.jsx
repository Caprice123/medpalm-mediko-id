import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Endpoints from '@config/endpoint'
import { getWithToken } from '@utils/requestUtils'
import {
  MessageList,
  Message,
  MessageAuthor,
  MessageText,
  EmptyState,
} from '../../../SessionPractice.styles'

const MessagList = () => {
  const { sessionId } = useParams()
  const [messages, setMessages] = useState([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')

  const messagesEndRef = useRef(null)

  // Fetch message history on mount
  useEffect(() => {
    if (!sessionId) return

    const fetchMessages = async () => {
      try {
        setIsLoadingMessages(true)
        const route = Endpoints.api.osceMessages(sessionId)
        const response = await getWithToken(route)

        if (response.data.success) {
          const fetchedMessages = response.data.data.map(msg => ({
            id: msg.id,
            text: msg.content,
            isUser: msg.senderType === 'user',
            timestamp: new Date(msg.createdAt),
            creditsUsed: msg.creditsUsed,
          }))
          setMessages(fetchedMessages)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setIsLoadingMessages(false)
      }
    }

    fetchMessages()
  }, [sessionId])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, streamingMessage])

  return (
    <MessageList>
        {isLoadingMessages ? (
            <EmptyState>
            Memuat riwayat percakapan...
            </EmptyState>
        ) : messages.length === 0 && !streamingMessage ? (
            <EmptyState>
            Mulai percakapan dengan mengetik pesan atau merekam audio
            </EmptyState>
        ) : (
            <>
            {messages.map(message => (
                <Message key={message.id} isUser={message.isUser}>
                <MessageAuthor>
                    {message.isUser ? 'Anda' : 'AI Pasien'}
                </MessageAuthor>
                <MessageText>{message.text}</MessageText>
                </Message>
            ))}
            {streamingMessage && (
                <Message isUser={false}>
                <MessageAuthor>AI Pasien</MessageAuthor>
                <MessageText>
                    {streamingMessage}
                    <span style={{ marginLeft: '4px', animation: 'blink 1s infinite' }}>▊</span>
                </MessageText>
                </Message>
            )}
            <div ref={messagesEndRef} />
            </>
        )}
    </MessageList>
  )
}

export default MessagList