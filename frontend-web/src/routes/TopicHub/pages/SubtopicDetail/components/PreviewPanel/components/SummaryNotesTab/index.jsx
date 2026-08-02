import BlockNoteEditor from '@components/BlockNoteEditor'
import { CountLabel } from '../../PreviewPanel.styles'
import {
  NoteItem, NoteIcon, NoteInfo, NoteTitle, NoteReadTime, NoteExtLink,
  NoteDetailHeader, OpenFullBtn, NoteDetailTitle, NoteEditorWrap,
} from './SummaryNotesTab.styles'
import { useSummaryNotesTab } from './hooks/useSummaryNotesTab'

export default function SummaryNotesTab({ subtopic }) {
  const { notes, selectedNote, noteDetail, noteDetailLoading, parsedContent, handleNoteClick } = useSummaryNotesTab(subtopic)

  if (!selectedNote) {
    return notes.length === 0
      ? <CountLabel>Tidak ada catatan tersedia.</CountLabel>
      : notes.map(note => (
        <NoteItem key={note.id} onClick={() => handleNoteClick(note)}>
          <NoteIcon>📖</NoteIcon>
          <NoteInfo>
            <NoteTitle>{note.title}</NoteTitle>
            <NoteReadTime>{note.readingMinutes} menit baca</NoteReadTime>
          </NoteInfo>
          <NoteExtLink>↗</NoteExtLink>
        </NoteItem>
      ))
  }

  return (
    <>
      <NoteDetailHeader>
        <OpenFullBtn href={`/summary-notes/${selectedNote.uniqueId}`} target="_blank" rel="noopener noreferrer">
          Buka Penuh ↗
        </OpenFullBtn>
      </NoteDetailHeader>
      {noteDetailLoading ? (
        <CountLabel style={{ marginTop: '1rem' }}>Memuat...</CountLabel>
      ) : noteDetail ? (
        <>
          <NoteDetailTitle>{noteDetail.title}</NoteDetailTitle>
          <NoteEditorWrap>
            {parsedContent && (
              <BlockNoteEditor initialContent={parsedContent} editable={false} />
            )}
          </NoteEditorWrap>
        </>
      ) : null}
    </>
  )
}
