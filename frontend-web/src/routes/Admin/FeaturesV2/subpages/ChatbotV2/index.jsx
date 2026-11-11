import Button from '@components/common/Button'
import ConversationsPage from './pages/ConversationsPage'
import ResearchModePage from './pages/ResearchModePage'
import DomainsPage from './pages/DomainsPage'
import JournalsPage from './pages/JournalsPage'
import { useChatbotV2Admin, TABS } from './hooks/useChatbotV2Admin'
import {
  Container,
  Header,
  HeaderContent,
  Title,
  TabsContainer,
  Tab,
} from './ChatbotV2.styles'

const TAB_PAGES = {
  conversations: ConversationsPage,
  research: ResearchModePage,
  domains: DomainsPage,
  journals: JournalsPage,
}

function ChatbotV2({ onBack }) {
  const { activeTab, setActiveTab } = useChatbotV2Admin()

  const ActivePage = TAB_PAGES[activeTab]

  return (
    <Container>
      <Header>
        <Button variant="secondary" onClick={onBack}>← Kembali</Button>
        <HeaderContent>
          <Title>Chat Assistant V2</Title>
        </HeaderContent>
      </Header>

      <TabsContainer>
        {TABS.map((tab) => (
          <Tab
            key={tab.key}
            $active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabsContainer>

      <ActivePage />
    </Container>
  )
}

export default ChatbotV2
