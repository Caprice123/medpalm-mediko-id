import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAdminSummaryNotes, fetchSummaryNoteDetail } from '@store/summaryNotes/action'
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
  BackButton,
  HeaderContent,
  TitleSection,
  Title,
  Actions,
  ActionButton
} from './SummaryNotes.styles'
import { Filter } from './components/Filter'

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
    dispatch(fetchTags())
  }, [dispatch])

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAdminSummaryNotes())
  }

  const handleEditNote = async (note) => {
    try {
      await dispatch(fetchSummaryNoteDetail(note.id))
      setUiState({
        ...uiState,
        isModalOpen: true,
        mode: 'update'
      })
    } catch (error) {
      console.error('Failed to fetch note detail:', error)
    }
  }

  const handleCloseModal = () => {
    setUiState(prev => ({ ...prev, isModalOpen: false, mode: null }))
    dispatch(actions.setSelectedNote(null))
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>← Back</BackButton>
        <HeaderContent>
          <TitleSection>
            <Title>Kelola Ringkasan Materi</Title>
          </TitleSection>
          <Actions>
            <ActionButton secondary onClick={() => setUiState({ ...uiState, isSettingsModalOpen: true })}>
              Pengaturan
            </ActionButton>
            <ActionButton onClick={() => setUiState({ ...uiState, isModalOpen: true, mode: 'create' })}>
              + Tambah Ringkasan Baru
            </ActionButton>
          </Actions>
        </HeaderContent>
      </Header>

      <Filter />

      <NotesList
        onEdit={handleEditNote}
        onCreateFirst={() => setUiState({ ...uiState, isModalOpen: true, mode: 'create' })}
      />

      <Pagination
        currentPage={pagination.page}
        isLastPage={pagination.isLastPage}
        onPageChange={handlePageChange}
        isLoading={loading.isAdminNotesLoading}
        variant="admin"
        language="id"
      />

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
