import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWebinars, fetchMyRegistrations } from '@store/webinar/userAction'
import { actions } from '@store/webinar/reducer'

export function useWebinarList() {
  const dispatch = useDispatch()
  const { webinars, myRegistrations, filter, pagination, loading } = useSelector(state => state.webinar)

  const [tab, setTab] = useState('list')
  const [detailTarget, setDetailTarget] = useState(null)
  const [registerTarget, setRegisterTarget] = useState(null)

  useEffect(() => {
    if (tab === 'list') dispatch(fetchWebinars())
    else dispatch(fetchMyRegistrations())
  }, [tab, dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(actions.setPagination({ ...pagination, page: 1 }))
    dispatch(fetchWebinars())
  }

  const handleSearchChange = (value) => {
    dispatch(actions.updateFilter({ key: 'search', value }))
  }

  const handleRegistrationFilterChange = (key) => {
    dispatch(actions.updateFilter({ key: 'registrationStatus', value: key }))
    dispatch(actions.setPagination({ ...pagination, page: 1 }))
    dispatch(fetchWebinars())
  }

  const handlePageChange = (page) => {
    dispatch(actions.setPagination({ ...pagination, page }))
    if (tab === 'list') dispatch(fetchWebinars())
    else dispatch(fetchMyRegistrations())
  }

  const handleRegisterSuccess = () => {
    dispatch(fetchWebinars())
  }

  return {
    webinars,
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
