import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNodeQuestions, deleteNodeQuestion } from '@store/nodeQuestions'

export function useQuestionsPage(node) {
  const dispatch = useDispatch()
  const { pagination } = useSelector(state => state.nodeQuestions)

  const [modal, setModal] = useState({ open: false, question: null })
  const [moveModal, setMoveModal] = useState({ open: false, question: null })

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

  return {
    modal, setModal,
    moveModal, setMoveModal,
    handleDelete, handlePageChange, handleQuestionSuccess, handleMoveSuccess,
  }
}
