import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '@store/favorites/userAction'
import { SectionBlock, EmptyHint, FavoriteBtn } from '../../NotesSidebar.styles'
import { SearchNoteRow, SearchNoteInfo, SearchNoteTitle, SearchNotePath } from './SearchResults.styles'

export default function SearchResults({ results, isLoading, selectedNoteId, onSelectNote }) {
  const dispatch = useDispatch()
  const { favoritedIds } = useSelector(s => s.favorites)
  const favLoading = useSelector(s => s.favorites.loading)
  const favoritedSummaryNoteIds = favoritedIds['summary_note'] || []

  const handleToggleFavorite = (e, noteId, metadata = null) => {
    e.stopPropagation()
    dispatch(toggleFavorite('summary_note', noteId, metadata))
  }

  return (
    <SectionBlock>
      {isLoading ? (
        <EmptyHint>Mencari...</EmptyHint>
      ) : results.length === 0 ? (
        <EmptyHint>Tidak ada hasil</EmptyHint>
      ) : results.map(note => {
        const isFav = favoritedSummaryNoteIds.includes(note.id)
        return (
          <SearchNoteRow
            key={note.id}
            $selected={note.uniqueId === selectedNoteId}
            onClick={() => onSelectNote(note.uniqueId)}
          >
            <SearchNoteInfo>
              <SearchNoteTitle $selected={note.uniqueId === selectedNoteId}>
                {note.title}
              </SearchNoteTitle>
              {note.nodePath?.length > 0 && (
                <SearchNotePath>📁 {note.nodePath.join(' › ')}</SearchNotePath>
              )}
            </SearchNoteInfo>
            <FavoriteBtn
              $active={isFav}
              disabled={favLoading.isToggling}
              onClick={e => handleToggleFavorite(e, note.id, { uniqueId: note.uniqueId, title: note.title })}
              title={isFav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            >
              ★
            </FavoriteBtn>
          </SearchNoteRow>
        )
      })}
    </SectionBlock>
  )
}
