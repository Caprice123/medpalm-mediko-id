import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { actions, fetchNodeCards, loadMoreNodeCards, deleteNodeCard } from '@store/nodeCards'
import { importNodeCards } from '@store/nodeCards/adminAction'

const { setPagination } = actions

export function useCardsPage(node) {
  const dispatch = useDispatch()

  const [modal, setModal] = useState({ open: false, card: null })
  const [moveModal, setMoveModal] = useState({ open: false, card: null })
  const importRef = useRef(null)
  const [importResult, setImportResult] = useState(null)

  const reload = () => {
    dispatch(setPagination({ page: 1 }))
    dispatch(fetchNodeCards(node.id))
  }

  useEffect(reload, [dispatch, node.id])

  const handleDelete = (card) => {
    if (!window.confirm('Hapus kartu ini?')) return
    dispatch(deleteNodeCard(node.id, card.id, reload))
  }

  const handleLoadMore = () => dispatch(loadMoreNodeCards(node.id))

  const handleCardSuccess = () => {
    setModal({ open: false, card: null })
    reload()
  }

  const handleMoveSuccess = () => {
    setMoveModal({ open: false, card: null })
    reload()
  }

  const handleImportFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''
    dispatch(importNodeCards(node.id, file, (result) => {
      setImportResult(result)
      handleCardSuccess()
    }))
  }

  return {
    modal, setModal,
    moveModal, setMoveModal,
    importRef, importResult, setImportResult,
    handleDelete, handleLoadMore, handleCardSuccess, handleMoveSuccess, handleImportFile,
  }
}
