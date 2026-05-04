import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import Pagination from '@components/common/Pagination'
import { fetchAdminBanners, updateBanner } from '@store/banner/adminAction'
import { actions } from '@store/banner/reducer'
import BannerFormModal from './components/BannerFormModal'
import BannerOrderModal from './components/BannerOrderModal'
import {
  Container, Header, TitleSection, Title, Subtitle,
  FilterCard, FilterGrid, FilterField, FilterLabel, FilterActions,
  BannerGrid, BannerCard, CardPreview, CardBody, CardHeader,
  CardTitle, ActiveBadge, CardMeta, CardDescription, CardFooter,
} from './Banner.styles'

const ACTIVE_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Aktif', value: 'true' },
  { label: 'Nonaktif', value: 'false' },
]

function BannerAdmin() {
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

  return (
    <Container>
      <Header>
        <TitleSection>
          <Title>Kelola Banner</Title>
          <Subtitle>Banner ditampilkan sebagai slideshow di halaman dashboard pengguna</Subtitle>
        </TitleSection>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" onClick={() => setShowOrder(true)}>Atur Urutan</Button>
          <Button variant="primary" onClick={() => setShowCreate(true)}>+ Tambah Banner</Button>
        </div>
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

      {loading.isGetListLoading ? (
        <Loading />
      ) : banners.length === 0 ? (
        <EmptyState
          icon="🖼️"
          title="Belum ada banner"
          description="Tambah banner untuk ditampilkan di dashboard pengguna"
        />
      ) : (
        <BannerGrid>
          {banners.map(banner => (
            <BannerCard key={banner.uniqueId}>
              <CardPreview
                $gradientStart={banner.gradientStart}
                $gradientEnd={banner.gradientEnd}
              >
                {banner.image?.url && (
                  <img src={banner.image.url} alt={banner.title} />
                )}
              </CardPreview>
              <CardBody>
                <CardHeader>
                  <CardTitle>{banner.title}</CardTitle>
                  <ActiveBadge $active={banner.isActive}>
                    {banner.isActive ? 'Aktif' : 'Nonaktif'}
                  </ActiveBadge>
                </CardHeader>
                {banner.description && (
                  <CardDescription>{banner.description}</CardDescription>
                )}
                <CardMeta>🔗 {banner.redirectUrl}</CardMeta>
                <div style={{ flex: 1 }} />
                <CardFooter>
                  <Button fullWidth onClick={() => setEditTarget(banner)}>
                    Edit
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handleToggleActive(banner)}
                    disabled={loading.isUpdateLoading}
                  >
                    {banner.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </Button>
                </CardFooter>
              </CardBody>
            </BannerCard>
          ))}
        </BannerGrid>
      )}

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
