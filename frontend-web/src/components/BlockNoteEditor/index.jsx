import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useRef } from 'react'
import { BlockNoteEditor as x } from "@blocknote/core"



function BlockNoteEditor({ initialContent, onChange, editable = true, placeholder }) {
  const editor = useCreateBlockNote({
    initialContent: initialContent || [
      {
        type: "paragraph",
        content: "",
      },
    ],
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
    <BlockNoteView
      editor={editor}
      theme="light"
      editable={editable}
      onKeyDown={(e) => {
        // Prevent tab from leaving the editor
        if (e.key === 'Tab') {
          e.stopPropagation()
        }
      }}
    />
  )
}

export default BlockNoteEditor
