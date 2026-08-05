import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions as atlasActions } from '@store/nodeAtlas/reducer'
import { fetchNodeAtlasModels, loadMoreNodeAtlasModels, unlinkNodeAtlasModel, moveNodeAtlasModel } from '@store/nodeAtlas/adminAction'
import { actions as anatomyActions } from '@store/nodeAnatomy/reducer'
import { fetchNodeAnatomyQuizzes, loadMoreNodeAnatomyQuizzes, unlinkNodeAnatomyQuiz, moveNodeAnatomyQuiz } from '@store/nodeAnatomy/adminAction'

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
  const [atlasLinkModal, setAtlasLinkModal] = useState({ open: false, item: null })
  const [atlasQuizLinkModal, setAtlasQuizLinkModal] = useState({ open: false, item: null })
  const [quizLinkModal, setQuizLinkModal] = useState({ open: false, item: null })
  const [quizAtlasLinkModal, setQuizAtlasLinkModal] = useState({ open: false, item: null })

  const reloadAtlas = () => {
    dispatch(atlasActions.setPagination({ page: 1 }))
    dispatch(fetchNodeAtlasModels(nodeId))
  }

  const reloadQuizzes = () => {
    dispatch(anatomyActions.setPagination({ page: 1 }))
    dispatch(fetchNodeAnatomyQuizzes(nodeId))
  }

  useEffect(() => {
    reloadAtlas()
    reloadQuizzes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, nodeId])

  const handleUnlinkAtlas = (model) => {
    if (!window.confirm(`Lepas "${model.title}" dari modul ini?`)) return
    dispatch(unlinkNodeAtlasModel(nodeId, model.id, reloadAtlas))
  }

  const handleUnlinkQuiz = (quiz) => {
    if (!window.confirm(`Lepas "${quiz.title}" dari modul ini?`)) return
    dispatch(unlinkNodeAnatomyQuiz(nodeId, quiz.id, reloadQuizzes))
  }

  const handleAtlasSuccess = () => {
    setAtlasModal(false)
    reloadAtlas()
  }

  const handleQuizSuccess = () => {
    setQuizModal(false)
    reloadQuizzes()
  }

  const handleAtlasEditSuccess = () => {
    setAtlasEditModal({ open: false, item: null })
    reloadAtlas()
  }

  const handleQuizEditSuccess = () => {
    setQuizEditModal({ open: false, item: null })
    reloadQuizzes()
  }

  const handleAtlasMoveConfirm = (targetNodeId, onSuccess) => {
    dispatch(moveNodeAtlasModel(nodeId, atlasMoveModal.item.id, targetNodeId, onSuccess))
  }

  const handleAtlasMoveSuccess = () => {
    setAtlasMoveModal({ open: false, item: null })
    reloadAtlas()
  }

  const handleQuizMoveConfirm = (targetNodeId, onSuccess) => {
    dispatch(moveNodeAnatomyQuiz(nodeId, quizMoveModal.item.id, targetNodeId, onSuccess))
  }

  const handleQuizMoveSuccess = () => {
    setQuizMoveModal({ open: false, item: null })
    reloadQuizzes()
  }

  const handleAtlasLoadMore = () => dispatch(loadMoreNodeAtlasModels(nodeId))
  const handleQuizLoadMore = () => dispatch(loadMoreNodeAnatomyQuizzes(nodeId))

  return {
    models, atlasPagination, atlasLoading,
    quizzes, quizPagination, quizLoading,
    atlasModal, setAtlasModal,
    quizModal, setQuizModal,
    atlasEditModal, setAtlasEditModal,
    atlasMoveModal, setAtlasMoveModal,
    quizEditModal, setQuizEditModal,
    quizMoveModal, setQuizMoveModal,
    atlasLinkModal, setAtlasLinkModal,
    atlasQuizLinkModal, setAtlasQuizLinkModal,
    quizLinkModal, setQuizLinkModal,
    quizAtlasLinkModal, setQuizAtlasLinkModal,
    handleUnlinkAtlas, handleUnlinkQuiz,
    handleAtlasSuccess, handleQuizSuccess,
    handleAtlasEditSuccess, handleQuizEditSuccess,
    handleAtlasMoveConfirm, handleAtlasMoveSuccess,
    handleQuizMoveConfirm, handleQuizMoveSuccess,
    handleAtlasLoadMore, handleQuizLoadMore,
  }
}
