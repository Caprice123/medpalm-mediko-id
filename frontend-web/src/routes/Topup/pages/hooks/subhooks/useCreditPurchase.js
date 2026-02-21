import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPricingPlans, purchasePricingPlan } from '@store/pricing/userAction'
import { actions as commonActions } from '@store/common/reducer'

export const useCreditPurchase = ({ isOpen, onClose, onPurchaseSuccess, onOpenTransactionDetail }) => {
  const dispatch = useDispatch()
  const plans = useSelector(state => state.pricing.plans)
  const loading = useSelector(state => state.pricing.loading.isPlansLoading)
  const isPurchaseLoading = useSelector(state => state.pricing.loading.isPurchaseLoading)
  const error = useSelector(state => state.pricing.error)

  const [activeFilter, setActiveFilter] = useState('all')
  const snapScriptLoaded = useRef(false)

  useEffect(() => {
    if (isOpen && !snapScriptLoaded.current) {
      const script = document.createElement('script')
      script.src = import.meta.env.VITE_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js'
      script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '')
      script.async = true
      script.onload = () => {
        snapScriptLoaded.current = true
      }
      document.body.appendChild(script)

      return () => {
        const existingScript = document.querySelector('script[src*="midtrans"]')
        if (existingScript) {
          document.body.removeChild(existingScript)
        }
        snapScriptLoaded.current = false
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchPricingPlans())
    }
  }, [isOpen, dispatch])

  const handlePlanSelect = (plan) => {
    const allowedMethods = plan.allowedPaymentMethods || ['xendit']

    let paymentMethod = 'manual'
    if (allowedMethods.includes('midtrans')) {
      paymentMethod = 'midtrans'
    } else if (allowedMethods.includes('xendit')) {
      paymentMethod = 'xendit'
    }

    handlePurchase(plan, paymentMethod)
  }

  const handlePurchase = async (plan, paymentMethod) => {
    await dispatch(purchasePricingPlan(plan.id, paymentMethod, (result) => {
          const { paymentInfo, id: purchaseId } = result.data
    
        if (paymentMethod === 'midtrans' && paymentInfo?.snapToken) {
            if (onPurchaseSuccess) onPurchaseSuccess(result)
    
            if (window.snap) {
              window.snap.pay(paymentInfo.snapToken, {
                onSuccess: () => {
                  onClose()
                  if (onPurchaseSuccess) onPurchaseSuccess()
                },
                onPending: () => {
                  onClose()
                  dispatch(commonActions.setError('Pembayaran sedang diproses. Silakan selesaikan pembayaran Anda.'))
                },
                onError: (res) => {
                  dispatch(commonActions.setError('Pembayaran gagal: ' + (res.status_message || 'Terjadi kesalahan')))
                },
              })
            } else {
                dispatch(commonActions.setError('Payment system not ready. Please try again.'))
            }
        } else if (paymentMethod === 'xendit' && paymentInfo?.invoiceUrl) {
            if (onPurchaseSuccess) onPurchaseSuccess(result)
            window.location.href = paymentInfo.invoiceUrl
        } else if (paymentMethod === 'manual') {
            onClose()
            if (onPurchaseSuccess) onPurchaseSuccess(result)
            if (onOpenTransactionDetail && purchaseId) {
                onOpenTransactionDetail(purchaseId)
            }
        }
    }))
  }

  const filteredPlans = plans.filter(plan => {
    if (activeFilter === 'all') return true
    return plan.bundleType === activeFilter
  })

  return {
    loading,
    isPurchaseLoading,
    error,
    activeFilter,
    setActiveFilter,
    filteredPlans,
    handlePlanSelect,
  }
}
