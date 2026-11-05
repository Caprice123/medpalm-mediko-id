import { useSelector } from 'react-redux'
import { PiClockCounterClockwise } from 'react-icons/pi'
import Button from '@components/common/Button'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import { Panel, PanelHead, PanelFooter, MicroLabel } from '../../Hub.styles'
import HistoryRow from './components/HistoryRow'
import { useHistoryPanel } from './hooks/useHistoryPanel'
import { Chips, Chip } from './HistoryPanel.styles'

// The chips are the history filter and the state summary at once, which is why the counts sit
// inside them rather than in a separate stat row.
const CHIPS = [
  { status: '', label: 'Semua', countKey: null },
  { status: 'started', label: 'Berlangsung', countKey: 'running' },
  { status: 'created', label: 'Belum dimulai', countKey: 'created' },
  { status: 'completed', label: 'Selesai dinilai', countKey: 'completed' },
  { status: 'expired', label: 'Waktu habis', countKey: 'expired' },
]

function HistoryPanel({ onRequestStart }) {
  const { selectStatus, loadMore } = useHistoryPanel()
  const { history, historyFilter, historyPagination, loading, hub } = useSelector((state) => state.oscePracticeV2)

  const counts = hub?.counts || {}
  const total = (counts.running || 0) + (counts.created || 0) + (counts.completed || 0) + (counts.expired || 0)
  const isFirstLoad = loading.isFetchingHistory && history.length === 0

  return (
    <Panel>
      <PanelHead>
        <h2>Riwayat latihan</h2>
        <MicroLabel>{total} sesi</MicroLabel>
      </PanelHead>

      <Chips role="group" aria-label="Saring riwayat berdasarkan status">
        {CHIPS.map((chip) => {
          const count = chip.countKey ? counts[chip.countKey] || 0 : total
          const isActive = historyFilter.status === chip.status

          return (
            <Chip
              key={chip.label}
              type="button"
              $active={isActive}
              aria-pressed={isActive}
              onClick={() => selectStatus(chip.status)}
            >
              {chip.label}<b>{count}</b>
            </Chip>
          )
        })}
      </Chips>

      {isFirstLoad ? (
        <Loading type="oval" size="small" text="Memuat riwayat..." height="180px" />
      ) : history.length === 0 ? (
        <EmptyState
          icon={<PiClockCounterClockwise size={32} />}
          title={historyFilter.status ? 'Tidak ada sesi di status ini' : 'Belum ada riwayat latihan'}
          description={
            historyFilter.status
              ? 'Pilih chip Semua untuk melihat seluruh sesi.'
              : 'Mulai satu stasiun dari papan di atas — hasilnya muncul di sini setelah dinilai.'
          }
        />
      ) : (
        history.map((session) => (
          <HistoryRow key={session.uniqueId} session={session} onRequestStart={onRequestStart} />
        ))
      )}

      {!historyPagination.isLastPage && history.length > 0 && (
        <PanelFooter>
          <Button variant="secondary" onClick={loadMore} disabled={loading.isFetchingHistory}>
            {loading.isFetchingHistory ? 'Memuat...' : 'Muat Lebih Banyak'}
          </Button>
        </PanelFooter>
      )}
    </Panel>
  )
}

export default HistoryPanel
