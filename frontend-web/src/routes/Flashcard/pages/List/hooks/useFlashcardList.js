import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFlashcardDecks } from '@store/flashcard/action'
import { fetchTags } from '@store/tags/action'
import { actions as tagActions } from '@store/tags/reducer'

export const useFlashcardList = () => {
  const dispatch = useDispatch()
  
  // Fetch decks and tags when component mounts
  useEffect(() => {
    dispatch(fetchFlashcardDecks())
    dispatch(tagActions.updateFilter({ key: "tagGroupNames", value: ["topic", "department", "university", "semester"]}))
    dispatch(fetchTags())
  }, [dispatch])
}
