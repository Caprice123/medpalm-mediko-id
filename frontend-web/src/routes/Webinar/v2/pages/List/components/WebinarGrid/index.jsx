import { useSelector } from 'react-redux'
import { PiVideoCamera, PiMagnifyingGlass } from 'react-icons/pi'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import { WebinarSkeletonGrid } from '@components/common/SkeletonCard'
import WebinarCard from './components/WebinarCard'
import { GridRow, GridCol, SectionHead, LoadMoreRow } from './WebinarGrid.styles'

const EMPTY_COPY = {
  open: {
    title: 'Tidak ada webinar yang membuka pendaftaran',
    description: 'Coba lihat "Akan dibuka" untuk jadwal yang sudah terpasang.',
  },
  upcoming: {
    title: 'Belum ada jadwal pendaftaran berikutnya',
    description: 'Jadwal baru akan muncul di sini begitu admin memasangnya.',
  },
  closed: {
    title: 'Belum ada webinar yang sudah selesai',
    description: 'Webinar yang pendaftarannya sudah ditutup akan tercatat di sini.',
  },
  all: {
    title: 'Belum ada webinar yang dijadwalkan',
    description: 'Pantau halaman ini — jadwal baru muncul di sini.',
  },
}

function WebinarGrid({ onDetail, onRegister, onLoadMore }) {
  const { webinars, featured, filter, pagination, loading } = useSelector(state => state.webinarV2)

  // The billboard already carries the nearest open webinar; showing it again as
  // the first card would read as a duplicate.
  const rows = webinars.filter(w => w.uniqueId !== featured?.uniqueId)
  const isFirstLoad = loading.isFetchingWebinars && webinars.length === 0

  if (isFirstLoad) return <WebinarSkeletonGrid count={6} />

  if (rows.length === 0) {
    const copy = EMPTY_COPY[filter.registrationStatus] ?? EMPTY_COPY.all
    return (
      <EmptyState
        icon={filter.search
          ? <PiMagnifyingGlass size={40} aria-hidden="true" />
          : <PiVideoCamera size={40} aria-hidden="true" />}
        title={filter.search ? `Tidak ada webinar untuk "${filter.search}"` : copy.title}
        description={filter.search ? 'Coba kata kunci lain atau ganti filter status.' : copy.description}
      />
    )
  }

  return (
    <>
      <SectionHead>
        <h2>{featured ? 'Webinar lainnya' : 'Jadwal webinar'}</h2>
        <p>{rows.length} ditampilkan</p>
      </SectionHead>

      <GridRow>
        {rows.map(webinar => (
          <GridCol key={webinar.uniqueId} xs={12} md={6} xl={4}>
            <WebinarCard webinar={webinar} onDetail={onDetail} onRegister={onRegister} />
          </GridCol>
        ))}
      </GridRow>

      {!pagination.isLastPage && (
        <LoadMoreRow>
          <Button
            variant="secondary"
            onClick={onLoadMore}
            disabled={loading.isFetchingWebinars}
          >
            {loading.isFetchingWebinars ? 'Memuat…' : 'Muat lebih banyak'}
          </Button>
        </LoadMoreRow>
      )}
    </>
  )
}

export default WebinarGrid
