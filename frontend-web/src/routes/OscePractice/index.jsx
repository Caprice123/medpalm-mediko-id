import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchUserOsceSessions } from '@store/oscePractice/userAction'
import { actions } from '@store/oscePractice/reducer'
import SessionCard from './components/SessionCard'
import Button from '@components/common/Button'
import Pagination from '@components/Pagination'
import { OsceSessionSkeletonGrid } from '@components/common/SkeletonCard'
import {
  PageContainer,
  Header,
  Title,
  Subtitle,
  Section,
  SectionHeader,
  SectionTitle,
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

  // Initial loading state
  if (loading.isLoadingUserSessions) {
    return (
      <Container>
        <PageContainer>
          <Section>
            <SectionHeader>
              <SectionTitle>Riwayat Latihan</SectionTitle>
            </SectionHeader>
            <OsceSessionSkeletonGrid count={6} />
          </Section>
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
              <OsceSessionSkeletonGrid count={6} />
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
                      key={session.uniqueId}
                      session={session}
                  />
                  ))}
              </div>

              {!loading.isLoadingUserSessions && (sessionsPagination.page > 1 || (sessionsPagination.page === 1 && !sessionsPagination.isLastPage)) && (
                <Pagination
                  currentPage={sessionsPagination.page}
                  isLastPage={sessionsPagination.isLastPage}
                  onPageChange={handlePageChange}
                  isLoading={loading.isLoadingUserSessions}
                  variant="admin"
                  language="id"
                />
              )}
            </>
            )}
        </Section>
        </PageContainer>
    </Container>
  )
}

export default OscePracticePage
