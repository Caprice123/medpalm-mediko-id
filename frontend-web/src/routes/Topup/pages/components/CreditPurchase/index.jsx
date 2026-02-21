import { useCreditPurchase } from '../../hooks/subhooks/useCreditPurchase'
import { CreditPurchaseSkeleton } from '@components/common/SkeletonCard'
import Button from '@components/common/Button'
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
  EmptyState,
  ErrorMessage,
  FilterTabs,
  FilterTab,
  PlanDescription,
} from './CreditPurchase.styles'

function CreditPurchase({ isOpen, onClose, onPurchaseSuccess, onOpenTransactionDetail }) {
  const {
    loading,
    isPurchaseLoading,
    error,
    activeFilter,
    setActiveFilter,
    filteredPlans,
    handlePlanSelect,
  } = useCreditPurchase({ isOpen, onClose, onPurchaseSuccess, onOpenTransactionDetail })

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

          {loading ? (
            <CreditPurchaseSkeleton planCount={6} />
          ) : (
            <>
              <FilterTabs>
                <FilterTab $active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
                  Semua Paket
                </FilterTab>
                <FilterTab $active={activeFilter === 'credits'} onClick={() => setActiveFilter('credits')}>
                  Kredit
                </FilterTab>
                <FilterTab $active={activeFilter === 'subscription'} onClick={() => setActiveFilter('subscription')}>
                  Berlangganan
                </FilterTab>
                <FilterTab $active={activeFilter === 'hybrid'} onClick={() => setActiveFilter('hybrid')}>
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
                        disabled={isPurchaseLoading}
                      >
                        {isPurchaseLoading ? 'Memproses...' : 'Pilih Paket'}
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
