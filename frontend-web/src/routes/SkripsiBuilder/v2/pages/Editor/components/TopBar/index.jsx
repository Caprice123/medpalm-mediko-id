import { memo } from 'react'
import { useSelector } from 'react-redux'
import {
  FaArrowLeft, FaEdit, FaCheck, FaTimes, FaSave, FaFileWord, FaQuoteRight,
} from 'react-icons/fa'
import Button from '@components/common/Button'
import { useSetTitle } from './hooks/useSetTitle'
import {
  TopBar as Bar,
  SetTitleWrapper,
  SetTitle,
  SetTitleInput,
  TopActions,
} from './TopBar.styles'

const TopBar = memo(({
  currentSet,
  hasUnsavedChanges,
  isSaving,
  onSave,
  onExportWord,
  onOpenCitations,
  onBack,
}) => {
  // Read here rather than passed down: the bar is the only thing that shows it.
  const citationCount = useSelector(state => state.skripsiV2.citations.length)

  const {
    isEditing,
    draft,
    setDraft,
    isUpdating,
    startEditing,
    cancelEditing,
    save,
    handleKeyDown,
  } = useSetTitle(currentSet)

  return (
    <Bar>
      <Button variant="secondary" onClick={onBack}>
        <FaArrowLeft /> Kembali
      </Button>

      <SetTitleWrapper>
        {isEditing ? (
          <>
            <SetTitleInput
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="Masukkan judul laporan..."
            />
            <Button variant="secondary" onClick={save} disabled={isUpdating} title="Simpan judul">
              <FaCheck />
            </Button>
            <Button variant="danger" onClick={cancelEditing} disabled={isUpdating} title="Batal">
              <FaTimes />
            </Button>
          </>
        ) : (
          <>
            <SetTitle>{currentSet.title}</SetTitle>
            <Button variant="secondary" onClick={startEditing} title="Ubah judul laporan">
              <FaEdit />
            </Button>
          </>
        )}
      </SetTitleWrapper>

      {/* The kelompok is not edited from here: it is written into the Cover
          section like any other text. */}
      <TopActions>
        <Button variant="secondary" onClick={onOpenCitations}>
          <FaQuoteRight /> Referensi{citationCount > 0 ? ` (${citationCount})` : ''}
        </Button>

        <Button variant="secondary" onClick={onSave} disabled={!hasUnsavedChanges || isSaving}>
          <FaSave /> {isSaving ? 'Menyimpan...' : 'Simpan'}
        </Button>
        <Button variant="primary" onClick={onExportWord}>
          <FaFileWord /> Export Word
        </Button>
      </TopActions>
    </Bar>
  )
})

TopBar.displayName = 'TopBar'

export default TopBar
