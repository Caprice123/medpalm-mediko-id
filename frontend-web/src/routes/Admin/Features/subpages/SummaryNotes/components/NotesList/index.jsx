import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import { formatLocalDate } from '@utils/dateUtils'
import EmptyState from '@components/common/EmptyState'
import StatusBadge from '@components/common/StatusBadge'
import {
  LoadingOverlay,
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
  CardActions
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
      <EmptyState
        icon="📝"
        title="No summary notes found"
        actionLabel={onCreateFirst && "Create Your First Summary Note"}
        onAction={onCreateFirst}
        actionVariant="primary"
      />
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

            <div style={{flex: "1"}}></div>

          {/* Topic Tags */}
          {note.topicTags && note.topicTags.length > 0 && (
            <TagList>
              {note.topicTags.map((tag) => (
                <Tag key={tag.id} topic>
                  🏥 {tag.name}
                </Tag>
              ))}
            </TagList>
          )}

          {/* Department Tags */}
          {note.departmentTags && note.departmentTags.length > 0 && (
            <TagList>
              {note.departmentTags.map((tag) => (
                <Tag key={tag.id} department>
                  🏨 {tag.name}
                </Tag>
              ))}
            </TagList>
          )}

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

          <NoteStats>
            <StatItem>
              <StatLabel>Status</StatLabel>
              <StatValue><StatusBadge status={note.status} /></StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Created</StatLabel>
              <StatValue>
                {formatLocalDate(note.createdAt)}
              </StatValue>
            </StatItem>
          </NoteStats>

          <CardActions>
            <Button variant="secondary" fullWidth onClick={() => onEdit(note)}>
              Edit
            </Button>
            <Button variant="danger" fullWidth onClick={(e) => {
              e.stopPropagation()
              onDelete(note)
            }}>
              Delete
            </Button>
          </CardActions>
        </NoteCard>
      ))}
    </NotesGrid>
  )
}

export default NotesList
