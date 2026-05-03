import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import Textarea from '@components/common/Textarea'
import Loading from '@components/common/Loading'
import { fetchRegistrationDetail, reviewRegistration, fetchAllEventRegistrations } from '@store/event/adminAction'
import { formatLocalDateLong } from '@utils/dateUtils'
import {
  DetailSection, SectionTitle, DetailGrid, DetailItem, DetailLabel, DetailValue,
  StatusBadge, EvidenceList, EvidenceItem, EvidenceInfo, EvidenceFileName,
  ActionButtons, NotesField, Divider, GrantedList, GrantedTag,
} from './RegistrationDetailModal.styles'

const STATUS_LABEL = { pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' }

function RegistrationDetailModal({ registrationUniqueId, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.event)
  const appFeatures = useSelector(state => state.feature.features)
  const featureLabels = Object.fromEntries(appFeatures.map(f => [f.sessionType, f.name]))
  const [registration, setRegistration] = useState(null)
  const [notes, setNotes] = useState('')
  const [action, setAction] = useState(null)

  useEffect(() => {
    dispatch(fetchRegistrationDetail(registrationUniqueId)).then(data => {
      if (data) setRegistration(data)
    })
  }, [registrationUniqueId, dispatch])

  const handleReview = (status) => {
    setAction(status)
    dispatch(
      reviewRegistration(
        registrationUniqueId,
        { status, adminNotes: notes || undefined },
        () => {
          dispatch(fetchAllEventRegistrations())
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
      {loading.isGetDetailLoading || !registration ? (
        <Loading text="Memuat detail..." minHeight="200px" />
      ) : (
        <>
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
            <SectionTitle>Informasi Event</SectionTitle>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>Code</DetailLabel>
                <DetailValue>{registration.event?.code || '—'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Judul</DetailLabel>
                <DetailValue>{registration.event?.title || '—'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Tanggal</DetailLabel>
                <DetailValue>
                  {registration.event?.startAt ? formatLocalDateLong(registration.event.startAt) : '—'}
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

          {registration.status === 'approved' &&
            (registration.creditsGranted > 0 || registration.featuresGranted?.length > 0) && (
            <>
              <Divider />
              <DetailSection>
                <SectionTitle>Reward yang Diberikan</SectionTitle>
                <GrantedList>
                  {registration.creditsGranted > 0 && (
                    <GrantedTag>🎁 {registration.creditsGranted} kredit</GrantedTag>
                  )}
                  {(registration.featuresGranted || []).map(({ key, durationDays }) => (
                    <GrantedTag key={key}>
                      {featureLabels[key] || key} — {durationDays} hari
                    </GrantedTag>
                  ))}
                </GrantedList>
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
        </>
      )}
    </Modal>
  )
}

export default RegistrationDetailModal
