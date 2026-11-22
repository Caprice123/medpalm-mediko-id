import { EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import {
  FaUndo, FaRedo, FaBold, FaItalic, FaStrikethrough, FaUnderline, FaCode,
  FaHighlighter, FaAlignLeft, FaAlignCenter, FaAlignRight, FaListUl, FaListOl,
  FaQuoteRight, FaMinus, FaTable, FaLink, FaImage, FaAnchor,
  FaAlignJustify, FaIndent, FaOutdent,
} from 'react-icons/fa'
import { TbMathFunction, TbClearFormatting, TbEraser, TbSparkles } from 'react-icons/tb'
import ColorPickerButton from './components/ColorPickerButton'
import {
  useRichTextEditor, TEXT_COLORS, HIGHLIGHT_COLORS,
  BLOCK_STYLES, FONT_FAMILIES, FONT_SIZES, DEFAULT_FONT_FAMILY,
} from './hooks/useRichTextEditor'
import {
  EditorShell, Toolbar, ToolbarGroup, ToolbarButton, ToolbarDivider, ToolbarSelect,
  EditorSurface, TextColorGlyph, AiEditBubble,
} from './RichTextEditor.styles'
import 'katex/dist/katex.min.css'

// `onAiEdit` is optional: without it the editor behaves exactly as it always
// has. With it, selecting text offers one button, and the caller decides what
// an AI edit looks like — it receives the selected text plus the function that
// writes a revision back over it.
// `onPickReference` is optional in the same way `onAiEdit` is: supply it and
// the toolbar gains a button that opens the caller's own picker, and the
// chosen reference is written into the text as a chip. `resolveReference` keeps
// those chips named correctly as things are renamed or deleted, and
// `onOpenReference` is what a click on one does.
export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled,
  minHeight,
  uploadFolder,
  onAiEdit,
  onPickReference,
  resolveReference,
  onOpenReference,
}) {
  const {
    editor,
    fileInputRef, handleFileSelected,
    setLink, pickImage, insertMath, insertTable, requestAiEdit, requestReference,
    setBlockStyle, setFontFamily, setFontSize, indent, outdent,
    setTextColor, unsetTextColor, setHighlight, unsetHighlight,
    clearFormatting, clearNodes,
  } = useRichTextEditor({
    value,
    onChange,
    placeholder,
    disabled,
    uploadFolder,
    onAiEdit,
    onPickReference,
    resolveReference,
    onOpenReference,
  })

  if (!editor) return null

  const can = editor.can().chain().focus()

  const activeBlockStyle = BLOCK_STYLES
    .find(style => style.value && editor.isActive('heading', { level: Number(style.value) }))?.value || ''

  // Text pasted from elsewhere can carry a face or size that is on neither
  // list. Rather than show the wrong row as selected, the face falls back to
  // the document's default and the size to Auto.
  const textStyle = editor.getAttributes('textStyle') || {}
  const activeFont = FONT_FAMILIES.some(font => font.value === textStyle.fontFamily)
    ? textStyle.fontFamily
    : DEFAULT_FONT_FAMILY
  const activeSize = FONT_SIZES.includes(String(textStyle.fontSize || '').replace('pt', ''))
    ? String(textStyle.fontSize).replace('pt', '')
    : ''

  return (
    <EditorShell $disabled={disabled}>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarButton type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!can.undo().run()} title="Undo"><FaUndo /></ToolbarButton>
          <ToolbarButton type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!can.redo().run()} title="Redo"><FaRedo /></ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarSelect
            $width="7rem"
            value={activeBlockStyle}
            onChange={(event) => setBlockStyle(event.target.value)}
            title="Gaya paragraf"
            aria-label="Gaya paragraf"
          >
            {BLOCK_STYLES.map(style => (
              <option key={style.label} value={style.value}>{style.label}</option>
            ))}
          </ToolbarSelect>
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarSelect
            value={activeFont}
            onChange={(event) => setFontFamily(event.target.value)}
            title="Jenis huruf"
            aria-label="Jenis huruf"
          >
            {FONT_FAMILIES.map(font => (
              <option key={font.label} value={font.value}>{font.label}</option>
            ))}
          </ToolbarSelect>

          <ToolbarSelect
            $width="4.25rem"
            value={activeSize}
            onChange={(event) => setFontSize(event.target.value)}
            title="Ukuran huruf"
            aria-label="Ukuran huruf"
          >
            <option value="">Auto</option>
            {FONT_SIZES.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </ToolbarSelect>
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton type="button" $active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Tebal"><FaBold /></ToolbarButton>
          <ToolbarButton type="button" $active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Miring"><FaItalic /></ToolbarButton>
          <ToolbarButton type="button" $active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Coret"><FaStrikethrough /></ToolbarButton>
          <ToolbarButton type="button" $active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Garis bawah"><FaUnderline /></ToolbarButton>
          <ToolbarButton type="button" $active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} title="Kode inline"><FaCode /></ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ColorPickerButton
            icon={<FaHighlighter />}
            title="Sorot teks"
            colors={HIGHLIGHT_COLORS}
            activeColor={editor.getAttributes('highlight')?.color}
            onPick={setHighlight}
            onClear={unsetHighlight}
          />
          <ColorPickerButton
            icon={<TextColorGlyph>A</TextColorGlyph>}
            title="Warna teks"
            colors={TEXT_COLORS}
            activeColor={editor.getAttributes('textStyle')?.color}
            onPick={setTextColor}
            onClear={unsetTextColor}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton type="button" $active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Rata kiri"><FaAlignLeft /></ToolbarButton>
          <ToolbarButton type="button" $active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Rata tengah"><FaAlignCenter /></ToolbarButton>
          <ToolbarButton type="button" $active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Rata kanan"><FaAlignRight /></ToolbarButton>
          <ToolbarButton type="button" $active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()} title="Rata kiri-kanan"><FaAlignJustify /></ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton type="button" $active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Daftar poin"><FaListUl /></ToolbarButton>
          <ToolbarButton type="button" $active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Daftar bernomor"><FaListOl /></ToolbarButton>
          <ToolbarButton type="button" onClick={indent} title="Tambah indentasi (Ctrl+])"><FaIndent /></ToolbarButton>
          <ToolbarButton type="button" onClick={outdent} title="Kurangi indentasi (Ctrl+[)"><FaOutdent /></ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton type="button" $active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Blok kode"><FaCode /></ToolbarButton>
          <ToolbarButton type="button" $active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Kutipan"><FaQuoteRight /></ToolbarButton>
          <ToolbarButton type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Garis pemisah"><FaMinus /></ToolbarButton>
          <ToolbarButton type="button" onClick={insertTable} title="Sisipkan tabel 3×3"><FaTable /></ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton type="button" $active={editor.isActive('link')} onClick={setLink} title="Tautan"><FaLink /></ToolbarButton>
          <ToolbarButton type="button" onClick={pickImage} title={uploadFolder ? 'Unggah gambar' : 'Gambar dari URL'}><FaImage /></ToolbarButton>
          <ToolbarButton type="button" onClick={insertMath} title="Rumus LaTeX"><TbMathFunction /></ToolbarButton>
          {onPickReference && (
            <ToolbarButton type="button" onClick={requestReference} title="Rujuk bagian lain"><FaAnchor /></ToolbarButton>
          )}
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton type="button" onClick={clearFormatting} title="Hapus format teks"><TbClearFormatting /></ToolbarButton>
          <ToolbarButton type="button" onClick={clearNodes} title="Hapus gaya paragraf"><TbEraser /></ToolbarButton>
        </ToolbarGroup>
      </Toolbar>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />

      {onAiEdit && (
        <BubbleMenu
          editor={editor}
          pluginKey="aiEditBubble"
          options={{
            placement: 'top-start',
            offset: 8,
            // The toolbar is sticky at the top of this editor, so above a
            // selection in the first visible line is exactly where the toolbar
            // is. Padding the flip boundary by a toolbar's height sends the
            // bubble below the selection there instead of behind the buttons.
            flip: { padding: { top: 76 } },
            shift: { padding: 8 },
          }}
          shouldShow={({ editor: instance, state, from, to }) => (
            instance.isEditable
            && !state.selection.empty
            && Boolean(state.doc.textBetween(from, to, ' ').trim())
          )}
        >
          <AiEditBubble type="button" onClick={requestAiEdit}>
            <TbSparkles /> Edit dengan AI
          </AiEditBubble>
        </BubbleMenu>
      )}

      <EditorSurface $minHeight={minHeight}>
        <EditorContent editor={editor} />
      </EditorSurface>
    </EditorShell>
  )
}
