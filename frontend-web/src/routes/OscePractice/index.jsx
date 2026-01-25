import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchUserOsceSessions } from '@store/oscePractice/userAction'
import { actions } from '@store/oscePractice/reducer'
import SessionCard from './components/SessionCard'
import Button from '@components/common/Button'
import Pagination from '@components/Pagination'
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
  Container,
} from './OscePractice.styles'

function OscePracticePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userSessions, loading, sessionsPagination } = useSelector(state => state.oscePractice)

  useEffect(() => {
    dispatch(fetchUserOsceSessions())
  }, [dispatch])

  const handleStartPractice = () => {
    navigate('/osce-practice/topics')
  }

  const handlePageChange = (page) => {
    dispatch(actions.setSessionsPage(page))
    dispatch(fetchUserOsceSessions())
  }

  // Loading state
  if (loading.isLoadingUserTopics && loading.isLoadingUserSessions) {
    return (

    <Container>
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginTop: '1rem' }}>Memuat data...</div>
        </LoadingContainer>
      </PageContainer>
    </Container>
    )
  }

  return (
    <Container>
        {/* Session History */}
        <PageContainer>
        <Section>
            <SectionHeader>
                <SectionTitle>Riwayat Latihan</SectionTitle>
                <Button variant="primary" onClick={handleStartPractice}>
                    Mulai Latihan Baru
                </Button>
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
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
                  {userSessions.map((session) => (
                  <SessionCard
                      key={session.id}
                      session={session}
                  />
                  ))}
              </div>

              <Pagination
                currentPage={sessionsPagination.page}
                isLastPage={sessionsPagination.isLastPage}
                onPageChange={handlePageChange}
                isLoading={loading.isLoadingUserSessions}
                variant="user"
                language="id"
              />
            </>
            )}
        </Section>
        </PageContainer>
    </Container>
  )
}

export default OscePracticePage
