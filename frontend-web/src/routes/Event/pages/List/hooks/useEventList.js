import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents, fetchMyEventRegistrations } from '@store/event/userAction'
import { fetchFeatures } from '@store/feature/action'
import { actions } from '@store/event/reducer'

export function useEventList() {
  const dispatch = useDispatch()
  const { events, myRegistrations, filter, pagination, loading } = useSelector(state => state.event)
  const appFeatures = useSelector(state => state.feature.features)

  useEffect(() => {
    if (appFeatures.length === 0) dispatch(fetchFeatures())
  }, [])

  const [tab, setTab] = useState('list')
  const [detailTarget, setDetailTarget] = useState(null)
  const [registerTarget, setRegisterTarget] = useState(null)

  useEffect(() => {
    if (tab === 'list') dispatch(fetchEvents())
    else dispatch(fetchMyEventRegistrations())
  }, [tab, dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(actions.setPagination({ ...pagination, page: 1 }))
    dispatch(fetchEvents())
  }

  const handleSearchChange = (value) => {
    dispatch(actions.updateFilter({ key: 'search', value }))
  }

  const handleRegistrationFilterChange = (key) => {
    dispatch(actions.updateFilter({ key: 'registrationStatus', value: key }))
    dispatch(actions.setPagination({ ...pagination, page: 1 }))
    dispatch(fetchEvents())
  }

  const handlePageChange = (page) => {
    dispatch(actions.setPagination({ ...pagination, page }))
    if (tab === 'list') dispatch(fetchEvents())
    else dispatch(fetchMyEventRegistrations())
  }

  const handleRegisterSuccess = () => {
    dispatch(fetchEvents())
  }

  return {
    events,
    myRegistrations,
    filter,
    pagination,
    loading,
    tab,
    setTab,
    detailTarget,
    setDetailTarget,
    registerTarget,
    setRegisterTarget,
    handleSearch,
    handleSearchChange,
    handleRegistrationFilterChange,
    handlePageChange,
    handleRegisterSuccess,
  }
}
