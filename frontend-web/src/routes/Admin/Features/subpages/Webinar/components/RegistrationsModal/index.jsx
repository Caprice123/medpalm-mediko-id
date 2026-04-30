import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import Textarea from '@components/common/Textarea'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import { fetchWebinarRegistrations, reviewRegistration } from '@store/webinar/adminAction'
import { formatLocalDate } from '@utils/dateUtils'
import {
  Tabs, Tab,
  RegistrationList, RegistrationCard, RegHeader,
  UserInfo, UserName, UserEmail,
  StatusBadge, EvidenceList, EvidenceItem,
  RegActions, AdminNote, DateText,
} from './RegistrationsModal.styles'

const TABS = [
  { label: 'Semua', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Disetujui', value: 'approved' },
  { label: 'Ditolak', value: 'rejected' },
]

function ReviewInline({ registration, onDone }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.webinar)
  const [notes, setNotes] = useState('')
  const [action, setAction] = useState(null)

  const handleReview = (status) => {
    setAction(status)
    dispatch(reviewRegistration(
      registration.uniqueId,
      { status, adminNotes: notes || undefined },
      onDone
    ))
  }

  return (
    <div style={{ marginTop: '0.75rem' }}>
      <Textarea
        placeholder="Catatan untuk peserta (opsional)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={2}
      />
      <RegActions style={{ marginTop: '0.5rem' }}>
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
      </RegActions>
    </div>
  )
}

function RegistrationsModal({ webinar, onClose }) {
  const dispatch = useDispatch()
  const { registrations, loading } = useSelector(state => state.webinar)
  const [activeTab, setActiveTab] = useState('')

  const loadRegistrations = () => {
    dispatch(fetchWebinarRegistrations(webinar.uniqueId, { status: activeTab || undefined }))
  }

  useEffect(() => { loadRegistrations() }, [webinar.uniqueId, activeTab])

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Registrasi — ${webinar.title}`}
      size="large"
      footer={<Button variant="secondary" onClick={onClose}>Tutup</Button>}
    >
      <Tabs>
        {TABS.map(tab => (
          <Tab key={tab.value} active={activeTab === tab.value} onClick={() => setActiveTab(tab.value)}>
            {tab.label}
          </Tab>
        ))}
      </Tabs>

      {loading.isGetRegistrationsLoading ? (
        <Loading text="Memuat registrasi..." minHeight="200px" />
      ) : registrations.length === 0 ? (
        <EmptyState icon="📋" title="Belum ada registrasi untuk filter ini." />
      ) : (
        <RegistrationList>
          {registrations.map(reg => (
            <RegistrationCard key={reg.uniqueId}>
              <RegHeader>
                <UserInfo>
                  <UserName>{reg.user?.name || '—'}</UserName>
                  <UserEmail>{reg.user?.email || '—'}</UserEmail>
                  <DateText>Mendaftar: {formatLocalDate(reg.createdAt)}</DateText>
                </UserInfo>
                <StatusBadge status={reg.status}>
                  {reg.status === 'pending' ? 'Pending' :
                   reg.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                </StatusBadge>
              </RegHeader>

              {reg.evidences?.length > 0 && (
                <EvidenceList>
                  {reg.evidences.map((ev, i) => (
                    <EvidenceItem key={ev.id || i} href={ev.url} target="_blank" rel="noreferrer">
                      📎 {ev.filename || `Bukti ${i + 1}`}
                    </EvidenceItem>
                  ))}
                </EvidenceList>
              )}

              {reg.status !== 'pending' && reg.adminNotes && (
                <AdminNote>Catatan: {reg.adminNotes}</AdminNote>
              )}

              {reg.status === 'pending' && (
                <ReviewInline registration={reg} onDone={loadRegistrations} />
              )}
            </RegistrationCard>
          ))}
        </RegistrationList>
      )}
    </Modal>
  )
}

export default RegistrationsModal
