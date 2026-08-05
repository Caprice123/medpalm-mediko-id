import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { actions, fetchUnlinkedAtlas, loadMoreUnlinkedAtlas, deleteUnlinkedAtlas } from '@store/unlinkedAtlas'

const { setPagination } = actions

export function useUnlinkedAtlasPage() {
  const dispatch = useDispatch()

  const [editModal, setEditModal] = useState({ open: false, model: null })
  const [assignModal, setAssignModal] = useState({ open: false, model: null })
  const [search, setSearch] = useState('')

  const reload = () => {
    dispatch(setPagination({ page: 1 }))
    dispatch(fetchUnlinkedAtlas({ search: search.trim() }))
  }

  useEffect(reload, [dispatch])

  const handleSearch = () => reload()

  const handleLoadMore = () => dispatch(loadMoreUnlinkedAtlas(search.trim()))

  const handleDelete = (model) => {
    if (!window.confirm(`Hapus "${model.title}"?`)) return
    dispatch(deleteUnlinkedAtlas(model.uniqueId, reload))
  }

  const handleEditSuccess = () => {
    setEditModal({ open: false, model: null })
    reload()
  }

  const handleAssignSuccess = () => {
    setAssignModal({ open: false, model: null })
    reload()
  }

  return {
    editModal, setEditModal,
    assignModal, setAssignModal,
    search, setSearch,
    handleSearch, handleLoadMore, handleDelete,
    handleEditSuccess, handleAssignSuccess,
  }
}
