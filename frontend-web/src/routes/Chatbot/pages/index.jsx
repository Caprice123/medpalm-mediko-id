import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ConversationList from './components/ConversationList'
import ConversationPanel from './components/Conversation'
import { fetchChatbotConfig } from '@/store/chatbot/userAction'
import {
  Container,
  ContentWrapper,
  LeftPanel,
  RightPanel,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from './Chatbot.styles'

const Chatbot = () => {
  const dispatch = useDispatch()
  const activeConversationId = useSelector(state => state.chatbot.activeConversationId)

  // Lock body scroll on desktop
  useEffect(() => {
    const isDesktop = window.innerWidth >= 769
    if (isDesktop) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = originalOverflow }
    }
  }, [])

  useEffect(() => {
    dispatch(fetchChatbotConfig())
  }, [dispatch])

  return (
    <Container>
      <ContentWrapper>
        <LeftPanel $hidden={!!activeConversationId}>
          <ConversationList />
        </LeftPanel>

        <RightPanel $hidden={!activeConversationId}>
          {activeConversationId ? (
            <ConversationPanel
              conversationId={activeConversationId}
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
