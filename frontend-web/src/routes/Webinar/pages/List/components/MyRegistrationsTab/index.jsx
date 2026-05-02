import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import { formatJakartaDateTimeFull } from '@utils/dateUtils'
import { STATUS_LABEL } from '../../utils'
import {
  RegCard, RegInfo, RegTitle, RegMeta,
  StatusBadge, EvidenceLinks, EvidenceLink,
  JoinLinks, JoinLink, AdminNote,
} from './MyRegistrationsTab.styles'

function MyRegistrationsTab({ myRegistrations, loading, onSwitchToList }) {
  if (loading.isGetMyRegistrationsLoading) {
    return <Loading text="Memuat pendaftaran..." minHeight="300px" />
  }

  if (myRegistrations.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="Belum ada pendaftaran"
        actionLabel="Lihat Webinar"
        onAction={onSwitchToList}
        actionVariant="primary"
      />
    )
  }

  return (
    <>
      {myRegistrations.map(reg => (
        <RegCard key={reg.uniqueId}>
          <RegInfo>
            <RegTitle>{reg.webinar?.title || '—'}</RegTitle>
            {reg.webinar?.startAt && (
              <RegMeta>📅 {formatJakartaDateTimeFull(reg.webinar.startAt)}</RegMeta>
            )}
            <RegMeta>Mendaftar: {formatJakartaDateTimeFull(reg.createdAt)}</RegMeta>

            {reg.evidences?.length > 0 && (
              <EvidenceLinks>
                {reg.evidences.map((ev, i) => (
                  <EvidenceLink key={i} href={ev.url} target="_blank" rel="noreferrer">
                    📎 {ev.filename || `Bukti ${i + 1}`}
                  </EvidenceLink>
                ))}
              </EvidenceLinks>
            )}

            {reg.status === 'approved' && reg.webinar?.joinUrl?.length > 0 && (
              <JoinLinks>
                {reg.webinar.joinUrl.map((link, i) => (
                  <JoinLink key={i} href={link.url} target="_blank" rel="noreferrer">
                    🔗 Link Bergabung{reg.webinar.joinUrl.length > 1 ? ` ${i + 1}` : ''}
                  </JoinLink>
                ))}
              </JoinLinks>
            )}

            {reg.adminNotes && <AdminNote>Catatan admin: {reg.adminNotes}</AdminNote>}
          </RegInfo>
          <StatusBadge $s={reg.status}>{STATUS_LABEL[reg.status] || reg.status}</StatusBadge>
        </RegCard>
      ))}
    </>
  )
}

export default MyRegistrationsTab
