import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUnlinkedCards, deleteUnlinkedCard } from '@store/unlinkedCards'

export function useUnlinkedCardsPage() {
  const dispatch = useDispatch()
  const { pagination } = useSelector(state => state.unlinkedCards)

  const [editModal, setEditModal] = useState({ open: false, card: null })
  const [assignModal, setAssignModal] = useState({ open: false, card: null })
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchUnlinkedCards({ page: 1 }))
  }, [dispatch])

  const handleSearch = () => dispatch(fetchUnlinkedCards({ page: 1, search: search.trim() }))

  const handlePageChange = (page) => dispatch(fetchUnlinkedCards({ page, search: search.trim() }))

  const handleDelete = (card) => {
    if (!window.confirm('Hapus kartu ini?')) return
    dispatch(deleteUnlinkedCard(card.id, () => dispatch(fetchUnlinkedCards({ page: pagination.page, search: search.trim() }))))
  }

  const handleEditSuccess = () => {
    setEditModal({ open: false, card: null })
    dispatch(fetchUnlinkedCards({ page: pagination.page, search: search.trim() }))
  }

  const handleAssignSuccess = () => {
    setAssignModal({ open: false, card: null })
    dispatch(fetchUnlinkedCards({ page: 1, search: search.trim() }))
  }

  return {
    editModal, setEditModal,
    assignModal, setAssignModal,
    search, setSearch,
    handleSearch, handlePageChange, handleDelete,
    handleEditSuccess, handleAssignSuccess,
  }
}
