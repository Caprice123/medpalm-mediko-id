import { memo } from 'react'
import { FaArrowLeft, FaEdit, FaCheck, FaTimes, FaSave, FaFileWord } from 'react-icons/fa'
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
  onBack,
}) => {
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
              placeholder="Masukkan judul set..."
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
            <Button variant="secondary" onClick={startEditing} title="Ubah judul set">
              <FaEdit />
            </Button>
          </>
        )}
      </SetTitleWrapper>

      <TopActions>
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
