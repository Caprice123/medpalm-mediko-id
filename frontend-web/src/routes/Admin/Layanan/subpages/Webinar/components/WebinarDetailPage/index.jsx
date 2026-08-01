import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/webinar/reducer'
import { fetchWebinarRegistrations } from '@store/webinar/adminAction'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Table from '@components/common/Table'
import Pagination from '@components/Pagination'
import { formatJakartaDateLong, formatJakartaDateTimeFull } from '@utils/dateUtils'
import RegistrationDetailModal from '../RegistrationDetailModal'
import {
  Container, Header, HeaderContent, TitleSection, Title,
  FilterCard, FilterGrid, FilterField, FilterLabel, FilterActions,
  UserCell, UserCellName, UserCellEmail,
  DateCell, DateCellMain,
  RegistrationStatusBadge,
} from '../../Webinar.styles'

const REG_STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Disetujui', value: 'approved' },
  { label: 'Ditolak', value: 'rejected' },
]

const STATUS_LABEL = { pending: 'Pending', approved: 'Disetujui', rejected: 'Ditolak' }

function WebinarDetailPage({ webinar, onBack }) {
  const dispatch = useDispatch()
  const { registrations, registrationPagination, loading } = useSelector(state => state.webinar)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [selectedRegistrationId, setSelectedRegistrationId] = useState(null)

  useEffect(() => {
    dispatch(actions.setRegistrationPage(1))
    dispatch(fetchWebinarRegistrations(webinar.uniqueId, { page: 1 }))
  }, [webinar.uniqueId, dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(actions.setRegistrationPage(1))
    dispatch(fetchWebinarRegistrations(webinar.uniqueId, { search, status, page: 1 }))
  }

  const handlePageChange = (page) => {
    dispatch(actions.setRegistrationPage(page))
    dispatch(fetchWebinarRegistrations(webinar.uniqueId, { search, status, page }))
  }

  const refetch = () => {
    dispatch(fetchWebinarRegistrations(webinar.uniqueId, { search, status, page: registrationPagination.page }))
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
      key: 'status',
      header: 'Status',
      width: '110px',
      align: 'center',
      render: (s) => (
        <RegistrationStatusBadge $s={s}>{STATUS_LABEL[s] || s}</RegistrationStatusBadge>
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
        <Button variant="secondary" onClick={onBack}>← Kembali</Button>
        <HeaderContent>
          <TitleSection>
            <Title>Pendaftar: {webinar.title}</Title>
          </TitleSection>
        </HeaderContent>
      </Header>

      {webinar.startAt && (
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '-1rem', marginBottom: '1.5rem' }}>
          📅 {formatJakartaDateTimeFull(webinar.startAt)}
        </p>
      )}

      <FilterCard>
        <form onSubmit={handleSearch}>
          <FilterGrid>
            <FilterField>
              <FilterLabel>Cari Peserta</FilterLabel>
              <TextInput
                placeholder="Nama atau email peserta..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </FilterField>
            <FilterField>
              <FilterLabel>Status</FilterLabel>
              <Dropdown
                options={REG_STATUS_OPTIONS}
                value={REG_STATUS_OPTIONS.find(o => o.value === status) || REG_STATUS_OPTIONS[0]}
                onChange={option => setStatus(option?.value || '')}
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
        emptyText="Belum ada pendaftar."
        emptySubtext="Peserta yang mendaftar akan muncul di sini."
        hoverable
        striped
      />

      {(registrationPagination.page > 1 || !registrationPagination.isLastPage) && (
        <Pagination
          currentPage={registrationPagination.page}
          isLastPage={registrationPagination.isLastPage}
          onPageChange={handlePageChange}
          isLoading={loading.isGetRegistrationsLoading}
          variant="admin"
          language="id"
        />
      )}

      {selectedRegistrationId && (
        <RegistrationDetailModal
          registrationUniqueId={selectedRegistrationId}
          onClose={() => setSelectedRegistrationId(null)}
          onReviewed={refetch}
        />
      )}
    </Container>
  )
}

export default WebinarDetailPage
