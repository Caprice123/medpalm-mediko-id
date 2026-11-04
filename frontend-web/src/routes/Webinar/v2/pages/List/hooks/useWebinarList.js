import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/webinar/v2/reducer'
import {
  fetchFeaturedWebinar,
  fetchWebinars,
  fetchMyRegistrations,
  loadMoreWebinars,
} from '@store/webinar/v2/userAction'

/**
 * Page-owned state: the two modal targets (shared by the billboard, the grid and
 * each other) and every reload path. Lives at page level because more than one
 * sibling reads it.
 */
export function useWebinarList() {
  const dispatch = useDispatch()
  const { filter } = useSelector(state => state.webinarV2)

  const [detailTarget, setDetailTarget] = useState(null)
  const [registerTarget, setRegisterTarget] = useState(null)

  // Any list change resets to page 1 — an appended list left at its end page
  // would show a stale tail once the filter or the result count moves.
  const reloadList = useCallback(() => {
    dispatch(actions.setPagination({ page: 1 }))
    dispatch(fetchWebinars())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchFeaturedWebinar())
    dispatch(fetchMyRegistrations())
    reloadList()
  }, [dispatch, reloadList])

  const handleRegistrationStatusChange = (value) => {
    if (value === filter.registrationStatus) return
    dispatch(actions.updateFilter({ key: 'registrationStatus', value }))
    reloadList()
  }

  const handleSearchSubmit = (value) => {
    dispatch(actions.updateFilter({ key: 'search', value }))
    reloadList()
  }

  const handleLoadMore = () => dispatch(loadMoreWebinars())

  // A new registration changes the billboard's CTA, the status band and the
  // card's footer at once, so all three refetch.
  const handleRegisterSuccess = () => {
    dispatch(fetchFeaturedWebinar())
    dispatch(fetchMyRegistrations())
    reloadList()
  }

  const openDetail = (webinar) => setDetailTarget(webinar)
  const closeDetail = () => setDetailTarget(null)
  const openRegister = (webinar) => {
    setDetailTarget(null)
    setRegisterTarget(webinar)
  }
  const closeRegister = () => setRegisterTarget(null)

  return {
    detailTarget,
    registerTarget,
    openDetail,
    closeDetail,
    openRegister,
    closeRegister,
    handleRegistrationStatusChange,
    handleSearchSubmit,
    handleLoadMore,
    handleRegisterSuccess,
  }
}
