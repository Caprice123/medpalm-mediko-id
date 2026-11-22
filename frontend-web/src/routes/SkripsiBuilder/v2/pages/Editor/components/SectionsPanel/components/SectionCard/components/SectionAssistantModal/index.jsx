import { FaExclamationTriangle } from 'react-icons/fa'
import { TbSparkles } from 'react-icons/tb'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import Textarea from '@components/common/Textarea'
import Loading from '@components/common/Loading'
import ConfirmationModal from '@components/common/ConfirmationModal'
import RichTextViewer from '@components/common/RichTextViewer'
import ContextPicker from '../../../../../ContextPicker'
import { useSectionAssistantModal } from './hooks/useSectionAssistantModal'
import {
  Warning, Label, SectionName, SelectedText, Chips, Chip, FieldLabel, Revision, Divider,
  Removed, Added, RevisionHeader, ViewSwitch, ViewOption, NoChangeNote, DraftPreview,
} from './SectionAssistantModal.styles'

// The AI assistant for one section, in two modes.
//
// `rewrite` is the old "Edit dengan AI": it revises the text the student
// highlighted and the result is shown as a diff, because it is replacing their
// own writing. `draft` is what the editor could not do before — a section that
// is still empty has nothing to highlight, so there was no way to ask for a
// first version. Its result is HTML, shown rendered, and it is either appended
// or swapped in for the whole section.
//
// Both carry the same attachable context, which is the point of the thing: an
// answer that has read the PBL case and the section around it is about this
// report rather than about PBL reports in general. It is the same picker the
// chat tab uses, so what "Kasus" sends and how many sections fit are one
// answer rather than two that drift.

const SectionAssistantModal = ({
  isOpen,
  sectionId,
  sectionTitle,
  mode = 'rewrite',
  selectedText = '',
  hasContent = false,
  onApplyRewrite,
  onApplyDraft,
  onClose,
}) => {
  const {
    diff,
    changed,
    instruction,
    quickActions,
    applyQuickAction,
    setInstruction,
    context,
    toggleContext,
    sections,
    hasCase,
    hasCitations,
    selectedSectionIds,
    toggleSection,
    result,
    revisionView,
    setRevisionView,
    discardResult,
    isGenerating,
    canGenerate,
    handleGenerate,
    handleApplyRewrite,
    handleAppendDraft,
    requestReplace,
    confirmReplace,
    cancelReplace,
    isConfirmingReplace,
  } = useSectionAssistantModal({
    isOpen,
    sectionId,
    mode,
    selectedText,
    onApplyRewrite,
    onApplyDraft,
    onClose,
  })

  const isDraft = mode === 'draft'

  // Replacing an empty section is not a decision worth a dialog, so the
  // confirmation is skipped when there is nothing to lose.
  const handleReplace = () => (hasContent ? requestReplace() : confirmReplace())

  const footer = result ? (
    <>
      <Button variant="secondary" onClick={discardResult} disabled={isGenerating}>
        Generate ulang
      </Button>
      {isDraft ? (
        <>
          <Button variant="secondary" onClick={handleAppendDraft} disabled={isGenerating}>
            Tambahkan di akhir
          </Button>
          <Button variant="primary" onClick={handleReplace} disabled={isGenerating}>
            Ganti isi bagian
          </Button>
        </>
      ) : (
        <Button variant="primary" onClick={handleApplyRewrite} disabled={isGenerating}>
          Ganti teks asli
        </Button>
      )}
    </>
  ) : (
    <>
      <Button variant="secondary" onClick={onClose} disabled={isGenerating}>
        Batal
      </Button>
      <Button variant="primary" onClick={handleGenerate} disabled={!canGenerate || isGenerating}>
        <TbSparkles /> {isGenerating
          ? (isDraft ? 'Menulis draf...' : 'Menyusun revisi...')
          : (isDraft ? 'Tulis draf' : 'Generate revisi')}
      </Button>
    </>
  )

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isDraft ? 'Tulis bagian dengan AI' : 'Edit teks dengan AI'}
        footer={footer}
      >
        <Warning>
          <FaExclamationTriangle />
          AI dapat melakukan kesalahan. Periksa hasil sebelum dipakai di laporan.
        </Warning>

        {isDraft ? (
          <Label>Bagian · <SectionName>{sectionTitle}</SectionName></Label>
        ) : (
          <>
            <Label>Teks terpilih · <SectionName>{sectionTitle}</SectionName></Label>
            <SelectedText>{selectedText}</SelectedText>
          </>
        )}

        {!result && (
          <>
            <FieldLabel as="div">Konteks yang dikirim</FieldLabel>
            <ContextPicker
              context={context}
              sections={sections}
              selectedSectionIds={selectedSectionIds}
              ownSectionId={sectionId}
              hasCase={hasCase}
              hasCitations={hasCitations}
              disabled={isGenerating}
              onToggle={toggleContext}
              onToggleSection={toggleSection}
            />
          </>
        )}

        {result ? (
          <>
            <Divider />

            <RevisionHeader>
              <Label>{isDraft ? 'Draf dari AI' : 'Hasil revisi'}</Label>
              {!isDraft && (
                <ViewSwitch>
                  <ViewOption
                    type="button"
                    $active={revisionView === 'changes'}
                    onClick={() => setRevisionView('changes')}
                  >
                    Perubahan
                  </ViewOption>
                  <ViewOption
                    type="button"
                    $active={revisionView === 'clean'}
                    onClick={() => setRevisionView('clean')}
                  >
                    Hasil bersih
                  </ViewOption>
                </ViewSwitch>
              )}
            </RevisionHeader>

            {!isDraft && !changed && (
              <NoChangeNote>
                AI menilai teks aslinya sudah sesuai dengan perintah — tidak ada yang diubah.
              </NoChangeNote>
            )}

            {isDraft ? (
              <DraftPreview>
                <RichTextViewer html={result} />
              </DraftPreview>
            ) : (
              <Revision>
                {revisionView === 'clean'
                  ? result
                  : diff.map((part, index) => {
                    if (part.type === 'removed') return <Removed key={index}>{part.text}</Removed>
                    if (part.type === 'added') return <Added key={index}>{part.text}</Added>
                    return <span key={index}>{part.text}</span>
                  })}
              </Revision>
            )}
          </>
        ) : (
          <>
            <FieldLabel htmlFor={`section-assistant-instruction-${sectionId}`}>
              Perintah untuk AI
            </FieldLabel>
            <Chips>
              {quickActions.map(action => (
                <Chip
                  key={action.label}
                  type="button"
                  $active={instruction === action.text}
                  disabled={isGenerating}
                  onClick={() => applyQuickAction(action.text)}
                >
                  {action.label}
                </Chip>
              ))}
            </Chips>
            <Textarea
              id={`section-assistant-instruction-${sectionId}`}
              value={instruction}
              onChange={setInstruction}
              placeholder={isDraft
                ? 'Contoh: tulis patofisiologi sesuai keluhan pada kasus, dalam 3 paragraf...'
                : 'Contoh: ubah menjadi bahasa yang lebih ilmiah tanpa mengubah maknanya...'}
              rows={3}
              disabled={isGenerating}
            />

            {isGenerating && <Loading text={isDraft ? 'Menulis draf...' : 'Menyusun revisi...'} />}
          </>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmingReplace}
        title="Ganti isi bagian"
        message={`Seluruh isi bagian "${sectionTitle}" akan diganti dengan draf ini, termasuk teks yang kamu tulis sendiri.`}
        icon="✨"
        confirmText="Ya, ganti"
        cancelText="Batalkan"
        onConfirm={confirmReplace}
        onCancel={cancelReplace}
      />
    </>
  )
}

export default SectionAssistantModal
