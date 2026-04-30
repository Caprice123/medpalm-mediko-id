import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import Textarea from '@components/common/Textarea'
import { reviewRegistration, fetchAllWebinarRegistrations } from '@store/webinar/adminAction'
import { formatLocalDateLong } from '@utils/dateUtils'
import {
  DetailSection, SectionTitle, DetailGrid, DetailItem, DetailLabel, DetailValue,
  StatusBadge, EvidenceList, EvidenceItem, EvidenceInfo, EvidenceFileName,
  ActionButtons, NotesField, Divider,
} from './RegistrationDetailModal.styles'

const STATUS_LABEL = { pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' }

function RegistrationDetailModal({ registration, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.webinar)
  const [notes, setNotes] = useState('')
  const [action, setAction] = useState(null)

  const handleReview = (status) => {
    setAction(status)
    dispatch(
      reviewRegistration(
        registration.uniqueId,
        { status, adminNotes: notes || undefined },
        () => {
          dispatch(fetchAllWebinarRegistrations())
          onClose()
        }
      )
    )
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Detail Registrasi"
      size="medium"
      footer={<Button variant="secondary" onClick={onClose}>Tutup</Button>}
    >
      <DetailSection>
        <SectionTitle>Informasi Peserta</SectionTitle>
        <DetailGrid>
          <DetailItem>
            <DetailLabel>Nama</DetailLabel>
            <DetailValue>{registration.user?.name || '—'}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Email</DetailLabel>
            <DetailValue>{registration.user?.email || '—'}</DetailValue>
          </DetailItem>
        </DetailGrid>
      </DetailSection>

      <Divider />

      <DetailSection>
        <SectionTitle>Informasi Webinar</SectionTitle>
        <DetailGrid>
          <DetailItem>
            <DetailLabel>Judul</DetailLabel>
            <DetailValue>{registration.webinar?.title || '—'}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Tanggal</DetailLabel>
            <DetailValue>
              {registration.webinar?.startAt ? formatLocalDateLong(registration.webinar.startAt) : '—'}
            </DetailValue>
          </DetailItem>
        </DetailGrid>
      </DetailSection>

      <Divider />

      <DetailSection>
        <SectionTitle>Status Pendaftaran</SectionTitle>
        <DetailGrid>
          <DetailItem>
            <DetailLabel>Status</DetailLabel>
            <DetailValue>
              <StatusBadge $s={registration.status}>
                {STATUS_LABEL[registration.status] || registration.status}
              </StatusBadge>
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Tanggal Mendaftar</DetailLabel>
            <DetailValue>{formatLocalDateLong(registration.createdAt)}</DetailValue>
          </DetailItem>
          {registration.reviewedAt && (
            <DetailItem>
              <DetailLabel>Tanggal Ditinjau</DetailLabel>
              <DetailValue>{formatLocalDateLong(registration.reviewedAt)}</DetailValue>
            </DetailItem>
          )}
          {registration.adminNotes && (
            <DetailItem>
              <DetailLabel>Catatan Admin</DetailLabel>
              <DetailValue>{registration.adminNotes}</DetailValue>
            </DetailItem>
          )}
        </DetailGrid>
      </DetailSection>

      {registration.evidences?.length > 0 && (
        <>
          <Divider />
          <DetailSection>
            <SectionTitle>Bukti Pendaftaran</SectionTitle>
            <EvidenceList>
              {registration.evidences.map((ev, i) => (
                <EvidenceItem key={ev.id || i}>
                  <EvidenceInfo>
                    <EvidenceFileName>{ev.filename || `Bukti ${i + 1}`}</EvidenceFileName>
                  </EvidenceInfo>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => window.open(ev.url, '_blank')}
                  >
                    Lihat
                  </Button>
                </EvidenceItem>
              ))}
            </EvidenceList>
          </DetailSection>
        </>
      )}

      {registration.status === 'pending' && (
        <>
          <Divider />
          <NotesField>
            <Textarea
              label="Catatan untuk peserta (opsional)"
              placeholder="Tulis catatan jika diperlukan..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
            />
          </NotesField>
          <ActionButtons>
            <Button
              variant="primary"
              onClick={() => handleReview('approved')}
              disabled={loading.isReviewLoading}
            >
              {loading.isReviewLoading && action === 'approved' ? 'Memproses...' : '✓ Setujui'}
            </Button>
            <Button
              variant="danger"
              onClick={() => handleReview('rejected')}
              disabled={loading.isReviewLoading}
            >
              {loading.isReviewLoading && action === 'rejected' ? 'Memproses...' : '✗ Tolak'}
            </Button>
          </ActionButtons>
        </>
      )}
    </Modal>
  )
}

export default RegistrationDetailModal
