import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { actions, fetchUnlinkedQuestions, loadMoreUnlinkedQuestions, deleteUnlinkedQuestion } from '@store/unlinkedQuestions'

const { setPagination } = actions

export function useUnlinkedQuestionsPage() {
  const dispatch = useDispatch()

  const [editModal, setEditModal] = useState({ open: false, question: null })
  const [assignModal, setAssignModal] = useState({ open: false, question: null })
  const [search, setSearch] = useState('')

  const reload = () => {
    dispatch(setPagination({ page: 1 }))
    dispatch(fetchUnlinkedQuestions({ search: search.trim() }))
  }

  useEffect(reload, [dispatch])

  const handleSearch = () => reload()

  const handleLoadMore = () => dispatch(loadMoreUnlinkedQuestions(search.trim()))

  const handleDelete = (question) => {
    if (!window.confirm('Hapus pertanyaan ini?')) return
    dispatch(deleteUnlinkedQuestion(question.id, reload))
  }

  const handleEditSuccess = () => {
    setEditModal({ open: false, question: null })
    reload()
  }

  const handleAssignSuccess = () => {
    setAssignModal({ open: false, question: null })
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
