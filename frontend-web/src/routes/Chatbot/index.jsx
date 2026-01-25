import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ConversationList from './pages/List/components/ConversationList'
import ConversationPanel from './pages/Conversation'
import { fetchConversations, createConversation, fetchChatbotConfig } from '@/store/chatbot/action'
import {
  Container,
  ContentWrapper,
  LeftPanel,
  RightPanel,
  Header,
  HeaderTitle,
  NewChatButton,
  SearchContainer,
  SearchInput,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription
} from './Chatbot.styles'
import Button from '@components/common/Button'

const Chatbot = () => {
  const dispatch = useDispatch()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversationId, setSelectedConversationId] = useState(null)

  // Only subscribe to conversations and loading - prevents rerender when messages update
  const conversations = useSelector(state => state.chatbot.conversations)
  const loading = useSelector(state => state.chatbot.loading)

  // Fetch chatbot config on mount (to get available modes)
  useEffect(() => {
    dispatch(fetchChatbotConfig())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchConversations({ search: searchQuery }, 1, 50))
  }, [dispatch, searchQuery])

  const handleConversationSelect = (id) => {
    setSelectedConversationId(id)
  }

  const handleNewConversation = async () => {
    try {
      // Create conversation with default values
      const newConversation = await dispatch(
        createConversation("Percakapan Baru", "normal")
      )
      // Select the new conversation
      setSelectedConversationId(newConversation.id)
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  const handleBackToList = () => {
    setSelectedConversationId(null)
  }

  return (
    <Container>
      <ContentWrapper>
        {/* Left Panel - Conversation List */}
        <LeftPanel $hidden={!!selectedConversationId}>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>

        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onConversationSelect={handleConversationSelect}
          isLoading={loading.isConversationsLoading}
        />
      </LeftPanel>

      {/* Right Panel - Chat or Empty State */}
      <RightPanel $hidden={!selectedConversationId}>
        {selectedConversationId ? (
          <ConversationPanel
            conversationId={selectedConversationId}
            onBack={handleBackToList}
          />
        ) : (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyTitle>Pilih percakapan atau mulai yang baru</EmptyTitle>
            <EmptyDescription>
              Pilih percakapan dari daftar di sebelah kiri atau klik "Percakapan Baru" untuk memulai
            </EmptyDescription>
          </EmptyState>
        )}
      </RightPanel>
      </ContentWrapper>
    </Container>
  )
}

export default Chatbot
