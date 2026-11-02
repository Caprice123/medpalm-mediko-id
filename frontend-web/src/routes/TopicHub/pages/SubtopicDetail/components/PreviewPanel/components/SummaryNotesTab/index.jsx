import BlockNoteEditor from '@components/BlockNoteEditor'
import Loading from '@components/common/Loading'
import { CountLabel } from '../../PreviewPanel.styles'
import {
  NoteItem, NoteIcon, NoteInfo, NoteTitle, NoteReadTime, NoteExtLink,
  NoteDetailHeader, OpenFullBtn, NoteDetailTitle, NoteEditorWrap,
} from './SummaryNotesTab.styles'
import { useSummaryNotesTab } from './hooks/useSummaryNotesTab'

export default function SummaryNotesTab({ subtopic }) {
  const {
    notes, isLoadingNotes, selectedNote, noteDetail, noteDetailLoading,
    parsedContent, handleNoteClick,
  } = useSummaryNotesTab(subtopic)

  // the list fetch decides whether a note opens straight away, so stay on the
  // spinner until it resolves rather than showing the empty state first
  if (isLoadingNotes) {
    return <Loading size="small" text="Memuat catatan..." padding="2rem 0" />
  }

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
        <Loading size="small" text="Memuat catatan..." padding="2rem 0" />
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
