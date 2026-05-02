import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/webinar/reducer'
import {
  fetchAdminWebinars, fetchAdminWebinar, deleteWebinar,
  fetchAllWebinarRegistrations,
} from '@store/webinar/adminAction'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import Pagination from '@components/Pagination'
import Table from '@components/common/Table'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import WebinarFormModal from './components/WebinarFormModal'
import RegistrationDetailModal from './components/RegistrationDetailModal'
import { formatLocalDate } from '@utils/dateUtils'
import {
  Container, Header, HeaderContent, TitleSection, Title, Actions,
  TabBar, TabBtn,
  WebinarGrid, WebinarCard, CardThumbnail, CardHeader, CardTitle, StatusBadge,
  CardMeta, CardDescription, CardStats, CardActions,
  FilterCard, FilterGrid, FilterField, FilterLabel, FilterActions,
  UserCell, UserCellName, UserCellEmail,
  DateCell, DateCellMain,
  RegistrationStatusBadge,
} from './Webinar.styles'

const WEBINAR_STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Cancelled', value: 'cancelled' },
]

const REG_STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Disetujui', value: 'approved' },
  { label: 'Ditolak', value: 'rejected' },
]

const STATUS_LABEL = { pending: 'Pending', approved: 'Disetujui', rejected: 'Ditolak' }

function Webinar({ onBack = null }) {
  const dispatch = useDispatch()
  const {
    webinars, filter, pagination, loading, detail,
    registrations, registrationFilter, registrationPagination,
  } = useSelector(state => state.webinar)

  const [tab, setTab] = useState('webinars')
  const [modal, setModal] = useState(null)
  const [selectedRegistrationId, setSelectedRegistrationId] = useState(null)

  useEffect(() => {
    if (tab === 'webinars') dispatch(fetchAdminWebinars())
    else dispatch(fetchAllWebinarRegistrations())
  }, [tab, dispatch])

  // ── Webinar tab handlers ──────────────────────────────────────────────────

  const handleWebinarSearch = (e) => {
    e.preventDefault()
    dispatch(actions.setPagination({ ...pagination, page: 1 }))
    dispatch(fetchAdminWebinars())
  }

  const handleWebinarPageChange = (page) => {
    dispatch(actions.setPagination({ ...pagination, page }))
    dispatch(fetchAdminWebinars())
  }

  const handleEdit = async (webinar) => {
    await dispatch(fetchAdminWebinar(webinar.uniqueId))
    setModal('edit')
  }

  const handleDelete = async (webinar) => {
    if (!window.confirm(`Hapus webinar "${webinar.title}"?`)) return
    dispatch(deleteWebinar(webinar.uniqueId, () => dispatch(fetchAdminWebinars())))
  }

  // ── Registration tab handlers ─────────────────────────────────────────────

  const handleRegSearch = (e) => {
    e.preventDefault()
    dispatch(actions.setRegistrationPagination({ ...registrationPagination, page: 1 }))
    dispatch(fetchAllWebinarRegistrations())
  }

  const handleRegPageChange = (page) => {
    dispatch(actions.setRegistrationPagination({ ...registrationPagination, page }))
    dispatch(fetchAllWebinarRegistrations())
  }

  const updateRegFilter = (key, value) => {
    dispatch(actions.updateRegistrationFilter({ key, value }))
  }

  // ── Registration table columns ────────────────────────────────────────────

  const regColumns = [
    {
      key: 'createdAt',
      header: 'Tanggal',
      width: '130px',
      render: (createdAt) => (
        <DateCell>
          <DateCellMain>{formatLocalDate(createdAt)}</DateCellMain>
        </DateCell>
      ),
    },
    {
      key: 'user',
      header: 'Peserta',
      render: (user) => (
        <UserCell>
          <UserCellName>{user?.name || '—'}</UserCellName>
          <UserCellEmail>{user?.email || '—'}</UserCellEmail>
        </UserCell>
      ),
    },
    {
      key: 'webinar',
      header: 'Webinar',
      render: (webinar) => (
        <UserCell>
          <UserCellName>{webinar?.title || '—'}</UserCellName>
          {webinar?.startAt && (
            <UserCellEmail>{formatLocalDate(webinar.startAt)}</UserCellEmail>
          )}
        </UserCell>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '110px',
      align: 'center',
      render: (status) => (
        <RegistrationStatusBadge $s={status}>
          {STATUS_LABEL[status] || status}
        </RegistrationStatusBadge>
      ),
    },
    {
      key: '',
      header: 'Aksi',
      width: '90px',
      align: 'center',
      render: (row) => (
        <Button size="small" variant="primary" onClick={() => setSelectedRegistrationId(row.uniqueId)}>
          Detail
        </Button>
      ),
    },
  ]

  return (
    <Container>
      <Header>
        {onBack && <Button variant="secondary" onClick={onBack}>← Kembali</Button>}
        <HeaderContent>
          <TitleSection>
            <Title>Kelola Webinar</Title>
          </TitleSection>
          {tab === 'webinars' && (
            <Actions>
              <Button variant="primary" onClick={() => setModal('create')}>
                + Tambah Webinar
              </Button>
            </Actions>
          )}
        </HeaderContent>
      </Header>

      <TabBar>
        <TabBtn $active={tab === 'webinars'} onClick={() => setTab('webinars')}>
          Webinar
        </TabBtn>
        <TabBtn $active={tab === 'registrations'} onClick={() => setTab('registrations')}>
          Registrasi
        </TabBtn>
      </TabBar>

      {/* ── Tab: Webinar List ── */}
      {tab === 'webinars' && (
        <>
          <FilterCard>
            <form onSubmit={handleWebinarSearch}>
              <FilterGrid>
                <FilterField>
                  <FilterLabel>Judul Webinar</FilterLabel>
                  <TextInput
                    placeholder="Cari judul webinar..."
                    value={filter.search || ''}
                    onChange={e => dispatch(actions.updateFilter({ key: 'search', value: e.target.value }))}
                  />
                </FilterField>
                <FilterField>
                  <FilterLabel>Status</FilterLabel>
                  <Dropdown
                    options={WEBINAR_STATUS_OPTIONS}
                    value={WEBINAR_STATUS_OPTIONS.find(o => o.value === (filter.status || '')) || WEBINAR_STATUS_OPTIONS[0]}
                    onChange={option => dispatch(actions.updateFilter({ key: 'status', value: option?.value || '' }))}
                    placeholder="Filter status..."
                  />
                </FilterField>
              </FilterGrid>
              <FilterActions>
                <Button variant="primary" type="submit">Cari</Button>
              </FilterActions>
            </form>
          </FilterCard>

          {loading.isGetListLoading ? (
            <Loading text="Memuat webinar..." minHeight="300px" />
          ) : webinars.length === 0 ? (
            <EmptyState
              icon="🎓"
              title="Belum ada webinar"
              actionLabel="Tambah Webinar Pertama"
              onAction={() => setModal('create')}
              actionVariant="primary"
            />
          ) : (
            <WebinarGrid>
              {webinars.map(webinar => (
                <WebinarCard key={webinar.uniqueId}>
                  <PhotoProvider>
                    <CardThumbnail $hasImage={!!webinar.thumbnail?.url}>
                      {webinar.thumbnail?.url ? (
                        <PhotoView src={webinar.thumbnail.url}>
                          <img src={webinar.thumbnail.url} alt={webinar.title} />
                        </PhotoView>
                      ) : '🎓'}
                    </CardThumbnail>
                  </PhotoProvider>
                  <CardHeader>
                    <CardTitle>{webinar.title}</CardTitle>
                    <StatusBadge status={webinar.status}>
                      {webinar.status === 'published' ? 'Published' :
                       webinar.status === 'cancelled' ? 'Cancelled' : 'Draft'}
                    </StatusBadge>
                  </CardHeader>
                  <CardMeta>📅 {formatLocalDate(webinar.startAt)}</CardMeta>
                  {webinar.description && <CardDescription>{webinar.description}</CardDescription>}
                  <CardStats>👥 {webinar.registrationCount ?? 0} pendaftar</CardStats>
                  <CardActions>
                    <Button variant="secondary" onClick={() => handleEdit(webinar)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(webinar)}>
                      Hapus
                    </Button>
                  </CardActions>
                </WebinarCard>
              ))}
            </WebinarGrid>
          )}

          {!loading.isGetListLoading && webinars.length > 0 &&
            (pagination.page > 1 || !pagination.isLastPage) && (
            <Pagination
              currentPage={pagination.page}
              isLastPage={pagination.isLastPage}
              onPageChange={handleWebinarPageChange}
              isLoading={loading.isGetListLoading}
              variant="admin"
              language="id"
            />
          )}
        </>
      )}

      {/* ── Tab: Registrations ── */}
      {tab === 'registrations' && (
        <>
          <FilterCard>
            <form onSubmit={handleRegSearch}>
              <FilterGrid>
                <FilterField>
                  <FilterLabel>Cari Peserta</FilterLabel>
                  <TextInput
                    placeholder="Nama atau email peserta..."
                    value={registrationFilter?.search || ''}
                    onChange={e => updateRegFilter('search', e.target.value)}
                  />
                </FilterField>
                <FilterField>
                  <FilterLabel>Status</FilterLabel>
                  <Dropdown
                    options={REG_STATUS_OPTIONS}
                    value={REG_STATUS_OPTIONS.find(o => o.value === (registrationFilter?.status || '')) || REG_STATUS_OPTIONS[0]}
                    onChange={option => updateRegFilter('status', option?.value || '')}
                    placeholder="Filter status..."
                  />
                </FilterField>
              </FilterGrid>
              <FilterActions>
                <Button variant="primary" type="submit">Cari</Button>
              </FilterActions>
            </form>
          </FilterCard>

          <Table
            data={registrations}
            columns={regColumns}
            loading={loading.isGetRegistrationsLoading}
            emptyText="Belum ada registrasi."
            emptySubtext="Coba ubah filter pencarian"
            hoverable
            striped
          />

          {!loading.isGetRegistrationsLoading && registrations.length > 0 &&
            (registrationPagination.page > 1 || !registrationPagination.isLastPage) && (
            <Pagination
              currentPage={registrationPagination.page}
              isLastPage={registrationPagination.isLastPage}
              onPageChange={handleRegPageChange}
              isLoading={loading.isGetRegistrationsLoading}
              variant="admin"
              language="id"
            />
          )}
        </>
      )}

      {/* ── Modals ── */}
      {modal === 'create' && (
        <WebinarFormModal mode="create" onClose={() => setModal(null)} />
      )}

      {modal === 'edit' && detail && (
        <WebinarFormModal mode="edit" initialValues={detail} onClose={() => setModal(null)} />
      )}

      {selectedRegistrationId && (
        <RegistrationDetailModal
          registrationUniqueId={selectedRegistrationId}
          onClose={() => setSelectedRegistrationId(null)}
        />
      )}

    </Container>
  )
}

export default Webinar
