import { useSelector } from 'react-redux'
import Skeleton from 'react-loading-skeleton'
import { PiGift, PiMagnifyingGlass } from 'react-icons/pi'
import Button from '@components/common/Button'
import { TrackHeader, TrackCount, TrackRule } from '../../List.styles'
import EventCard from './components/EventCard'
import { useClaimableTrack } from './hooks/useClaimableTrack'
import {
  CardsRow, CardCol, SearchForm, SearchField, QuietNotice, LoadMoreRow,
} from './ClaimableTrack.styles'

function ClaimableTrack({ featureLabels, onDetail, onClaim, onSearchSubmit, onLoadMore }) {
  const { claimable, pagination, loading } = useSelector(state => state.eventV2)
  const { draft, setDraft, appliedSearch, handleSubmit } = useClaimableTrack({ onSearchSubmit })

  const isFirstLoad = loading.isFetchingClaimable && claimable.length === 0

  return (
    <section>
      <TrackHeader>
        <h2>Bisa diklaim sekarang</h2>
        {claimable.length > 0 && <TrackCount>{claimable.length}</TrackCount>}
        <TrackRule />
        <SearchForm onSubmit={handleSubmit} role="search">
          <SearchField>
            <PiMagnifyingGlass size={16} aria-hidden="true" />
            <input
              type="search"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Cari event…"
              aria-label="Cari event"
            />
          </SearchField>
          <Button variant="secondary" type="submit">Cari</Button>
        </SearchForm>
      </TrackHeader>

      {isFirstLoad ? (
        <CardsRow>
          {[0, 1, 2].map(i => (
            <CardCol key={i} xs={12} md={6} xl={4}>
              <Skeleton
                height={236}
                borderRadius={16}
                width="100%"
                baseColor="var(--color-gray-200)"
                highlightColor="var(--color-gray-100)"
              />
            </CardCol>
          ))}
        </CardsRow>
      ) : claimable.length === 0 ? (
        <QuietNotice>
          {appliedSearch
            ? <PiMagnifyingGlass size={32} aria-hidden="true" />
            : <PiGift size={32} aria-hidden="true" />}
          <div>
            {appliedSearch ? (
              <>
                <h3>Tidak ada event terbuka untuk &ldquo;{appliedSearch}&rdquo;</h3>
                <p>Coba kata kunci lain, atau kosongkan pencarian untuk melihat semua yang terbuka.</p>
              </>
            ) : (
              <>
                <h3>Belum ada event yang bisa diklaim</h3>
                <p>
                  Event baru biasanya dibuka setiap bulan dan hanya berjalan sekitar satu minggu.
                  Riwayat klaim kamu tetap ada di bawah.
                </p>
              </>
            )}
          </div>
        </QuietNotice>
      ) : (
        <>
          <CardsRow>
            {claimable.map(event => (
              <CardCol key={event.code} xs={12} md={6} xl={4}>
                <EventCard
                  event={event}
                  featureLabels={featureLabels}
                  onDetail={onDetail}
                  onClaim={onClaim}
                />
              </CardCol>
            ))}
          </CardsRow>

          {!pagination.isLastPage && (
            <LoadMoreRow>
              <Button
                variant="secondary"
                onClick={onLoadMore}
                disabled={loading.isFetchingClaimable}
              >
                {loading.isFetchingClaimable ? 'Memuat…' : 'Muat lebih banyak'}
              </Button>
            </LoadMoreRow>
          )}
        </>
      )}
    </section>
  )
}

export default ClaimableTrack
