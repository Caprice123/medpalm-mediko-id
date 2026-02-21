import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPurchaseHistory, fetchUserStatus } from '@store/pricing/userAction'
import { actions } from '@store/pricing/reducer'

export const useTopup = () => {
  const dispatch = useDispatch()
  const purchaseHistory = useSelector(state => state.pricing.purchaseHistory)
  const pagination = useSelector(state => state.pricing.historyPagination)
  const userStatus = useSelector(state => state.pricing.userStatus)
  const loading = useSelector(state => state.pricing.loading.isHistoryLoading)

  const [showTopupModal, setShowTopupModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null)

  useEffect(() => {
    dispatch(fetchPurchaseHistory())
    dispatch(fetchUserStatus())
  }, [dispatch])

  const handlePageChange = (newPage) => {
    dispatch(actions.setHistoryPage(newPage))
    dispatch(fetchPurchaseHistory())
  }

  const handleTopupClick = () => setShowTopupModal(true)

  const handlePurchaseSuccess = () => {
    dispatch(fetchPurchaseHistory())
    dispatch(fetchUserStatus())
  }

  const handleEvidenceUploaded = () => {
    dispatch(fetchPurchaseHistory())
    dispatch(fetchUserStatus())
  }

  const handleShowDetail = (purchaseId) => {
    setSelectedPurchaseId(purchaseId)
    setShowDetailModal(true)
  }

  const handleCloseTopupModal = () => setShowTopupModal(false)

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedPurchaseId(null)
  }

  return {
    purchaseHistory,
    pagination,
    userStatus,
    loading,
    showTopupModal,
    showDetailModal,
    selectedPurchaseId,
    handlePageChange,
    handleTopupClick,
    handlePurchaseSuccess,
    handleEvidenceUploaded,
    handleShowDetail,
    handleCloseTopupModal,
    handleCloseDetailModal,
  }
}
