import { useEffect, memo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  ChatContainer,
} from '../../SessionPractice.styles'
import { fetchSessionMessages, sendMessage, stopStreaming } from '../../../../../../store/oscePractice/userAction'
import MessageListComponent from './subcomponents/MessageListComponent'
import UserInput from './subcomponents/UserInput'
import Guideline from './subcomponents/Guideline'

function ConversationTab() {
  const { sessionId } = useParams()
  const dispatch = useDispatch()
  const { sessionMessages, loading } = useSelector(state => state.oscePractice)

  // Fetch message history on mount
  useEffect(() => {
    if (!sessionId) return

    dispatch(fetchSessionMessages(sessionId))
  }, [sessionId, dispatch])

  const handleSendMessage = useCallback(async (userMessageText) => {
    if (!sessionId) return
    if (!userMessageText) return

    try {
      console.log('📨 Sending message...')
      await dispatch(sendMessage(sessionId, userMessageText))
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }, [sessionId, dispatch])

  const handleStopStreaming = useCallback(async () => {
    if (!sessionId) return

    try {
      console.log('⏹️ User clicked stop button')
      await dispatch(stopStreaming())
    } catch (error) {
      console.error('Failed to stop streaming:', error)
    }
  }, [sessionId, dispatch])

  // Check if there's a streaming message AND we're actually sending
  // This prevents the stop button from lingering after streaming is done
  const hasStreamingMessage = sessionMessages?.some(msg =>
    msg.id && msg.id.toString().startsWith('streaming-')
  ) || false

  
  const isStreaming = hasStreamingMessage || loading.isSendingMessage

  return (
    <ChatContainer>
      <Guideline />

      <MessageListComponent />

      <UserInput
        key={sessionId} // Reset input when session changes
        onSendMessage={handleSendMessage}
        onStopStreaming={handleStopStreaming}
        isSendingMessage={loading.isSendingMessage}
        isStreaming={isStreaming}
      />
    </ChatContainer>
  )
}

export default memo(ConversationTab)
