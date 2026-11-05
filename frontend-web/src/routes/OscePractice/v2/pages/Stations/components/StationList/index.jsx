import { useSelector } from 'react-redux'
import { PiMagnifyingGlass } from 'react-icons/pi'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import Loading from '@components/common/Loading'
import { Panel, PanelHead, PanelFooter, MicroLabel } from '../../../../styles/surface.styles'
import StationRow from './components/StationRow'
import { useStationList } from './hooks/useStationList'
import { ColumnLabels } from './StationList.styles'

// The catalogue itself. Rows accumulate behind "Muat Lebih Banyak" the way every admin and
// topic list in the product does — the page just no longer pushes anything else down as they do.
function StationList({ onStart }) {
  const { loadMore } = useStationList()

  const { stations, filter, stationsPagination, loading } = useSelector((state) => state.oscePracticeV2)
  const isCreatingSession = useSelector((state) => state.oscePractice.loading.isCreatingSession)

  const isFirstLoad = loading.isFetchingStations && stations.length === 0
  const hasFilter = !!filter.search || !!filter.topicTag || !!filter.batchTag

  return (
    <Panel $active={hasFilter}>
      <PanelHead>
        <h2>Kasus tersedia</h2>
      </PanelHead>

      {isFirstLoad ? (
        <Loading type="oval" size="small" text="Memuat kasus..." height="260px" />
      ) : stations.length === 0 ? (
        <EmptyState
          icon={<PiMagnifyingGlass size={32} />}
          title="Tidak ada kasus yang cocok"
          description={
            hasFilter
              ? 'Coba lepas salah satu filter, atau kosongkan pencariannya.'
              : 'Belum ada kasus yang dipublikasikan untuk akunmu.'
          }
        />
      ) : (
        <>
          <ColumnLabels aria-hidden="true">
            <MicroLabel>Kasus</MicroLabel>
            <MicroLabel>Topik &amp; batch</MicroLabel>
            <MicroLabel>Durasi</MicroLabel>
            <span />
          </ColumnLabels>

          {stations.map((station) => (
            <StationRow
              key={station.id}
              station={station}
              isStarting={isCreatingSession}
              onStart={onStart}
            />
          ))}
        </>
      )}

      {!stationsPagination.isLastPage && stations.length > 0 && (
        <PanelFooter>
          <Button variant="secondary" onClick={loadMore} disabled={loading.isFetchingStations}>
            {loading.isFetchingStations ? 'Memuat...' : 'Muat Lebih Banyak'}
          </Button>
        </PanelFooter>
      )}
    </Panel>
  )
}

export default StationList
