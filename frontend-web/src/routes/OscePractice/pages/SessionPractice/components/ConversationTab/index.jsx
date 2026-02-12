import { memo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  ChatContainer,
} from '../../SessionPractice.styles'
import { sendMessage } from '../../../../../../store/oscePractice/userAction'
import MessageListComponent from './subcomponents/MessageListComponent'
import UserInput from './subcomponents/UserInput'
import Guideline from './subcomponents/Guideline'

function ConversationTab({ sttProvider }) {
  const { sessionId } = useParams()
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.oscePractice)

  // Messages are fetched by parent component (SessionPractice) on initial render
  // No need to fetch here - just use what's in the store

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

  // Use centralized loading states from reducer
  const isSendingOrTyping = loading.isSendingMessage || loading.isAssistantTyping

  return (
    <ChatContainer>
      <Guideline />

      <MessageListComponent />

      <UserInput
        key={sessionId} // Reset input when session changes
        onSendMessage={handleSendMessage}
        disabled={isSendingOrTyping}
        sttProvider={sttProvider}
      />
    </ChatContainer>
  )
}

export default memo(ConversationTab)
