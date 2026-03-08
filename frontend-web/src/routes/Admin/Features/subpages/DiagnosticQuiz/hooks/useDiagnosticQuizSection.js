import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchAdminDiagnosticQuizzes } from '@store/diagnostic/adminAction'
import { fetchAdminTags } from '@store/tags/adminAction'
import { actions } from "@store/tags/reducer"

export const useDiagnosticQuizSection = () => {
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
    dispatch(fetchAdminDiagnosticQuizzes())
    dispatch(actions.updateFilter({ key: "tagGroupNames", value: ["university", "semester", "diagnostic_topic"]}))
    dispatch(fetchAdminTags())
  }, [dispatch])

  return {
    uiState,
    setUiState,
  }
}
