import { useSelector } from 'react-redux'
import { PiClockCounterClockwise } from 'react-icons/pi'
import Button from '@components/common/Button'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import { Panel, PanelHead, PanelFooter } from '../../../../styles/surface.styles'
import HistoryRow from './components/HistoryRow'
import { useHistoryPanel } from './hooks/useHistoryPanel'
import { Chips, Chip } from './HistoryPanel.styles'

// The chips are a filter and only a filter. They used to carry a count each, and the panel head
// a total, which made the panel read as a scoreboard of states — a number to interpret before
// the rows underneath could be. Progress is the rail's job; this panel answers "mana sesi yang
// aku cari", and the rows themselves say what state they are in.
const CHIPS = [
  { status: '', label: 'Semua' },
  { status: 'started', label: 'Berlangsung' },
  { status: 'created', label: 'Belum dimulai' },
  { status: 'completed', label: 'Selesai dinilai' },
  { status: 'expired', label: 'Waktu habis' },
]

function HistoryPanel({ onRequestStart }) {
  const { selectStatus, loadMore } = useHistoryPanel()
  const { history, historyFilter, historyPagination, loading } = useSelector((state) => state.oscePracticeV2)

  const isFirstLoad = loading.isFetchingHistory && history.length === 0

  return (
    <Panel>
      <PanelHead>
        <h2>Riwayat latihan</h2>
      </PanelHead>

      <Chips role="group" aria-label="Saring riwayat berdasarkan status">
        {CHIPS.map((chip) => {
          const isActive = historyFilter.status === chip.status

          return (
            <Chip
              key={chip.label}
              type="button"
              $active={isActive}
              aria-pressed={isActive}
              onClick={() => selectStatus(chip.status)}
            >
              {chip.label}
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
              : 'Mulai satu kasus dari daftar kasus — hasilnya muncul di sini setelah dinilai.'
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
