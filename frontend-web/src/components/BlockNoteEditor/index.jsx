import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useRef, useState } from 'react'
import { BlockNoteEditor as x } from "@blocknote/core"
import { EditorContainer, EditorWrapper, ModeToggle, ModeButton } from './BlockNoteEditor.styles'



function BlockNoteEditor({ initialContent, onChange, editable = true, placeholder, showModeToggle = false, onImageUpload }) {
  const [viewMode, setViewMode] = useState('structured') // 'structured' or 'aesthetic'
  const editor = useCreateBlockNote({
    initialContent: initialContent || [
      {
        type: "paragraph",
        content: "",
      },
    ],
    uploadFile: onImageUpload ? async (file) => {
      try {
        const url = await onImageUpload(file)
        return url
      } catch (error) {
        console.error('Failed to upload image:', error)
        throw error
      }
    } : undefined,
  });

  const previousContentRef = useRef(null)
  const isInternalUpdateRef = useRef(false) // Track if update is from user typing

  // Update editor content when initialContent changes externally
  useEffect(() => {
    if (!editor || !initialContent) return

    // Check if content actually changed (avoid unnecessary updates)
    const newContentStr = JSON.stringify(initialContent)
    if (previousContentRef.current === newContentStr) {
      return
    }

    // Skip if this update is coming from the editor itself (user typing)
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false
      previousContentRef.current = newContentStr
      return
    }

    try {
      console.log('External update detected - replacing editor content')

      // Get all current blocks
      const currentBlocks = editor.document

      // Replace all blocks at once with new content (only for external updates like AI generation)
      if (currentBlocks.length > 0) {
        editor.replaceBlocks(currentBlocks, initialContent)
      } else {
        // If no blocks exist, insert the new ones
        editor.insertBlocks(initialContent)
      }

      previousContentRef.current = newContentStr
      console.log('Editor content updated successfully')
    } catch (error) {
      console.error('Failed to update editor content:', error)
    }
  }, [initialContent, editor])

  // Listen to editor changes and call onChange
  useEffect(() => {
    if (!editor || !onChange) return

    const handleUpdate = () => {
      // Mark this as an internal update (from user typing)
      isInternalUpdateRef.current = true

      const blocks = editor.document
      onChange(blocks)
    }

    editor.onChange(handleUpdate)
  }, [editor, onChange])

  if (!editor) {
    return <div style={{ padding: '1rem', color: '#9ca3af' }}>Loading editor...</div>
  }

  return (
    <EditorContainer>
      {showModeToggle && (
        <ModeToggle>
          <ModeButton
            $active={viewMode === 'structured'}
            onClick={() => setViewMode('structured')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Structured
          </ModeButton>
          <ModeButton
            $active={viewMode === 'aesthetic'}
            onClick={() => setViewMode('aesthetic')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Aesthetic
          </ModeButton>
        </ModeToggle>
      )}

      <EditorWrapper $isStructured={viewMode === 'structured'}>
        <BlockNoteView
          editor={editor}
          theme={"black"}
          editable={editable}
          onKeyDown={(e) => {
            // Prevent tab from leaving the editor
            if (e.key === 'Tab') {
              e.stopPropagation()
            }
          }}
        />
      </EditorWrapper>
    </EditorContainer>
  )
}

export default BlockNoteEditor
