import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchAdminAnatomyQuizzes } from '@store/anatomy/adminAction'
import { fetchAdminTags } from '@store/tags/adminAction'
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
    dispatch(fetchAdminTags())
  }, [dispatch])

  return {
    uiState,
    setUiState,
  }
}
