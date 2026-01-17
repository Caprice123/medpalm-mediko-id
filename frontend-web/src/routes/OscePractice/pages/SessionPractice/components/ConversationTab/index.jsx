import { useState, useEffect, useRef, memo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Endpoints from '@config/endpoint'
import { getToken } from '@utils/authToken'
import { getWithToken } from '@utils/requestUtils'
import { useRecording } from '@hooks/useRecording'
import { actions as commonActions } from '@store/common/reducer'
import {
  ChatContainer,
  GuideSection,
  GuideTitle,
  GuideText,
  MessageList,
  Message,
  MessageAuthor,
  MessageText,
  InputArea,
  TextInput,
  InputActions,
  RecordButton,
  SendButton,
  HelpText,
  EmptyState,
} from '../../SessionPractice.styles'

function ConversationTab() {
  const { sessionId } = useParams()
  const dispatch = useDispatch()
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')

  const messagesEndRef = useRef(null)

  // Recording hook with Deepgram-first, Whisper fallback
  const handleTranscriptUpdate = useCallback((interimText) => {
    // For interim results from Deepgram, we could show them in a different way
    // For now, we'll just let the final transcript update the input
  }, [])

  const handleTranscriptFinal = useCallback((finalText) => {
    setInputText(prev => prev + finalText)
  }, [])

  const handleRecordingError = useCallback((error) => {
    dispatch(commonActions.setError(error))
  }, [dispatch])

  const recording = useRecording(
    handleTranscriptUpdate,
    handleTranscriptFinal,
    false, // autoSendEnabled - set to false for manual send
    null, // onAutoSend
    handleRecordingError
  )

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

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return

    const userMessageText = inputText.trim()
    setInputText('')
    setIsSending(true)
    setStreamingMessage('')

    // Add user message to UI immediately
    const tempUserMessage = {
      id: `temp-user-${Date.now()}`,
      text: userMessageText,
      isUser: true,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, tempUserMessage])

    try {
      const token = getToken()
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
      const route = Endpoints.api.osceMessages(sessionId)

      const response = await fetch(`${baseUrl}${route}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.accessToken}`,
        },
        body: JSON.stringify({ message: userMessageText }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.substring(6))

              if (jsonData.type === 'chunk') {
                accumulatedText += jsonData.content
                setStreamingMessage(accumulatedText)
              } else if (jsonData.type === 'done') {
                // Replace temp messages with actual saved messages
                setMessages(prev => {
                  const filtered = prev.filter(m => !m.id.toString().startsWith('temp-'))
                  return [
                    ...filtered,
                    {
                      id: jsonData.data.userMessage.id,
                      text: jsonData.data.userMessage.content,
                      isUser: true,
                      timestamp: new Date(jsonData.data.userMessage.createdAt),
                    },
                    {
                      id: jsonData.data.aiMessage.id,
                      text: jsonData.data.aiMessage.content,
                      isUser: false,
                      timestamp: new Date(jsonData.data.aiMessage.createdAt),
                      creditsUsed: jsonData.data.aiMessage.creditsUsed,
                    },
                  ]
                })
                setStreamingMessage('')
              } else if (jsonData.type === 'error') {
                throw new Error(jsonData.error)
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert(`Gagal mengirim pesan: ${error.message}`)

      // Remove temp user message on error
      setMessages(prev => prev.filter(m => !m.id.toString().startsWith('temp-')))
      setInputText(userMessageText) // Restore input
      setStreamingMessage('')
    } finally {
      setIsSending(false)
    }
  }

  const handleToggleRecording = () => {
    recording.toggleRecording()
  }

  return (
    <ChatContainer>
      <GuideSection>
        <GuideTitle>Panduan</GuideTitle>
        <GuideText>
          Jika AI memberikan respon yang tidak sesuai ekspektasi pengguna dapat mencoba untuk menanyakan lagi hal yang sama, jika masih belum, cobalah persingkat pertanyaannya, atau tanyakan secara bertahap.
        </GuideText>
      </GuideSection>

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

      <InputArea>
        <TextInput
          placeholder={
            isSending
              ? "Mengirim pesan..."
              : recording.isRecording
              ? "Sedang merekam... (berbicara sekarang)"
              : recording.isTranscribing
              ? "Memproses audio..."
              : "Ketik pesan Anda di sini..."
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isSending) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          disabled={isSending || recording.isRecording}
        />

        <InputActions>
          <RecordButton
            recording={recording.isRecording}
            onClick={handleToggleRecording}
            disabled={recording.isTranscribing}
          >
            <span>
              {recording.isTranscribing ? '⏳' : recording.isRecording ? '⏹️' : '🎤'}
            </span>
            {recording.isTranscribing
              ? 'Memproses...'
              : recording.isRecording
              ? 'Hentikan Rekaman'
              : 'MULAI REKAM'}
          </RecordButton>

          <SendButton
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isSending}
          >
            {isSending ? '⏳' : '➤'}
          </SendButton>
        </InputActions>

        <HelpText>
          {recording.usingDeepgram && (
            <span style={{ color: '#4CAF50', marginRight: '8px' }}>
              🔴 Real-time transcription (Deepgram)
            </span>
          )}
          {recording.usingWhisper && (
            <span style={{ color: '#FF9800', marginRight: '8px' }}>
              ⚠️ Fallback mode (Whisper)
            </span>
          )}
          AI memahami konteks meskipun terdapat typo, pesan aman untuk dikirim
        </HelpText>
      </InputArea>
    </ChatContainer>
  )
}

export default memo(ConversationTab)
