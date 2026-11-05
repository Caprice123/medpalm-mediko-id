import { useRef, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table'
import { Mathematics } from '@tiptap/extension-mathematics'
import { Placeholder } from '@tiptap/extensions'
import ResizableImage from '../extensions/ResizableImage'
import { upload } from '@store/common/action'
import Endpoints from '@config/endpoint'

export const TEXT_COLORS = ['#111827', '#dc2626', '#ea580c', '#16a34a', '#2563eb', '#7c3aed']
export const HIGHLIGHT_COLORS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#e9d5ff', '#fed7aa']

const isImageFile = (file) => !!file && file.type?.startsWith('image/')

export function useRichTextEditor({ value, onChange, placeholder, disabled, uploadFolder }) {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  // The editor instance is created once, so its ProseMirror handlers close over the first
  // render's props — this ref keeps the drop/paste upload pointing at the current folder.
  const uploadFolderRef = useRef(uploadFolder)
  uploadFolderRef.current = uploadFolder

  // Uploads the file through the shared blob upload action and returns a URL that never
  // expires: /api/v1/blobs/:id redirects to a freshly presigned URL on every request.
  const uploadImageFile = useCallback(async (file) => {
    const folder = uploadFolderRef.current
    if (!folder) return null
    try {
      const result = await dispatch(upload(file, folder))
      return result?.blobId ? Endpoints.api.blobImageUrl(result.blobId) : null
    } catch {
      window.alert('Gagal mengunggah gambar')
      return null
    }
  }, [dispatch])

  const editor = useEditor({
    extensions: [
      // StarterKit v3 bundles Link and Underline — configured through it so the extension
      // names are not registered twice.
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph', 'image'] }),
      // base64 stays off: dropped files are uploaded, so a pasted data URI would only
      // bloat the stored HTML
      ResizableImage.configure({ inline: false, allowBase64: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Mathematics,
      Placeholder.configure({ placeholder: placeholder || 'Tulis di sini...' }),
    ],
    content: value || '',
    editable: !disabled,
    onUpdate: ({ editor: instance }) => onChange?.(instance.getHTML()),
    editorProps: {
      handleDrop: (view, event, _slice, moved) => {
        if (moved || !uploadFolderRef.current) return false
        const files = Array.from(event.dataTransfer?.files || []).filter(isImageFile)
        if (files.length === 0) return false

        event.preventDefault()
        const coords = view.posAtCoords({ left: event.clientX, top: event.clientY })
        const dropPos = coords?.pos ?? view.state.selection.from

        files.forEach(async (file) => {
          const src = await uploadImageFile(file)
          if (!src) return
          const node = view.state.schema.nodes.image.create({ src })
          view.dispatch(view.state.tr.insert(dropPos, node))
        })
        return true
      },
      handlePaste: (view, event) => {
        if (!uploadFolderRef.current) return false
        const files = Array.from(event.clipboardData?.files || []).filter(isImageFile)
        if (files.length === 0) return false

        event.preventDefault()
        files.forEach(async (file) => {
          const src = await uploadImageFile(file)
          if (!src) return
          const node = view.state.schema.nodes.image.create({ src })
          view.dispatch(view.state.tr.replaceSelectionWith(node))
        })
        return true
      },
    },
  })

  // Only push an external value in when it genuinely differs, otherwise every keystroke
  // would round-trip through the parent and reset the cursor to the end of the document.
  useEffect(() => {
    if (!editor) return
    const incoming = value || ''
    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming, { emitUpdate: false })
    }
  }, [value, editor])

  useEffect(() => {
    if (editor) editor.setEditable(!disabled)
  }, [disabled, editor])

  const setLink = () => {
    if (!editor) return
    const previous = editor.getAttributes('link')?.href || ''
    const url = window.prompt('Masukkan link (kosongkan untuk menghapus):', previous)
    if (url === null) return
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  // With an upload folder the button opens the file picker; without one it falls back to
  // asking for a URL, so the editor still works outside an authenticated admin screen.
  const pickImage = () => {
    if (uploadFolder) {
      fileInputRef.current?.click()
      return
    }
    const url = window.prompt('Masukkan URL gambar:')
    if (url?.trim()) editor?.chain().focus().setImage({ src: url.trim() }).run()
  }

  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!isImageFile(file)) return
    const src = await uploadImageFile(file)
    if (src) editor?.chain().focus().setImage({ src }).run()
  }

  const insertMath = () => {
    if (!editor) return
    const latex = window.prompt('Masukkan rumus LaTeX (mis. \\frac{a}{b}):')
    if (!latex?.trim()) return
    editor.chain().focus().insertInlineMath({ latex: latex.trim() }).run()
  }

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const setTextColor = (color) => editor?.chain().focus().setColor(color).run()
  const unsetTextColor = () => editor?.chain().focus().unsetColor().run()
  const setHighlight = (color) => editor?.chain().focus().toggleHighlight({ color }).run()
  const unsetHighlight = () => editor?.chain().focus().unsetHighlight().run()

  const clearFormatting = () => editor?.chain().focus().unsetAllMarks().run()
  const clearNodes = () => editor?.chain().focus().clearNodes().run()

  return {
    editor,
    fileInputRef, handleFileSelected,
    setLink, pickImage, insertMath, insertTable,
    setTextColor, unsetTextColor, setHighlight, unsetHighlight,
    clearFormatting, clearNodes,
  }
}
