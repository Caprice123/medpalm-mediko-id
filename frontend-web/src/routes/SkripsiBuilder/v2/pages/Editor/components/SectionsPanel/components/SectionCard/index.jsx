import { memo } from 'react'
import { FaArrowUp, FaArrowDown, FaTrash, FaLock } from 'react-icons/fa'
import { TbSparkles } from 'react-icons/tb'
import RichTextEditor from '@components/common/RichTextEditor'
import TextInput from '@components/common/TextInput'
import SectionAssistantModal from './components/SectionAssistantModal'
import SectionReferenceModal from './components/SectionReferenceModal'
import { useSectionCard } from './hooks/useSectionCard'
import { sectionDomId } from '../../utils/sectionDomId'
import {
  Card, Header, Title, TitleField, Actions, IconButton, SavingNote, LockNote,
  GenerationNote,
} from './SectionCard.styles'

// One section of the report: its heading and its own editor.
//
// The Referensi section is the exception: it closes every report, so its
// heading, its place in the order and its existence are fixed — only its text
// can change, by hand or through "Kumpulkan referensi" in the top bar. The
// server refuses a rename, a delete and any move past it regardless; this only
// keeps the UI from offering what would be rejected.
// What a "Generate sekaligus" run says about this section while it runs.
const GENERATION_LABELS = {
  pending: 'Menunggu giliran',
  writing: 'AI sedang menulis...',
  error: 'Gagal — coba lagi dari tombol AI',
}

const SectionCard = memo(({
  section,
  isFirst,
  isLast,
  isSaving,
  generationStatus,
  onContentChange,
  onRename,
  onMove,
  onDelete,
}) => {
  const {
    referenceRequest,
    requestReference,
    closeReferencePicker,
    insertReference,
    resolveReference,
    openReference,
    assistRequest,
    requestAiEdit,
    requestDraft,
    closeAssistant,
    applyAiRevision,
    applyDraft,
    handleContentChange,
    isEditingTitle,
    startEditingTitle,
    draftTitle,
    setDraftTitle,
    commitTitle,
    handleTitleKeyDown,
    initialContent,
  } = useSectionCard({ section, onRename, onContentChange })

  const isLocked = Boolean(section.isReferenceSlot)

  return (
    <Card id={sectionDomId(section.id)}>
      <Header>
        {isEditingTitle && !isLocked ? (
          <TitleField>
            <TextInput
              value={draftTitle}
              onChange={setDraftTitle}
              onBlur={commitTitle}
              onKeyDown={handleTitleKeyDown}
              size="small"
              autoFocus
            />
          </TitleField>
        ) : (
          <Title
            $locked={isLocked}
            onClick={isLocked ? undefined : startEditingTitle}
            title={isLocked
              ? 'Bagian Referensi selalu menutup laporan dan namanya tetap'
              : 'Klik untuk ganti nama bagian'}
          >
            {section.title}
          </Title>
        )}

        {/* A finished section says nothing: the text that appeared is the
            message, and a row of "Selesai" badges would outlive its use. */}
        {GENERATION_LABELS[generationStatus] && (
          <GenerationNote $status={generationStatus}>
            {GENERATION_LABELS[generationStatus]}
          </GenerationNote>
        )}

        {isSaving && <SavingNote>Menyimpan...</SavingNote>}

        {isLocked ? (
          <LockNote title="Bagian ini tidak bisa dipindah, diganti nama, atau dihapus">
            <FaLock /> Bagian tetap
          </LockNote>
        ) : (
          <Actions>
            <IconButton
              type="button"
              $accent
              title="Tulis bagian ini dengan AI"
              aria-label="Tulis bagian ini dengan AI"
              onClick={requestDraft}
            >
              <TbSparkles />
            </IconButton>
            <IconButton
              type="button"
              title="Pindah ke atas"
              aria-label="Pindah ke atas"
              disabled={isFirst}
              onClick={() => onMove(section.id, -1)}
            >
              <FaArrowUp />
            </IconButton>
            <IconButton
              type="button"
              title="Pindah ke bawah"
              aria-label="Pindah ke bawah"
              disabled={isLast}
              onClick={() => onMove(section.id, 1)}
            >
              <FaArrowDown />
            </IconButton>
            <IconButton
              type="button"
              $danger
              title="Hapus bagian"
              aria-label="Hapus bagian"
              onClick={() => onDelete(section)}
            >
              <FaTrash />
            </IconButton>
          </Actions>
        )}
      </Header>

      <RichTextEditor
        value={initialContent}
        onChange={(html) => handleContentChange(section.id, html)}
        placeholder={`Tulis ${section.title.toLowerCase()} di sini...`}
        uploadFolder="skripsi-editor"
        minHeight="180px"
        onAiEdit={requestAiEdit}
        onPickReference={requestReference}
        resolveReference={resolveReference}
        onOpenReference={openReference}
      />

      <SectionReferenceModal
        isOpen={Boolean(referenceRequest)}
        currentSectionId={section.id}
        onSelect={insertReference}
        onClose={closeReferencePicker}
      />

      <SectionAssistantModal
        isOpen={Boolean(assistRequest)}
        sectionId={section.id}
        sectionTitle={section.title}
        mode={assistRequest?.mode || 'rewrite'}
        selectedText={assistRequest?.text || ''}
        hasContent={Boolean(section.content)}
        onApplyRewrite={applyAiRevision}
        onApplyDraft={applyDraft}
        onClose={closeAssistant}
      />
    </Card>
  )
})

SectionCard.displayName = 'SectionCard'

export default SectionCard
