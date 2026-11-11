import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDiagramHistory, fetchDiagramDetail } from '@store/skripsi/v2'
import { selectDiagramsForTab } from '@store/skripsi/v2/reducer'
import { actions as commonActions } from '@store/common/reducer'

// The tab's saved diagrams, and loading one back onto the canvas.
export const useDiagramHistory = ({ tabId, api, onLoaded, onShowPreview }) => {
  const dispatch = useDispatch()
  const diagrams = useSelector(state => selectDiagramsForTab(state, tabId))
  const isFetching = useSelector(state => state.skripsiV2.loading.isFetchingDiagrams)

  useEffect(() => {
    if (!tabId) return

    dispatch(fetchDiagramHistory(tabId))
  }, [tabId, dispatch])

  // The history list omits the stored canvas — it is large — so opening an
  // entry fetches the full record first.
  const loadDiagram = useCallback(async (diagram) => {
    if (!api) {
      dispatch(commonActions.setError('Kanvas diagram belum siap. Coba lagi sesaat.'))
      return
    }

    try {
      const full = await dispatch(fetchDiagramDetail(diagram.id))
      const elements = full?.diagramData?.elements

      if (!elements) {
        dispatch(commonActions.setError('Diagram ini tidak memiliki data kanvas.'))
        return
      }

      api.updateScene({ elements })
      onLoaded(full.id)
      onShowPreview()
    } catch (error) {
      dispatch(commonActions.setError(`Gagal memuat diagram: ${error.message}`))
    }
  }, [api, dispatch, onLoaded, onShowPreview])

  return { diagrams, isFetching, loadDiagram }
}
