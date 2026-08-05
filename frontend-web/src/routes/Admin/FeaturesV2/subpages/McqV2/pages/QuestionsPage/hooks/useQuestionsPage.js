import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { actions, fetchNodeQuestions, loadMoreNodeQuestions, deleteNodeQuestion } from '@store/nodeQuestions'
import { importNodeQuestions } from '@store/nodeQuestions/adminAction'

const { setPagination } = actions

export function useQuestionsPage(node) {
  const dispatch = useDispatch()

  const [modal, setModal] = useState({ open: false, question: null })
  const [moveModal, setMoveModal] = useState({ open: false, question: null })
  const importRef = useRef(null)
  const [importResult, setImportResult] = useState(null)

  const reload = () => {
    dispatch(setPagination({ page: 1 }))
    dispatch(fetchNodeQuestions(node.id))
  }

  useEffect(reload, [dispatch, node.id])

  const handleDelete = (question) => {
    if (!window.confirm('Hapus pertanyaan ini?')) return
    dispatch(deleteNodeQuestion(node.id, question.id, reload))
  }

  const handleLoadMore = () => dispatch(loadMoreNodeQuestions(node.id))

  const handleQuestionSuccess = () => {
    setModal({ open: false, question: null })
    reload()
  }

  const handleMoveSuccess = () => {
    setMoveModal({ open: false, question: null })
    reload()
  }

  const handleImportFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''
    dispatch(importNodeQuestions(node.id, file, (result) => {
      setImportResult(result)
      handleQuestionSuccess()
    }))
  }

  return {
    modal, setModal,
    moveModal, setMoveModal,
    importRef, importResult, setImportResult,
    handleDelete, handleLoadMore, handleQuestionSuccess, handleMoveSuccess, handleImportFile,
  }
}
