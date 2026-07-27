import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminSummaryNotesV2, fetchAdminSummaryNoteDetailV2, deleteSummaryNoteV2 } from '@store/summaryNotes/v2/adminAction'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import TextInput from '@components/common/TextInput'
import CreateNoteModalV2 from '../CreateNoteModalV2'
import NoteDetailPage from '../NoteDetailPage'
import AssignNodeModal from '../AssignNodeModal'
import {
  Container, Header, HeaderLeft,
  Breadcrumb, BreadcrumbLink, BreadcrumbSep, BreadcrumbCurrent,
  PageTitle, NoteStatusBadge, NoteActions,
} from '../../SummaryNotesV2.styles'

const PER_PAGE = 50

export default function UnlinkedNotesPage({ onBack }) {
  const dispatch = useDispatch()
  const { notes, loading, pagination } = useSelector(s => s.summaryNotesV2)

  const [selectedNote, setSelectedNote] = useState(null)
  const [creatingNote, setCreatingNote] = useState(false)
  const [assignNote, setAssignNote] = useState(null)
  const [search, setSearch] = useState('')
  const [searchCommitted, setSearchCommitted] = useState('')
  const [page, setPage] = useState(1)

  const refetch = (p = 1, append = false) => {
    dispatch(fetchAdminSummaryNotesV2({ unassigned: true, search: searchCommitted, perPage: PER_PAGE, page: p, append }))
  }

  useEffect(() => {
    setPage(1)
    refetch(1)
  }, [dispatch, searchCommitted])

  const handleEdit = async (note) => {
    await dispatch(fetchAdminSummaryNoteDetailV2(note.uniqueId))
    setSelectedNote(note)
  }

  const handleDelete = async (note) => {
    if (!window.confirm(`Hapus ringkasan "${note.title}"?`)) return
    await dispatch(deleteSummaryNoteV2(note.uniqueId))
    setPage(1)
    refetch(1)
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    refetch(nextPage, true)
  }

  const handleBackFromDetail = () => {
    setSelectedNote(null)
    setPage(1)
    refetch(1)
  }

  if (selectedNote) {
    return <NoteDetailPage note={selectedNote} onBack={handleBackFromDetail} />
  }

  const isLoading = loading?.isAdminNotesLoading

  const columns = [
    {
      header: 'Judul',
      render: (note) => (
        <div>
          <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{note.title}</div>
          {note.description && (
            <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.125rem' }}>{note.description}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      width: '110px',
      render: (note) => <NoteStatusBadge $status={note.status}>{note.status}</NoteStatusBadge>,
    },
    {
      header: 'Aksi',
      width: '200px',
      render: (note) => (
        <NoteActions>
          <Button size="small" variant="secondary" onClick={() => setAssignNote(note)}>Pindah</Button>
          <Button size="small" variant="primary" onClick={() => handleEdit(note)}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(note)}>Hapus</Button>
        </NoteActions>
      ),
    },
  ]

  return (
    <Container>
      <div>
        <Breadcrumb>
          <BreadcrumbLink onClick={onBack}>Summary Notes V2</BreadcrumbLink>
          <BreadcrumbSep>›</BreadcrumbSep>
          <BreadcrumbCurrent>Belum Ditugaskan</BreadcrumbCurrent>
        </Breadcrumb>
        <Header>
          <HeaderLeft>
            <Button variant="secondary" onClick={onBack}>← Kembali</Button>
            <PageTitle>Ringkasan Tidak Terhubung</PageTitle>
          </HeaderLeft>
          <Button variant="primary" onClick={() => setCreatingNote(true)}>+ Tambah</Button>
        </Header>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <TextInput
          placeholder="Cari judul ringkasan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') setSearchCommitted(search.trim())
            if (e.key === 'Escape') { setSearch(''); setSearchCommitted('') }
          }}
          style={{ flex: 1 }}
        />
        <Button variant="secondary" onClick={() => setSearchCommitted(search.trim())}>Cari</Button>
      </div>

      <Table
        columns={columns}
        data={notes}
        loading={isLoading}
        hoverable
        emptyText="Semua ringkasan sudah ditugaskan ke sub-topik"
        emptySubtext=""
      />

      {!pagination?.isLastPage && (
        <div style={{ paddingTop: '0.5rem' }}>
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={handleLoadMore}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Memuat...' : 'Muat Lebih Banyak'}
          </Button>
        </div>
      )}

      {creatingNote && (
        <CreateNoteModalV2
          nodeId={null}
          onClose={async (createdNote) => {
            setCreatingNote(false)
            if (createdNote?.uniqueId) {
              await dispatch(fetchAdminSummaryNoteDetailV2(createdNote.uniqueId))
              setSelectedNote(createdNote)
            } else {
              setPage(1)
              refetch(1)
            }
          }}
        />
      )}

      {assignNote && (
        <AssignNodeModal
          note={assignNote}
          onClose={() => setAssignNote(null)}
          onSuccess={() => {
            setAssignNote(null)
            setPage(1)
            refetch(1)
          }}
        />
      )}
    </Container>
  )
}
