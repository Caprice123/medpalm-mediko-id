import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { actions } from '@store/nodeQuestions'
import {
  fetchUnlinkedDiagnosticQuestions,
  loadMoreUnlinkedDiagnosticQuestions,
  deleteUnlinkedDiagnosticQuestion,
} from '@store/diagnosticNodes/adminAction'

const { setPagination } = actions

export function useUnlinkedQuestionsPage() {
  const dispatch = useDispatch()

  const [editModal, setEditModal] = useState({ open: false, question: null })
  const [moveModal, setMoveModal] = useState({ open: false, question: null })
  const [search, setSearch] = useState('')

  const reload = () => {
    dispatch(setPagination({ page: 1 }))
    dispatch(fetchUnlinkedDiagnosticQuestions({ search: search.trim() }))
  }

  useEffect(reload, [dispatch])

  const handleSearch = () => reload()

  const handleLoadMore = () => dispatch(loadMoreUnlinkedDiagnosticQuestions(search.trim()))

  const handleDelete = (q) => {
    if (!window.confirm('Hapus soal ini?')) return
    dispatch(deleteUnlinkedDiagnosticQuestion(q.id, reload))
  }

  const handleEditSuccess = () => {
    setEditModal({ open: false, question: null })
    reload()
  }

  const handleMoveSuccess = () => {
    setMoveModal({ open: false, question: null })
    reload()
  }

  return {
    editModal, setEditModal,
    moveModal, setMoveModal,
    search, setSearch,
    handleSearch, handleLoadMore, handleDelete,
    handleEditSuccess, handleMoveSuccess,
  }
}
