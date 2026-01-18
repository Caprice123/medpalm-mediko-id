import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserOsceSessions } from '@store/oscePractice/userAction'
import SessionCard from './components/SessionCard'
import TopicSelectionModal from './components/TopicSelectionModal'
import Button from '@components/common/Button'
import {
  PageContainer,
  Header,
  Title,
  Subtitle,
  Section,
  SectionHeader,
  SectionTitle,
  LoadingContainer,
  LoadingSpinner,
  EmptyState,
} from './OscePractice.styles'

function OscePracticePage() {
  const dispatch = useDispatch()
  const { userSessions, loading } = useSelector(state => state.oscePractice)
  const [showTopicModal, setShowTopicModal] = useState(false)

  useEffect(() => {
    dispatch(fetchUserOsceSessions())
  }, [dispatch])

  const handleStartPractice = () => {
    setShowTopicModal(true)
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
        <Button variant="primary" onClick={handleStartPractice}>
          Mulai Latihan Baru
        </Button>
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
              />
            ))}
          </div>
        )}
      </Section>

      {/* Topic Selection Modal */}
      {showTopicModal && (
        <TopicSelectionModal
          onClose={() => setShowTopicModal(false)}
        />
      )}
    </PageContainer>
  )
}

export default OscePracticePage
