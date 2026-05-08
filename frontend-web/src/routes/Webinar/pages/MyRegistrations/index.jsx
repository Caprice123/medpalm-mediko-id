import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchMyRegistrations } from '@store/webinar/userAction'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import Pagination from '@components/Pagination'
import { actions } from '@store/webinar/reducer'
import { formatJakartaDateTimeFull, formatJakartaDateLong } from '@utils/dateUtils'
import { WebinarRoute } from '../../routes'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

const RegistrationCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`

const WebinarInfo = styled.div`
  flex: 1;
`

const WebinarTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem;
`

const MetaText = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0 0 0.25rem;
`

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 500;
  background: ${({ status }) =>
    status === 'approved' ? '#dcfce7' :
    status === 'rejected' ? '#fee2e2' : '#fef9c3'};
  color: ${({ status }) =>
    status === 'approved' ? '#16a34a' :
    status === 'rejected' ? '#dc2626' : '#854d0e'};
`

const AdminNote = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0.5rem 0 0;
  font-style: italic;
`

const EvidenceList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5rem;
`

const EvidenceLink = styled.a`
  font-size: 0.75rem;
  color: #2563eb;
  text-decoration: none;
  padding: 0.2rem 0.5rem;
  background: #eff6ff;
  border-radius: 4px;
  border: 1px solid #bfdbfe;

  &:hover { background: #dbeafe; }
`

const STATUS_LABEL = { pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' }

function MyRegistrationsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { myRegistrations, pagination, loading } = useSelector(state => state.webinar)

  useEffect(() => {
    dispatch(fetchMyRegistrations())
  }, [dispatch])

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchMyRegistrations())
  }

  return (
    <Container>
      <PageHeader>
        <Button variant="secondary" onClick={() => navigate(WebinarRoute.listRoute)}>
          ← Kembali
        </Button>
        <PageTitle>Pendaftaran Webinar Saya</PageTitle>
      </PageHeader>

      {loading.isGetMyRegistrationsLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          Memuat data...
        </div>
      ) : myRegistrations.length === 0 ? (
        <EmptyState
          icon="📋"
          title="Belum ada pendaftaran"
          actionLabel="Lihat Webinar"
          onAction={() => navigate(WebinarRoute.listRoute)}
          actionVariant="primary"
        />
      ) : (
        myRegistrations.map(reg => (
          <RegistrationCard key={reg.uniqueId}>
            <WebinarInfo>
              <WebinarTitle>{reg.webinar?.title || '—'}</WebinarTitle>
              {reg.webinar?.startAt && (
                <MetaText>📅 {formatJakartaDateTimeFull(reg.webinar.startAt)}</MetaText>
              )}
              <MetaText>Mendaftar: {formatJakartaDateLong(reg.createdAt)}</MetaText>

              {reg.evidences?.length > 0 && (
                <EvidenceList>
                  {reg.evidences.map((ev, i) => (
                    <EvidenceLink key={i} href={ev.url} target="_blank" rel="noreferrer">
                      📎 {ev.filename || `Bukti ${i + 1}`}
                    </EvidenceLink>
                  ))}
                </EvidenceList>
              )}

              {reg.adminNotes && (
                <AdminNote>Catatan admin: {reg.adminNotes}</AdminNote>
              )}
            </WebinarInfo>

            <StatusBadge status={reg.status}>
              {STATUS_LABEL[reg.status] || reg.status}
            </StatusBadge>
          </RegistrationCard>
        ))
      )}

      {!loading.isGetMyRegistrationsLoading && myRegistrations.length > 0 &&
        (pagination.page > 1 || !pagination.isLastPage) && (
        <Pagination
          variant="admin"
          currentPage={pagination.page}
          isLastPage={pagination.isLastPage}
          onPageChange={handlePageChange}
          isLoading={loading.isGetMyRegistrationsLoading}
          language="id"
        />
      )}
    </Container>
  )
}

export default MyRegistrationsPage
