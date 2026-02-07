import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@store/store'
import { shallowEqual } from 'react-redux'
import { fetchSet, switchTab, saveSetContent } from '@store/skripsi/action'
import { upload } from '@store/common/action'
import { exportBlocksToDocx } from '@components/BlockNoteEditor/exportToDocx'
import { blocksToHTML, htmlToBlocks } from '@utils/blockNoteConversion'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import { Container, EditorArea, LoadingState, Wrapper } from './Editor.styles'
import TopBar from './components/TopBar'
import TabBar from './components/TabBar'
import ChatPanel from './components/ChatPanel'
import DiagramBuilderPanel from './components/DiagramBuilderPanel'
import EditorPanel from './components/EditorPanel'
import UnsavedChangesDialog from './components/UnsavedChangesDialog'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const SkripsiEditor = () => {
  const { setId } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // Use separate selectors with shallowEqual to prevent unnecessary re-renders
  const currentSet = useAppSelector((state) => state.skripsi.currentSet, shallowEqual)
  const currentTab = useAppSelector((state) => state.skripsi.currentTab, shallowEqual)
  const loading = useAppSelector((state) => state.skripsi.loading, shallowEqual)

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [editorContent, setEditorContent] = useState([
    {
      type: "paragraph",
      content: "",
    },
  ])
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [isSavingBeforeLeave, setIsSavingBeforeLeave] = useState(false)

  // Detect mobile for responsive layout
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  // Get initial panel size from localStorage
  const getInitialPanelSize = () => {
    try {
      const saved = localStorage.getItem('skripsi-chat-panel-width')
      return saved ? parseFloat(saved) : 400
    } catch (error) {
      return 400
    }
  }

  const [chatPanelSize, _] = useState(getInitialPanelSize)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Image upload handler
  const handleImageUpload = useCallback(async (file) => {
    try {
      const result = await dispatch(upload(file, 'skripsi-editor'))
      // Use permanent blob URL instead of presigned URL so images persist indefinitely
      return `${API_BASE_URL}/api/v1/blobs/${result.blobId}`
    } catch (error) {
      console.error('Image upload failed:', error)
      throw error
    }
  }, [dispatch])

  // Handle content changes from BlockNote editor
  const handleContentChange = useCallback((blocks) => {
    setEditorContent(blocks)
    setHasUnsavedChanges(true)
  }, [])

  // Fetch set data on mount
  useEffect(() => {
    if (setId) {
      dispatch(fetchSet(setId))
    }
  }, [setId, dispatch])

  // Convert HTML to BlockNote blocks when set is loaded
  useEffect(() => {
    if (!currentSet) return

    const loadContent = async () => {
      setIsLoadingContent(true)
      try {
        const htmlContent = currentSet.editorContent || ''
        const blocks = await htmlToBlocks(htmlContent)
        setEditorContent(blocks)
        setHasUnsavedChanges(false) // Reset unsaved changes flag after loading
      } catch (error) {
        console.error('Failed to load editor content:', error)
      } finally {
        setIsLoadingContent(false)
      }
    }

    loadContent()
  }, [currentSet?.id]) // Only reload when set ID changes

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasUnsavedChanges])

  // Memoize individual values that change (MUST be before early returns)
  const tabs = useMemo(() => currentSet?.tabs || [], [currentSet?.tabs])
  const currentTabId = useMemo(() => currentTab?.id, [currentTab?.id])
  const isSavingContent = useMemo(() => loading.isSavingContent, [loading.isSavingContent])

  const handleTabSwitch = (tab) => {
    dispatch(switchTab(tab))
  }

  const handleSave = useCallback(async () => {
    if (!currentSet) return

    try {
      // Convert BlockNote blocks to HTML before saving
      const htmlContent = await blocksToHTML(editorContent)
      await dispatch(saveSetContent(currentSet.id, htmlContent))
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }, [currentSet, editorContent, dispatch])

  // Auto-save every 30 seconds (silent - no alert)
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (hasUnsavedChanges && currentSet) {
        handleSave() // Don't show alert for auto-save
      }
    }, 30000) // 30 seconds

    return () => {
      clearInterval(autoSaveInterval)
    }
  }, [hasUnsavedChanges, currentSet, handleSave])

  const handleExportWord = useCallback(async () => {
    if (!currentSet) return

    try {
      // Export BlockNote blocks directly to DOCX
      const fileName = currentSet.title.replace(/[^a-z0-9]/gi, '_')

      await exportBlocksToDocx(editorContent, fileName, {
        title: currentSet.title,
        description: currentSet.description || '',
        creator: 'Mediko',
        subject: 'Skripsi',
      })

      alert('Berhasil mengekspor ke Word!')
    } catch (error) {
      console.error('Failed to export Word:', error)
      alert(`Gagal mengekspor ke Word: ${error.message}`)
    }
  }, [currentSet, editorContent])

  // Handle back button click
  const handleBackClick = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true)
    } else {
      navigate('/sets')
    }
  }, [hasUnsavedChanges, navigate])

  // Handle save and leave
  const handleSaveAndLeave = async () => {
    setIsSavingBeforeLeave(true)
    try {
      await handleSave()
      navigate('/sets')
    } catch (error) {
      console.error('Failed to save before leaving:', error)
      alert('Gagal menyimpan perubahan')
    } finally {
      setIsSavingBeforeLeave(false)
      setShowUnsavedDialog(false)
    }
  }

  // Handle leave without saving
  const handleLeaveWithoutSaving = () => {
    setShowUnsavedDialog(false)
    navigate('/sets')
  }

  // Handle cancel navigation
  const handleCancelNavigation = () => {
    setShowUnsavedDialog(false)
  }

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
                  // Save the chat panel size to localStorage when resizing
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
