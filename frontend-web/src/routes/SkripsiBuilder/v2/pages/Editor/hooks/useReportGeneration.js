import { useEffect, useRef } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  generateReportSections,
  stopReportGeneration,
  selectGeneratableSections,
} from '@store/skripsi/v2'

// "Generate sekaligus", run from the page it fills in.
//
// The create page navigates here and the run starts on arrival, so the student
// watches the report being written instead of waiting on a spinner at a button
// they already pressed. Closing the page stops it; what landed is saved, and
// "Lanjutkan generate" picks up whatever is still empty.
export const useReportGeneration = (currentSet) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const generation = useSelector(state => state.skripsiV2.generation, shallowEqual)
  const pendingCount = useSelector(state => selectGeneratableSections(state).length)

  // The signal is carried in router state rather than on the set, so it is
  // spent by arriving: a reload is not a second request to rewrite the report,
  // and the button below is how a stopped run is resumed.
  const shouldAutoStart = Boolean(location.state?.autoGenerate)
  const hasAutoStarted = useRef(false)

  useEffect(() => {
    if (!shouldAutoStart || hasAutoStarted.current) return
    // Sections arrive with the set, so there is nothing to generate until it
    // has loaded.
    if (!currentSet) return

    hasAutoStarted.current = true

    // Clears the flag without adding a history entry, so going back and
    // forward again does not restart the run.
    navigate(location.pathname, { replace: true, state: null })

    dispatch(generateReportSections())
  }, [shouldAutoStart, currentSet, dispatch, navigate, location.pathname])

  return {
    isGenerating: generation.isRunning,
    isStopping: generation.isStopping,
    statusBySection: generation.statusBySection,
    // Offered only on a report that asked for this, and only while something
    // is still empty — a manual report has its own per-section assistant.
    canGenerate: currentSet?.workMode === 'generate' && pendingCount > 0,
    pendingCount,
    startGeneration: () => dispatch(generateReportSections()),
    stopGeneration: () => dispatch(stopReportGeneration()),
  }
}
