import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUnlinkedQuestions, deleteUnlinkedQuestion } from '@store/unlinkedQuestions'

export function useUnlinkedQuestionsPage() {
  const dispatch = useDispatch()
  const { pagination } = useSelector(state => state.unlinkedQuestions)

  const [editModal, setEditModal] = useState({ open: false, question: null })
  const [assignModal, setAssignModal] = useState({ open: false, question: null })
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchUnlinkedQuestions({ page: 1 }))
  }, [dispatch])

  const handleSearch = () => dispatch(fetchUnlinkedQuestions({ page: 1, search: search.trim() }))

  const handlePageChange = (page) => dispatch(fetchUnlinkedQuestions({ page, search: search.trim() }))

  const handleDelete = (question) => {
    if (!window.confirm('Hapus pertanyaan ini?')) return
    dispatch(deleteUnlinkedQuestion(question.id, () =>
      dispatch(fetchUnlinkedQuestions({ page: pagination.page, search: search.trim() }))
    ))
  }

  const handleEditSuccess = () => {
    setEditModal({ open: false, question: null })
    dispatch(fetchUnlinkedQuestions({ page: pagination.page, search: search.trim() }))
  }

  const handleAssignSuccess = () => {
    setAssignModal({ open: false, question: null })
    dispatch(fetchUnlinkedQuestions({ page: 1, search: search.trim() }))
  }

  return {
    editModal, setEditModal,
    assignModal, setAssignModal,
    search, setSearch,
    handleSearch, handlePageChange, handleDelete,
    handleEditSuccess, handleAssignSuccess,
  }
}
