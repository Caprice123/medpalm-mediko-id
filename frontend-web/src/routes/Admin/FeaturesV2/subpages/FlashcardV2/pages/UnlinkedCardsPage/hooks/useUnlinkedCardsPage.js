import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { actions, fetchUnlinkedCards, loadMoreUnlinkedCards, deleteUnlinkedCard } from '@store/unlinkedCards'

const { setPagination } = actions

export function useUnlinkedCardsPage() {
  const dispatch = useDispatch()

  const [editModal, setEditModal] = useState({ open: false, card: null })
  const [assignModal, setAssignModal] = useState({ open: false, card: null })
  const [search, setSearch] = useState('')

  const reload = () => {
    dispatch(setPagination({ page: 1 }))
    dispatch(fetchUnlinkedCards({ search: search.trim() }))
  }

  useEffect(reload, [dispatch])

  const handleSearch = () => reload()

  const handleLoadMore = () => dispatch(loadMoreUnlinkedCards(search.trim()))

  const handleDelete = (card) => {
    if (!window.confirm('Hapus kartu ini?')) return
    dispatch(deleteUnlinkedCard(card.id, reload))
  }

  const handleEditSuccess = () => {
    setEditModal({ open: false, card: null })
    reload()
  }

  const handleAssignSuccess = () => {
    setAssignModal({ open: false, card: null })
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
