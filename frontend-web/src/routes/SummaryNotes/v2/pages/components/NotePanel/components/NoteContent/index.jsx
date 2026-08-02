import BlockNoteEditor from '@components/BlockNoteEditor'
import EmbedLoadingBanner from '@components/common/EmbedLoadingBanner'
import { SectionRow, SectionLabel, SectionLine } from '../../NotePanel.styles'
import { NoteTitle, NoteDescription, EditorWrapper } from './NoteContent.styles'

export default function NoteContent({ title, description, parsedContent }) {
  return (
    <>
      <SectionRow>
        <SectionLabel>📖 Ringkasan</SectionLabel>
        <SectionLine />
      </SectionRow>
      <NoteTitle>{title}</NoteTitle>
      {description && (
        <NoteDescription>{description}</NoteDescription>
      )}

      <SectionRow style={{ marginBottom: '1.25rem' }}>
        <SectionLabel>📄 Konten</SectionLabel>
        <SectionLine />
      </SectionRow>

      {parsedContent?.some(block => block.type === 'embed') && <EmbedLoadingBanner />}

      <EditorWrapper>
        <BlockNoteEditor
          initialContent={parsedContent}
          editable={false}
        />
      </EditorWrapper>
    </>
  )
}
