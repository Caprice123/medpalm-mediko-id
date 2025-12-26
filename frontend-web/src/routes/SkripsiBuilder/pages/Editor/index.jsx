import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@store/store'
import { shallowEqual } from 'react-redux'
import { fetchSet, switchTab, saveSetContent } from '@store/skripsi/action'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
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
      const content = currentSet.editor_content || ''
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
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx')
      const { saveAs } = await import('file-saver')

      // Get HTML content and parse it
      const htmlContent = editor.getHTML()
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlContent, 'text/html')

      // Convert HTML to docx paragraphs
      const paragraphs = []

      const processNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.trim()
          if (text) {
            return new TextRun({ text })
          }
          return null
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName.toLowerCase()
          const children = Array.from(node.childNodes)

          if (tagName === 'p') {
            const textRuns = children.map(processNode).filter(Boolean)
            const alignment = node.style.textAlign === 'center' ? AlignmentType.CENTER :
                            node.style.textAlign === 'right' ? AlignmentType.RIGHT :
                            AlignmentType.LEFT
            paragraphs.push(new Paragraph({ children: textRuns, alignment }))
          } else if (tagName === 'h1') {
            const textRuns = children.map(processNode).filter(Boolean)
            paragraphs.push(new Paragraph({
              children: textRuns,
              heading: HeadingLevel.HEADING_1
            }))
          } else if (tagName === 'h2') {
            const textRuns = children.map(processNode).filter(Boolean)
            paragraphs.push(new Paragraph({
              children: textRuns,
              heading: HeadingLevel.HEADING_2
            }))
          } else if (tagName === 'h3') {
            const textRuns = children.map(processNode).filter(Boolean)
            paragraphs.push(new Paragraph({
              children: textRuns,
              heading: HeadingLevel.HEADING_3
            }))
          } else if (tagName === 'li') {
            const textRuns = children.map(processNode).filter(Boolean)
            paragraphs.push(new Paragraph({
              children: textRuns,
              bullet: { level: 0 }
            }))
          } else if (tagName === 'strong' || tagName === 'b') {
            const text = node.textContent
            return new TextRun({ text, bold: true })
          } else if (tagName === 'em' || tagName === 'i') {
            const text = node.textContent
            return new TextRun({ text, italics: true })
          } else if (tagName === 'u') {
            const text = node.textContent
            return new TextRun({ text, underline: {} })
          } else {
            children.forEach(processNode)
          }
        }
        return null
      }

      // Process all nodes
      Array.from(doc.body.childNodes).forEach(processNode)

      // Create document
      const wordDoc = new Document({
        sections: [{
          properties: {},
          children: paragraphs.length > 0 ? paragraphs : [
            new Paragraph({ children: [new TextRun({ text: 'Dokumen kosong' })] })
          ]
        }]
      })

      // Generate and save
      const blob = await Packer.toBlob(wordDoc)
      const fileName = `${currentSet.title.replace(/[^a-z0-9]/gi, '_')}.docx`
      saveAs(blob, fileName)
    } catch (error) {
      console.error('Failed to export Word:', error)
      alert('Gagal mengekspor ke Word')
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

        <EditorPanel editor={editor} />
      </EditorArea>
    </Container>
  )
}

export default SkripsiEditor
