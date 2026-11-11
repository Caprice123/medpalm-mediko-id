import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'
import { fetchConversations, loadMoreConversations, createConversation } from '@/store/chatbot/userAction'
import { actions } from '@/store/chatbot/reducer'
import { formatRelativeTime } from '@utils/dateUtils'
import EmptyState from '@components/common/EmptyState'
import { ConversationListSkeleton } from '@components/common/SkeletonCard'
import Button from '@components/common/Button'
import {
  Header,
  HeaderTitle,
  SearchContainer,
  SearchInput,
} from '../../Chatbot.styles'
import {
  Container,
  ConversationItem,
  ConversationHeader,
  ConversationTopic,
  ConversationTime,
  ConversationPreview,
  LoadingContainer,
  LoadingSpinner,
} from './ConversationList.styles'

const SCROLLABLE_ID = 'conversation-list-scroll'

const ConversationList = () => {
  const dispatch = useDispatch()
  const { conversations, loading, pagination, filters, activeConversationId } = useSelector(
    state => state.chatbot
  )
  console.log(useSelector(
    state => state.chatbot
  ))

  // Reset to page 1 and fetch when search changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(actions.setPage(1))
      dispatch(fetchConversations())
    }, 400)
    return () => clearTimeout(timer)
  }, [dispatch, filters.search])

  const handleConversationSelect = (id) => {
    dispatch(actions.setActiveConversationId(id))
  }

  const handleNewConversation = async () => {
    const newConversation = await dispatch(createConversation('Percakapan Baru', 'normal'))
    dispatch(actions.setActiveConversationId(newConversation.uniqueId))
  }

  return (
    <>
      <Header>
        <HeaderTitle>Percakapan</HeaderTitle>
        <Button variant="primary" onClick={handleNewConversation}>
          + Percakapan Baru
        </Button>
      </Header>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Cari percakapan..."
          value={filters.search}
          onChange={(e) => dispatch(actions.updateFilter({ key: 'search', value: e.target.value }))}
        />
      </SearchContainer>

      {loading.isConversationsLoading ? (
        <Container>
          <ConversationListSkeleton count={8} />
        </Container>
      ) : !conversations || conversations.length === 0 ? (
        <Container>
          <EmptyState icon="💬" title="Belum ada percakapan" />
        </Container>
      ) : (
        <Container id={SCROLLABLE_ID}>
          <InfiniteScroll
            dataLength={conversations.length}
            next={() => dispatch(loadMoreConversations())}
            hasMore={!pagination.isLastPage}
            loader={
              <LoadingContainer>
                <LoadingSpinner>⟳</LoadingSpinner>
              </LoadingContainer>
            }
            scrollableTarget={SCROLLABLE_ID}
          >
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.uniqueId}
                $isSelected={activeConversationId === conversation.uniqueId}
                onClick={() => handleConversationSelect(conversation.uniqueId)}
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
      )}
    </>
  )
}

export default ConversationList
