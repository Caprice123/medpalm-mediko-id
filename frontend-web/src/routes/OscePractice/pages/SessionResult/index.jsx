import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSessionDetail } from '@store/oscePractice/userAction'
import HasilTab from './components/tabs/HasilTab'
import ChatsTab from './components/tabs/ChatsTab'
import ObservationTab from './components/tabs/ObservationTab'
import DiagnosisTab from './components/tabs/DiagnosisTab'
import TherapyTab from './components/tabs/TherapyTab'
import {
  Container,
  Header,
  BackButton,
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

  useEffect(() => {
    if (sessionId) {
      dispatch(fetchSessionDetail(sessionId)).catch(err => {
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

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatDuration = (minutes) => {
    if (!minutes) return '-'
    return `${minutes} menit`
  }

  const calculatePercentage = () => {
    if (!sessionDetail?.totalScore || !sessionDetail?.maxScore) return 0
    return Math.round((sessionDetail.totalScore / sessionDetail.maxScore) * 100)
  }

  const isPassing = () => {
    const percentage = calculatePercentage()
    return percentage >= 60 // Assuming 60% is passing
  }

  if (loading.isLoadingSessionDetail) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginTop: '1rem' }}>Memuat detail sesi...</div>
        </LoadingContainer>
      </Container>
    )
  }

  if (error || !sessionDetail) {
    return (
      <Container>
        <Wrapper>
            <Header>
            <BackButton onClick={() => navigate('/osce-practice')}>
                ← Kembali
            </BackButton>
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
                <BackButton onClick={() => navigate('/osce-practice')}>
                ← Kembali
                </BackButton>

                <TitleRow>
                <TitleSection>
                    <Title>{sessionDetail.topicTitle || 'OSCE Session'}</Title>
                    <Subtitle>{sessionDetail.topicDescription || 'Hasil Latihan OSCE'}</Subtitle>
                </TitleSection>

                {sessionDetail.totalScore !== null && sessionDetail.totalScore !== undefined && (
                    <ScoreCard passing={isPassing()}>
                    <ScoreLabel passing={isPassing()}>
                        {isPassing() ? 'Lulus' : 'Tidak Lulus'}
                    </ScoreLabel>
                    <Score passing={isPassing()}>
                        {calculatePercentage()}%
                    </Score>
                    <ScoreMax passing={isPassing()}>
                        {sessionDetail.totalScore} / {sessionDetail.maxScore}
                    </ScoreMax>
                    </ScoreCard>
                )}
                </TitleRow>

                <MetaInfo>
                <MetaItem>
                    <MetaLabel>Tanggal</MetaLabel>
                    <MetaValue>{formatDate(sessionDetail.createdAt)}</MetaValue>
                </MetaItem>
                <MetaItem>
                    <MetaLabel>Durasi</MetaLabel>
                    <MetaValue>{formatDuration(sessionDetail.durationMinutes)}</MetaValue>
                </MetaItem>
                <MetaItem>
                    <MetaLabel>AI Model</MetaLabel>
                    <MetaValue>{sessionDetail.aiModelUsed || 'N/A'}</MetaValue>
                </MetaItem>
                <MetaItem>
                    <MetaLabel>Credit Digunakan</MetaLabel>
                    <MetaValue>{sessionDetail.creditsUsed || 0}</MetaValue>
                </MetaItem>
                </MetaInfo>
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
