import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { actions } from '@store/diagnosticCases'
import {
  fetchUnlinkedDiagnosticCases,
  loadMoreUnlinkedDiagnosticCases,
  deleteUnlinkedDiagnosticCase,
} from '@store/diagnosticNodes/adminAction'

const { setPagination } = actions

export function useUnlinkedCasesPage() {
  const dispatch = useDispatch()

  const [editModal, setEditModal] = useState({ open: false, diagnosticCase: null })
  const [moveModal, setMoveModal] = useState({ open: false, diagnosticCase: null })
  const [search, setSearch] = useState('')

  const reload = () => {
    dispatch(setPagination({ page: 1 }))
    dispatch(fetchUnlinkedDiagnosticCases({ search: search.trim() }))
  }

  useEffect(reload, [dispatch])

  const handleSearch = () => reload()

  const handleLoadMore = () => dispatch(loadMoreUnlinkedDiagnosticCases(search.trim()))

  const handleDelete = (diagnosticCase) => {
    if (!window.confirm('Hapus kasus ini beserta seluruh soal di dalamnya?')) return
    dispatch(deleteUnlinkedDiagnosticCase(diagnosticCase.id, reload))
  }

  const handleEditSuccess = () => {
    setEditModal({ open: false, diagnosticCase: null })
    reload()
  }

  const handleMoveSuccess = () => {
    setMoveModal({ open: false, diagnosticCase: null })
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
