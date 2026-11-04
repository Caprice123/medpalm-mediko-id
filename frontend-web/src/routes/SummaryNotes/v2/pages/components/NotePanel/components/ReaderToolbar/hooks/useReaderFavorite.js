import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '@store/favorites/userAction'

// The sidebar's star only reaches a note whose row is on screen, which it is not in
// full screen or on a phone. The reader needs its own.
export function useReaderFavorite(note) {
  const dispatch = useDispatch()
  const isFavorited = useSelector(s => (
    note ? (s.favorites.favoritedIds['summary_note'] || []).includes(note.id) : false
  ))
  const isToggling = useSelector(s => s.favorites.loading.isToggling)

  const handleToggle = useCallback(() => {
    if (!note) return
    dispatch(toggleFavorite('summary_note', note.id, {
      uniqueId: note.uniqueId,
      title: note.title,
    }))
  }, [note, dispatch])

  return { isFavorited, isToggling, handleToggle }
}
