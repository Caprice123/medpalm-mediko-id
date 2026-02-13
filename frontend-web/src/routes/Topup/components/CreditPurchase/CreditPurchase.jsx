import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPricingPlans, purchasePricingPlan } from '@store/pricing/action'
import { CreditPurchaseSkeleton } from '@components/common/SkeletonCard'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  PlansGrid,
  PlanCard,
  PopularBadge,
  PlanName,
  PlanCredits,
  PlanPrice,
  DiscountBadge,
  PurchaseButton,
  LoadingState,
  EmptyState,
  ErrorMessage,
  FilterTabs,
  FilterTab,
  PlanDescription,
} from './CreditPurchase.styles'
import Button from '@components/common/Button'

function CreditPurchase({ isOpen, onClose, onPurchaseSuccess, onOpenTransactionDetail }) {
  const dispatch = useDispatch()
  const plans = useSelector(state => state.pricing.plans)
  const loading = useSelector(state => state.pricing.loading.isPlansLoading)
  const error = useSelector(state => state.pricing.error)

  const [activeFilter, setActiveFilter] = useState('all')
  const [purchasingPlanId, setPurchasingPlanId] = useState(null)
  const snapScriptLoaded = useRef(false)

  // Load Midtrans Snap script
  useEffect(() => {
    if (isOpen && !snapScriptLoaded.current) {
      const script = document.createElement('script')
      script.src = import.meta.env.VITE_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js'
      script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '')
      script.async = true
      script.onload = () => {
        snapScriptLoaded.current = true
        console.log('Midtrans Snap script loaded')
      }
      document.body.appendChild(script)

      return () => {
        // Cleanup script on unmount
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

    // Determine payment method
    // Priority: midtrans > xendit > manual
    let paymentMethod = 'manual'
    if (allowedMethods.includes('midtrans')) {
      paymentMethod = 'midtrans'
    } else if (allowedMethods.includes('xendit')) {
      paymentMethod = 'xendit'
    }

    handlePurchase(plan, paymentMethod)
  }

  const handlePurchase = async (plan, paymentMethod) => {
    try {
      setPurchasingPlanId(plan.id)

      const result = await dispatch(purchasePricingPlan(plan.id, paymentMethod))

      const { paymentInfo, id: purchaseId } = result.data

      // Handle based on payment method
      if (paymentMethod === 'midtrans' && paymentInfo?.snapToken) {
        // For Midtrans: open Snap payment popup
        if (onPurchaseSuccess) {
          onPurchaseSuccess(result)
        }

        // Wait for Snap to be available
        if (window.snap) {
          window.snap.pay(paymentInfo.snapToken, {
            onSuccess: function(result) {
              console.log('Midtrans payment success:', result)
              onClose()
              // Refresh purchase history after successful payment
              if (onPurchaseSuccess) {
                onPurchaseSuccess()
              }
            },
            onPending: function(result) {
              console.log('Midtrans payment pending:', result)
              onClose()
              alert('Pembayaran sedang diproses. Silakan selesaikan pembayaran Anda.')
            },
            onError: function(result) {
              console.error('Midtrans payment error:', result)
              alert('Pembayaran gagal: ' + (result.status_message || 'Terjadi kesalahan'))
            },
            onClose: function() {
              console.log('Midtrans popup closed')
              setPurchasingPlanId(null)
            }
          })
        } else {
          console.error('Midtrans Snap not loaded')
          alert('Payment system not ready. Please try again.')
          setPurchasingPlanId(null)
        }
      } else if (paymentMethod === 'xendit' && paymentInfo?.invoiceUrl) {
        // For Xendit: redirect to invoice URL
        if (onPurchaseSuccess) {
          onPurchaseSuccess(result)
        }

        // Redirect to Xendit payment page
        window.location.href = paymentInfo.invoiceUrl
      } else if (paymentMethod === 'manual') {
        // For Manual: close pricing modal and open transaction detail
        onClose()

        if (onPurchaseSuccess) {
          onPurchaseSuccess(result)
        }

        // Open transaction detail modal with the created purchase
        if (onOpenTransactionDetail && purchaseId) {
          onOpenTransactionDetail(purchaseId)
        }
      }
    } catch (err) {
      alert('Purchase failed: ' + (err.response?.data?.message || err.message))
      console.error('Purchase error:', err)
      setPurchasingPlanId(null)
    }
  }

  const filteredPlans = plans.filter(plan => {
    if (activeFilter === 'all') return true
    return plan.bundleType === activeFilter
  })

  if (!isOpen) return null

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Pilih Paket yang Sesuai</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {/* Plan Selection */}
          {loading ? (
            <CreditPurchaseSkeleton planCount={6} />
          ) : (
            <>
              <FilterTabs>
                <FilterTab
                  $active={activeFilter === 'all'}
                  onClick={() => setActiveFilter('all')}
                >
                  Semua Paket
                </FilterTab>
                <FilterTab
                  $active={activeFilter === 'credits'}
                  onClick={() => setActiveFilter('credits')}
                >
                  Kredit
                </FilterTab>
                <FilterTab
                  $active={activeFilter === 'subscription'}
                  onClick={() => setActiveFilter('subscription')}
                >
                  Berlangganan
                </FilterTab>
                <FilterTab
                  $active={activeFilter === 'hybrid'}
                  onClick={() => setActiveFilter('hybrid')}
                >
                  Paket Hybrid
                </FilterTab>
              </FilterTabs>

              {filteredPlans.length > 0 ? (
                <PlansGrid>
                  {filteredPlans.map((plan) => (
                    <PlanCard key={plan.id}>
                      {plan.isPopular && <PopularBadge>Paling Populer</PopularBadge>}
                      <PlanName>{plan.name}</PlanName>

                      <PlanCredits>
                        {plan.bundleType === 'subscription' ? (
                          `${plan.durationDays || 0} Hari Akses`
                        ) : plan.bundleType === 'hybrid' ? (
                          <>
                            {(plan.creditsIncluded || 0).toLocaleString()} Kredit
                            <br />
                            {plan.durationDays || 0} Hari
                          </>
                        ) : (
                          `${(plan.creditsIncluded || 0).toLocaleString()} Kredit`
                        )}
                      </PlanCredits>

                      <PlanPrice>
                        Rp {Number(plan.price || 0).toLocaleString('id-ID')}
                        {plan.discount > 0 && (
                          <DiscountBadge>Hemat {plan.discount}%</DiscountBadge>
                        )}
                      </PlanPrice>

                      <PlanDescription>
                        {plan.description || 'Akses semua fitur pembelajaran premium'}
                      </PlanDescription>

                      <Button
                        variant="primary"
                        onClick={() => handlePlanSelect(plan)}
                        fullWidth
                        disabled={purchasingPlanId === plan.id}
                      >
                        {purchasingPlanId === plan.id ? 'Memproses...' : 'Pilih Paket'}
                      </Button>
                    </PlanCard>
                  ))}
                </PlansGrid>
              ) : (
                <EmptyState>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
                  <div>Tidak ada paket tersedia</div>
                  <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Pilih kategori lain atau coba lagi nanti
                  </div>
                </EmptyState>
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CreditPurchase
