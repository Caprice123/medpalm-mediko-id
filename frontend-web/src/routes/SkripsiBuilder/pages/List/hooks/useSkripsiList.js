import { useEffect, useState } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@store/store'
import { fetchSets, createSet } from '@store/skripsi/userAction'
import { actions as commonActions } from '@store/common/reducer'
import { SkripsiRoute } from '../../../routes'

export const useSkripsiList = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { loading, pagination, sets } = useAppSelector((state) => state.skripsi)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '' })

  useEffect(() => {
    dispatch(fetchSets())
  }, [dispatch])

  const handlePageChange = (page) => {
    dispatch(fetchSets(page))
  }

  const hasMorePages = !pagination.isLastPage || pagination.page > 1

  const handleCreateSet = async () => {
    if (!formData.title.trim()) {
      dispatch(commonActions.setError('Judul set tidak boleh kosong'))
      return
    }

      await dispatch(createSet(formData.title, formData.description, (set) => {
        navigate(generatePath(SkripsiRoute.editorRoute, { setId: set.uniqueId }))
      }))
  }

  const handleOpenCreateModal = () => setShowCreateModal(true)

  const handleCloseCreateModal = () => {
    setShowCreateModal(false)
    setFormData({ title: '', description: '' })
  }

  return {
    sets,
    loading,
    pagination,
    hasMorePages,
    showCreateModal,
    formData,
    setFormData,
    handlePageChange,
    handleCreateSet,
    handleOpenCreateModal,
    handleCloseCreateModal,
  }
}
