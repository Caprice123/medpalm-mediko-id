import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNodeAtlasModels, unlinkNodeAtlasModel, moveNodeAtlasModel } from '@store/nodeAtlas/adminAction'
import { fetchNodeAnatomyQuizzes, unlinkNodeAnatomyQuiz, moveNodeAnatomyQuiz } from '@store/nodeAnatomy/adminAction'

export function useModuleDetail(nodeId) {
  const dispatch = useDispatch()
  const { models, pagination: atlasPagination, loading: atlasLoading } = useSelector(s => s.nodeAtlas)
  const { quizzes, pagination: quizPagination, loading: quizLoading } = useSelector(s => s.nodeAnatomy)

  const [atlasModal, setAtlasModal] = useState(false)
  const [quizModal, setQuizModal] = useState(false)
  const [atlasEditModal, setAtlasEditModal] = useState({ open: false, item: null })
  const [atlasMoveModal, setAtlasMoveModal] = useState({ open: false, item: null })
  const [quizEditModal, setQuizEditModal] = useState({ open: false, item: null })
  const [quizMoveModal, setQuizMoveModal] = useState({ open: false, item: null })

  useEffect(() => {
    dispatch(fetchNodeAtlasModels(nodeId, { page: 1 }))
    dispatch(fetchNodeAnatomyQuizzes(nodeId, { page: 1 }))
  }, [dispatch, nodeId])

  const handleUnlinkAtlas = (model) => {
    if (!window.confirm(`Lepas "${model.title}" dari modul ini?`)) return
    dispatch(unlinkNodeAtlasModel(nodeId, model.id, () =>
      dispatch(fetchNodeAtlasModels(nodeId, { page: atlasPagination.page }))
    ))
  }

  const handleUnlinkQuiz = (quiz) => {
    if (!window.confirm(`Lepas "${quiz.title}" dari modul ini?`)) return
    dispatch(unlinkNodeAnatomyQuiz(nodeId, quiz.id, () =>
      dispatch(fetchNodeAnatomyQuizzes(nodeId, { page: quizPagination.page }))
    ))
  }

  const handleAtlasSuccess = () => {
    setAtlasModal(false)
    dispatch(fetchNodeAtlasModels(nodeId, { page: 1 }))
  }

  const handleQuizSuccess = () => {
    setQuizModal(false)
    dispatch(fetchNodeAnatomyQuizzes(nodeId, { page: 1 }))
  }

  const handleAtlasEditSuccess = () => {
    setAtlasEditModal({ open: false, item: null })
    dispatch(fetchNodeAtlasModels(nodeId, { page: atlasPagination.page }))
  }

  const handleQuizEditSuccess = () => {
    setQuizEditModal({ open: false, item: null })
    dispatch(fetchNodeAnatomyQuizzes(nodeId, { page: quizPagination.page }))
  }

  const handleAtlasMoveConfirm = (targetNodeId, onSuccess) => {
    dispatch(moveNodeAtlasModel(nodeId, atlasMoveModal.item.id, targetNodeId, onSuccess))
  }

  const handleAtlasMoveSuccess = () => {
    setAtlasMoveModal({ open: false, item: null })
    dispatch(fetchNodeAtlasModels(nodeId, { page: atlasPagination.page }))
  }

  const handleQuizMoveConfirm = (targetNodeId, onSuccess) => {
    dispatch(moveNodeAnatomyQuiz(nodeId, quizMoveModal.item.id, targetNodeId, onSuccess))
  }

  const handleQuizMoveSuccess = () => {
    setQuizMoveModal({ open: false, item: null })
    dispatch(fetchNodeAnatomyQuizzes(nodeId, { page: quizPagination.page }))
  }

  const handleAtlasPageChange = (page) => dispatch(fetchNodeAtlasModels(nodeId, { page }))
  const handleQuizPageChange = (page) => dispatch(fetchNodeAnatomyQuizzes(nodeId, { page }))

  return {
    models, atlasPagination, atlasLoading,
    quizzes, quizPagination, quizLoading,
    atlasModal, setAtlasModal,
    quizModal, setQuizModal,
    atlasEditModal, setAtlasEditModal,
    atlasMoveModal, setAtlasMoveModal,
    quizEditModal, setQuizEditModal,
    quizMoveModal, setQuizMoveModal,
    handleUnlinkAtlas, handleUnlinkQuiz,
    handleAtlasSuccess, handleQuizSuccess,
    handleAtlasEditSuccess, handleQuizEditSuccess,
    handleAtlasMoveConfirm, handleAtlasMoveSuccess,
    handleQuizMoveConfirm, handleQuizMoveSuccess,
    handleAtlasPageChange, handleQuizPageChange,
  }
}
