import { useSelector } from 'react-redux'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import { formatJakartaDateLong } from '@utils/dateUtils'
import { STATUS_LABEL } from '../../utils'
import {
  RegCard, RegInfo, RegTitle, RegCode, RegMeta,
  StatusBadge, EvidenceLinks, EvidenceLink, AdminNote,
  GrantedBadge, GrantedTag,
} from './MyRegistrationsTab.styles'

function MyRegistrationsTab({ myRegistrations, loading, onSwitchToList }) {
  const appFeatures = useSelector(state => state.feature.features)
  const featureLabels = Object.fromEntries(appFeatures.map(f => [f.sessionType, f.name]))
  if (loading.isGetMyRegistrationsLoading) {
    return <Loading text="Memuat pendaftaran..." minHeight="300px" />
  }

  if (myRegistrations.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="Belum ada pendaftaran"
        actionLabel="Lihat Events"
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
            <RegTitle>{reg.event?.title || '—'}</RegTitle>
            <RegMeta>Mendaftar: {formatJakartaDateLong(reg.createdAt)}</RegMeta>

            {reg.evidences?.length > 0 && (
              <EvidenceLinks>
                {reg.evidences.map((ev, i) => (
                  <EvidenceLink key={i} href={ev.url} target="_blank" rel="noreferrer">
                    📎 {ev.filename || `Bukti ${i + 1}`}
                  </EvidenceLink>
                ))}
              </EvidenceLinks>
            )}

            {reg.status === 'approved' && (reg.creditsGranted > 0 || reg.featuresGranted?.length > 0) && (
              <GrantedBadge>
                {reg.creditsGranted > 0 && (
                  <GrantedTag>🎁 {reg.creditsGranted} kredit diterima</GrantedTag>
                )}
                {(reg.featuresGranted || []).map(({ key, durationDays }) => (
                  <GrantedTag key={key}>✓ {featureLabels[key] || key} — {durationDays} hari</GrantedTag>
                ))}
              </GrantedBadge>
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
