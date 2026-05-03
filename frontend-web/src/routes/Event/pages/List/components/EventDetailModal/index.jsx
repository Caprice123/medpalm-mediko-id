import { useSelector } from 'react-redux'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { formatLocalDate } from '@utils/dateUtils'
import { getRegistrationStatus } from '../../utils'
import { DetailModalThumb, DetailRow, DetailLabel, DetailText, RewardBadge, FeatureList, FeatureTag } from './EventDetailModal.styles'

function EventDetailModal({ event, onClose, onRegister }) {
  const appFeatures = useSelector(state => state.feature.features)
  const featureLabels = Object.fromEntries(appFeatures.map(f => [f.sessionType, f.name]))
  const regStatus = getRegistrationStatus(event)
  const hasCredits = event.creditsOnApproval > 0
  const hasSubscription = event.allowedFeatures?.length > 0
  const hasReward = hasCredits || hasSubscription

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={event.title}
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Tutup</Button>
          {event.myRegistrationStatus === 'pending' ? (
            <Button variant="secondary" disabled>⏳ Menunggu Review</Button>
          ) : event.myRegistrationStatus === 'approved' ? (
            <Button variant="secondary" disabled>✓ Sudah Terdaftar</Button>
          ) : regStatus === 'upcoming' ? (
            <Button variant="secondary" disabled>Pendaftaran Belum Dibuka</Button>
          ) : regStatus === 'closed' ? (
            <Button variant="secondary" disabled>Pendaftaran Sudah Ditutup</Button>
          ) : event.myRegistrationStatus === 'rejected' ? (
            <Button variant="primary" onClick={() => { onClose(); onRegister(event) }}>Daftar Ulang</Button>
          ) : (
            <Button variant="primary" onClick={() => { onClose(); onRegister(event) }}>Daftar Sekarang</Button>
          )}
        </>
      }
    >
      {event.thumbnail?.url && (
        <PhotoProvider>
          <PhotoView src={event.thumbnail.url}>
            <DetailModalThumb src={event.thumbnail.url} alt={event.title} />
          </PhotoView>
        </PhotoProvider>
      )}

      {event.description && (
        <DetailRow>
          <DetailLabel>Deskripsi</DetailLabel>
          <DetailText>{event.description}</DetailText>
        </DetailRow>
      )}

      {(event.registrationStartAt || event.registrationEndAt) && (
        <DetailRow>
          <DetailLabel>Periode Pendaftaran</DetailLabel>
          <DetailText>
            {event.registrationStartAt ? formatLocalDate(event.registrationStartAt) : '—'}
            {event.registrationEndAt && ` s/d ${formatLocalDate(event.registrationEndAt)}`}
          </DetailText>
        </DetailRow>
      )}

      {hasReward && (
        <DetailRow>
          <DetailLabel>Reward saat Disetujui</DetailLabel>
          <div>
            {hasCredits && (
              <RewardBadge>
                🎁 {event.creditsOnApproval} kredit
                {event.creditType === 'expiring' && event.creditExpiryDays
                  ? ` (berlaku ${event.creditExpiryDays} hari)`
                  : ' (permanen)'}
              </RewardBadge>
            )}
            {hasSubscription && (
              <FeatureList>
                {event.allowedFeatures.map(({ key, durationDays }) => (
                  <FeatureTag key={key}>
                    {featureLabels[key] || key} — {durationDays} hari
                  </FeatureTag>
                ))}
              </FeatureList>
            )}
          </div>
        </DetailRow>
      )}
    </Modal>
  )
}

export default EventDetailModal
