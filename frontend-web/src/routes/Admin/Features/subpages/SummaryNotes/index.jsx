import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAdminSummaryNotes, fetchSummaryNoteDetail, deleteSummaryNote } from '@store/summaryNotes/action'
import { actions } from '@store/summaryNotes/reducer'
import { fetchTags } from '@store/tags/action'
import CreateNoteModal from './components/CreateNoteModal'
import UpdateNoteModal from './components/UpdateNoteModal'
import SummaryNotesSettingsModal from './components/SummaryNotesSettingsModal'
import NotesList from './components/NotesList'
import Pagination from '@components/Pagination'
import {
  Container,
  Header,
  HeaderContent,
  TitleSection,
  Title,
  Actions,
} from './SummaryNotes.styles'
import Button from '@components/common/Button'
import { Filter } from './components/Filter'
import { actions as tagActions } from "@store/tags/reducer"

function SummaryNotes({ onBack }) {
  const dispatch = useDispatch()
  const { pagination, loading } = useSelector(state => state.summaryNotes)

  const [uiState, setUiState] = useState({
    isModalOpen: false,
    mode: null, // 'create' or 'update'
    isSettingsModalOpen: false
  })

  useEffect(() => {
    dispatch(fetchAdminSummaryNotes({}, 1, 30))
    dispatch(tagActions.updateFilter({ key: "tagGroupNames", value: ["university", "semester", "topic", "department"]}))
    dispatch(fetchTags())
  }, [dispatch])

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAdminSummaryNotes())
  }

  const handleEditNote = async (note) => {
    try {
      await dispatch(fetchSummaryNoteDetail(note.uniqueId))
      setUiState({
        ...uiState,
        isModalOpen: true,
        mode: 'update'
      })
    } catch (error) {
      console.error('Failed to fetch note detail:', error)
    }
  }

  const handleDeleteNote = async (note) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus "${note.title}"?`)) {
      return
    }

    try {
      await dispatch(deleteSummaryNote(note.id))
      await dispatch(fetchAdminSummaryNotes({}, pagination.page, 30))
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  const handleCloseModal = () => {
    setUiState(prev => ({ ...prev, isModalOpen: false, mode: null }))
    dispatch(actions.setSelectedNote(null))
  }

  return (
    <Container>
      <Header>
        <Button variant="secondary" onClick={onBack}>← Kembali</Button>
        <HeaderContent>
          <TitleSection>
            <Title>Kelola Ringkasan Materi</Title>
          </TitleSection>
          <Actions>
            <Button variant="secondary" onClick={() => setUiState({ ...uiState, isSettingsModalOpen: true })}>
              Pengaturan
            </Button>
            <Button variant="primary" onClick={() => setUiState({ ...uiState, isModalOpen: true, mode: 'create' })}>
              + Tambah Ringkasan Baru
            </Button>
          </Actions>
        </HeaderContent>
      </Header>

      <Filter />

      <NotesList
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
        onCreateFirst={() => setUiState({ ...uiState, isModalOpen: true, mode: 'create' })}
      />

      {(pagination.page > 1 || (pagination.page === 1 && !pagination.isLastPage)) && (
        <Pagination
          currentPage={pagination.page}
          isLastPage={pagination.isLastPage}
          onPageChange={handlePageChange}
          isLoading={loading.isAdminNotesLoading}
          variant="admin"
          language="id"
        />
      )}

      {uiState.isModalOpen && uiState.mode === 'create' && (
        <CreateNoteModal onClose={handleCloseModal} />
      )}

      {uiState.isModalOpen && uiState.mode === 'update' && (
        <UpdateNoteModal onClose={handleCloseModal} />
      )}

      {uiState.isSettingsModalOpen && (
        <SummaryNotesSettingsModal
          isOpen={uiState.isSettingsModalOpen}
          onClose={() => setUiState(prev => ({ ...prev, isSettingsModalOpen: false }))}
        />
      )}
    </Container>
  )
}

export default SummaryNotes
