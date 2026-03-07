import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAdminConversations, deleteAdminConversation } from '@store/chatbot/adminAction'
import { actions } from '@store/chatbot/reducer'
import ChatbotSettingsModal from './components/ChatbotSettingsModal'
import ConversationsList from './components/ConversationsList'
import ConversationDetailModal from './components/ConversationDetailModal'
import DomainsTab from './subtabs/Domains'
import Pagination from '@components/Pagination'
import {
  Container,
  Header,
  HeaderContent,
  TitleSection,
  Title,
  Actions,
  TabsContainer,
  Tab,
} from './Chatbot.styles'
import Button from "@components/common/Button"
import { Filter } from './components/Filter'
import { getUserData } from '@utils/authToken'

const ALLOWED_EMAIL = 'kelvinpalem@gmail.com'

function Chatbot({ onBack }) {
  const dispatch = useDispatch()
  const { pagination, loading } = useSelector(state => state.chatbot)
  const currentUser = getUserData()
  const isAllowed = currentUser?.email === ALLOWED_EMAIL

  const [activeTab, setActiveTab] = useState('conversations')
  const [uiState, setUiState] = useState({
    isSettingsModalOpen: false,
    isDetailModalOpen: false,
    selectedConversation: null
  })

  useEffect(() => {
    if (isAllowed) {
        dispatch(fetchAdminConversations())
    }
  }, [dispatch, isAllowed])

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAdminConversations())
  }

  const handleViewConversation = (conversation) => {
    setUiState({
      ...uiState,
      isDetailModalOpen: true,
      selectedConversation: conversation
    })
  }

  const handleDeleteConversation = async (conversation) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus percakapan "${conversation.topic}"?`)) {
      return
    }

    try {
      await dispatch(deleteAdminConversation(conversation.uniqueId))
      await dispatch(fetchAdminConversations({}, pagination.page, 20))
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }

  const handleCloseDetailModal = () => {
    setUiState(prev => ({
      ...prev,
      isDetailModalOpen: false,
      selectedConversation: null
    }))
    dispatch(actions.setMessages([]))
  }

  return (
    <Container>
      <Header>
        <Button variant="secondary" onClick={onBack}>← Kembali</Button>
        <HeaderContent>
          <TitleSection>
            <Title>Kelola Chat Assistant</Title>
          </TitleSection>
          <Actions>
            <Button variant="secondary" onClick={() => setUiState({ ...uiState, isSettingsModalOpen: true })}>
              Pengaturan Fitur
            </Button>
          </Actions>
        </HeaderContent>
      </Header>

      <TabsContainer>
        <Tab active={activeTab === 'conversations'} onClick={() => setActiveTab('conversations')}>
          Percakapan
        </Tab>
        <Tab active={activeTab === 'domains'} onClick={() => setActiveTab('domains')}>
          Domain
        </Tab>
      </TabsContainer>

      {activeTab === 'conversations' && isAllowed && (
        <>
          <Filter />

          <ConversationsList
            onView={handleViewConversation}
            onDelete={handleDeleteConversation}
          />

          {(pagination.page > 1 || (pagination.page === 1 && !pagination.isLastPage)) && (
            <Pagination
              currentPage={pagination.page}
              isLastPage={pagination.isLastPage}
              onPageChange={handlePageChange}
              isLoading={loading.isConversationsLoading}
              variant="admin"
              language="id"
            />
          )}

          {uiState.isDetailModalOpen && uiState.selectedConversation && (
            <ConversationDetailModal
              conversation={uiState.selectedConversation}
              isOpen={uiState.isDetailModalOpen}
              onClose={handleCloseDetailModal}
            />
          )}
        </>
      )}

      {activeTab === 'domains' && <DomainsTab />}

      {uiState.isSettingsModalOpen && (
        <ChatbotSettingsModal
          isOpen={uiState.isSettingsModalOpen}
          onClose={() => setUiState(prev => ({ ...prev, isSettingsModalOpen: false }))}
        />
      )}
    </Container>
  )
}

export default Chatbot
