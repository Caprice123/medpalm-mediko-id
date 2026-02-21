import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import { Container, EditorArea, LoadingState, Wrapper } from './Editor.styles'
import TopBar from './components/TopBar'
import TabBar from './components/TabBar'
import ChatPanel from './components/ChatPanel'
import DiagramBuilderPanel from './components/DiagramBuilderPanel'
import EditorPanel from './components/EditorPanel'
import UnsavedChangesDialog from './components/UnsavedChangesDialog'
import { useSkripsiEditor } from './hooks/useSkripsiEditor'

const SkripsiEditor = () => {
  const {
    currentSet,
    currentTab,
    loading,
    tabs,
    currentTabId,
    isSavingContent,
    hasUnsavedChanges,
    editorContent,
    isLoadingContent,
    showUnsavedDialog,
    isSavingBeforeLeave,
    isMobile,
    chatPanelSize,
    handleImageUpload,
    handleContentChange,
    handleTabSwitch,
    handleSave,
    handleExportWord,
    handleBackClick,
    handleSaveAndLeave,
    handleLeaveWithoutSaving,
    handleCancelNavigation,
  } = useSkripsiEditor()

  if (loading.isSetLoading) {
    return (
      <Container>
        <LoadingState>Memuat data...</LoadingState>
      </Container>
    )
  }

  if (!currentSet) {
    return (
      <Container>
        <LoadingState>Set tidak ditemukan</LoadingState>
      </Container>
    )
  }

  return (
    <Wrapper>
      <Container>
        <TopBar
          currentSet={currentSet}
          hasUnsavedChanges={hasUnsavedChanges}
          isSavingContent={isSavingContent}
          onSave={handleSave}
          onExportWord={handleExportWord}
          onBackClick={handleBackClick}
        />

        <TabBar
          tabs={tabs}
          currentTabId={currentTabId}
          onTabSwitch={handleTabSwitch}
        />

        <EditorArea>
          {isMobile ? (
            // Mobile: Stack vertically without resizable panels
            <>
              {/* Keep both panels mounted to preserve state, toggle with CSS */}
              <DiagramBuilderPanel
                currentTab={currentTab}
                style={{
                  display: currentTab?.tabType === 'diagram_builder' ? 'flex' : 'none',
                }}
              />

              <ChatPanel
                currentTab={currentTab}
                style={{
                  display: currentTab?.tabType !== 'diagram_builder' ? 'flex' : 'none',
                }}
              />

              <EditorPanel
                editorContent={editorContent}
                onContentChange={handleContentChange}
                onImageUpload={handleImageUpload}
                hasUnsavedChanges={hasUnsavedChanges}
                isSavingContent={isSavingContent}
                onSave={handleSave}
                onExportWord={handleExportWord}
                isLoadingContent={isLoadingContent}
              />
            </>
          ) : (
            // Desktop: Horizontal resizable panels
            <PanelGroup direction="horizontal" autoSaveId="skripsi-editor-panels">
              {/* Chat/Diagram Panel */}
              <Panel
                defaultSize={chatPanelSize}
                minSize={300}
                maxSize={800}
                onResize={(size) => {
                  localStorage.setItem('skripsi-chat-panel-width', size.inPixels.toString())
                }}
                style={{ display: 'flex' }}
              >
                {/* Keep both panels mounted to preserve state, toggle with CSS */}
                <DiagramBuilderPanel
                  currentTab={currentTab}
                  style={{
                    display: currentTab?.tabType === 'diagram_builder' ? 'flex' : 'none',
                    width: '100%'
                  }}
                />

                <ChatPanel
                  currentTab={currentTab}
                  style={{
                    display: currentTab?.tabType !== 'diagram_builder' ? 'flex' : 'none',
                    width: '100%'
                  }}
                />
              </Panel>

              <PanelResizeHandle className="resize-handle-skripsi" />

              {/* Editor Panel */}
              <Panel minSize={50} style={{ display: 'flex' }}>
                <EditorPanel
                  editorContent={editorContent}
                  onContentChange={handleContentChange}
                  onImageUpload={handleImageUpload}
                  hasUnsavedChanges={hasUnsavedChanges}
                  isSavingContent={isSavingContent}
                  onSave={handleSave}
                  onExportWord={handleExportWord}
                  isLoadingContent={isLoadingContent}
                />
              </Panel>
            </PanelGroup>
          )}
        </EditorArea>

        <UnsavedChangesDialog
          isOpen={showUnsavedDialog}
          onSaveAndLeave={handleSaveAndLeave}
          onLeaveWithoutSaving={handleLeaveWithoutSaving}
          onCancel={handleCancelNavigation}
          isSaving={isSavingBeforeLeave}
        />
      </Container>
    </Wrapper>
  )
}

export default SkripsiEditor
