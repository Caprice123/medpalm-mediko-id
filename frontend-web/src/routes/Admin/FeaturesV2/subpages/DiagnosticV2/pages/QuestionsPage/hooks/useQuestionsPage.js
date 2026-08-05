import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/nodeQuestions'
import {
  fetchDiagnosticAdminQuestions,
  loadMoreDiagnosticAdminQuestions,
  addDiagnosticQuestion,
  updateDiagnosticQuestion,
  deleteDiagnosticQuestion,
  importDiagnosticQuestions,
} from '@store/diagnosticNodes/adminAction'

const { setPagination } = actions

export function useQuestionsPage(parentNode) {
  const dispatch = useDispatch()
  const { questions, pagination, loading } = useSelector(s => s.nodeQuestions)

  const [search, setSearch] = useState('')
  const [qModal, setQModal] = useState({ open: false, question: null })
  const [moveModal, setMoveModal] = useState({ open: false, question: null })
  const [importResult, setImportResult] = useState(null)
  const importRef = useRef(null)

  const reload = () => {
    dispatch(setPagination({ page: 1 }))
    dispatch(fetchDiagnosticAdminQuestions(parentNode.id, { search: search.trim() }))
  }

  useEffect(() => {
    setSearch('')
    dispatch(setPagination({ page: 1 }))
    dispatch(fetchDiagnosticAdminQuestions(parentNode.id))
  }, [dispatch, parentNode.id])

  const handleSearch = () => reload()

  const handleLoadMore = () => dispatch(loadMoreDiagnosticAdminQuestions(parentNode.id, search.trim()))

  const handleDelete = (q) => {
    if (!window.confirm('Hapus soal ini?')) return
    dispatch(deleteDiagnosticQuestion(parentNode.id, q.id, reload))
  }

  const handleImportFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''
    dispatch(importDiagnosticQuestions(parentNode.id, file, (result) => {
      setImportResult(result)
      reload()
    }))
  }

  const handleQSave = (payload) => {
    const onSuccess = () => {
      setQModal({ open: false, question: null })
      reload()
    }
    if (qModal.question) {
      dispatch(updateDiagnosticQuestion(parentNode.id, qModal.question.id, payload, onSuccess))
    } else {
      dispatch(addDiagnosticQuestion(parentNode.id, payload, onSuccess))
    }
  }

  const handleMoveSuccess = () => {
    setMoveModal({ open: false, question: null })
    reload()
  }

  return {
    questions, pagination, loading,
    search, setSearch, handleSearch,
    qModal, setQModal, handleQSave,
    moveModal, setMoveModal, handleMoveSuccess,
    importResult, setImportResult, importRef, handleImportFile,
    handleDelete, handleLoadMore,
  }
}
