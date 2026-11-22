import { useState } from 'react'
import { FaSave, FaFileWord, FaQuoteRight } from 'react-icons/fa'
import Button from '@components/common/Button'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import ConfirmationModal from '@components/common/ConfirmationModal'
import SectionCard from './components/SectionCard'
import TableOfContents from './components/TableOfContents'
import AddSectionDivider from './components/AddSectionDivider'
import { useSectionsLayout } from './hooks/useSectionsLayout'
import {
  Panel, PanelActions, Canvas, Layout, SheetColumn, Rail, Sheet, EmptyWrapper,
} from './SectionsPanel.styles'

// The document pane: one sheet holding every section, each with its own editor
// and a "+" on the rule between them to slot a new one in. The save and export
// pair at the top is the top bar's, repeated for phones where that bar is far
// from the typing.
const SectionsPanel = ({
  sections,
  isLoadingSections,
  isCreatingSection,
  isDeletingSection,
  savingSectionIds,
  hasUnsavedChanges,
  isSaving,
  onContentChange,
  onSave,
  onExportWord,
  onOpenCitations,
  onAddSection,
  onRenameSection,
  onMoveSection,
  onReorderSections,
  onDeleteSection,
}) => {
  // Modal visibility is the one piece of state that stays local by convention.
  const [pendingDeletion, setPendingDeletion] = useState(null)

  const { canvasRef, isRail } = useSectionsLayout()

  // The daftar pustaka closes the report: nothing is added below it and
  // nothing is moved past it, so the section above it is the last one whose
  // "down" arrow does anything. The server enforces both rules too.
  const referenceIndex = sections.findIndex(section => section.isReferenceSlot)
  const lastMovableIndex = referenceIndex === -1 ? sections.length - 1 : referenceIndex - 1

  const confirmDeletion = () => {
    if (!pendingDeletion) return

    // The card disappears on this click; the request runs behind it.
    onDeleteSection(pendingDeletion.id)
    setPendingDeletion(null)
  }

  return (
    <Panel>
      <PanelActions>
        <Button
          variant="secondary"
          onClick={onSave}
          disabled={isLoadingSections || !hasUnsavedChanges || isSaving}
        >
          <FaSave /> {isSaving ? 'Menyimpan...' : 'Simpan'}
        </Button>
        <Button variant="secondary" onClick={onOpenCitations} disabled={isLoadingSections}>
          <FaQuoteRight /> Referensi
        </Button>
        <Button variant="primary" onClick={onExportWord} disabled={isLoadingSections}>
          <FaFileWord /> Export Word
        </Button>
      </PanelActions>

      <Canvas ref={canvasRef}>
        {isLoadingSections && sections.length === 0 ? (
          <Loading text="Memuat bagian laporan..." />
        ) : sections.length === 0 ? (
          <EmptyWrapper>
            <EmptyState
              icon="📄"
              title="Laporan ini belum punya bagian"
              description="Tambahkan bagian pertama, lalu tulis isinya."
              actionLabel={isCreatingSection ? 'Menambahkan...' : 'Tambah Bagian'}
              onAction={() => onAddSection(null)}
            />
          </EmptyWrapper>
        ) : (
          <Layout $rail={isRail}>
            {/* As a strip the outline belongs above the sheet; as a rail it is
                the column beside it. Same element, two places. */}
            {!isRail && (
              <TableOfContents
                sections={sections}
                isRail={false}
                onReorder={onReorderSections}
                onMove={onMoveSection}
              />
            )}

            <SheetColumn>
              <Sheet>
                <AddSectionDivider
                  afterPosition={0}
                  onAdd={onAddSection}
                  leading
                />

                {sections.map((section, index) => (
                  <div key={section.id}>
                    <SectionCard
                      section={section}
                      isFirst={index === 0}
                      isLast={index >= lastMovableIndex}
                      isSaving={Boolean(savingSectionIds[section.id])}
                      onContentChange={onContentChange}
                      onRename={onRenameSection}
                      onMove={onMoveSection}
                      onDelete={setPendingDeletion}
                    />

                    {!section.isReferenceSlot && (
                      <AddSectionDivider
                        afterPosition={index + 1}
                        onAdd={onAddSection}
                      />
                    )}
                  </div>
                ))}
              </Sheet>
            </SheetColumn>

            {isRail && (
              <Rail>
                <TableOfContents
                  sections={sections}
                  isRail
                  onReorder={onReorderSections}
                  onMove={onMoveSection}
                />
              </Rail>
            )}
          </Layout>
        )}
      </Canvas>

      <ConfirmationModal
        isOpen={Boolean(pendingDeletion)}
        title="Hapus bagian"
        message={`Bagian "${pendingDeletion?.title || ''}" beserta isinya akan dihapus. Tindakan ini tidak dapat dibatalkan.`}
        icon="🗑️"
        confirmText={isDeletingSection ? 'Menghapus...' : 'Ya, hapus'}
        cancelText="Batalkan"
        onConfirm={confirmDeletion}
        onCancel={() => setPendingDeletion(null)}
      />
    </Panel>
  )
}

export default SectionsPanel
