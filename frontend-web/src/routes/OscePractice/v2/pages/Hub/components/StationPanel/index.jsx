import { useSelector } from 'react-redux'
import { PiMagnifyingGlass } from 'react-icons/pi'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import EmptyState from '@components/common/EmptyState'
import Loading from '@components/common/Loading'
import { Panel, PanelHead, PanelFooter, MicroLabel } from '../../Hub.styles'
import StationRow from './components/StationRow'
import { useStationPanel } from './hooks/useStationPanel'
import { Filters, FilterField, ActiveFilterNote } from './StationPanel.styles'

// The board's work area: picking the next station, in place, with this student's own record on
// every row. V1 spent a separate `/topics` page on this.
function StationPanel({ onStart }) {
  const {
    searchDraft, setSearchDraft, submitSearch,
    topicOptions, batchOptions, applyFilter, loadMore,
  } = useStationPanel()

  const { stations, filter, stationsPagination, loading } = useSelector((state) => state.oscePracticeV2)
  const isCreatingSession = useSelector((state) => state.oscePractice.loading.isCreatingSession)

  const activeTopic = topicOptions.find((option) => String(option.value) === String(filter.topicTag))
  const isFirstLoad = loading.isFetchingStations && stations.length === 0

  return (
    <Panel $active={!!filter.topicTag || !!filter.search}>
      <PanelHead>
        <h2>Pilih stasiun</h2>
        <MicroLabel>
          {stations.length} ditampilkan{stationsPagination.isLastPage ? '' : ' · ada lagi'}
        </MicroLabel>
      </PanelHead>

      <Filters onSubmit={submitSearch}>
        <FilterField>
          <TextInput
            label="Pencarian"
            placeholder="Cari stasiun, keluhan, atau skenario..."
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
          />
        </FilterField>

        <FilterField>
          <Dropdown
            label="Topik"
            options={topicOptions}
            value={activeTopic || null}
            onChange={(option) => applyFilter('topicTag', option?.value || '')}
            placeholder="Semua topik"
            isClearable
          />
        </FilterField>

        <FilterField>
          <Dropdown
            label="Batch"
            options={batchOptions}
            value={batchOptions.find((option) => String(option.value) === String(filter.batchTag)) || null}
            onChange={(option) => applyFilter('batchTag', option?.value || '')}
            placeholder="Semua batch"
            isClearable
          />
        </FilterField>

        <Button type="submit" variant="primary" disabled={loading.isFetchingStations}>
          Cari
        </Button>

        {activeTopic && (
          <ActiveFilterNote>
            Disaring ke topik <strong>{activeTopic.label}</strong> dari baris performa di rail.
          </ActiveFilterNote>
        )}
      </Filters>

      {isFirstLoad ? (
        <Loading type="oval" size="small" text="Memuat stasiun..." height="220px" />
      ) : stations.length === 0 ? (
        <EmptyState
          icon={<PiMagnifyingGlass size={32} />}
          title="Tidak ada stasiun yang cocok"
          description={
            filter.search || filter.topicTag || filter.batchTag
              ? 'Coba lepas salah satu filter, atau kosongkan pencariannya.'
              : 'Belum ada stasiun yang dipublikasikan untuk akunmu.'
          }
        />
      ) : (
        stations.map((station) => (
          <StationRow
            key={station.id}
            station={station}
            isStarting={isCreatingSession}
            onStart={onStart}
          />
        ))
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

export default StationPanel
