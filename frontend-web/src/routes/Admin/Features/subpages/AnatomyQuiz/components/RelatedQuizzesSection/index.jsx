import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAnatomyQuizRelations,
  addAnatomyQuizRelation,
  removeAnatomyQuizRelation,
  searchAnatomyQuizzesForRelation,
} from '@store/anatomy/adminAction'
import {
  SectionWrapper, SectionLabel, SectionHint,
  RelationList, RelationItem, RelationItemTitle, RemoveRelationButton,
  SearchRow, SearchInput, SearchButton,
  SearchResults, SearchResultItem,
  EmptyRelations,
} from './RelatedQuizzesSection.styles'

function RelatedQuizzesSection({ quizUniqueId }) {
  const dispatch = useDispatch()
  const { quizRelations, searchedAnatomyQuizzes, loading } = useSelector(state => state.anatomy)
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)

  const linkedTitles = new Set(quizRelations.map(r => r.targetTitle))

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    dispatch(searchAnatomyQuizzesForRelation(searchQuery.trim()))
    setShowResults(true)
  }

  const handleAdd = (target) => {
    if (target.uniqueId === quizUniqueId) return
    dispatch(addAnatomyQuizRelation(quizUniqueId, target.uniqueId, () => {
      dispatch(fetchAnatomyQuizRelations(quizUniqueId))
    }))
    setShowResults(false)
    setSearchQuery('')
  }

  const handleRemove = (relationId) => {
    dispatch(removeAnatomyQuizRelation(quizUniqueId, relationId, () => {
      dispatch(fetchAnatomyQuizRelations(quizUniqueId))
    }))
  }

  const filteredResults = searchedAnatomyQuizzes.filter(q => q.uniqueId !== quizUniqueId)

  return (
    <SectionWrapper>
      <SectionLabel>Quiz Terkait</SectionLabel>
      <SectionHint>Hubungkan quiz ini dengan quiz anatomi lain yang relevan. Ditampilkan di halaman detail.</SectionHint>

      {loading.isFetchingQuizRelations ? (
        <EmptyRelations>Memuat...</EmptyRelations>
      ) : quizRelations.length === 0 ? (
        <EmptyRelations>Belum ada quiz terkait.</EmptyRelations>
      ) : (
        <RelationList>
          {quizRelations.map(rel => (
            <RelationItem key={rel.id}>
              <RelationItemTitle title={rel.targetTitle}>{rel.targetTitle}</RelationItemTitle>
              <RemoveRelationButton
                type="button"
                onClick={() => handleRemove(rel.id)}
                disabled={loading.isDeletingQuizRelation}
                title="Hapus relasi"
              >
                ×
              </RemoveRelationButton>
            </RelationItem>
          ))}
        </RelationList>
      )}

      <SearchRow>
        <SearchInput
          type="text"
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); if (!e.target.value) setShowResults(false) }}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Cari quiz berdasarkan judul..."
        />
        <SearchButton
          type="button"
          onClick={handleSearch}
          disabled={loading.isSearchingAnatomyQuizzes || !searchQuery.trim()}
        >
          {loading.isSearchingAnatomyQuizzes ? 'Mencari...' : 'Cari'}
        </SearchButton>
      </SearchRow>

      {showResults && filteredResults.length > 0 && (
        <SearchResults>
          {filteredResults.map(q => {
            const alreadyLinked = linkedTitles.has(q.title)
            return (
              <SearchResultItem
                key={q.uniqueId}
                className={alreadyLinked ? 'disabled' : ''}
                onClick={() => !alreadyLinked && handleAdd(q)}
              >
                {q.title} {alreadyLinked ? '(sudah ditambahkan)' : ''}
              </SearchResultItem>
            )
          })}
        </SearchResults>
      )}

      {showResults && filteredResults.length === 0 && !loading.isSearchingAnatomyQuizzes && (
        <SearchResults>
          <SearchResultItem className="disabled">Tidak ada hasil ditemukan.</SearchResultItem>
        </SearchResults>
      )}
    </SectionWrapper>
  )
}

export default RelatedQuizzesSection
