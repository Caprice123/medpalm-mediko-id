import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPurchaseHistory, fetchUserStatus, fetchInitialTopupData, purchasePricingPlan } from '@store/pricing/userAction'
import { actions } from '@store/pricing/reducer'
import { actions as commonActions } from '@store/common/reducer'
import AOS from 'aos'

export const useTopup = () => {
  const dispatch = useDispatch()
  const purchaseHistory = useSelector(state => state.pricing.purchaseHistory)
  const pagination = useSelector(state => state.pricing.historyPagination)
  const userStatus = useSelector(state => state.pricing.userStatus)
  const loading = useSelector(state => state.pricing.loading.isHistoryLoading)
  const plans = useSelector(state => state.pricing.plans)
  const plansLoading = useSelector(state => state.pricing.loading.isPlansLoading)
  const isPurchaseLoading = useSelector(state => state.pricing.loading.isPurchaseLoading)

  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null)
  const [activeTab, setActiveTab] = useState('plans')
  const [planFilter, setPlanFilter] = useState('all')
  const [showContactModal, setShowContactModal] = useState(false)
  const [pendingPlan, setPendingPlan] = useState(null)
  const snapScriptLoaded = useRef(false)

  const filteredPlans = useMemo(() => plans.filter(plan =>
    planFilter === 'all' ? true : plan.bundleType === planFilter
  ), [planFilter, plans])

  useEffect(() => {
    AOS.init({
        duration: 500,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        delay: 0,
    })

    const handleAosIn = ({ detail }) => {
      detail.removeAttribute('data-aos')
      detail.removeAttribute('data-aos-delay')
    }
    document.addEventListener('aos:in', handleAosIn)

    dispatch(fetchInitialTopupData())

    if (!snapScriptLoaded.current) {
      const script = document.createElement('script')
      script.src = import.meta.env.VITE_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js'
      script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '')
      script.async = true
      script.onload = () => { snapScriptLoaded.current = true }
      document.body.appendChild(script)
    }

    return () => {
      document.removeEventListener('aos:in', handleAosIn)
    }
  }, [dispatch])

  const handlePageChange = (newPage) => {
    dispatch(actions.setHistoryPage(newPage))
    dispatch(fetchPurchaseHistory())
  }

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

  const handlePlanSelect = (plan) => {
    setPendingPlan(plan)
    setShowContactModal(true)
  }

  const handleContactConfirm = ({ phoneNumber, university }) => {
    if (!pendingPlan) return
    const plan = pendingPlan
    const allowedMethods = plan.allowedPaymentMethods || ['xendit']
    let paymentMethod = 'manual'
    if (allowedMethods.includes('midtrans')) paymentMethod = 'midtrans'
    else if (allowedMethods.includes('xendit')) paymentMethod = 'xendit'

    dispatch(purchasePricingPlan(plan.id, paymentMethod, (result) => {
      setShowContactModal(false)
      setPendingPlan(null)
      const { paymentInfo, id: purchaseId } = result.data

      if (paymentMethod === 'midtrans' && paymentInfo?.snapToken) {
        handlePurchaseSuccess()
        if (window.snap) {
          window.snap.pay(paymentInfo.snapToken, {
            onSuccess: () => handlePurchaseSuccess(),
            onPending: () => dispatch(commonActions.setError('Pembayaran sedang diproses. Silakan selesaikan pembayaran Anda.')),
            onError: (res) => dispatch(commonActions.setError('Pembayaran gagal: ' + (res.status_message || 'Terjadi kesalahan'))),
          })
        } else {
          dispatch(commonActions.setError('Payment system not ready. Please try again.'))
        }
      } else if (paymentMethod === 'xendit' && paymentInfo?.invoiceUrl) {
        handlePurchaseSuccess()
        window.location.href = paymentInfo.invoiceUrl
      } else if (paymentMethod === 'manual') {
        handlePurchaseSuccess()
        if (purchaseId) handleShowDetail(purchaseId)
      }
    }, { phoneNumber, university }))
  }

  const handleCloseContactModal = () => {
    setShowContactModal(false)
    setPendingPlan(null)
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedPurchaseId(null)
  }

  return {
    purchaseHistory,
    pagination,
    userStatus,
    loading,
    plans,
    plansLoading,
    filteredPlans,
    planFilter,
    setPlanFilter,
    activeTab,
    setActiveTab,
    showDetailModal,
    selectedPurchaseId,
    isPurchaseLoading,
    showContactModal,
    pendingPlan,
    handlePageChange,
    handlePurchaseSuccess,
    handleEvidenceUploaded,
    handleShowDetail,
    handlePlanSelect,
    handleContactConfirm,
    handleCloseContactModal,
    handleCloseDetailModal,
  }
}
