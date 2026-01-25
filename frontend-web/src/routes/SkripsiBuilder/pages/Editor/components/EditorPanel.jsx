import React, { memo } from 'react'
import { FaSave, FaFileWord } from 'react-icons/fa'
import BlockNoteEditor from '@components/BlockNoteEditor'
import {
  EditorPanel as StyledEditorPanel,
  EditorActions,
  SaveButton,
  ExportButton,
  EditorContent as StyledEditorContent
} from '../Editor.styles'
import Button from '@components/common/Button'

const EditorPanel = memo(({
  editorContent,
  onContentChange,
  onImageUpload,
  hasUnsavedChanges,
  isSavingContent,
  onSave,
  onExportWord,
  isLoadingContent
}) => {
  if (isLoadingContent) {
    return (
      <StyledEditorPanel>
        <EditorActions>
          <Button variant="secondary" disabled>
            <FaSave /> Simpan
          </Button>
          <Button disabled>
            <FaFileWord /> Export Word
          </Button>
        </EditorActions>
        <StyledEditorContent>
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
            Memuat konten editor...
          </div>
        </StyledEditorContent>
      </StyledEditorPanel>
    )
  }

  return (
    <StyledEditorPanel>
      <EditorActions>
        <Button onClick={onSave} disabled={!hasUnsavedChanges || isSavingContent}>
          <FaSave /> {isSavingContent ? 'Menyimpan...' : 'Simpan'}
        </Button>
        <Button variant="primary" onClick={onExportWord}>
          <FaFileWord /> Export Word
        </Button>
      </EditorActions>

      <StyledEditorContent>
        <BlockNoteEditor
          initialContent={editorContent}
          onChange={onContentChange}
          onImageUpload={onImageUpload}
          editable={true}
          placeholder="Mulai menulis skripsi Anda di sini..."
        />
      </StyledEditorContent>
    </StyledEditorPanel>
  )
})

EditorPanel.displayName = 'EditorPanel'

export default EditorPanel
