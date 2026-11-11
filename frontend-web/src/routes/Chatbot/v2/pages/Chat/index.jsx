import { useSelector } from 'react-redux'
import ConversationList from './components/ConversationList'
import Conversation from './components/Conversation'
import { useChatPage } from './hooks/useChatPage'
import {
  Container,
  ContentWrapper,
  LeftPanel,
  RightPanel,
  PlaceholderPanel,
  PlaceholderIcon,
  PlaceholderTitle,
  PlaceholderDescription,
} from './Chat.styles'

const Chat = () => {
  useChatPage()

  // Read directly here: the page only decides which pane is showing, it does
  // not process this value.
  const activeConversationId = useSelector(state => state.chatbotV2.activeConversationId)

  return (
    <Container>
      <ContentWrapper>
        <LeftPanel $hidden={Boolean(activeConversationId)}>
          <ConversationList />
        </LeftPanel>

        <RightPanel $hidden={!activeConversationId}>
          {activeConversationId ? (
            // Keyed by conversation so switching threads mounts a fresh panel
            // rather than carrying the previous thread's scroll and draft over.
            <Conversation key={activeConversationId} conversationId={activeConversationId} />
          ) : (
            <PlaceholderPanel>
              <PlaceholderIcon>💬</PlaceholderIcon>
              <PlaceholderTitle>Pilih percakapan atau mulai yang baru</PlaceholderTitle>
              <PlaceholderDescription>
                Pilih percakapan dari daftar di sebelah kiri atau klik &quot;Percakapan Baru&quot; untuk memulai
              </PlaceholderDescription>
            </PlaceholderPanel>
          )}
        </RightPanel>
      </ContentWrapper>
    </Container>
  )
}

export default Chat
