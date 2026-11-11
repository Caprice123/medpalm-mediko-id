import { memo } from 'react'
import { FaSave, FaFileWord } from 'react-icons/fa'
import BlockNoteEditor from '@components/BlockNoteEditor'
import Button from '@components/common/Button'
import Loading from '@components/common/Loading'
import {
  EditorPanel as Panel,
  EditorActions,
  EditorContent,
} from './EditorPanel.styles'

// The document pane. Its save and export buttons duplicate the top bar's on
// purpose: on a wide screen the editor is the right-hand pane and the top bar
// can be a long way from where the student is typing.
const EditorPanel = memo(({
  blocks,
  isLoadingContent,
  hasUnsavedChanges,
  isSaving,
  onContentChange,
  onImageUpload,
  onSave,
  onExportWord,
}) => (
  <Panel>
    <EditorActions>
      <Button
        variant="secondary"
        onClick={onSave}
        disabled={isLoadingContent || !hasUnsavedChanges || isSaving}
      >
        <FaSave /> {isSaving ? 'Menyimpan...' : 'Simpan'}
      </Button>
      <Button variant="primary" onClick={onExportWord} disabled={isLoadingContent}>
        <FaFileWord /> Export Word
      </Button>
    </EditorActions>

    <EditorContent>
      {isLoadingContent ? (
        <Loading text="Memuat konten editor..." />
      ) : (
        <BlockNoteEditor
          initialContent={blocks}
          onChange={onContentChange}
          onImageUpload={onImageUpload}
          editable
          placeholder="Mulai menulis skripsi Anda di sini..."
        />
      )}
    </EditorContent>
  </Panel>
))

EditorPanel.displayName = 'EditorPanel'

export default EditorPanel
