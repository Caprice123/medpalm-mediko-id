import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/diagnosticCases'
import {
  fetchDiagnosticAdminCases,
  loadMoreDiagnosticAdminCases,
  addDiagnosticCase,
  updateDiagnosticCase,
  deleteDiagnosticCase,
  importDiagnosticCases,
} from '@store/diagnosticNodes/adminAction'

const { setPagination } = actions

export function useCasesPage(parentNode) {
  const dispatch = useDispatch()
  const { cases, pagination, loading } = useSelector(s => s.diagnosticCases)

  const [search, setSearch] = useState('')
  const [caseModal, setCaseModal] = useState({ open: false, diagnosticCase: null })
  const [moveModal, setMoveModal] = useState({ open: false, diagnosticCase: null })
  const [importResult, setImportResult] = useState(null)
  const importRef = useRef(null)

  const reload = () => {
    dispatch(setPagination({ page: 1 }))
    dispatch(fetchDiagnosticAdminCases(parentNode.id, { search: search.trim() }))
  }

  useEffect(() => {
    setSearch('')
    dispatch(setPagination({ page: 1 }))
    dispatch(fetchDiagnosticAdminCases(parentNode.id))
  }, [dispatch, parentNode.id])

  const handleSearch = () => reload()

  const handleLoadMore = () => dispatch(loadMoreDiagnosticAdminCases(parentNode.id, search.trim()))

  const handleDelete = (diagnosticCase) => {
    if (!window.confirm('Hapus kasus ini beserta seluruh soal di dalamnya?')) return
    dispatch(deleteDiagnosticCase(parentNode.id, diagnosticCase.id, reload))
  }

  const handleImportFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''
    dispatch(importDiagnosticCases(parentNode.id, file, (result) => {
      setImportResult(result)
      reload()
    }))
  }

  const handleCaseSave = (payload) => {
    const onSuccess = () => {
      setCaseModal({ open: false, diagnosticCase: null })
      reload()
    }
    if (caseModal.diagnosticCase) {
      dispatch(updateDiagnosticCase(parentNode.id, caseModal.diagnosticCase.id, payload, onSuccess))
    } else {
      dispatch(addDiagnosticCase(parentNode.id, payload, onSuccess))
    }
  }

  const handleMoveSuccess = () => {
    setMoveModal({ open: false, diagnosticCase: null })
    reload()
  }

  return {
    cases, pagination, loading,
    search, setSearch, handleSearch,
    caseModal, setCaseModal, handleCaseSave,
    moveModal, setMoveModal, handleMoveSuccess,
    importResult, setImportResult, importRef, handleImportFile,
    handleDelete, handleLoadMore,
  }
}
