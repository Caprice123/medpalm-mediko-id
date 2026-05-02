import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import Button from '@components/common/Button'
import { Card, CardBody } from '@components/common/Card'
import ConfirmationModal from '@components/common/ConfirmationModal'
import Pagination from '@components/common/Pagination'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import TextInput from '@components/common/TextInput'
import { fetchAdminBanners, deleteBanner, updateBanner } from '@store/banner/adminAction'
import { actions } from '@store/banner/reducer'
import BannerFormModal from './components/BannerFormModal'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

const SearchRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  align-items: center;
  max-width: 400px;
`

const BannerGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const BannerCardInner = styled.div`
  display: flex;
  gap: 1.25rem;
  align-items: center;
`

const BannerPreview = styled.div`
  width: 200px;
  min-width: 200px;
  height: 72px;
  border-radius: 10px;
  background: ${props => props.$gradientStart && props.$gradientEnd
    ? `linear-gradient(135deg, ${props.$gradientStart} 0%, ${props.$gradientEnd} 100%)`
    : 'linear-gradient(135deg, #0369a1 0%, #15803d 100%)'};
  background-image: ${props => props.$imageUrl
    ? `url(${props.$imageUrl})`
    : 'none'};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.$imageUrl
      ? 'rgba(0,0,0,0.18)'
      : props.$gradientStart && props.$gradientEnd
        ? `linear-gradient(135deg, ${props.$gradientStart} 0%, ${props.$gradientEnd} 100%)`
        : 'linear-gradient(135deg, #0369a1 0%, #15803d 100%)'};
  }
`

const BannerInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const BannerTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const BannerMeta = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0 0 0.375rem;
`

const BannerUrl = styled.a`
  font-size: 0.8rem;
  color: #6BB9E8;
  text-decoration: none;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
`

const BannerActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  align-items: center;
`

const OrderBadge = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  font-weight: 600;
`

const ActiveBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.2rem 0.6rem;
  background: ${props => props.$active ? '#dcfce7' : '#f3f4f6'};
  color: ${props => props.$active ? '#16a34a' : '#6b7280'};
`

function BannerAdmin() {
  const dispatch = useDispatch()
  const { banners, filter, pagination, loading } = useSelector(state => state.banner)

  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    dispatch(fetchAdminBanners())
  }, [dispatch])

  const handleSearch = (e) => {
    dispatch(actions.updateFilter({ key: 'search', value: e.target.value }))
  }

  const handleSearchSubmit = () => {
    dispatch(actions.setPagination({ ...pagination, page: 1 }))
    dispatch(fetchAdminBanners())
  }

  const handlePageChange = (page) => {
    dispatch(actions.setPagination({ ...pagination, page }))
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
    }, () => {
      dispatch(fetchAdminBanners())
    }))
  }

  const handleDelete = () => {
    dispatch(deleteBanner(deleteTarget.uniqueId, () => {
      setDeleteTarget(null)
      dispatch(fetchAdminBanners())
    }))
  }

  return (
    <div>
      <Header>
        <div>
          <Title>Kelola Banner</Title>
          <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
            Banner tampil di halaman dashboard pengguna
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          + Tambah Banner
        </Button>
      </Header>

      <SearchRow>
        <TextInput
          value={filter.search || ''}
          onChange={handleSearch}
          placeholder="Cari banner..."
          onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
        />
        <Button variant="outline" onClick={handleSearchSubmit}>Cari</Button>
      </SearchRow>

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
            <Card key={banner.uniqueId}>
              <CardBody>
                <BannerCardInner>
                  <BannerPreview
                    $gradientStart={banner.gradientStart}
                    $gradientEnd={banner.gradientEnd}
                    $imageUrl={banner.image?.url}
                  />
                  <BannerInfo>
                    <BannerTitle>{banner.title}</BannerTitle>
                    {banner.description && (
                      <BannerMeta>{banner.description}</BannerMeta>
                    )}
                    <BannerUrl href={banner.redirectUrl} target="_blank" rel="noopener noreferrer">
                      {banner.redirectUrl}
                    </BannerUrl>
                  </BannerInfo>
                  <BannerActions>
                    <OrderBadge>#{banner.order}</OrderBadge>
                    <ActiveBadge $active={banner.isActive}>
                      {banner.isActive ? 'Aktif' : 'Nonaktif'}
                    </ActiveBadge>
                    <Button
                      variant={banner.isActive ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleActive(banner)}
                    >
                      {banner.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditTarget(banner)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setDeleteTarget(banner)}>
                      Hapus
                    </Button>
                  </BannerActions>
                </BannerCardInner>
              </CardBody>
            </Card>
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

      {deleteTarget && (
        <ConfirmationModal
          isOpen
          title="Hapus Banner"
          message={`Yakin ingin menghapus banner "${deleteTarget.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isLoading={loading.isDeleteLoading}
        />
      )}
    </div>
  )
}

export default BannerAdmin
