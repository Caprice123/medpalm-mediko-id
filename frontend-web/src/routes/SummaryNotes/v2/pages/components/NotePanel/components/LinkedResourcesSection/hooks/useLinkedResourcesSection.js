import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPublicConstants } from '@store/constant/userAction'

export function useLinkedResourcesSection() {
  const dispatch = useDispatch()
  const { nodeStats, anatomyQuizzes } = useSelector(s => s.summaryNotesV2)
  const constants = useSelector(s => s.constant.constants)

  useEffect(() => {
    dispatch(fetchPublicConstants(['flashcard_feature_title', 'mcq_feature_title']))
  }, [dispatch])

  return {
    nodeStats,
    anatomyQuizzes,
    flashcardLabel: constants?.flashcard_feature_title || 'Flashcard',
    mcqLabel: constants?.mcq_feature_title || 'MCQ',
    hasFlashcards: (nodeStats?.flashcardCards ?? 0) > 0,
    hasMcq: (nodeStats?.mcqQuestions ?? 0) > 0,
    hasAnatomyQuizzes: anatomyQuizzes.length > 0,
  }
}
