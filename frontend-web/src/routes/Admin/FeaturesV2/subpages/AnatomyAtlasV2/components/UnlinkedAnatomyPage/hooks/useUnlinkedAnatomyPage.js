import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUnlinkedAnatomy, deleteUnlinkedAnatomy } from '@store/unlinkedAnatomy/adminAction'

export function useUnlinkedAnatomyPage() {
  const dispatch = useDispatch()
  const { pagination } = useSelector(state => state.unlinkedAnatomy)

  const [editModal, setEditModal] = useState({ open: false, quiz: null })
  const [assignModal, setAssignModal] = useState({ open: false, quiz: null })
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchUnlinkedAnatomy({ page: 1 }))
  }, [dispatch])

  const handleSearch = () => dispatch(fetchUnlinkedAnatomy({ page: 1, search: search.trim() }))

  const handlePageChange = (page) => dispatch(fetchUnlinkedAnatomy({ page, search: search.trim() }))

  const handleDelete = (quiz) => {
    if (!window.confirm(`Hapus "${quiz.title}"?`)) return
    dispatch(deleteUnlinkedAnatomy(quiz.uniqueId, () =>
      dispatch(fetchUnlinkedAnatomy({ page: pagination.page, search: search.trim() }))
    ))
  }

  const handleEditSuccess = () => {
    setEditModal({ open: false, quiz: null })
    dispatch(fetchUnlinkedAnatomy({ page: pagination.page, search: search.trim() }))
  }

  const handleAssignSuccess = () => {
    setAssignModal({ open: false, quiz: null })
    dispatch(fetchUnlinkedAnatomy({ page: 1, search: search.trim() }))
  }

  return {
    editModal, setEditModal,
    assignModal, setAssignModal,
    search, setSearch,
    handleSearch, handlePageChange, handleDelete,
    handleEditSuccess, handleAssignSuccess,
  }
}
