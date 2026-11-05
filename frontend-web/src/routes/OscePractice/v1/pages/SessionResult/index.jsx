import { SessionResultSkeleton } from '@components/common/SkeletonCard'
import HasilTab from './components/tabs/HasilTab'
import ChatsTab from './components/tabs/ChatsTab'
import PhysicalExamTab from './components/tabs/PhysicalExamTab'
import ObservationTab from './components/tabs/ObservationTab'
import DiagnosisTab from './components/tabs/DiagnosisTab'
import TherapyTab from './components/tabs/TherapyTab'
import Button from '@components/common/Button'
import {
  Container,
  Header,
  Content,
  TabBar,
  Tab,
  TabContent,
  ErrorMessage,
  Wrapper,
} from './styles'
import { useSessionResult } from './hooks/useSessionResult'

const TABS = [
  { id: 'hasil', label: 'Hasil' },
  { id: 'chats', label: 'Percakapan' },
  { id: 'physical_exam', label: 'Pemeriksaan Fisik' },
  { id: 'observation', label: 'Observasi' },
  { id: 'diagnosis', label: 'Diagnosis' },
  { id: 'therapy', label: 'Terapi' },
]

function SessionResult() {
  const {
    sessionId, sessionDetail, loading,
    activeTab, setActiveTab,
    error, handleBack,
  } = useSessionResult()

  if (loading.isLoadingSessionDetail) {
    return (
      <Container>
        <SessionResultSkeleton />
      </Container>
    )
  }

  if (error || !sessionDetail) {
    return (
      <Container>
        <Wrapper>
          <Header>
            <Button variant="secondary" onClick={handleBack}>
              ← Kembali
            </Button>
            <ErrorMessage>
              <span>⚠️</span>
              <span>{error || 'Sesi tidak ditemukan'}</span>
            </ErrorMessage>
          </Header>
        </Wrapper>
      </Container>
    )
  }

  return (
    <Container>
      <Wrapper>
        <Header>
          <Button variant="secondary" onClick={handleBack}>
            ← Kembali
          </Button>
        </Header>

        <Content>
          <TabBar>
            {TABS.map(tab => (
              <Tab
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Tab>
            ))}
          </TabBar>

          <TabContent>
            {activeTab === 'hasil' && <HasilTab session={sessionDetail} />}
            {activeTab === 'chats' && <ChatsTab sessionId={sessionDetail.uniqueId} />}
            {activeTab === 'physical_exam' && <PhysicalExamTab sessionId={sessionDetail.uniqueId} />}
            {activeTab === 'observation' && <ObservationTab sessionId={sessionDetail.uniqueId} />}
            {activeTab === 'diagnosis' && <DiagnosisTab sessionId={sessionDetail.uniqueId} />}
            {activeTab === 'therapy' && <TherapyTab sessionId={sessionDetail.uniqueId} />}
          </TabContent>
        </Content>
      </Wrapper>
    </Container>
  )
}

export default SessionResult
