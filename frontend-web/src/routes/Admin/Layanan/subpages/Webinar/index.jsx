import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/webinar/reducer'
import { fetchAdminWebinars, fetchAdminWebinar, deleteWebinar } from '@store/webinar/adminAction'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Pagination from '@components/Pagination'
import Table from '@components/common/Table'
import WebinarFormModal from './components/WebinarFormModal'
import WebinarDetailPage from './components/WebinarDetailPage'
import { formatJakartaDateTimeFull } from '@utils/dateUtils'
import {
  Container, Header, HeaderContent, TitleSection, Title, Actions,
  StatusBadge, CardActions,
  FilterCard, FilterGrid, FilterField, FilterLabel, FilterActions,
} from './Webinar.styles'

const WEBINAR_STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Cancelled', value: 'cancelled' },
]

function Webinar({ onBack = null }) {
  const dispatch = useDispatch()
  const { webinars, filter, pagination, loading, detail } = useSelector(state => state.webinar)

  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    dispatch(fetchAdminWebinars())
  }, [dispatch])

  const handleWebinarSearch = (e) => {
    e.preventDefault()
    dispatch(actions.setPage(1))
    dispatch(fetchAdminWebinars())
  }

  const handleWebinarPageChange = (page) => {
    dispatch(actions.setPage(page))
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

  const webinarColumns = [
    { key: 'title', header: 'Webinar' },
    {
      key: 'startAt',
      header: 'Tanggal Mulai',
      render: (startAt) => startAt ? formatJakartaDateTimeFull(startAt) : '-',
    },
    {
      key: 'endAt',
      header: 'Tanggal Selesai',
      render: (endAt) => endAt ? formatJakartaDateTimeFull(endAt) : '-',
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (status) => (
        <StatusBadge status={status}>
          {status === 'published' ? 'Published' : status === 'cancelled' ? 'Cancelled' : 'Draft'}
        </StatusBadge>
      ),
    },
    {
      header: 'Pendaftar',
      align: 'center',
      render: (w) => w.registrationCount ?? 0,
    },
    {
      header: 'Aksi',
      render: (w) => (
        <CardActions>
          <Button variant="secondary" onClick={() => setSelected(w)}>Lihat Pendaftar</Button>
          <Button variant="secondary" onClick={() => handleEdit(w)}>Edit</Button>
          <Button variant="danger" onClick={() => handleDelete(w)}>Hapus</Button>
        </CardActions>
      ),
    },
  ]

  if (selected) {
    return (
      <WebinarDetailPage
        webinar={selected}
        onBack={() => setSelected(null)}
      />
    )
  }

  return (
    <Container>
      <Header>
        {onBack && <Button variant="secondary" onClick={onBack}>← Kembali</Button>}
        <HeaderContent>
          <TitleSection>
            <Title>Kelola Webinar</Title>
          </TitleSection>
          <Actions>
            <Button variant="primary" onClick={() => setModal('create')}>
              + Tambah Webinar
            </Button>
          </Actions>
        </HeaderContent>
      </Header>

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

      <Table
        columns={webinarColumns}
        data={webinars}
        loading={loading.isGetListLoading}
        emptyText="Belum ada webinar"
        emptySubtext='Klik "+ Tambah Webinar" untuk memulai.'
      />

      {(pagination.page > 1 || !pagination.isLastPage) && (
        <Pagination
          currentPage={pagination.page}
          isLastPage={pagination.isLastPage}
          onPageChange={handleWebinarPageChange}
          isLoading={loading.isGetListLoading}
          variant="admin"
          language="id"
        />
      )}

      {/* ── Modals ── */}
      {modal === 'create' && (
        <WebinarFormModal mode="create" onClose={() => setModal(null)} />
      )}

      {modal === 'edit' && detail && (
        <WebinarFormModal mode="edit" initialValues={detail} onClose={() => setModal(null)} />
      )}

    </Container>
  )
}

export default Webinar
