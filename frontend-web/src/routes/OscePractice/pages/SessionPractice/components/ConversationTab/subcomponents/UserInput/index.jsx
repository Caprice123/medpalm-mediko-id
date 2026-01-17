import { useState, memo } from 'react'
import { useParams } from 'react-router-dom'
import Endpoints from '@config/endpoint'
import { getToken } from '@utils/authToken'
import {
  InputArea,
  TextInput,
  InputActions,
  RecordButton,
  SendButton,
  HelpText,
} from '../../../SessionPractice.styles'

function UserInput() {
  const { sessionId } = useParams()
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isSending, setIsSending] = useState(false)

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

  const handleStartRecording = async () => {
    try {
      setIsRecording(true)
      // TODO: Implement actual recording logic
      console.log('Starting recording...')
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Gagal memulai rekaman')
      setIsRecording(false)
    }
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    // TODO: Process recorded audio
    console.log('Stopping recording...')
  }

  return (
    <InputArea>
    <TextInput
        placeholder={isSending ? "Mengirim pesan..." : "Ketik pesan Anda di sini..."}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={(e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isSending) {
            e.preventDefault()
            handleSendMessage()
        }
        }}
        disabled={isSending}
    />

    <InputActions>
        <RecordButton
        recording={isRecording}
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
        <span>{isRecording ? '⏹️' : '🎤'}</span>
        {isRecording ? 'Hentikan Rekaman' : 'MULAI REKAM'}
        </RecordButton>

        <SendButton
        onClick={handleSendMessage}
        disabled={!inputText.trim() || isSending}
        >
        {isSending ? '⏳' : '➤'}
        </SendButton>
    </InputActions>

    <HelpText>
        AI memahami konteks meskipun terdapat typo, pesan aman untuk dikirim
    </HelpText>
    </InputArea>
  )
}

export default memo(UserInput)
