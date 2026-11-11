import ConfirmationModal from '@components/common/ConfirmationModal'
import LoadMore from '@components/common/LoadMore'
import { useSelector } from 'react-redux'
import ConversationFilter from './components/ConversationFilter'
import ConversationsGrid from './components/ConversationsGrid'
import ConversationDetailModal from './components/ConversationDetailModal'
import { useConversationsPage } from './hooks/useConversationsPage'
import { LoadMoreRow } from '../../ChatbotV2.styles'

const ConversationsPage = () => {
  const {
    pagination,
    openedConversation,
    openConversation,
    closeConversation,
    pendingDeletion,
    requestDeletion,
    cancelDeletion,
    confirmDeletion,
    handleLoadMore,
  } = useConversationsPage()

  const conversationCount = useSelector(state => state.chatbotAdminV2.conversations.length)
  const isFetching = useSelector(state => state.chatbotAdminV2.loading.isFetchingConversations)
  const isLoadingMore = useSelector(state => state.chatbotAdminV2.loading.isLoadingMoreConversations)

  return (
    <>
      <ConversationFilter />

      <ConversationsGrid onOpen={openConversation} onDelete={requestDeletion} />

      <LoadMoreRow>
        <LoadMore
          isLastPage={pagination.isLastPage}
          isLoading={isFetching || isLoadingMore}
          itemCount={conversationCount}
          onClick={handleLoadMore}
        />
      </LoadMoreRow>

      {openedConversation && (
        <ConversationDetailModal
          conversation={openedConversation}
          isOpen={Boolean(openedConversation)}
          onClose={closeConversation}
        />
      )}

      <ConfirmationModal
        isOpen={Boolean(pendingDeletion)}
        title="Hapus percakapan"
        message={`Percakapan "${pendingDeletion?.topic || 'tanpa judul'}" akan dihapus permanen beserta seluruh pesannya. Tindakan ini tidak dapat dibatalkan.`}
        icon="🗑️"
        confirmText="Ya, hapus"
        cancelText="Batalkan"
        onConfirm={confirmDeletion}
        onCancel={cancelDeletion}
      />
    </>
  )
}

export default ConversationsPage
