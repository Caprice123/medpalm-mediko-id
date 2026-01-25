import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPricingPlans, purchasePricingPlan } from '@store/pricing/action'
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

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchPricingPlans())
    }
  }, [isOpen, dispatch])

  const handlePlanSelect = (plan) => {
    const allowedMethods = plan.allowedPaymentMethods || ['xendit']

    // Determine payment method
    // If both methods allowed, default to xendit
    const paymentMethod = allowedMethods.includes('xendit') ? 'xendit' : 'manual'

    handlePurchase(plan, paymentMethod)
  }

  const handlePurchase = async (plan, paymentMethod) => {
    try {
      setPurchasingPlanId(plan.id)

      const result = await dispatch(purchasePricingPlan(plan.id, paymentMethod))

      const { paymentInfo, id: purchaseId } = result.data

      // Handle based on payment method
      if (paymentMethod === 'xendit' && paymentInfo?.invoiceUrl) {
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
    } finally {
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

          {loading ? (
            <LoadingState>Memuat paket...</LoadingState>
          ) : filteredPlans.length > 0 ? (
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
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CreditPurchase
