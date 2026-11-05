import { EditorContent } from '@tiptap/react'
import {
  FaUndo, FaRedo, FaBold, FaItalic, FaStrikethrough, FaUnderline, FaCode,
  FaHighlighter, FaAlignLeft, FaAlignCenter, FaAlignRight, FaListUl, FaListOl,
  FaQuoteRight, FaMinus, FaTable, FaLink, FaImage,
} from 'react-icons/fa'
import { TbMathFunction, TbClearFormatting, TbEraser } from 'react-icons/tb'
import ColorPickerButton from './components/ColorPickerButton'
import { useRichTextEditor, TEXT_COLORS, HIGHLIGHT_COLORS } from './hooks/useRichTextEditor'
import {
  EditorShell, Toolbar, ToolbarGroup, ToolbarButton, ToolbarDivider,
  EditorSurface, HeadingLabel, TextColorGlyph,
} from './RichTextEditor.styles'
import 'katex/dist/katex.min.css'

export default function RichTextEditor({ value, onChange, placeholder, disabled, minHeight, uploadFolder }) {
  const {
    editor,
    fileInputRef, handleFileSelected,
    setLink, pickImage, insertMath, insertTable,
    setTextColor, unsetTextColor, setHighlight, unsetHighlight,
    clearFormatting, clearNodes,
  } = useRichTextEditor({ value, onChange, placeholder, disabled, uploadFolder })

  if (!editor) return null

  const can = editor.can().chain().focus()

  return (
    <EditorShell $disabled={disabled}>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarButton type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!can.undo().run()} title="Undo"><FaUndo /></ToolbarButton>
          <ToolbarButton type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!can.redo().run()} title="Redo"><FaRedo /></ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          {[1, 2, 3].map(level => (
            <ToolbarButton
              key={level}
              type="button"
              $active={editor.isActive('heading', { level })}
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
              title={`Judul ${level}`}
            >
              <HeadingLabel>H{level}</HeadingLabel>
            </ToolbarButton>
          ))}
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
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton type="button" $active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Daftar poin"><FaListUl /></ToolbarButton>
          <ToolbarButton type="button" $active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Daftar bernomor"><FaListOl /></ToolbarButton>
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

      <EditorSurface $minHeight={minHeight}>
        <EditorContent editor={editor} />
      </EditorSurface>
    </EditorShell>
  )
}
