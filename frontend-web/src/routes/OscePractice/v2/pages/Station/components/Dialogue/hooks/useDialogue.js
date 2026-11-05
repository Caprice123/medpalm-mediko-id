import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { sendMessage, sendPhysicalExamMessage } from '@store/oscePractice/userAction'

// Which of the two conversations the middle area is showing, and how a message is sent in it.
//
// The mode decides the action, so sending lives here rather than in each stream: the input
// below is the same control in both modes and should not know which one it is in.
export const useDialogue = () => {
  const { sessionId } = useParams()
  const dispatch = useDispatch()
  const [mode, setMode] = useState('conversation')

  const isPhysicalExam = mode === 'physical_exam'

  const send = useCallback(async (text) => {
    if (!sessionId || !text) return

    await dispatch(isPhysicalExam
      ? sendPhysicalExamMessage(sessionId, text)
      : sendMessage(sessionId, text))
  }, [dispatch, sessionId, isPhysicalExam])

  return { mode, setMode, isPhysicalExam, send }
}
