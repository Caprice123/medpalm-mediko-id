import { useSelector } from 'react-redux'
import {
  LoadingOverlay,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  ActionButton,
  NotesGrid,
  NoteCard,
  NoteCardHeader,
  NoteCardTitle,
  NoteDescription,
  TagList,
  Tag,
  NoteStats,
  StatItem,
  StatLabel,
  StatValue,
  CardActions,
  EditButton,
  DeleteButton
} from './NotesList.styles'

function NotesList({ onEdit, onDelete, onCreateFirst }) {
  const { notes, loading } = useSelector((state) => state.summaryNotes)

  // Loading state
  if (loading?.isAdminNotesLoading) {
    return <LoadingOverlay>Loading notes...</LoadingOverlay>
  }

  // Empty state
  if (notes.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>📝</EmptyStateIcon>
        <EmptyStateText>No summary notes found</EmptyStateText>
        {onCreateFirst && (
          <ActionButton onClick={onCreateFirst}>
            Create Your First Summary Note
          </ActionButton>
        )}
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

          <div style={{ flex: "1" }}></div>

          <NoteStats>
            <StatItem>
              <StatLabel>Status</StatLabel>
              <StatValue>{note.is_active ? 'Active' : 'Inactive'}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Created</StatLabel>
              <StatValue>
                {new Date(note.createdAt).toLocaleDateString("id-ID")}
              </StatValue>
            </StatItem>
          </NoteStats>

          <CardActions>
            <EditButton onClick={() => onEdit(note)}>
              Edit
            </EditButton>
            <DeleteButton onClick={(e) => {
              e.stopPropagation()
              onDelete(note)
            }}>
              Delete
            </DeleteButton>
          </CardActions>
        </NoteCard>
      ))}
    </NotesGrid>
  )
}

export default NotesList
