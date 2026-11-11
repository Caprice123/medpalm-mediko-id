import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { renameConversation } from '@store/chatbot/v2'

// Inline rename of the open thread. The draft title is local — only a confirmed
// rename reaches the server.
export const useConversationTitle = ({ conversationId, topic }) => {
  const dispatch = useDispatch()
  const inputRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const startEditing = () => {
    setDraft(topic || '')
    setIsEditing(true)
    // After the input exists: preselect, so typing replaces the placeholder name
    // a new thread starts with instead of appending to it.
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const cancelEditing = () => setIsEditing(false)

  const save = async () => {
    const next = draft.trim()
    setIsEditing(false)

    if (!next || next === topic) return

    await dispatch(renameConversation(conversationId, next))
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') save()
    if (event.key === 'Escape') cancelEditing()
  }

  return {
    inputRef,
    isEditing,
    draft,
    setDraft,
    startEditing,
    cancelEditing,
    save,
    handleKeyDown,
  }
}
