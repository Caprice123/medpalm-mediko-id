import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/event/reducer'
import { fetchAdminEvents, fetchAdminEvent, deleteEvent } from '@store/event/adminAction'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Pagination from '@components/Pagination'
import Table from '@components/common/Table'
import EventFormModal from './components/EventFormModal'
import EventDetailPage from './components/EventDetailPage'
import { formatJakartaDateTimeFull } from '@utils/dateUtils'
import {
  Container, Header, HeaderContent, TitleSection, Title, Actions,
  StatusBadge, CardActions,
  FilterCard, FilterGrid, FilterField, FilterLabel, FilterActions,
} from './Event.styles'

const EVENT_STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Cancelled', value: 'cancelled' },
]

function Event({ onBack = null }) {
  const dispatch = useDispatch()
  const { events, filter, pagination, loading, detail } = useSelector(state => state.event)

  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    dispatch(fetchAdminEvents())
  }, [dispatch])

  const handleEventSearch = (e) => {
    e.preventDefault()
    dispatch(actions.setPage(1))
    dispatch(fetchAdminEvents())
  }

  const handleEventPageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAdminEvents())
  }

  const handleEdit = async (event) => {
    await dispatch(fetchAdminEvent(event.code))
    setModal('edit')
  }

  const handleDelete = async (event) => {
    if (!window.confirm(`Hapus event "${event.title}"?`)) return
    dispatch(deleteEvent(event.code, () => dispatch(fetchAdminEvents())))
  }

  const eventColumns = [
    { key: 'title', header: 'Event' },
    { key: 'code', header: 'Kode' },
    {
      key: 'registrationStartAt',
      header: 'Pendaftaran Dibuka',
      render: (date) => date ? formatJakartaDateTimeFull(date) : '-',
    },
    {
      key: 'registrationEndAt',
      header: 'Pendaftaran Ditutup',
      render: (date) => date ? formatJakartaDateTimeFull(date) : '-',
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
      render: (e) => e.registrationCount ?? 0,
    },
    {
      header: 'Aksi',
      render: (e) => (
        <CardActions>
          <Button variant="secondary" onClick={() => setSelected(e)}>Lihat Pendaftar</Button>
          <Button variant="secondary" onClick={() => handleEdit(e)}>Edit</Button>
          <Button variant="danger" onClick={() => handleDelete(e)}>Hapus</Button>
        </CardActions>
      ),
    },
  ]

  if (selected) {
    return (
      <EventDetailPage
        event={selected}
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
            <Title>Kelola Events</Title>
          </TitleSection>
          <Actions>
            <Button variant="primary" onClick={() => setModal('create')}>
              + Tambah Event
            </Button>
          </Actions>
        </HeaderContent>
      </Header>

      <FilterCard>
        <form onSubmit={handleEventSearch}>
          <FilterGrid>
            <FilterField>
              <FilterLabel>Cari Event</FilterLabel>
              <TextInput
                placeholder="Judul atau code event..."
                value={filter.search || ''}
                onChange={e => dispatch(actions.updateFilter({ key: 'search', value: e.target.value }))}
              />
            </FilterField>
            <FilterField>
              <FilterLabel>Status</FilterLabel>
              <Dropdown
                options={EVENT_STATUS_OPTIONS}
                value={EVENT_STATUS_OPTIONS.find(o => o.value === (filter.status || '')) || EVENT_STATUS_OPTIONS[0]}
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
        columns={eventColumns}
        data={events}
        loading={loading.isGetListLoading}
        emptyText="Belum ada event"
        emptySubtext='Klik "+ Tambah Event" untuk memulai.'
      />

      {(pagination.page > 1 || !pagination.isLastPage) && (
        <Pagination
          currentPage={pagination.page}
          isLastPage={pagination.isLastPage}
          onPageChange={handleEventPageChange}
          isLoading={loading.isGetListLoading}
          variant="admin"
          language="id"
        />
      )}

      {modal === 'create' && (
        <EventFormModal mode="create" onClose={() => setModal(null)} />
      )}

      {modal === 'edit' && detail && (
        <EventFormModal mode="edit" initialValues={detail} onClose={() => setModal(null)} />
      )}
    </Container>
  )
}

export default Event
