import { memo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  ChatContainer,
} from '../../SessionPractice.styles'
import { sendPhysicalExamMessage } from '../../../../../../store/oscePractice/userAction'
import MessageListComponent from '../ConversationTab/subcomponents/MessageListComponent'
import UserInput from '../ConversationTab/subcomponents/UserInput'
import PhysicalExamGuideline from './subcomponents/PhysicalExamGuideline'

function PhysicalExaminationTab({ sttProvider }) {
  const { sessionId } = useParams()
  const dispatch = useDispatch()
  const { loading, physicalExamMessages, sessionDetail } = useSelector(state => state.oscePractice)

  // Physical exam messages are fetched by parent component (SessionPractice) on initial render
  // No need to fetch here - just use what's in the store

  const handleSendMessage = useCallback(async (userMessageText) => {
    if (!sessionId) return
    if (!userMessageText) return

    try {
      console.log('📨 Sending physical exam message...')
      await dispatch(sendPhysicalExamMessage(sessionId, userMessageText))
    } catch (error) {
      console.error('Failed to send physical exam message:', error)
    }
  }, [sessionId, dispatch])

  // Use centralized loading states from reducer
  const isSendingOrTyping = loading.isSendingPhysicalExamMessage || loading.isPhysicalExamAssistantTyping

  // Get guideline from topic
  const guideline = sessionDetail?.topic?.physicalExamGuideline

  return (
    <ChatContainer>
      <PhysicalExamGuideline guideline={guideline} />

      <MessageListComponent messages={physicalExamMessages} mode="physical_exam" />

      <UserInput
        key={`physical-exam-${sessionId}`} // Reset input when session changes
        onSendMessage={handleSendMessage}
        disabled={isSendingOrTyping}
        sttProvider={sttProvider}
      />
    </ChatContainer>
  )
}

export default memo(PhysicalExaminationTab)
