import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { actions, fetchUnlinkedAnatomy, loadMoreUnlinkedAnatomy, deleteUnlinkedAnatomy } from '@store/unlinkedAnatomy'

const { setPagination } = actions

export function useUnlinkedAnatomyPage() {
  const dispatch = useDispatch()

  const [editModal, setEditModal] = useState({ open: false, quiz: null })
  const [assignModal, setAssignModal] = useState({ open: false, quiz: null })
  const [search, setSearch] = useState('')

  const reload = () => {
    dispatch(setPagination({ page: 1 }))
    dispatch(fetchUnlinkedAnatomy({ search: search.trim() }))
  }

  useEffect(reload, [dispatch])

  const handleSearch = () => reload()

  const handleLoadMore = () => dispatch(loadMoreUnlinkedAnatomy(search.trim()))

  const handleDelete = (quiz) => {
    if (!window.confirm(`Hapus "${quiz.title}"?`)) return
    dispatch(deleteUnlinkedAnatomy(quiz.uniqueId, reload))
  }

  const handleEditSuccess = () => {
    setEditModal({ open: false, quiz: null })
    reload()
  }

  const handleAssignSuccess = () => {
    setAssignModal({ open: false, quiz: null })
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
