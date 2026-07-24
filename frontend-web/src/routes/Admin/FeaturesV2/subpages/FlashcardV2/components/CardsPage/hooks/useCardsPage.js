import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNodeCards, deleteNodeCard } from '@store/nodeCards'

export function useCardsPage(node) {
  const dispatch = useDispatch()
  // pagination.page is needed inside handlers to know the current page
  const { pagination } = useSelector(state => state.nodeCards)

  const [modal, setModal] = useState({ open: false, card: null })
  const [moveModal, setMoveModal] = useState({ open: false, card: null })

  useEffect(() => {
    dispatch(fetchNodeCards(node.id, { page: 1 }))
  }, [dispatch, node.id])

  const handleDelete = (card) => {
    if (!window.confirm('Hapus kartu ini?')) return
    dispatch(deleteNodeCard(node.id, card.id, () => dispatch(fetchNodeCards(node.id, { page: pagination.page }))))
  }

  const handlePageChange = (page) => dispatch(fetchNodeCards(node.id, { page }))

  const handleCardSuccess = () => {
    setModal({ open: false, card: null })
    dispatch(fetchNodeCards(node.id, { page: pagination.page }))
  }

  const handleMoveSuccess = () => {
    setMoveModal({ open: false, card: null })
    dispatch(fetchNodeCards(node.id, { page: pagination.page }))
  }

  return {
    modal, setModal,
    moveModal, setMoveModal,
    handleDelete, handlePageChange, handleCardSuccess, handleMoveSuccess,
  }
}
