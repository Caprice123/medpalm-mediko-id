import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  countRegistrationsByStatus,
  findNextJoinable,
} from '../../../utils/registrationState'

/** Which status drawer is expanded, plus the band's derived counts. */
export function useMyRegistrationsBand() {
  const { myRegistrations, loading } = useSelector(state => state.webinarV2)
  const [openStatus, setOpenStatus] = useState(null)

  const counts = useMemo(
    () => countRegistrationsByStatus(myRegistrations),
    [myRegistrations],
  )

  const nextJoinable = useMemo(
    () => findNextJoinable(myRegistrations),
    [myRegistrations],
  )

  const visibleRegistrations = useMemo(
    () => (openStatus ? myRegistrations.filter(reg => reg.status === openStatus) : []),
    [myRegistrations, openStatus],
  )

  const toggleStatus = (status) => {
    setOpenStatus(current => (current === status ? null : status))
  }

  return {
    isLoading: loading.isFetchingMyRegistrations,
    hasRegistrations: myRegistrations.length > 0,
    counts,
    nextJoinable,
    openStatus,
    visibleRegistrations,
    toggleStatus,
  }
}
