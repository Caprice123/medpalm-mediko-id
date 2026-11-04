import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { formatJakartaDateTimeFull } from '@utils/dateUtils'
import { getRegistrationStatus } from '../../utils'
import {
  DetailModalThumb, DetailRow, DetailLabel, DetailText,
  SpeakerEntry, SpeakerName, SuitableList, SuitableItem,
} from './WebinarDetailModal.styles'

function WebinarDetailModal({ webinar, onClose, onRegister }) {
  return (
    <Modal
      isOpen
      onClose={onClose}
      title={webinar.title}
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Tutup</Button>
          {webinar.myRegistrationStatus === 'pending' ? (
            <Button variant="secondary" disabled>⏳ Menunggu Review</Button>
          ) : webinar.myRegistrationStatus === 'approved' ? (
            <Button variant="secondary" disabled>✓ Sudah Mendaftar</Button>
          ) : getRegistrationStatus(webinar) === 'upcoming' ? (
            <Button variant="secondary" disabled>Pendaftaran Belum Dibuka</Button>
          ) : getRegistrationStatus(webinar) === 'closed' ? (
            <Button variant="secondary" disabled>Pendaftaran Sudah Ditutup</Button>
          ) : webinar.myRegistrationStatus === 'rejected' ? (
            <Button variant="primary" onClick={() => { onClose(); onRegister(webinar) }}>
              Daftar Ulang
            </Button>
          ) : (
            <Button variant="primary" onClick={() => { onClose(); onRegister(webinar) }}>
              Daftar Sekarang
            </Button>
          )}
        </>
      }
    >
      {webinar.thumbnail?.url && (
        <PhotoProvider>
          <PhotoView src={webinar.thumbnail.url}>
            <DetailModalThumb src={webinar.thumbnail.url} alt={webinar.title} />
          </PhotoView>
        </PhotoProvider>
      )}

      {webinar.speakers?.length > 0 && (
        <DetailRow>
          <DetailLabel>🎤 Pembicara</DetailLabel>
          {webinar.speakers.map((s, i) => s.name && (
            <SpeakerEntry key={i}>
              <SpeakerName>{s.name}</SpeakerName>
              {s.bio && <DetailText>{s.bio}</DetailText>}
            </SpeakerEntry>
          ))}
        </DetailRow>
      )}

      <DetailRow>
        <DetailLabel>📅 Waktu</DetailLabel>
        <DetailText>
          {formatJakartaDateTimeFull(webinar.startAt)}
          {webinar.endAt && ` — ${formatJakartaDateTimeFull(webinar.endAt)}`}
        </DetailText>
      </DetailRow>

      {webinar.description && (
        <DetailRow>
          <DetailLabel>Deskripsi</DetailLabel>
          <DetailText>{webinar.description}</DetailText>
        </DetailRow>
      )}

      {webinar.benefits && (
        <DetailRow>
          <DetailLabel>Benefit</DetailLabel>
          <DetailText>{webinar.benefits}</DetailText>
        </DetailRow>
      )}

      {webinar.suitableFor?.length > 0 && (
        <DetailRow>
          <DetailLabel>Cocok Untuk</DetailLabel>
          <SuitableList>
            {webinar.suitableFor.map((item, i) => (
              <SuitableItem key={i}>{item}</SuitableItem>
            ))}
          </SuitableList>
        </DetailRow>
      )}
    </Modal>
  )
}

export default WebinarDetailModal
