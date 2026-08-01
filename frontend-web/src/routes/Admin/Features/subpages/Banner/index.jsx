import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Pagination from '@components/common/Pagination'
import Table from '@components/common/Table'
import { fetchAdminBanners, updateBanner } from '@store/banner/adminAction'
import { actions } from '@store/banner/reducer'
import BannerFormModal from './components/BannerFormModal'
import BannerOrderModal from './components/BannerOrderModal'
import {
  Container, Header, HeaderContent, TitleSection, Title, Subtitle,
  FilterCard, FilterGrid, FilterField, FilterLabel, FilterActions,
  ThumbCell, TitleCell, ActionCell,
  CardTitle, ActiveBadge, CardMeta, CardDescription,
} from './Banner.styles'

const ACTIVE_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Aktif', value: 'true' },
  { label: 'Nonaktif', value: 'false' },
]

function BannerAdmin({ onBack = null }) {
  const dispatch = useDispatch()
  const { banners, filter, pagination, loading } = useSelector(state => state.banner)

  const [searchInput, setSearchInput] = useState(filter.search || '')
  const [activeFilter, setActiveFilter] = useState(filter.isActive || '')
  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [showOrder, setShowOrder] = useState(false)

  useEffect(() => {
    dispatch(fetchAdminBanners())
  }, [dispatch])

  const applyFilters = () => {
    dispatch(actions.updateFilter({ key: 'search', value: searchInput }))
    dispatch(actions.updateFilter({ key: 'isActive', value: activeFilter }))
    dispatch(actions.setPage(1))
    dispatch(fetchAdminBanners())
  }

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAdminBanners())
  }

  const handleToggleActive = (banner) => {
    dispatch(updateBanner(banner.uniqueId, {
      title: banner.title,
      description: banner.description,
      redirectUrl: banner.redirectUrl,
      redirectLabel: banner.redirectLabel,
      gradientStart: banner.gradientStart,
      gradientEnd: banner.gradientEnd,
      isActive: !banner.isActive,
      order: banner.order,
    }, () => dispatch(fetchAdminBanners())))
  }

  const bannerColumns = [
    {
      header: 'Banner',
      render: (b) => (
        <TitleCell>
          <ThumbCell $gradientStart={b.gradientStart} $gradientEnd={b.gradientEnd}>
            {b.image?.url && <img src={b.image.url} alt={b.title} />}
          </ThumbCell>
          <div>
            <CardTitle>{b.title}</CardTitle>
            {b.description && <CardDescription>{b.description}</CardDescription>}
          </div>
        </TitleCell>
      ),
    },
    {
      key: 'redirectUrl',
      header: 'Link',
      render: (url) => <CardMeta style={{ maxWidth: 220 }}>🔗 {url}</CardMeta>,
    },
    {
      key: 'isActive',
      header: 'Status',
      align: 'center',
      render: (active) => <ActiveBadge $active={active}>{active ? 'Aktif' : 'Nonaktif'}</ActiveBadge>,
    },
    {
      key: 'order',
      header: 'Urutan',
      align: 'center',
    },
    {
      header: 'Aksi',
      render: (b) => (
        <ActionCell>
          <Button onClick={() => setEditTarget(b)}>Edit</Button>
          <Button
            variant="primary"
            onClick={() => handleToggleActive(b)}
            disabled={loading.isUpdateLoading}
          >
            {b.isActive ? 'Nonaktifkan' : 'Aktifkan'}
          </Button>
        </ActionCell>
      ),
    },
  ]

  return (
    <Container>
      <Header>
        {onBack && <Button variant="secondary" onClick={onBack}>← Kembali</Button>}
        <HeaderContent>
          <TitleSection>
            <Title>Kelola Banner</Title>
            <Subtitle>Banner ditampilkan sebagai slideshow di halaman dashboard pengguna</Subtitle>
          </TitleSection>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => setShowOrder(true)}>Atur Urutan</Button>
            <Button variant="primary" onClick={() => setShowCreate(true)}>+ Tambah Banner</Button>
          </div>
        </HeaderContent>
      </Header>

      <FilterCard>
        <FilterGrid>
          <FilterField>
            <FilterLabel>Cari Banner</FilterLabel>
            <TextInput
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Cari judul atau deskripsi..."
              onKeyDown={e => e.key === 'Enter' && applyFilters()}
            />
          </FilterField>
          <FilterField>
            <FilterLabel>Status</FilterLabel>
            <Dropdown
              options={ACTIVE_OPTIONS}
              value={ACTIVE_OPTIONS.find(o => o.value === activeFilter) || ACTIVE_OPTIONS[0]}
              onChange={opt => setActiveFilter(opt?.value || '')}
            />
          </FilterField>
        </FilterGrid>
        <FilterActions>
          <Button variant="primary" onClick={applyFilters}>
            Cari
          </Button>
        </FilterActions>
      </FilterCard>

      <Table
        columns={bannerColumns}
        data={banners}
        loading={loading.isGetListLoading}
        emptyText="Belum ada banner"
        emptySubtext="Tambah banner untuk ditampilkan di dashboard pengguna"
      />

      <Pagination
        page={pagination.page}
        isLastPage={pagination.isLastPage}
        onPageChange={handlePageChange}
      />

      {showCreate && (
        <BannerFormModal mode="create" onClose={() => setShowCreate(false)} />
      )}

      {editTarget && (
        <BannerFormModal
          mode="edit"
          initialValues={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      <BannerOrderModal isOpen={showOrder} onClose={() => setShowOrder(false)} />
    </Container>
  )
}

export default BannerAdmin
