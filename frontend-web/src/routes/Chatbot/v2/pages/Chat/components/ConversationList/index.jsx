import { useSelector } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'
import { formatRelativeTime } from '@utils/dateUtils'
import EmptyState from '@components/common/EmptyState'
import { ConversationListSkeleton } from '@components/common/SkeletonCard'
import Button from '@components/common/Button'
import { useConversationList } from './hooks/useConversationList'
import { LoadingContainer, LoadingSpinner } from '../../Chat.styles'
import {
  Header,
  HeaderTitle,
  SearchContainer,
  SearchInput,
  Container,
  ConversationItem,
  ConversationHeader,
  ConversationTopic,
  ConversationTime,
  ConversationPreview,
} from './ConversationList.styles'

// InfiniteScroll needs a real scroll container to watch, addressed by id.
const SCROLLABLE_ID = 'chatbot-v2-conversation-list'

const ConversationList = () => {
  const {
    search,
    handleSearchChange,
    handleSelect,
    handleLoadMore,
    handleNewConversation,
  } = useConversationList()

  const conversations = useSelector(state => state.chatbotV2.conversations)
  const activeConversationId = useSelector(state => state.chatbotV2.activeConversationId)
  const isLastPage = useSelector(state => state.chatbotV2.pagination.isLastPage)
  const isLoading = useSelector(state => state.chatbotV2.loading.isConversationsLoading)
  const isCreating = useSelector(state => state.chatbotV2.loading.isCreatingConversation)

  const renderBody = () => {
    if (isLoading) {
      return (
        <Container>
          <ConversationListSkeleton count={8} />
        </Container>
      )
    }

    if (!conversations?.length) {
      return (
        <Container>
          <EmptyState
            icon="💬"
            title={search ? 'Tidak ada percakapan yang cocok' : 'Belum ada percakapan'}
          />
        </Container>
      )
    }

    return (
      <Container id={SCROLLABLE_ID}>
        <InfiniteScroll
          dataLength={conversations.length}
          next={handleLoadMore}
          hasMore={!isLastPage}
          loader={(
            <LoadingContainer>
              <LoadingSpinner>⟳</LoadingSpinner>
            </LoadingContainer>
          )}
          scrollableTarget={SCROLLABLE_ID}
        >
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.uniqueId}
              $isSelected={activeConversationId === conversation.uniqueId}
              onClick={() => handleSelect(conversation.uniqueId)}
            >
              <ConversationHeader>
                <ConversationTopic>{conversation.topic}</ConversationTopic>
                <ConversationTime>
                  {formatRelativeTime(conversation.updatedAt || conversation.createdAt)}
                </ConversationTime>
              </ConversationHeader>
              {conversation.lastMessage && (
                <ConversationPreview>{conversation.lastMessage}</ConversationPreview>
              )}
            </ConversationItem>
          ))}
        </InfiniteScroll>
      </Container>
    )
  }

  return (
    <>
      <Header>
        <HeaderTitle>Percakapan</HeaderTitle>
        <Button variant="primary" onClick={handleNewConversation} disabled={isCreating}>
          {isCreating ? 'Membuat...' : '+ Percakapan Baru'}
        </Button>
      </Header>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Cari percakapan..."
          value={search}
          onChange={handleSearchChange}
        />
      </SearchContainer>

      {renderBody()}
    </>
  )
}

export default ConversationList
