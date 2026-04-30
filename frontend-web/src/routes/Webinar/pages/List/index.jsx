import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchWebinars, fetchMyRegistrations, registerWebinar } from '@store/webinar/userAction'
import { actions } from '@store/webinar/reducer'
import { upload } from '@store/common/action'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import FileUpload from '@components/common/FileUpload'
import Modal from '@components/common/Modal'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import Pagination from '@components/Pagination'
import { formatLocalDateTimeFull } from '@utils/dateUtils'
import {
  PageWrapper, Container, PageTitle, PageSubtitle,
  TabBar, TabBtn,
  FilterCard, FilterField, FilterLabel, FilterActions,
  Grid, WebinarCard, Thumbnail, CardBody, CardTitle, CardSpeakerName,
  CardDateText, CardDescText, CardFooterRow,
  DetailModalThumb, DetailSection, DetailRow, DetailLabel, DetailText,
  SpeakerEntry, SpeakerName, SuitableList, SuitableItem,
  RegCard, RegInfo, RegTitle, RegMeta,
  StatusBadge, EvidenceLinks, EvidenceLink, AdminNote,
  JoinLinks, JoinLink,
  UploadedList, UploadedItem, UploadError,
} from './List.styles'

const STATUS_LABEL = { pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' }
const MAX_EVIDENCE = 3

// ─── Webinar Detail Modal ────────────────────────────────────────────────────

function WebinarDetailModal({ webinar, onClose, onRegister }) {
  const hasDetail = webinar.speakers?.some(s => s.bio) || webinar.benefits || webinar.suitableFor?.length > 0

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={webinar.title}
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Tutup</Button>
          {webinar.isRegistered ? (
            <Button variant="secondary" disabled>✓ Sudah Mendaftar</Button>
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
          {formatLocalDateTimeFull(webinar.startAt)}
          {webinar.endAt && ` — ${formatLocalDateTimeFull(webinar.endAt)}`}
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

// ─── Register Modal ──────────────────────────────────────────────────────────

function RegisterModal({ webinar, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.webinar)
  const { loading: commonLoading } = useSelector(state => state.common)
  const [uploaded, setUploaded] = useState([])
  const [error, setError] = useState('')

  const handleFileSelect = async (files) => {
    setError('')
    const fileArray = files instanceof FileList ? Array.from(files) : [files]
    const remaining = MAX_EVIDENCE - uploaded.length
    const toUpload = fileArray.slice(0, remaining)
    if (fileArray.length > remaining) {
      setError(`Maksimal ${MAX_EVIDENCE} bukti. ${fileArray.length - remaining} file diabaikan.`)
    }
    for (const file of toUpload) {
      const result = await dispatch(upload(file, 'webinar-evidence'))
      setUploaded(prev => [...prev, { blobId: result.blobId, name: result.filename || file.name }])
    }
  }

  const handleSubmit = () => {
    if (uploaded.length === 0) { setError('Upload minimal satu bukti.'); return }
    dispatch(registerWebinar(
      webinar.uniqueId,
      uploaded.map(f => f.blobId),
      () => { if (onSuccess) onSuccess(); onClose() }
    ))
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Daftar — ${webinar.title}`}
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading.isRegisterLoading || commonLoading.isUploading}
          >
            {loading.isRegisterLoading ? 'Mengirim...' : 'Kirim Pendaftaran'}
          </Button>
        </>
      }
    >
      {uploaded.length < MAX_EVIDENCE && (
        <FileUpload
          file={null}
          onFileSelect={handleFileSelect}
          acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'application/pdf']}
          acceptedTypesLabel="JPG, PNG, PDF"
          maxSizeMB={10}
          isUploading={commonLoading.isUploading}
          uploadText={`Klik untuk upload bukti (maks. ${MAX_EVIDENCE} file)`}
          multiple
        />
      )}

      {uploaded.length > 0 && (
        <UploadedList>
          {uploaded.map((f, i) => (
            <UploadedItem key={i}>
              <span>✅ {f.name}</span>
              <Button variant="ghost" onClick={() => setUploaded(p => p.filter((_, j) => j !== i))}>✕</Button>
            </UploadedItem>
          ))}
        </UploadedList>
      )}

      {error && <UploadError>{error}</UploadError>}
    </Modal>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

function WebinarPage() {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const { webinars, myRegistrations, filter, pagination, loading } = useSelector(state => state.webinar)
  const [tab, setTab] = useState(searchParams.get('tab') === 'registrations' ? 'registrations' : 'list')
  const [detailTarget, setDetailTarget] = useState(null)
  const [registerTarget, setRegisterTarget] = useState(null)

  useEffect(() => {
    if (tab === 'list') dispatch(fetchWebinars())
    else dispatch(fetchMyRegistrations())
  }, [tab, dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(actions.setPagination({ ...pagination, page: 1 }))
    dispatch(fetchWebinars())
  }

  const handlePageChange = (page) => {
    dispatch(actions.setPagination({ ...pagination, page }))
    if (tab === 'list') dispatch(fetchWebinars())
    else dispatch(fetchMyRegistrations())
  }

  return (
    <PageWrapper>
      <Container>
        <PageTitle>🎓 Webinar</PageTitle>
        <PageSubtitle>Daftar & ikuti webinar eksklusif dari para dokter dan spesialis</PageSubtitle>

        <TabBar>
          <TabBtn $active={tab === 'list'} onClick={() => setTab('list')}>Webinar Tersedia</TabBtn>
          <TabBtn $active={tab === 'registrations'} onClick={() => setTab('registrations')}>
            Pendaftaran Saya
            {myRegistrations.length > 0 && ` (${myRegistrations.length})`}
          </TabBtn>
        </TabBar>

        {/* ── Tab: Webinar List ── */}
        {tab === 'list' && (
          <>
            <FilterCard>
              <form onSubmit={handleSearch}>
                <FilterField>
                  <FilterLabel>Judul Webinar</FilterLabel>
                  <TextInput
                    placeholder="Cari webinar berdasarkan judul..."
                    value={filter.search || ''}
                    onChange={e => dispatch(actions.updateFilter({ key: 'search', value: e.target.value }))}
                  />
                </FilterField>
                <FilterActions>
                  <Button variant="primary" type="submit">Cari</Button>
                </FilterActions>
              </form>
            </FilterCard>

            {loading.isGetListLoading ? (
              <Loading text="Memuat webinar..." minHeight="300px" />
            ) : webinars.length === 0 ? (
              <EmptyState icon="🎓" title="Tidak ada webinar tersedia saat ini." />
            ) : (
              <Grid>
                {webinars.map(w => (
                  <WebinarCard key={w.uniqueId}>
                    <PhotoProvider>
                      <Thumbnail $hasImage={!!w.thumbnail?.url}>
                        {w.thumbnail?.url ? (
                          <PhotoView src={w.thumbnail.url}>
                            <img src={w.thumbnail.url} alt={w.title} />
                          </PhotoView>
                        ) : '🎓'}
                      </Thumbnail>
                    </PhotoProvider>

                    <CardBody>
                      <CardTitle>{w.title}</CardTitle>
                      {w.speakers?.length > 0 && (
                        <CardSpeakerName>
                          🎤 {w.speakers.map(s => s.name).filter(Boolean).join(', ')}
                        </CardSpeakerName>
                      )}
                      <CardDateText>
                        📅 {formatLocalDateTimeFull(w.startAt)}
                        {w.endAt && ` — ${formatLocalDateTimeFull(w.endAt)}`}
                      </CardDateText>
                      {w.description && <CardDescText>{w.description}</CardDescText>}
                    </CardBody>

                    <CardFooterRow>
                      <Button variant="ghost" onClick={() => setDetailTarget(w)}>
                        Lihat Detail
                      </Button>
                      {w.isRegistered ? (
                        <Button variant="secondary" disabled>✓ Terdaftar</Button>
                      ) : (
                        <Button variant="primary" onClick={() => setRegisterTarget(w)}>
                          Daftar
                        </Button>
                      )}
                    </CardFooterRow>
                  </WebinarCard>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* ── Tab: My Registrations ── */}
        {tab === 'registrations' && (
          <>
            {loading.isGetMyRegistrationsLoading ? (
              <Loading text="Memuat pendaftaran..." minHeight="300px" />
            ) : myRegistrations.length === 0 ? (
              <EmptyState
                icon="📋"
                title="Belum ada pendaftaran"
                actionLabel="Lihat Webinar"
                onAction={() => setTab('list')}
                actionVariant="primary"
              />
            ) : (
              myRegistrations.map(reg => (
                <RegCard key={reg.uniqueId}>
                  <RegInfo>
                    <RegTitle>{reg.webinar?.title || '—'}</RegTitle>
                    {reg.webinar?.startAt && <RegMeta>📅 {formatLocalDateTimeFull(reg.webinar.startAt)}</RegMeta>}
                    <RegMeta>Mendaftar: {formatLocalDateTimeFull(reg.createdAt)}</RegMeta>
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
              ))
            )}
          </>
        )}

        {!loading.isGetListLoading && !loading.isGetMyRegistrationsLoading &&
          (pagination.page > 1 || !pagination.isLastPage) && (
          <Pagination
            variant="admin"
            currentPage={pagination.page}
            isLastPage={pagination.isLastPage}
            onPageChange={handlePageChange}
            isLoading={tab === 'list' ? loading.isGetListLoading : loading.isGetMyRegistrationsLoading}
            language="id"
          />
        )}

        {detailTarget && (
          <WebinarDetailModal
            webinar={detailTarget}
            onClose={() => setDetailTarget(null)}
            onRegister={(w) => setRegisterTarget(w)}
          />
        )}

        {registerTarget && (
          <RegisterModal
            webinar={registerTarget}
            onClose={() => setRegisterTarget(null)}
            onSuccess={() => dispatch(fetchWebinars())}
          />
        )}
      </Container>
    </PageWrapper>
  )
}

export default WebinarPage
