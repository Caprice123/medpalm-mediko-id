import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import TopBar from './components/TopBar'
import TabBar from './components/TabBar'
import ChatPanel from './components/ChatPanel'
import DiagramBuilderPanel from './components/DiagramBuilderPanel'
import EditorPanel from './components/EditorPanel'
import UnsavedChangesDialog from './components/UnsavedChangesDialog'
import { useEditorSet } from './hooks/useEditorSet'
import { useEditorDocument } from './hooks/useEditorDocument'
import { useEditorLayout } from './hooks/useEditorLayout'
import { useLeaveGuard } from './hooks/useLeaveGuard'
import { Wrapper, Container, EditorArea } from './Editor.styles'

const CHAT_PANEL_MIN_PX = 300
const CHAT_PANEL_MAX_PX = 800

const SkripsiEditor = () => {
  const { currentSet, tabs, activeTab, activeTabId, isFetchingSet, switchTab } = useEditorSet()
  const doc = useEditorDocument(currentSet)
  const { isMobile, chatPanelWidth, persistPanelWidth } = useEditorLayout()
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

  // Both panes stay mounted and are toggled with CSS rather than unmounted, so
  // a half-typed message or a diagram in progress survives a tab switch.
  const isDiagramTab = activeTab?.tabType === 'diagram_builder'

  const sidePanels = (
    <>
      <DiagramBuilderPanel
        tab={activeTab}
        style={{ display: isDiagramTab ? 'flex' : 'none', width: '100%' }}
      />
      <ChatPanel
        tab={activeTab}
        style={{ display: isDiagramTab ? 'none' : 'flex', width: '100%' }}
      />
    </>
  )

  const documentPanel = (
    <EditorPanel
      blocks={doc.blocks}
      isLoadingContent={doc.isLoadingContent}
      hasUnsavedChanges={doc.hasUnsavedChanges}
      isSaving={doc.isSaving}
      onContentChange={doc.handleContentChange}
      onImageUpload={doc.handleImageUpload}
      onSave={doc.save}
      onExportWord={doc.exportToWord}
    />
  )

  return (
    <Wrapper>
      <Container>
        <TopBar
          currentSet={currentSet}
          hasUnsavedChanges={doc.hasUnsavedChanges}
          isSaving={doc.isSaving}
          onSave={doc.save}
          onExportWord={doc.exportToWord}
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
