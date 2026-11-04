import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatures } from '@store/feature/userAction'
import { actions } from '@store/event/v2/reducer'
import {
  fetchClaimableEvents,
  fetchMyClaims,
  loadMoreClaimableEvents,
} from '@store/event/v2/userAction'

/**
 * Page-owned state: the two modal targets (opened from both tracks), the
 * feature-key → display-name map that both tracks need, and every reload path.
 */
export function useEventList() {
  const dispatch = useDispatch()
  const appFeatures = useSelector(state => state.feature.features)

  const [detailTarget, setDetailTarget] = useState(null)
  const [claimTarget, setClaimTarget] = useState(null)

  // `atlas` → "Atlas 3D". Served off the constants table via /api/v1/features,
  // so without it the raw key would show in the reward line.
  const featureLabels = useMemo(
    () => Object.fromEntries((appFeatures || []).map(f => [f.sessionType, f.name])),
    [appFeatures],
  )

  const reloadClaimable = useCallback(() => {
    dispatch(actions.setPagination({ page: 1 }))
    dispatch(fetchClaimableEvents())
  }, [dispatch])

  useEffect(() => {
    if (!appFeatures?.length) dispatch(fetchFeatures())
  }, [dispatch, appFeatures?.length])

  useEffect(() => {
    reloadClaimable()
    dispatch(fetchMyClaims())
  }, [dispatch, reloadClaimable])

  const handleSearchSubmit = (value) => {
    dispatch(actions.updateFilter({ key: 'search', value }))
    reloadClaimable()
  }

  const handleLoadMore = () => dispatch(loadMoreClaimableEvents())

  // A new claim changes the card's footer and adds a history row at once.
  const handleClaimSuccess = () => {
    reloadClaimable()
    dispatch(fetchMyClaims())
  }

  const openDetail = (event) => setDetailTarget(event)
  const closeDetail = () => setDetailTarget(null)
  const openClaim = (event) => {
    setDetailTarget(null)
    setClaimTarget(event)
  }
  const closeClaim = () => setClaimTarget(null)

  return {
    featureLabels,
    detailTarget,
    claimTarget,
    openDetail,
    closeDetail,
    openClaim,
    closeClaim,
    handleSearchSubmit,
    handleLoadMore,
    handleClaimSuccess,
  }
}
