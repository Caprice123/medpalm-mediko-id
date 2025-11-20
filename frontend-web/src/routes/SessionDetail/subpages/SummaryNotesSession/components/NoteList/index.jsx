import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchSummaryNotes, startSummaryNoteSession } from '@store/summaryNotes/action'
import { fetchTags } from '@store/tags/action'
import {
  Container,
  Header,
  BackButton,
  HeaderContent,
  Title,
  Subtitle,
  CreditInfo,
  ContentContainer,
  FilterSection,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  FilterInput,
  SearchButton,
  NotesGrid,
  NoteCard,
  NoteHeader,
  NoteTitle,
  NoteDescription,
  TagsContainer,
  Tag,
  NoteFooter,
  SelectButton,
  EmptyState,
  LoadingContainer,
  LoadingSpinner,
  PaginationContainer,
  PaginationButton,
  PaginationInfo
} from './NoteList.styles'

function NoteList({ sessionId, onNoteSelected }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { notes, pagination } = useSelector(state => state.summaryNotes)
  const { isNotesLoading, isStartingSession } = useSelector(state => state.summaryNotes.loading)
  const { balance } = useSelector(state => state.credit)
  const { tags } = useSelector(state => state.tags)

  const [localFilters, setLocalFilters] = useState({
    search: '',
    university: '',
    semester: ''
  })

  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    university: '',
    semester: ''
  })

  const [currentPage, setCurrentPage] = useState(1)

  // Get unique universities and semesters from tags
  const universities = tags.filter(t => t.type === 'university')
  const semesters = tags.filter(t => t.type === 'semester')

  useEffect(() => {
    dispatch(fetchSummaryNotes(appliedFilters, currentPage, 12))
    dispatch(fetchTags())
  }, [dispatch, appliedFilters, currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    setAppliedFilters({ ...localFilters })
    setCurrentPage(1)
  }

  const handleStartSession = async (note) => {
    try {
      await dispatch(startSummaryNoteSession(sessionId, note.id))
      onNoteSelected()
    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }


  return (
    <Container>
      <Header>
        <HeaderContent>
          <BackButton onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </BackButton>
          <div>
            <Title>Pilih Ringkasan Materi</Title>
            <Subtitle>Pilih materi yang ingin Anda pelajari</Subtitle>
          </div>
        </HeaderContent>
        <CreditInfo>
          💎 {balance || 0} Kredit
        </CreditInfo>
      </Header>

      <ContentContainer>
        <FilterSection>
          <FilterGroup>
            <FilterLabel>Nama</FilterLabel>
            <FilterInput
              type="text"
              placeholder="Cari nama ringkasan..."
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

          <SearchButton onClick={handleSearch} disabled={isNotesLoading}>
            Cari
          </SearchButton>
        </FilterSection>

        {isNotesLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <div style={{ marginTop: '1rem', color: '#6b7280' }}>
              Memuat ringkasan...
            </div>
          </LoadingContainer>
        ) : notes.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3>Tidak ada ringkasan tersedia</h3>
            <p>Silakan coba filter lain atau hubungi admin</p>
          </EmptyState>
        ) : (
          <>
            <NotesGrid>
              {notes.map(note => (
                <NoteCard key={note.id}>
                  <NoteHeader>
                    <NoteTitle>{note.title}</NoteTitle>
                    <NoteDescription>{note.description || 'Tidak ada deskripsi'}</NoteDescription>
                  </NoteHeader>

                  {note.tags && note.tags.length > 0 && (
                    <TagsContainer>
                      {note.tags.map(tag => (
                        <Tag key={tag.id} type={tag.type}>
                          {tag.name}
                        </Tag>
                      ))}
                    </TagsContainer>
                  )}

                  <NoteFooter>
                    <SelectButton
                      onClick={() => handleStartSession(note)}
                      disabled={isStartingSession}
                    >
                      {isStartingSession ? 'Memproses...' : 'Pilih Materi'}
                    </SelectButton>
                  </NoteFooter>
                </NoteCard>
              ))}
            </NotesGrid>

            {(currentPage > 1 || !pagination?.isLastPage) && (
              <PaginationContainer>
                <PaginationButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Sebelumnya
                </PaginationButton>

                <PaginationInfo>
                  Halaman {currentPage}
                </PaginationInfo>

                <PaginationButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={pagination?.isLastPage}
                >
                  Selanjutnya →
                </PaginationButton>
              </PaginationContainer>
            )}
          </>
        )}
      </ContentContainer>
    </Container>
  )
}

export default NoteList
