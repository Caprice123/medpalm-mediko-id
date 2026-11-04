import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { PiGift, PiHourglass, PiClock, PiInfinity } from 'react-icons/pi'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { formatJakartaDateTimeFull } from '@utils/dateUtils'
import {
  getClaimAction, getClaimCountdown, describeReward, isEvergreen, deadlineLabel,
} from '../../utils/claimState'
import RewardLine from '../RewardLine'
import {
  DetailCover, Section, SectionLabel, BodyText, WindowNote,
} from './EventDetailModal.styles'

function EventDetailModal({ event, featureLabels, onClose, onClaim }) {
  const action = getClaimAction(event)
  const countdown = getClaimCountdown(event)
  const reward = describeReward(event, featureLabels)
  const evergreen = isEvergreen(event)

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={event.title}
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Tutup</Button>
          <Button
            variant="primary"
            disabled={action.disabled}
            onClick={() => onClaim(event)}
          >
            {action.label}
          </Button>
        </>
      }
    >
      {event.thumbnail?.url && (
        <PhotoProvider>
          <PhotoView src={event.thumbnail.url}>
            <DetailCover src={event.thumbnail.url} alt={event.title} />
          </PhotoView>
        </PhotoProvider>
      )}

      {!reward.isEmpty && (
        <Section>
          <SectionLabel>
            <PiGift size={14} aria-hidden="true" />
            Yang kamu dapat setelah disetujui
          </SectionLabel>
          <RewardLine reward={reward} />
        </Section>
      )}

      {event.description && (
        <Section>
          <SectionLabel>Cara klaim</SectionLabel>
          <BodyText>{event.description}</BodyText>
        </Section>
      )}

      {evergreen ? (
        <WindowNote $tone="evergreen">
          <PiInfinity size={15} aria-hidden="true" />
          Selalu terbuka — tanpa batas waktu
        </WindowNote>
      ) : (
        <WindowNote $tone={countdown?.isUrgent ? 'urgent' : 'neutral'}>
          {countdown?.isUrgent
            ? <PiHourglass size={15} aria-hidden="true" />
            : <PiClock size={15} aria-hidden="true" />}
          {countdown && !countdown.isClosed
            ? `${deadlineLabel(countdown)} — ditutup ${formatJakartaDateTimeFull(event.registrationEndAt)}`
            : `Ditutup ${formatJakartaDateTimeFull(event.registrationEndAt)}`}
        </WindowNote>
      )}
    </Modal>
  )
}

export default EventDetailModal
