import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchUserOsceTopics, fetchUserOsceSessions, startOsceSession } from '@store/oscePractice/userAction'
import SessionCard from './components/SessionCard'
import TopicSelectionModal from './components/TopicSelectionModal'
import {
  PageContainer,
  Header,
  Title,
  Subtitle,
  StartButton,
  Section,
  SectionHeader,
  SectionTitle,
  LoadingContainer,
  LoadingSpinner,
  EmptyState,
} from './OscePractice.styles'

function OscePracticePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userTopics, userSessions, loading } = useSelector(state => state.oscePractice)
  const [showTopicModal, setShowTopicModal] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    dispatch(fetchUserOsceTopics())
    dispatch(fetchUserOsceSessions())
  }, [dispatch])

  const handleStartPractice = () => {
    setShowTopicModal(true)
  }

  const handleSelectTopic = async (topic) => {
    try {
      setIsStarting(true)

      await dispatch(startOsceSession(topic.id, (session) => {
        console.log('Session started:', session)

        // Navigate to session preparation page
        navigate(`/osce-practice/session/${session.uniqueId}/preparation`)

        setShowTopicModal(false)

        // Refresh sessions list
        dispatch(fetchUserOsceSessions())
      }))
    } catch (error) {
      console.error('Error starting session:', error)
      // Error is handled by handleApiError in the action
    } finally {
      setIsStarting(false)
    }
  }

  const handleViewSession = (session) => {
    console.log('View session:', session)
    navigate(`/osce-practice/session/${session.uniqueId}/result`)
  }

  const handleRetrySession = (session) => {
    console.log('Retry session:', session)
    // TODO: Start new session with same topic
    const topic = userTopics.find(t => t.id === session.topicId)
    if (topic) {
      handleSelectTopic(topic)
    }
  }

  // Loading state
  if (loading.isLoadingUserTopics && loading.isLoadingUserSessions) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginTop: '1rem' }}>Memuat data...</div>
        </LoadingContainer>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Header>
        <div>
          <Title>OSCE Practice</Title>
          <Subtitle>
            Latihan Objective Structured Clinical Examination dengan AI
          </Subtitle>
        </div>
        <StartButton onClick={handleStartPractice}>
          <span>➕</span>
          Mulai Latihan Baru
        </StartButton>
      </Header>

      {/* Session History */}
      <Section>
        <SectionHeader>
          <SectionTitle>Riwayat Latihan</SectionTitle>
        </SectionHeader>

        {loading.isLoadingUserSessions ? (
          <LoadingContainer>
            <LoadingSpinner />
            <div style={{ marginTop: '1rem' }}>Memuat riwayat...</div>
          </LoadingContainer>
        ) : userSessions.length === 0 ? (
          <EmptyState>
            <div>📋</div>
            <p>Belum ada riwayat latihan. Mulai latihan pertama Anda!</p>
          </EmptyState>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
            {userSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onView={handleViewSession}
                onRetry={handleRetrySession}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Topic Selection Modal */}
      {showTopicModal && (
        <TopicSelectionModal
          topics={userTopics}
          onClose={() => setShowTopicModal(false)}
          onSelectTopic={handleSelectTopic}
          isLoading={isStarting}
        />
      )}
    </PageContainer>
  )
}

export default OscePracticePage
