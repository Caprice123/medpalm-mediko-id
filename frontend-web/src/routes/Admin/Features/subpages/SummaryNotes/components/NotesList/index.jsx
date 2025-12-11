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
  StatusBadge,
  NoteDescription,
  TagList,
  Tag,
  NoteStats,
  StatItem,
  StatLabel,
  StatValue
} from './NotesList.styles'

function NotesList({ onEdit, onCreateFirst }) {
  const { adminNotes, loading } = useSelector((state) => state.summaryNotes)

  // Loading state
  if (loading?.isAdminNotesLoading) {
    return <LoadingOverlay>Loading notes...</LoadingOverlay>
  }

  // Empty state
  if (adminNotes.length === 0) {
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
      {adminNotes.map(note => (
        <NoteCard key={note.id} onClick={() => onEdit(note)}>
          <NoteCardHeader>
            <NoteCardTitle>{note.title}</NoteCardTitle>
            <StatusBadge published={note.status === 'published'}>
              {note.status === 'published' ? 'Published' : 'Draft'}
            </StatusBadge>
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
                {new Date(note.created_at).toLocaleDateString("id-ID")}
              </StatValue>
            </StatItem>
          </NoteStats>
        </NoteCard>
      ))}
    </NotesGrid>
  )
}

export default NotesList
