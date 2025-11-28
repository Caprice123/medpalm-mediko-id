import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { startFlashcardWithDeck, fetchFlashcardSessionDetail } from '@store/session/action'

export const useDeckList = (sessionId) => {
  const dispatch = useDispatch()
  const { sessionDetail } = useSelector(state => state.session)

  const [filters, setFilters] = useState({
    university: '',
    semester: ''
  })

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleStartDeck = async (deck) => {
    try {
      if (!sessionId) {
        throw new Error('Session ID not found')
      }

      await dispatch(startFlashcardWithDeck(
        sessionId,
        deck.id
      ))
    } catch (error) {
      console.error('Error starting flashcard session:', error)
      alert('Gagal memulai sesi: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  return {
    filters,
    handleFilterChange,
    handleStartDeck
  }
}
