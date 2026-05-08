import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/event/reducer'
import {
  fetchAdminEvents, fetchAdminEvent, deleteEvent, fetchAllEventRegistrations,
} from '@store/event/adminAction'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import Pagination from '@components/Pagination'
import Table from '@components/common/Table'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import EventFormModal from './components/EventFormModal'
import RegistrationDetailModal from './components/RegistrationDetailModal'
import { formatJakartaDateLong, formatJakartaDateTimeFull } from '@utils/dateUtils'
import {
  Container, Header, HeaderContent, TitleSection, Title, Actions,
  TabBar, TabBtn,
  EventGrid, EventCard, CardThumbnail, CardHeader, CardTitle, CardCode, StatusBadge,
  CardMeta, CardDescription, CardStats, CardActions,
  FilterCard, FilterGrid, FilterField, FilterLabel, FilterActions,
  UserCell, UserCellName, UserCellEmail,
  DateCell, DateCellMain,
  RegistrationStatusBadge,
} from './Event.styles'

const EVENT_STATUS_OPTIONS = [
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

function Event({ onBack = null }) {
  const dispatch = useDispatch()
  const {
    events, filter, pagination, loading, detail,
    registrations, registrationFilter, registrationPagination,
  } = useSelector(state => state.event)

  const [tab, setTab] = useState('events')
  const [modal, setModal] = useState(null)
  const [selectedRegistrationId, setSelectedRegistrationId] = useState(null)

  useEffect(() => {
    if (tab === 'events') dispatch(fetchAdminEvents())
    else dispatch(fetchAllEventRegistrations())
  }, [tab, dispatch])

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

  const handleRegSearch = (e) => {
    e.preventDefault()
    dispatch(actions.setRegistrationPage(1))
    dispatch(fetchAllEventRegistrations())
  }

  const handleRegPageChange = (page) => {
    dispatch(actions.setRegistrationPage(page))
    dispatch(fetchAllEventRegistrations())
  }

  const updateRegFilter = (key, value) => {
    dispatch(actions.updateRegistrationFilter({ key, value }))
  }

  const regColumns = [
    {
      key: 'createdAt',
      header: 'Tanggal',
      width: '130px',
      render: (createdAt) => (
        <DateCell>
          <DateCellMain>{formatJakartaDateLong(createdAt)}</DateCellMain>
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
      key: 'event',
      header: 'Event',
      render: (event) => (
        <UserCell>
          <UserCellName>{event?.title || '—'}</UserCellName>
          {event?.code && <UserCellEmail>{event.code}</UserCellEmail>}
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
            <Title>Kelola Events</Title>
          </TitleSection>
          {tab === 'events' && (
            <Actions>
              <Button variant="primary" onClick={() => setModal('create')}>
                + Tambah Event
              </Button>
            </Actions>
          )}
        </HeaderContent>
      </Header>

      <TabBar>
        <TabBtn $active={tab === 'events'} onClick={() => setTab('events')}>
          Events
        </TabBtn>
        <TabBtn $active={tab === 'registrations'} onClick={() => setTab('registrations')}>
          Registrasi
        </TabBtn>
      </TabBar>

      {tab === 'events' && (
        <>
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

          {loading.isGetListLoading ? (
            <Loading text="Memuat events..." minHeight="300px" />
          ) : events.length === 0 ? (
            <EmptyState
              icon="🗓️"
              title="Belum ada event"
              actionLabel="Tambah Event Pertama"
              onAction={() => setModal('create')}
              actionVariant="primary"
            />
          ) : (
            <EventGrid>
              {events.map(event => (
                <EventCard key={event.code}>
                  <PhotoProvider>
                    <CardThumbnail $hasImage={!!event.thumbnail?.url}>
                      {event.thumbnail?.url ? (
                        <PhotoView src={event.thumbnail.url}>
                          <img src={event.thumbnail.url} alt={event.title} />
                        </PhotoView>
                      ) : '🗓️'}
                    </CardThumbnail>
                  </PhotoProvider>
                  <CardHeader>
                    <div style={{ flex: 1 }}>
                      <CardTitle>{event.title}</CardTitle>
                      <CardCode>{event.code}</CardCode>
                    </div>
                    <StatusBadge status={event.status}>
                      {event.status === 'published' ? 'Published' :
                       event.status === 'cancelled' ? 'Cancelled' : 'Draft'}
                    </StatusBadge>
                  </CardHeader>
                  <CardMeta>📅 {formatJakartaDateTimeFull(event.startAt)}</CardMeta>
                  {event.description && <CardDescription>{event.description}</CardDescription>}
                  <CardStats>👥 {event.registrationCount ?? 0} pendaftar</CardStats>
                  <CardActions>
                    <Button variant="secondary" onClick={() => handleEdit(event)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(event)}>
                      Hapus
                    </Button>
                  </CardActions>
                </EventCard>
              ))}
            </EventGrid>
          )}

          {!loading.isGetListLoading && events.length > 0 &&
            (pagination.page > 1 || !pagination.isLastPage) && (
            <Pagination
              currentPage={pagination.page}
              isLastPage={pagination.isLastPage}
              onPageChange={handleEventPageChange}
              isLoading={loading.isGetListLoading}
              variant="admin"
              language="id"
            />
          )}
        </>
      )}

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

      {modal === 'create' && (
        <EventFormModal mode="create" onClose={() => setModal(null)} />
      )}

      {modal === 'edit' && detail && (
        <EventFormModal mode="edit" initialValues={detail} onClose={() => setModal(null)} />
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

export default Event
