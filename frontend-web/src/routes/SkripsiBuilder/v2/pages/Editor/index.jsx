import { useSelector } from 'react-redux'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import TopBar from './components/TopBar'
import TabBar from './components/TabBar'
import ChatPanel from './components/ChatPanel'
import SearcherPanel from './components/SearcherPanel'
import DiagramBuilderPanel from './components/DiagramBuilderPanel'
import SectionsPanel from './components/SectionsPanel'
import UnsavedChangesDialog from './components/UnsavedChangesDialog'
import CitationsModal from './components/TopBar/components/CitationsModal'
import { useEditorSet } from './hooks/useEditorSet'
import { useCitationsPanel } from './hooks/useCitationsPanel'
import { useSections } from './hooks/useSections'
import { useEditorLayout } from './hooks/useEditorLayout'
import { useLeaveGuard } from './hooks/useLeaveGuard'
import { Wrapper, Container, EditorArea } from './Editor.styles'

const CHAT_PANEL_MIN_PX = 300
const CHAT_PANEL_MAX_PX = 800

// Both side panes stay mounted and are toggled with CSS. These are the only
// two style objects they are ever given: passing an inline literal instead
// would hand the memoised panels a new prop on every render of this page.
const PANE_SHOWN = { display: 'flex', width: '100%' }
const PANE_HIDDEN = { display: 'none', width: '100%' }

const SkripsiEditor = () => {
  const { currentSet, tabs, activeTab, activeTabId, isFetchingSet, switchTab } = useEditorSet()
  const isDeletingSection = useSelector(state => state.skripsiV2.loading.isDeletingSection)
  const doc = useSections(currentSet)
  const { isMobile, chatPanelWidth, persistPanelWidth } = useEditorLayout()
  const { isCitationsOpen, openCitations, closeCitations } = useCitationsPanel()
  const leaveGuard = useLeaveGuard({
    hasUnsavedChanges: doc.hasUnsavedChanges,
    save: doc.save,
  })

  if (isFetchingSet && !currentSet) {
    return (
      <Container>
        <Loading text="Memuat data..." />
      </Container>
    )
  }

  if (!currentSet) {
    return (
      <Container>
        <EmptyState icon="📄" title="Set tidak ditemukan" />
      </Container>
    )
  }

  // All three panes stay mounted and are toggled with CSS rather than
  // unmounted, so a half-typed message, a filled-in search form or a diagram in
  // progress survives a tab switch.
  const tabType = activeTab?.tabType

  const sidePanels = (
    <>
      <DiagramBuilderPanel
        tab={activeTab}
        style={tabType === 'diagram_builder' ? PANE_SHOWN : PANE_HIDDEN}
      />
      <SearcherPanel
        style={tabType === 'research' ? PANE_SHOWN : PANE_HIDDEN}
      />
      <ChatPanel
        tab={activeTab}
        style={tabType === 'ai_chat' ? PANE_SHOWN : PANE_HIDDEN}
      />
    </>
  )

  const documentPanel = (
    <SectionsPanel
      sections={doc.sections}
      isLoadingSections={doc.isLoadingSections}
      isCreatingSection={doc.isCreatingSection}
      isDeletingSection={isDeletingSection}
      savingSectionIds={doc.savingSectionIds}
      hasUnsavedChanges={doc.hasUnsavedChanges}
      isSaving={doc.isSavingAny}
      onContentChange={doc.handleContentChange}
      onSave={doc.save}
      onExportWord={doc.exportToWord}
      onOpenCitations={openCitations}
      onAddSection={doc.addSection}
      onRenameSection={doc.renameSection}
      onMoveSection={doc.moveSection}
      onReorderSections={doc.reorderSections}
      onDeleteSection={doc.removeSection}
    />
  )

  return (
    <Wrapper>
      <Container>
        <TopBar
          currentSet={currentSet}
          hasUnsavedChanges={doc.hasUnsavedChanges}
          isSaving={doc.isSavingAny}
          onSave={doc.save}
          onExportWord={doc.exportToWord}
          onOpenCitations={openCitations}
          onBack={leaveGuard.requestLeave}
        />

        <TabBar tabs={tabs} activeTabId={activeTabId} onSwitch={switchTab} />

        <EditorArea>
          {isMobile ? (
            // On a phone there is no room for two panes side by side, so they
            // stack and the resizable split is dropped entirely.
            <>
              {sidePanels}
              {documentPanel}
            </>
          ) : (
            <PanelGroup direction="horizontal" autoSaveId="skripsi-v2-editor-panels">
              <Panel
                defaultSize={chatPanelWidth}
                minSize={CHAT_PANEL_MIN_PX}
                maxSize={CHAT_PANEL_MAX_PX}
                onResize={(size) => persistPanelWidth(size.inPixels)}
                style={{ display: 'flex' }}
              >
                {sidePanels}
              </Panel>

              <PanelResizeHandle className="resize-handle-skripsi" />

              <Panel minSize={50} style={{ display: 'flex' }}>
                {documentPanel}
              </Panel>
            </PanelGroup>
          )}
        </EditorArea>

        <CitationsModal isOpen={isCitationsOpen} onClose={closeCitations} />

        <UnsavedChangesDialog
          isOpen={leaveGuard.isDialogOpen}
          isSaving={leaveGuard.isSavingBeforeLeave}
          onSaveAndLeave={leaveGuard.saveAndLeave}
          onLeaveWithoutSaving={leaveGuard.leaveWithoutSaving}
          onCancel={leaveGuard.cancelLeave}
        />
      </Container>
    </Wrapper>
  )
}

export default SkripsiEditor
