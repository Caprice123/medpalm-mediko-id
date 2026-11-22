import { useRef, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { TextStyle, FontFamily, FontSize } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table'
import { Mathematics } from '@tiptap/extension-mathematics'
import { Placeholder } from '@tiptap/extensions'
import ResizableImage from '../extensions/ResizableImage'
import Indent from '../extensions/Indent'
import InlineReference from '../extensions/InlineReference'
import { upload } from '@store/common/action'
import Endpoints from '@config/endpoint'

export const TEXT_COLORS = ['#111827', '#dc2626', '#ea580c', '#16a34a', '#2563eb', '#7c3aed']
export const HIGHLIGHT_COLORS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#e9d5ff', '#fed7aa']

// What the editor writes in until told otherwise — the face every campus
// template asks for. EditorSurface styles `.tiptap` with the same stack, so an
// untouched paragraph already looks like what it will be submitted as.
export const DEFAULT_FONT_FAMILY = '"Times New Roman", Times, serif'

// The faces a campus template actually asks for, each with a fallback stack so
// a machine without the font still lands on something of the same shape.
export const FONT_FAMILIES = [
  { label: 'Times New Roman', value: DEFAULT_FONT_FAMILY },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Calibri', value: 'Calibri, Candara, Segoe, sans-serif' },
  { label: 'Cambria', value: 'Cambria, Georgia, serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
]

// In points, not pixels: a thesis guide is written in pt, and the stored value
// is what gets read back by whoever opens the document next.
export const FONT_SIZES = ['9', '10', '11', '12', '14', '16', '18', '24']

// The paragraph styles the document knows about. '' is an ordinary paragraph —
// the editor's heading levels are capped at 3 by StarterKit above.
export const BLOCK_STYLES = [
  { label: 'Normal', value: '' },
  { label: 'Heading 1', value: '1' },
  { label: 'Heading 2', value: '2' },
  { label: 'Heading 3', value: '3' },
]

const isImageFile = (file) => !!file && file.type?.startsWith('image/')

const escapeHtml = (text) => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

const BULLET_LINE = /^\s*[-*•]\s+/

// A revision comes back as plain text: a blank line starts a new paragraph, a
// single newline is a line break, and a run of dashed lines is a list — which
// is what the "ubah menjadi daftar poin" instruction asks the model for.
const textToHtml = (text) => text
  .trim()
  .split(/\n{2,}/)
  .map((block) => {
    const lines = block.trim().split('\n')

    if (lines.length > 1 && lines.every(line => BULLET_LINE.test(line))) {
      const items = lines.map(line => `<li>${escapeHtml(line.replace(BULLET_LINE, '').trim())}</li>`)
      return `<ul>${items.join('')}</ul>`
    }

    return `<p>${escapeHtml(block.trim()).replace(/\n/g, '<br />')}</p>`
  })
  .join('')

export function useRichTextEditor({
  value,
  onChange,
  placeholder,
  disabled,
  uploadFolder,
  onAiEdit,
  onPickReference,
  resolveReference,
  onOpenReference,
}) {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  // Same reason as the upload folder below: the handler is read when the
  // button is clicked, not when the editor was created.
  const onAiEditRef = useRef(onAiEdit)
  onAiEditRef.current = onAiEdit
  const onPickReferenceRef = useRef(onPickReference)
  onPickReferenceRef.current = onPickReference
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
      FontFamily,
      FontSize,
      Indent,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph', 'image'] }),
      // base64 stays off: dropped files are uploaded, so a pasted data URI would only
      // bloat the stored HTML
      ResizableImage.configure({ inline: false, allowBase64: false }),
      InlineReference,
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
    // An empty document reads back as '<p></p>', so a blank value would never
    // match what is on screen and this would rewrite the document on mount.
    if (!incoming && editor.isEmpty) return

    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming, { emitUpdate: false })
    }
  }, [value, editor])

  // The chips are drawn by a node view that reads these two out of the
  // editor's storage, so a reference always resolves against the list the page
  // holds right now rather than against whatever it held when the editor was
  // created.
  useEffect(() => {
    if (!editor) return

    editor.storage.inlineReference.resolve = resolveReference ?? null
    editor.storage.inlineReference.onOpen = onOpenReference ?? null
  }, [editor, resolveReference, onOpenReference])

  // Renaming a section has to reach the references pointing at it, and
  // deleting one has to mark them broken. The stored label is rewritten rather
  // than only the chip on screen: the document is what gets exported, and a
  // Word file has no resolver to ask.
  useEffect(() => {
    if (!editor || !resolveReference) return

    const { state } = editor
    let tr = state.tr
    let changed = false

    state.doc.descendants((node, pos) => {
      if (node.type.name !== 'inlineReference') return

      const resolved = resolveReference(node.attrs.refId)
      if (resolved === undefined) return

      const missing = resolved === null
      const label = missing ? node.attrs.label : resolved

      if (label !== node.attrs.label || missing !== node.attrs.missing) {
        // Positions hold while this runs: replacing a leaf node's attributes
        // never changes its size.
        tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, label, missing })
        changed = true
      }
    })

    // Kept out of the undo stack — a rename somewhere else is not something
    // the student should have to undo here.
    if (changed) editor.view.dispatch(tr.setMeta('addToHistory', false))
  }, [editor, resolveReference])

  // The second argument is what stops this from emitting a fake 'update':
  // setEditable emits one by default, so every editor reported a change the
  // moment it mounted and its parent marked an untouched form as dirty.
  useEffect(() => {
    if (editor) editor.setEditable(!disabled, false)
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

  // One select for the whole block style: picking Normal has to turn a heading
  // back into a paragraph, which toggleHeading on its own cannot say.
  const setBlockStyle = (level) => {
    if (!editor) return
    const chain = editor.chain().focus()
    if (level) chain.setHeading({ level: Number(level) }).run()
    else chain.setParagraph().run()
  }

  // An empty choice clears the mark rather than writing an empty family or
  // size, which would otherwise override the stylesheet with nothing.
  const setFontFamily = (family) => {
    if (!editor) return
    const chain = editor.chain().focus()
    if (family) chain.setFontFamily(family).run()
    else chain.unsetFontFamily().run()
  }

  const setFontSize = (size) => {
    if (!editor) return
    const chain = editor.chain().focus()
    if (size) chain.setFontSize(`${size}pt`).run()
    else chain.unsetFontSize().run()
  }

  const indent = () => editor?.chain().focus().indent().run()
  const outdent = () => editor?.chain().focus().outdent().run()

  const setTextColor = (color) => editor?.chain().focus().setColor(color).run()
  const unsetTextColor = () => editor?.chain().focus().unsetColor().run()
  const setHighlight = (color) => editor?.chain().focus().toggleHighlight({ color }).run()
  const unsetHighlight = () => editor?.chain().focus().unsetHighlight().run()

  // Hands the selected text to whoever owns the AI panel, together with the one
  // function that can write a revision back: the range is captured here, so the
  // replacement lands exactly where the student selected even after they have
  // clicked away into a modal.
  const requestAiEdit = () => {
    if (!editor) return

    const { from, to, empty } = editor.state.selection
    if (empty) return

    const text = editor.state.doc.textBetween(from, to, '\n')
    if (!text.trim()) return

    onAiEditRef.current?.({
      text,
      applyRevision: (revised) => {
        if (!revised?.trim()) return
        const end = Math.min(to, editor.state.doc.content.size)
        editor.chain().focus().insertContentAt({ from, to: end }, textToHtml(revised)).run()
      },
    })
  }

  // Opens whatever picker the caller provides, handing it the one function
  // that can write the chosen reference into the document. The insertion point
  // is wherever the cursor was, so the chip lands mid-sentence like any other
  // inline content.
  const requestReference = () => {
    if (!editor) return

    onPickReferenceRef.current?.({
      insertReference: ({ refId, label }) => {
        if (!refId) return
        editor.chain().focus().insertInlineReference({ refId, label }).run()
      },
    })
  }

  const clearFormatting = () => editor?.chain().focus().unsetAllMarks().run()
  const clearNodes = () => editor?.chain().focus().clearNodes().run()

  return {
    editor,
    fileInputRef, handleFileSelected,
    setLink, pickImage, insertMath, insertTable, requestAiEdit, requestReference,
    setBlockStyle, setFontFamily, setFontSize, indent, outdent,
    setTextColor, unsetTextColor, setHighlight, unsetHighlight,
    clearFormatting, clearNodes,
  }
}
