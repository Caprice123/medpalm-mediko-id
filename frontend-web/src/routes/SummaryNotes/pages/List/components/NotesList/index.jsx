import { useSelector } from 'react-redux'
import {
  LoadingOverlay,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  NotesGrid,
  NoteCard,
  NoteCardHeader,
  NoteCardTitle,
  NoteDescription,
  TagList,
  Tag,
  CardActions,
  CardActionButton
} from './NotesList.styles'
import { generatePath, useNavigate } from 'react-router-dom'
import { SummaryNotesRoute } from '../../../../routes'

function NotesList() {
  const { notes, loading } = useSelector((state) => state.summaryNotes)
  const navigate = useNavigate()

  // Loading state
  if (loading?.isNotesLoading) {
    return <LoadingOverlay>Memuat ringkasan...</LoadingOverlay>
  }

  // Empty state
  if (notes.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>📚</EmptyStateIcon>
        <EmptyStateText>Tidak ada ringkasan ditemukan</EmptyStateText>
      </EmptyState>
    )
  }

  // Data state - render notes grid
  return (
    <NotesGrid>
      {notes.map(note => (
        <NoteCard key={note.id}>
          <NoteCardHeader>
            <NoteCardTitle>{note.title}</NoteCardTitle>
          </NoteCardHeader>

          <NoteDescription>
            {note.description || 'Tidak ada deskripsi'}
          </NoteDescription>

          {/* University Tags */}
          {note.universityTags && note.universityTags.length > 0 && (
            <TagList>
              {note.universityTags.map((tag) => (
                <Tag key={tag.id} university>
                  🏛️ {tag.name}
                </Tag>
              ))}
            </TagList>
          )}

          {/* Semester Tags */}
          {note.semesterTags && note.semesterTags.length > 0 && (
            <TagList>
              {note.semesterTags.map((tag) => (
                <Tag key={tag.id} semester>
                  📚 {tag.name}
                </Tag>
              ))}
            </TagList>
          )}

          <div style={{flex: "1"}}></div>

          <CardActions>
            <CardActionButton onClick={() => navigate(generatePath(SummaryNotesRoute.detailRoute, { id: note.id }))}>
              Lihat Ringkasan
            </CardActionButton>
          </CardActions>
        </NoteCard>
      ))}
    </NotesGrid>
  )
}

export default NotesList
