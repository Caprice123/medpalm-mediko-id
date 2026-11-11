import { useDispatch } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ChatbotMessagesSkeleton } from '@components/common/SkeletonCard'
import { actions } from '@store/chatbot/v2/reducer'
import ConversationTitle from './components/ConversationTitle'
import MessageList from './components/MessageList'
import MessageInput from './components/MessageInput'
import ModeSelector from './components/ModeSelector'
import { useConversation } from './hooks/useConversation'
import { LoadingContainer, LoadingSpinner } from '../../Chat.styles'
import {
  Container,
  Header,
  HeaderContent,
  BackButton,
  ChatArea,
  ErrorState,
} from './Conversation.styles'

const SCROLLABLE_ID = 'chatbot-v2-messages-scroll'

const Conversation = ({ conversationId }) => {
  const dispatch = useDispatch()
  const {
    currentConversation,
    currentMode,
    messages,
    messagePagination,
    isStreaming,
    isMessagesLoading,
    isConversationLoading,
    chatAreaRef,
    handleLoadOlder,
    handleSend,
    handleStop,
    handleModeChange,
  } = useConversation(conversationId)

  if (isConversationLoading && !currentConversation) {
    return (
      <Container>
        <ChatbotMessagesSkeleton messageCount={6} />
      </Container>
    )
  }

  if (!currentConversation) {
    return (
      <Container>
        <ErrorState>
          <div>❌</div>
          <div>Percakapan tidak ditemukan</div>
        </ErrorState>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        {/* Mobile only: the list and the thread share one screen there, so
            without this there is no way back to the list. */}
        <BackButton onClick={() => dispatch(actions.setActiveConversationId(null))}>
          ← Percakapan
        </BackButton>
        <HeaderContent>
          <ConversationTitle conversationId={conversationId} topic={currentConversation.topic} />
        </HeaderContent>
      </Header>

      <ModeSelector currentMode={currentMode} onModeChange={handleModeChange} />

      <ChatArea id={SCROLLABLE_ID} ref={chatAreaRef}>
        {isMessagesLoading && messagePagination.page > 1 && (
          <LoadingContainer>
            <LoadingSpinner>⟳</LoadingSpinner>
          </LoadingContainer>
        )}

        {/* `inverse` because this list grows upward: paging happens at the top. */}
        <InfiniteScroll
          inverse
          scrollableTarget={SCROLLABLE_ID}
          dataLength={messages.length}
          next={handleLoadOlder}
          hasMore={!messagePagination.isLastPage}
          loader={<span />}
        >
          <MessageList
            conversationId={conversationId}
            isLoading={isMessagesLoading && messagePagination.page === 1}
            isStreaming={isStreaming}
          />
        </InfiniteScroll>
      </ChatArea>

      <MessageInput
        onSend={handleSend}
        onStop={handleStop}
        currentMode={currentMode}
        isStreaming={isStreaming}
      />
    </Container>
  )
}

export default Conversation
