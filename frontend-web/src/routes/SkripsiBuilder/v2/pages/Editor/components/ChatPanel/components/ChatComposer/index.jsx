import { memo } from 'react'
import { FaPaperPlane, FaStop } from 'react-icons/fa'
import { useChatComposer } from './hooks/useChatComposer'
import {
  ChatInputArea,
  ChatInputWrapper,
  ChatInput,
  SendButton,
} from './ChatComposer.styles'

const ChatComposer = memo(({ onSend, onStop, isStreaming }) => {
  const { value, canSend, handleChange, handleKeyDown, submit } = useChatComposer({
    onSend,
    isStreaming,
  })

  return (
    <ChatInputArea>
      <ChatInputWrapper>
        <ChatInput
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan... (Enter untuk kirim, Shift+Enter untuk baris baru)"
          disabled={isStreaming}
        />

        {isStreaming ? (
          <SendButton onClick={onStop} $variant="stop" title="Hentikan jawaban">
            <FaStop />
          </SendButton>
        ) : (
          <SendButton onClick={submit} disabled={!canSend} title="Kirim pesan">
            <FaPaperPlane />
          </SendButton>
        )}
      </ChatInputWrapper>
    </ChatInputArea>
  )
})

ChatComposer.displayName = 'ChatComposer'

export default ChatComposer
