import { useEffect, useState, useRef } from 'react'
import { getWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  HeaderContent,
  ModalTitle,
  UserInfo,
  UserText,
  CloseButton,
  EditorContainer,
  TopBar,
  SetTitleText,
  TabBar,
  Tab,
  EditorArea,
  ChatPanel,
  ChatHeader,
  ChatTitle,
  ChatMessages,
  Message,
  MessageBubble,
  MessageTime,
  EmptyMessages,
  EditorPanel,
  EditorContent,
  LoadingState,
  ReadOnlyBadge
} from './SetDetailModal.styles'

const TAB_CONFIGS = [
  { type: 'ai_researcher_1', title: 'AI Researcher 1' },
  { type: 'ai_researcher_2', title: 'AI Researcher 2' },
  { type: 'ai_researcher_3', title: 'AI Researcher 3' },
  { type: 'paraphraser', title: 'Paraphraser' },
  { type: 'diagram_builder', title: 'Diagram Builder' }
]

function SetDetailModal({ set, isOpen, onClose }) {
  const [setData, setSetData] = useState(null)
  const [currentTab, setCurrentTab] = useState(null)
  const [loading, setLoading] = useState(false)
  const chatMessagesRef = useRef(null)

  useEffect(() => {
    if (isOpen && set?.id) {
      fetchSetData()
    }
  }, [isOpen, set?.id])

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [currentTab?.messages?.length, currentTab?.id])

  const fetchSetData = async () => {
    try {
      setLoading(true)
      const response = await getWithToken(Endpoints.skripsi.admin.set(set.id))
      console.log('Admin set data:', response.data.data) // Debug log
      console.log('Tabs:', response.data.data.tabs) // Debug log
      setSetData(response.data.data)
      if (response.data.data.tabs && response.data.data.tabs.length > 0) {
        setCurrentTab(response.data.data.tabs[0])
      }
    } catch (error) {
      console.error('Failed to fetch set:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) return null

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <HeaderContent>
            <div>
              <ModalTitle>{set.title || 'Untitled Set'}</ModalTitle>
              <ReadOnlyBadge>👁️ Mode Lihat (Read-Only)</ReadOnlyBadge>
            </div>
            <UserInfo>
              <UserText>User: {set.user?.name || 'Unknown'} ({set.user?.email || 'No email'})</UserText>
              {set.description && <UserText>Deskripsi: {set.description}</UserText>}
            </UserInfo>
          </HeaderContent>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        {loading ? (
          <LoadingState>Memuat data...</LoadingState>
        ) : !setData ? (
          <LoadingState>Data tidak ditemukan</LoadingState>
        ) : (
          <EditorContainer>
            {/* Top Bar */}
            <TopBar>
              <SetTitleText>{setData.title}</SetTitleText>
            </TopBar>

            {/* Tab Bar */}
            <TabBar>
              {setData.tabs?.map((tab) => (
                <Tab
                  key={tab.id}
                  $active={currentTab?.id === tab.id}
                  onClick={() => setCurrentTab(tab)}
                >
                  {tab.title || TAB_CONFIGS.find(c => c.type === tab.tab_type)?.title}
                </Tab>
              ))}
            </TabBar>

            {/* Editor Area */}
            <EditorArea>
              {/* Chat Panel */}
              <ChatPanel>
                <ChatHeader>
                  <ChatTitle>Chat dengan AI</ChatTitle>
                </ChatHeader>

                <ChatMessages ref={chatMessagesRef}>
                  {currentTab?.messages?.length === 0 ? (
                    <EmptyMessages>
                      Belum ada percakapan
                    </EmptyMessages>
                  ) : (
                    currentTab?.messages?.map((msg, idx) => (
                      <Message key={idx} $sender={msg.sender_type}>
                        <MessageBubble $sender={msg.sender_type}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </MessageBubble>
                        <MessageTime>{formatTime(msg.created_at)}</MessageTime>
                      </Message>
                    ))
                  )}
                </ChatMessages>
              </ChatPanel>

              {/* Editor Panel */}
              <EditorPanel>
                <EditorContent>
                  {setData?.editor_content ? (
                    <div dangerouslySetInnerHTML={{ __html: setData.editor_content }} />
                  ) : (
                    <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>
                      Tidak ada konten
                    </p>
                  )}
                </EditorContent>
              </EditorPanel>
            </EditorArea>
          </EditorContainer>
        )}
      </ModalContainer>
    </ModalOverlay>
  )
}

export default SetDetailModal
