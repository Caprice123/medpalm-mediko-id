import { useDispatch, useSelector } from 'react-redux'
import { PiFolder, PiStar, PiStarFill } from 'react-icons/pi'
import { toggleFavorite } from '@store/favorites/userAction'
import { splitMatches } from '../../../../utils/textMatching'
import { EmptyHint, FavoriteButton } from '../../NotesSidebar.styles'
import { ResultsHeader, ResultRow, ResultInfo, ResultTitle, ResultPath } from './SearchResults.styles'

export default function SearchResults({ query, selectedNoteId, onSelectNote }) {
  const dispatch = useDispatch()
  const searchResults = useSelector(s => s.summaryNotesV2.searchResults)
  const isSearchLoading = useSelector(s => s.summaryNotesV2.loading.isSearchLoading)
  const isToggling = useSelector(s => s.favorites.loading.isToggling)
  const favoritedNoteIds = useSelector(s => s.favorites.favoritedIds['summary_note'])

  if (isSearchLoading) return <EmptyHint>Mencari...</EmptyHint>
  if (searchResults.length === 0) return <EmptyHint>Tidak ada ringkasan yang cocok</EmptyHint>

  const handleToggleFavorite = (event, note) => {
    event.stopPropagation()
    dispatch(toggleFavorite('summary_note', note.id, {
      uniqueId: note.uniqueId,
      title: note.title,
    }))
  }

  return (
    <>
      <ResultsHeader>{searchResults.length} hasil</ResultsHeader>
      {searchResults.map(note => {
        const isSelected = note.uniqueId === selectedNoteId
        const isFavorited = (favoritedNoteIds || []).includes(note.id)

        return (
          <ResultRow
            key={note.id}
            $selected={isSelected}
            onClick={() => onSelectNote(note.uniqueId)}
          >
            <ResultInfo>
              <ResultTitle $selected={isSelected}>
                {splitMatches(note.title, query).map((segment, index) => (
                  segment.isMatch
                    ? <mark key={index}>{segment.text}</mark>
                    : <span key={index}>{segment.text}</span>
                ))}
              </ResultTitle>
              {note.nodePath?.length > 0 && (
                <ResultPath title={note.nodePath.join(' › ')}>
                  <PiFolder />{note.nodePath.join(' › ')}
                </ResultPath>
              )}
            </ResultInfo>
            <FavoriteButton
              $active={isFavorited}
              $alwaysVisible={isFavorited}
              disabled={isToggling}
              onClick={event => handleToggleFavorite(event, note)}
              title={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
              aria-label={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            >
              {isFavorited ? <PiStarFill /> : <PiStar />}
            </FavoriteButton>
          </ResultRow>
        )
      })}
    </>
  )
}
