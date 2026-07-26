import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUnlinkedDiagnosticQuestions, deleteUnlinkedDiagnosticQuestion } from '@store/diagnosticNodes/adminAction'

export function useUnlinkedQuestionsPage() {
  const dispatch = useDispatch()
  const { pagination } = useSelector(s => s.nodeQuestions)

  const [editModal, setEditModal] = useState({ open: false, question: null })
  const [moveModal, setMoveModal] = useState({ open: false, question: null })
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchUnlinkedDiagnosticQuestions({ page: 1 }))
  }, [dispatch])

  const handleSearch = () =>
    dispatch(fetchUnlinkedDiagnosticQuestions({ page: 1, search: search.trim() }))

  const handlePageChange = (page) =>
    dispatch(fetchUnlinkedDiagnosticQuestions({ page, search: search.trim() }))

  const handleDelete = (q) => {
    if (!window.confirm('Hapus soal ini?')) return
    dispatch(deleteUnlinkedDiagnosticQuestion(q.id, () =>
      dispatch(fetchUnlinkedDiagnosticQuestions({ page: pagination.page, search: search.trim() }))
    ))
  }

  const handleEditSuccess = () => {
    setEditModal({ open: false, question: null })
    dispatch(fetchUnlinkedDiagnosticQuestions({ page: pagination.page, search: search.trim() }))
  }

  const handleMoveSuccess = () => {
    setMoveModal({ open: false, question: null })
    dispatch(fetchUnlinkedDiagnosticQuestions({ page: 1, search: search.trim() }))
  }

  return {
    editModal, setEditModal,
    moveModal, setMoveModal,
    search, setSearch,
    handleSearch, handlePageChange, handleDelete,
    handleEditSuccess, handleMoveSuccess,
  }
}
