import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminSummaryNotes, fetchSummaryNoteDetail } from '@store/summaryNotes/action'
import { fetchTags } from '@store/tags/action'
import NoteModal from './components/NoteModal'
import SummaryNotesSettingsModal from './components/SummaryNotesSettingsModal'
import TagManagementModal from '../Exercise/components/TagManagementModal'
import Pagination from '@components/Pagination'
import {
  Container,
  Header,
  TitleSection,
  BackButton,
  Title,
  HeaderButtons,
  ActionButton,
  AddButton,
  FilterSection,
  FilterTitle,
  FilterGrid,
  FilterGroup,
  FilterLabel,
  FilterInput,
  FilterSelect,
  ClearButton,
  NotesGrid,
  NoteCard,
  NoteTitle,
  NoteDescription,
  NoteStatus,
  NoteMeta,
  TagsContainer,
  Tag,
  EmptyState,
  LoadingSpinner
} from './SummaryNotes.styles'

function SummaryNotes({ onBack }) {
  const dispatch = useDispatch()

  const { adminNotes, pagination, filters } = useSelector(state => state.summaryNotes)
  const { isAdminNotesLoading } = useSelector(state => state.summaryNotes.loading)
  const { tags } = useSelector(state => state.tags)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [noteToEdit, setNoteToEdit] = useState(null)
  const [localFilters, setLocalFilters] = useState({
    search: '',
    university: '',
    semester: '',
    status: ''
  })

  // Get unique universities and semesters from tags
  const universities = tags.filter(t => t.type === 'university')
  const semesters = tags.filter(t => t.type === 'semester')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(fetchAdminSummaryNotes(localFilters, currentPage, 30))
    dispatch(fetchTags())
  }, [dispatch, localFilters, currentPage])

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setLocalFilters({ search: '', university: '', semester: '', status: '' })
    setCurrentPage(1)
  }

  const handleOpenCreateModal = () => {
    setNoteToEdit(null)
    setIsModalOpen(true)
  }

  const handleNoteClick = async (note) => {
    try {
      const fullNote = await dispatch(fetchSummaryNoteDetail(note.id))
      setNoteToEdit(fullNote)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Failed to fetch note detail:', error)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setNoteToEdit(null)
  }

  const handleModalSuccess = () => {
    dispatch(fetchAdminSummaryNotes(localFilters, currentPage, 30))
    handleCloseModal()
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <Container>
      <Header>
        <TitleSection>
          <BackButton onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </BackButton>
          <Title>Kelola Ringkasan Materi</Title>
        </TitleSection>
        <HeaderButtons>
          <ActionButton
            onClick={() => setIsSettingsModalOpen(true)}
            variant="settings"
          >
            Pengaturan
          </ActionButton>
          <ActionButton
            onClick={() => setIsTagModalOpen(true)}
            variant="tag"
          >
            Kelola Tag
          </ActionButton>
          <AddButton onClick={handleOpenCreateModal}>
            + Buat Ringkasan Baru
          </AddButton>
        </HeaderButtons>
      </Header>

      <FilterSection>
        <FilterTitle>Filter Ringkasan</FilterTitle>
        <FilterGrid>
          <FilterGroup>
            <FilterLabel>Judul</FilterLabel>
            <FilterInput
              type="text"
              placeholder="Cari judul..."
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Universitas</FilterLabel>
            <FilterSelect
              value={localFilters.university}
              onChange={(e) => handleFilterChange('university', e.target.value)}
            >
              <option value="">Semua Universitas</option>
              {universities.map(uni => (
                <option key={uni.id} value={uni.name}>{uni.name}</option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Semester</FilterLabel>
            <FilterSelect
              value={localFilters.semester}
              onChange={(e) => handleFilterChange('semester', e.target.value)}
            >
              <option value="">Semua Semester</option>
              {semesters.map(sem => (
                <option key={sem.id} value={sem.name}>{sem.name}</option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <FilterSelect
              value={localFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </FilterSelect>
          </FilterGroup>

          {(localFilters.search || localFilters.university || localFilters.semester || localFilters.status) && (
            <ClearButton onClick={handleClearFilters}>
              Reset Filter
            </ClearButton>
          )}
        </FilterGrid>
      </FilterSection>

      {isAdminNotesLoading ? (
        <LoadingSpinner />
      ) : adminNotes.length === 0 ? (
        <EmptyState>
          <h3>Tidak ada ringkasan</h3>
          <p>Klik "Buat Ringkasan Baru" untuk menambahkan</p>
        </EmptyState>
      ) : (
        <>
          <NotesGrid>
            {adminNotes.map(note => (
              <NoteCard key={note.id} onClick={() => handleNoteClick(note)}>
                <NoteTitle>{note.title}</NoteTitle>
                {note.description && (
                  <NoteDescription>{note.description}</NoteDescription>
                )}
                <NoteStatus status={note.status}>
                  {note.status === 'published' ? 'Published' : 'Draft'}
                </NoteStatus>
                {note.tags && note.tags.length > 0 && (
                  <TagsContainer>
                    {note.tags.slice(0, 3).map(tag => (
                      <Tag key={tag.id} type={tag.type}>
                        {tag.name}
                      </Tag>
                    ))}
                    {note.tags.length > 3 && (
                      <Tag>+{note.tags.length - 3}</Tag>
                    )}
                  </TagsContainer>
                )}
                <NoteMeta>
                  {note.is_active ? 'Aktif' : 'Tidak Aktif'}
                </NoteMeta>
              </NoteCard>
            ))}
          </NotesGrid>

          <Pagination
            currentPage={currentPage}
            isLastPage={pagination.isLastPage}
            onPageChange={handlePageChange}
            isLoading={isAdminNotesLoading}
          />
        </>
      )}

      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        noteToEdit={noteToEdit}
        onSuccess={handleModalSuccess}
        tags={tags}
      />

      <SummaryNotesSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <TagManagementModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
      />
    </Container>
  )
}

export default SummaryNotes
