import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNodeQuestions, deleteNodeQuestion } from '@store/nodeQuestions'
import { importNodeQuestions } from '@store/nodeQuestions/adminAction'

export function useQuestionsPage(node) {
  const dispatch = useDispatch()
  const { pagination } = useSelector(state => state.nodeQuestions)

  const [modal, setModal] = useState({ open: false, question: null })
  const [moveModal, setMoveModal] = useState({ open: false, question: null })
  const importRef = useRef(null)
  const [importResult, setImportResult] = useState(null)

  useEffect(() => {
    dispatch(fetchNodeQuestions(node.id, { page: 1 }))
  }, [dispatch, node.id])

  const handleDelete = (question) => {
    if (!window.confirm('Hapus pertanyaan ini?')) return
    dispatch(deleteNodeQuestion(node.id, question.id, () => dispatch(fetchNodeQuestions(node.id, { page: pagination.page }))))
  }

  const handlePageChange = (page) => dispatch(fetchNodeQuestions(node.id, { page }))

  const handleQuestionSuccess = () => {
    setModal({ open: false, question: null })
    dispatch(fetchNodeQuestions(node.id, { page: pagination.page }))
  }

  const handleMoveSuccess = () => {
    setMoveModal({ open: false, question: null })
    dispatch(fetchNodeQuestions(node.id, { page: pagination.page }))
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
    handleDelete, handlePageChange, handleQuestionSuccess, handleMoveSuccess, handleImportFile,
  }
}
