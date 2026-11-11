import { FaPen, FaCheck, FaXmark } from 'react-icons/fa6'
import { useConversationTitle } from './hooks/useConversationTitle'
import {
  TopicTitle,
  TopicInput,
  EditButton,
  TitleActionButton,
} from '../../Conversation.styles'

const ConversationTitle = ({ conversationId, topic }) => {
  const {
    inputRef,
    isEditing,
    draft,
    setDraft,
    startEditing,
    cancelEditing,
    save,
    handleKeyDown,
  } = useConversationTitle({ conversationId, topic })

  if (isEditing) {
    return (
      <>
        <TopicInput
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={256}
        />
        <TitleActionButton $variant="save" onClick={save} title="Simpan">
          <FaCheck size={13} />
        </TitleActionButton>
        <TitleActionButton $variant="revert" onClick={cancelEditing} title="Batal">
          <FaXmark size={13} />
        </TitleActionButton>
      </>
    )
  }

  return (
    <>
      <TopicTitle>{topic || 'Tanpa judul'}</TopicTitle>
      <EditButton onClick={startEditing} title="Ubah nama percakapan">
        <FaPen size={13} />
      </EditButton>
    </>
  )
}

export default ConversationTitle
