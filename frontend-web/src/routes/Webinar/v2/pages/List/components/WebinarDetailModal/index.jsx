import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import {
  PiCalendarBlank, PiMicrophoneStage, PiUsersThree,
  PiSealCheck, PiHourglass, PiCalendarX,
} from 'react-icons/pi'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { formatJakartaDateTimeFull } from '@utils/dateUtils'
import { getRegistrationCountdown, getWebinarAction } from '../../utils/registrationState'
import {
  DetailCover, Section, SectionLabel, BodyText, SpeakerEntry,
  TagList, Tag, WindowNote,
} from './WebinarDetailModal.styles'

function WebinarDetailModal({ webinar, onClose, onRegister }) {
  const action = getWebinarAction(webinar)
  const countdown = getRegistrationCountdown(webinar)

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={webinar.title}
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Tutup</Button>
          <Button
            variant="primary"
            disabled={action.disabled}
            onClick={() => onRegister(webinar)}
          >
            {action.label}
          </Button>
        </>
      }
    >
      {webinar.thumbnail?.url && (
        <PhotoProvider>
          <PhotoView src={webinar.thumbnail.url}>
            <DetailCover src={webinar.thumbnail.url} alt={webinar.title} />
          </PhotoView>
        </PhotoProvider>
      )}

      <Section>
        <SectionLabel>
          <PiCalendarBlank size={14} aria-hidden="true" />
          Waktu pelaksanaan
        </SectionLabel>
        <BodyText>
          {formatJakartaDateTimeFull(webinar.startAt)}
          {webinar.endAt && ` — ${formatJakartaDateTimeFull(webinar.endAt)}`}
        </BodyText>
      </Section>

      {webinar.speakers?.filter(s => s.name).length > 0 && (
        <Section>
          <SectionLabel>
            <PiMicrophoneStage size={14} aria-hidden="true" />
            Pembicara
          </SectionLabel>
          {webinar.speakers.filter(s => s.name).map((speaker, i) => (
            <SpeakerEntry key={i}>
              <h4>{speaker.name}</h4>
              {speaker.bio && <BodyText>{speaker.bio}</BodyText>}
            </SpeakerEntry>
          ))}
        </Section>
      )}

      {webinar.description && (
        <Section>
          <SectionLabel>Deskripsi</SectionLabel>
          <BodyText>{webinar.description}</BodyText>
        </Section>
      )}

      {webinar.benefits && (
        <Section>
          <SectionLabel>
            <PiSealCheck size={14} aria-hidden="true" />
            Yang kamu dapat
          </SectionLabel>
          <BodyText>{webinar.benefits}</BodyText>
        </Section>
      )}

      {webinar.suitableFor?.length > 0 && (
        <Section>
          <SectionLabel>
            <PiUsersThree size={14} aria-hidden="true" />
            Cocok untuk
          </SectionLabel>
          <TagList>
            {webinar.suitableFor.map((item, i) => <Tag key={i}>{item}</Tag>)}
          </TagList>
        </Section>
      )}

      {countdown && !countdown.isClosed && webinar.registrationEndAt && (
        <WindowNote $urgent={countdown.isUrgent}>
          {countdown.isUrgent
            ? <PiHourglass size={15} aria-hidden="true" />
            : <PiCalendarX size={15} aria-hidden="true" />}
          Pendaftaran ditutup {formatJakartaDateTimeFull(webinar.registrationEndAt)}
        </WindowNote>
      )}
    </Modal>
  )
}

export default WebinarDetailModal
