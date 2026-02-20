import SessionCard from './components/SessionCard'
import Button from '@components/common/Button'
import Pagination from '@components/Pagination'
import { OsceSessionSkeletonGrid } from '@components/common/SkeletonCard'
import {
  PageContainer,
  Section,
  SectionHeader,
  SectionTitle,
  EmptyState,
  Container,
} from './SessionHistory.styles'
import { useSessionHistory } from './hooks/useSessionHistory'

function SessionHistory() {
  const { userSessions, loading, sessionsPagination, handleStartPractice, handlePageChange } = useSessionHistory()

  if (loading.isLoadingUserSessions && userSessions.length === 0) {
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

              {!loading.isLoadingUserSessions && (sessionsPagination.page > 1 || !sessionsPagination.isLastPage) && (
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

export default SessionHistory
