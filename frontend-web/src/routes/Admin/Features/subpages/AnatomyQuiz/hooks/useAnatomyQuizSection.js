import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchAdminAnatomyQuizzes } from '@store/anatomy/action'
import { fetchTags } from '@store/tags/action'
import { actions } from "@store/tags/reducer"

export const useAnatomyQuizSection = () => {
  const dispatch = useDispatch()
  const [uiState, setUiState] = useState({
    isCalculatorModalOpen: false,
    isConfirmationCloseOpen: false,
    setIsFeatureSettingModalOpen: false,
    mode: null,
    selectedQuiz: null,
  })

  // Fetch quizzes and tags on mount
  useEffect(() => {
    dispatch(fetchAdminAnatomyQuizzes())
    dispatch(actions.updateFilter({ key: "tagGroupNames", value: ["university", "semester"]}))
    dispatch(fetchTags())
  }, [dispatch])

  return {
    uiState,
    setUiState,
  }
}
