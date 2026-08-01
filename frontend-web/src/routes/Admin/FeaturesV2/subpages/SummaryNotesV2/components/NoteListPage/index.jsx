import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminSummaryNotesV2, fetchAdminSummaryNoteDetailV2, deleteSummaryNoteV2 } from '@store/summaryNotes/v2/adminAction'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import CreateNoteModalV2 from '../CreateNoteModalV2'
import NoteDetailPage from '../NoteDetailPage'
import {
  Container, Header, HeaderLeft,
  Breadcrumb, BreadcrumbLink, BreadcrumbSep, BreadcrumbCurrent,
  PageTitle,
} from '../../SummaryNotesV2.styles'

export default function NoteListPage({ node, parentNode, onBack, onGoToRoot }) {
  const dispatch = useDispatch()
  const { notes, loading } = useSelector(s => s.summaryNotesV2)

  const [selectedNote, setSelectedNote] = useState(null)
  const [creatingNote, setCreatingNote] = useState(false)

  const refetch = () => dispatch(fetchAdminSummaryNotesV2({ nodeId: node.id, perPage: 1, page: 1 }))

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, node.id])

  useEffect(() => {
    setSelectedNote(null)
  }, [node.id])

  const isLoading = loading?.isAdminNotesLoading
  const note = !isLoading && notes.length > 0 ? notes[0] : null

  const handleKelola = async () => {
    await dispatch(fetchAdminSummaryNoteDetailV2(note.uniqueId))
    setSelectedNote(note)
  }

  const handleDelete = async () => {
    if (!window.confirm(`Hapus ringkasan "${note.title}"?`)) return
    await dispatch(deleteSummaryNoteV2(note.uniqueId))
    refetch()
  }

  const handleBackFromDetail = () => {
    setSelectedNote(null)
    refetch()
  }

  if (selectedNote) {
    return <NoteDetailPage note={selectedNote} onBack={handleBackFromDetail} />
  }

  return (
    <Container>
      <div>
        <Breadcrumb>
          <BreadcrumbLink onClick={onGoToRoot}>Summary Notes V2</BreadcrumbLink>
          <BreadcrumbSep>›</BreadcrumbSep>
          <BreadcrumbLink onClick={onBack}>{parentNode.name}</BreadcrumbLink>
          <BreadcrumbSep>›</BreadcrumbSep>
          <BreadcrumbCurrent>{node.name}</BreadcrumbCurrent>
        </Breadcrumb>
        <Header>
          <HeaderLeft>
            <Button variant="secondary" onClick={onBack}>← Kembali</Button>
            <PageTitle>Ringkasan Notes</PageTitle>
          </HeaderLeft>
        </Header>
      </div>

      {isLoading ? (
        <EmptyState icon="⏳" title="Memuat..." />
      ) : note ? (
        <EmptyState
          icon="📖"
          title={note.title}
          description={`Status: ${note.status}`}
          customAction={(
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="primary" onClick={handleKelola}>Kelola Ringkasan</Button>
              <Button variant="danger" onClick={handleDelete}>Hapus</Button>
            </div>
          )}
        />
      ) : (
        <EmptyState
          icon="📖"
          title="Belum ada ringkasan"
          description={`Sub-topik "${node.name}" belum memiliki ringkasan.`}
          actionLabel="+ Buat Ringkasan"
          onAction={() => setCreatingNote(true)}
        />
      )}

      {creatingNote && (
        <CreateNoteModalV2
          nodeId={node.id}
          nodeName={node.name}
          onClose={async (createdNote) => {
            setCreatingNote(false)
            if (createdNote?.uniqueId) {
              await dispatch(fetchAdminSummaryNoteDetailV2(createdNote.uniqueId))
              setSelectedNote(createdNote)
            } else {
              refetch()
            }
          }}
        />
      )}
    </Container>
  )
}
