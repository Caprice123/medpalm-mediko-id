import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAtlasModelRelations,
  addAtlasModelRelation,
  removeAtlasModelRelation,
  searchAtlasModelsForRelation,
} from '@store/atlas/adminAction'
import {
  SectionWrapper, SectionLabel, SectionHint,
  RelationList, RelationItem, RelationItemTitle, RemoveRelationButton,
  SearchRow, SearchInput, SearchButton,
  SearchResults, SearchResultItem,
  EmptyRelations,
} from './RelatedModelsSection.styles'

function RelatedModelsSection({ modelUniqueId }) {
  const dispatch = useDispatch()
  const { modelRelations, searchedAtlasModels, loading } = useSelector(state => state.atlas)
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)

  const linkedTitles = new Set(modelRelations.map(r => r.targetTitle))

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    dispatch(searchAtlasModelsForRelation(searchQuery.trim()))
    setShowResults(true)
  }

  const handleAdd = (target) => {
    if (target.uniqueId === modelUniqueId) return
    dispatch(addAtlasModelRelation(modelUniqueId, target.uniqueId, () => {
      dispatch(fetchAtlasModelRelations(modelUniqueId))
    }))
    setShowResults(false)
    setSearchQuery('')
  }

  const handleRemove = (relationId) => {
    dispatch(removeAtlasModelRelation(modelUniqueId, relationId, () => {
      dispatch(fetchAtlasModelRelations(modelUniqueId))
    }))
  }

  const filteredResults = searchedAtlasModels.filter(m => m.uniqueId !== modelUniqueId)

  return (
    <SectionWrapper>
      <SectionLabel>Model Terkait</SectionLabel>
      <SectionHint>Hubungkan model 3D ini dengan model 3D lain yang relevan. Ditampilkan di halaman detail.</SectionHint>

      {loading.isFetchingModelRelations ? (
        <EmptyRelations>Memuat...</EmptyRelations>
      ) : modelRelations.length === 0 ? (
        <EmptyRelations>Belum ada model terkait.</EmptyRelations>
      ) : (
        <RelationList>
          {modelRelations.map(rel => (
            <RelationItem key={rel.id}>
              <RelationItemTitle title={rel.targetTitle}>{rel.targetTitle}</RelationItemTitle>
              <RemoveRelationButton
                type="button"
                onClick={() => handleRemove(rel.id)}
                disabled={loading.isDeletingModelRelation}
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
          placeholder="Cari model berdasarkan judul..."
        />
        <SearchButton
          type="button"
          onClick={handleSearch}
          disabled={loading.isSearchingAtlasModels || !searchQuery.trim()}
        >
          {loading.isSearchingAtlasModels ? 'Mencari...' : 'Cari'}
        </SearchButton>
      </SearchRow>

      {showResults && filteredResults.length > 0 && (
        <SearchResults>
          {filteredResults.map(m => {
            const alreadyLinked = linkedTitles.has(m.title)
            return (
              <SearchResultItem
                key={m.uniqueId}
                className={alreadyLinked ? 'disabled' : ''}
                onClick={() => !alreadyLinked && handleAdd(m)}
              >
                {m.title} {alreadyLinked ? '(sudah ditambahkan)' : ''}
              </SearchResultItem>
            )
          })}
        </SearchResults>
      )}

      {showResults && filteredResults.length === 0 && !loading.isSearchingAtlasModels && (
        <SearchResults>
          <SearchResultItem className="disabled">Tidak ada hasil ditemukan.</SearchResultItem>
        </SearchResults>
      )}
    </SectionWrapper>
  )
}

export default RelatedModelsSection
