import React, { useState, useEffect, memo } from 'react'
import { EditorContent } from '@tiptap/react'
import {
  EditorPanel as StyledEditorPanel,
  EditorToolbar,
  ToolbarButton,
  EditorContent as StyledEditorContent
} from '../Editor.styles'

const EditorPanel = memo(({ editor }) => {
  const [, forceUpdate] = useState({})

  // Force re-render only on selection changes (not on text input)
  useEffect(() => {
    if (!editor) return

    const updateHandler = () => {
      forceUpdate({})
    }

    editor.on('selectionUpdate', updateHandler)

    return () => {
      editor.off('selectionUpdate', updateHandler)
    }
  }, [editor])

  if (!editor) return null

  return (
    <StyledEditorPanel>
      <EditorToolbar>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          $active={editor.isActive('bold')}
          disabled={!editor}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          $active={editor.isActive('italic')}
          disabled={!editor}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          $active={editor.isActive('underline')}
          disabled={!editor}
        >
          <u>U</u>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          $active={editor.isActive('heading', { level: 1 })}
          disabled={!editor}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          $active={editor.isActive('heading', { level: 2 })}
          disabled={!editor}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          $active={editor.isActive('heading', { level: 3 })}
          disabled={!editor}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          $active={editor.isActive('bulletList')}
          disabled={!editor}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          $active={editor.isActive('orderedList')}
          disabled={!editor}
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          $active={editor.isActive({ textAlign: 'left' })}
          disabled={!editor}
        >
          ⬅
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          $active={editor.isActive({ textAlign: 'center' })}
          disabled={!editor}
        >
          ⬌
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          $active={editor.isActive({ textAlign: 'right' })}
          disabled={!editor}
        >
          ➡
        </ToolbarButton>
      </EditorToolbar>

      <StyledEditorContent>
        <EditorContent editor={editor} />
      </StyledEditorContent>
    </StyledEditorPanel>
  )
})

EditorPanel.displayName = 'EditorPanel'

export default EditorPanel
