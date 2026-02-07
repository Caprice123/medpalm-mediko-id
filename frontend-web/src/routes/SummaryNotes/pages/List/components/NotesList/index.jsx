import { useSelector } from 'react-redux'
import { Card, CardHeader, CardBody } from '@components/common/Card'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import { SummaryNoteSkeletonGrid } from '@components/common/SkeletonCard'
import {
  NotesGrid,
  NoteDescription,
  TagList,
  Tag,
  UpdatedText
} from './NotesList.styles'
import { generatePath, useNavigate } from 'react-router-dom'
import { SummaryNotesRoute } from '../../../../routes'

function NotesList() {
  const { notes, loading } = useSelector((state) => state.summaryNotes)
  const navigate = useNavigate()

  // Loading state
  if (loading?.isNotesLoading) {
    return <SummaryNoteSkeletonGrid count={6} />
  }

  // Empty state
  if (notes.length === 0) {
    return (
      <EmptyState
        icon="📚"
        title="Tidak ada ringkasan ditemukan"
      />
    )
  }

  // Data state - render notes grid
  return (
    <NotesGrid>
      {notes.map(note => (
        <Card key={note.id} shadow hoverable>
          <CardHeader title={note.title} divider={false} />

          <CardBody padding="0 1.25rem 1.25rem 1.25rem">
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

            {/* Topic Tags */}
            {note.topicTags && note.topicTags.length > 0 && (
              <TagList>
                {note.topicTags.map((tag) => (
                  <Tag key={tag.id} topic>
                    🔬 {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            {/* Department Tags */}
            {note.departmentTags && note.departmentTags.length > 0 && (
              <TagList>
                {note.departmentTags.map((tag) => (
                  <Tag key={tag.id} department>
                    🏥 {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            <div style={{flex: 1}}></div>

            <UpdatedText>
              Terakhir diperbarui: {new Date(note.updatedAt).toLocaleDateString("id-ID", {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </UpdatedText>

            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate(generatePath(SummaryNotesRoute.detailRoute, { id: note.id }))}
            >
              Lihat Ringkasan
            </Button>
          </CardBody>
        </Card>
      ))}
    </NotesGrid>
  )
}

export default NotesList
