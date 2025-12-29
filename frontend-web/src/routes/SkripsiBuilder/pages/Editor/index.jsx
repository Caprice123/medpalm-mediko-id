import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@store/store'
import { shallowEqual } from 'react-redux'
import { fetchSet, switchTab, saveSetContent } from '@store/skripsi/action'
import { upload } from '@store/common/action'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import { convertHtmlToDocxReliable } from '@utils/htmlToDocx'
import { Container, EditorArea, LoadingState } from './Editor.styles'
import TopBar from './components/TopBar'
import TabBar from './components/TabBar'
import ChatPanel from './components/ChatPanel'
import EditorPanel from './components/EditorPanel'

const SkripsiEditor = () => {
  const { setId } = useParams()
  const dispatch = useAppDispatch()

  // Use separate selectors with shallowEqual to prevent unnecessary re-renders
  const currentSet = useAppSelector((state) => state.skripsi.currentSet, shallowEqual)
  const currentTab = useAppSelector((state) => state.skripsi.currentTab, shallowEqual)
  const loading = useAppSelector((state) => state.skripsi.loading, shallowEqual)

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Image upload handler
  const handleImageUpload = useCallback(async (file) => {
    try {
      const result = await dispatch(upload(file, 'skripsi-editor'))
      return result.url
    } catch (error) {
      console.error('Image upload failed:', error)
      throw error
    }
  }, [dispatch])

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
    ],
    content: '',
    onUpdate: () => {
      setHasUnsavedChanges(true)
    },
  })

  // Fetch set data on mount
  useEffect(() => {
    if (setId) {
      dispatch(fetchSet(setId))
    }
  }, [setId, dispatch])

  // Initialize editor content only once when set is loaded
  useEffect(() => {
    if (editor && currentSet && !editor.getText()) {
      // Load content from the set
      const content = currentSet.editorContent || ''
      editor.commands.setContent(content, false) // Don't emit update event on initial load
    }
  }, [currentSet, editor])

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
  const isSendingMessage = useMemo(() => loading.isSendingMessage, [loading.isSendingMessage])

  const handleTabSwitch = useCallback((tab) => {
    dispatch(switchTab(tab))
  }, [dispatch])

  const handleSave = useCallback(async (showAlert = true) => {
    if (!currentSet || !editor) return

    try {
      const content = editor.getHTML()
      await dispatch(saveSetContent(currentSet.id, content))
      setHasUnsavedChanges(false)
      if (showAlert) {
        alert('Berhasil disimpan!')
      }
    } catch (error) {
      console.error('Failed to save:', error)
      if (showAlert) {
        alert('Gagal menyimpan konten')
      }
    }
  }, [currentSet, editor, dispatch])

  // Auto-save every 30 seconds (silent - no alert)
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (hasUnsavedChanges && currentSet && editor) {
        handleSave(false) // Don't show alert for auto-save
      }
    }, 30000) // 30 seconds

    return () => {
      clearInterval(autoSaveInterval)
    }
  }, [hasUnsavedChanges, currentSet, editor, handleSave])

  const handleExportWord = useCallback(async () => {
    if (!editor || !currentSet) return

    try {
      const htmlContent = editor.getHTML()
      const fileName = currentSet.title.replace(/[^a-z0-9]/gi, '_')

      await convertHtmlToDocxReliable(htmlContent, fileName)

      alert('Berhasil mengekspor ke Word!')
    } catch (error) {
      console.error('Failed to export Word:', error)
      alert(`Gagal mengekspor ke Word: ${error.message}`)
    }
  }, [editor, currentSet])

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
    <Container>
      <TopBar
        currentSet={currentSet}
        hasUnsavedChanges={hasUnsavedChanges}
        isSavingContent={isSavingContent}
        onSave={handleSave}
        onExportWord={handleExportWord}
      />

      <TabBar
        tabs={tabs}
        currentTabId={currentTabId}
        onTabSwitch={handleTabSwitch}
      />

      <EditorArea>
        <ChatPanel
          currentTab={currentTab}
          isSendingMessage={isSendingMessage}
        />

        <EditorPanel editor={editor} onImageUpload={handleImageUpload} />
      </EditorArea>
    </Container>
  )
}

export default SkripsiEditor
