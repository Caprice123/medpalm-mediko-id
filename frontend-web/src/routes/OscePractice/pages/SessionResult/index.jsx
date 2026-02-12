import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSessionDetail,
  fetchSessionMessages,
  fetchPhysicalExamMessages
} from '@store/oscePractice/userAction'
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
  TitleRow,
  TitleSection,
  Title,
  Subtitle,
  ScoreCard,
  ScoreLabel,
  Score,
  ScoreMax,
  MetaInfo,
  MetaItem,
  MetaLabel,
  MetaValue,
  Content,
  TabBar,
  Tab,
  TabContent,
  LoadingContainer,
  LoadingSpinner,
  ErrorMessage,
  Wrapper,
} from './styles'

const TABS = [
  { id: 'hasil', label: 'Hasil' },
  { id: 'chats', label: 'Percakapan' },
  { id: 'physical_exam', label: 'Pemeriksaan Fisik' },
  { id: 'observation', label: 'Observasi' },
  { id: 'diagnosis', label: 'Diagnosis' },
  { id: 'therapy', label: 'Terapi' },
]

function SessionResult() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { sessionDetail, loading } = useSelector(state => state.oscePractice)
  const [activeTab, setActiveTab] = useState('hasil')
  const [error, setError] = useState(null)

  // Fetch session detail and all messages on mount (only once)
  useEffect(() => {
    if (sessionId) {
      // Fetch session detail and all messages in parallel
      Promise.all([
        dispatch(fetchSessionDetail(sessionId)),
        dispatch(fetchSessionMessages(sessionId)),
        dispatch(fetchPhysicalExamMessages(sessionId))
      ]).catch(err => {
        setError(err.message || 'Gagal memuat detail sesi')
      })
    }
  }, [sessionId, dispatch])

  // Redirect based on session status
  useEffect(() => {
    if (sessionDetail && sessionDetail.uniqueId === sessionId) {
      if (sessionDetail.status === 'created') {
        // Redirect to preparation page if session not started yet
        navigate(`/osce-practice/session/${sessionId}/preparation`, { replace: true })
      } else if (sessionDetail.status === 'started') {
        // Redirect to practice page if session is still ongoing
        navigate(`/osce-practice/session/${sessionId}/practice`, { replace: true })
      }
    }
  }, [sessionDetail, sessionId, navigate])

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
            <Button variant="secondary" onClick={() => navigate(-1)}>
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
            <Button variant="secondary" onClick={() => navigate("/osce-practice")}>
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
