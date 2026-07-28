import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUnlinkedAtlas, deleteUnlinkedAtlas } from '@store/unlinkedAtlas/adminAction'

export function useUnlinkedAtlasPage() {
  const dispatch = useDispatch()
  const { pagination } = useSelector(state => state.unlinkedAtlas)

  const [editModal, setEditModal] = useState({ open: false, model: null })
  const [assignModal, setAssignModal] = useState({ open: false, model: null })
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchUnlinkedAtlas({ page: 1 }))
  }, [dispatch])

  const handleSearch = () => dispatch(fetchUnlinkedAtlas({ page: 1, search: search.trim() }))

  const handlePageChange = (page) => dispatch(fetchUnlinkedAtlas({ page, search: search.trim() }))

  const handleDelete = (model) => {
    if (!window.confirm(`Hapus "${model.title}"?`)) return
    dispatch(deleteUnlinkedAtlas(model.uniqueId, () =>
      dispatch(fetchUnlinkedAtlas({ page: pagination.page, search: search.trim() }))
    ))
  }

  const handleEditSuccess = () => {
    setEditModal({ open: false, model: null })
    dispatch(fetchUnlinkedAtlas({ page: pagination.page, search: search.trim() }))
  }

  const handleAssignSuccess = () => {
    setAssignModal({ open: false, model: null })
    dispatch(fetchUnlinkedAtlas({ page: 1, search: search.trim() }))
  }

  return {
    editModal, setEditModal,
    assignModal, setAssignModal,
    search, setSearch,
    handleSearch, handlePageChange, handleDelete,
    handleEditSuccess, handleAssignSuccess,
  }
}
