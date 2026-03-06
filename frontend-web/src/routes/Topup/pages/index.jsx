import { useTopup } from './hooks/useTopup'
import PricingPlanCard from '@components/common/PricingPlanCard'
import Table from '@components/common/Table'
import Button from '@components/common/Button'
import Pagination from '@components/Pagination'
import { TopupTableSkeleton, CreditPurchaseSkeleton } from '@components/common/SkeletonCard'
import EmptyState from '@components/common/EmptyState'
import TransactionDetail from './components/TransactionDetail'
import 'aos/dist/aos.css'
import {
  PricingGrid,
  PricingFilterContainer,
} from '@routes/Home/Home.styles'
import {
  getStatusLabel,
  getTypeLabel,
  formatCurrency,
} from '@utils/transactionUtils'
import {
  Container,
  HeaderSection,
  TitleRow,
  PageTitle,
  PageSubtitle,
  CreditBalanceCard,
  BalanceGrid,
  BalanceSection,
  BalanceLabel,
  BalanceAmount,
  TableSection,
  SectionTitle,
  StatusBadge,
  TypeBadge,
  AmountText,
  TabsRow,
  Tab,
  PlansSection,
  PlanFilterTab,
  PageContainer,
} from './Topup.styles'
import { Parallax, ParallaxProvider } from 'react-scroll-parallax'

function Topup() {
  const {
    purchaseHistory,
    pagination,
    userStatus,
    loading,
    filteredPlans,
    plansLoading,
    planFilter,
    setPlanFilter,
    activeTab,
    setActiveTab,
    showDetailModal,
    selectedPurchaseId,
    isPurchaseLoading,
    handlePageChange,
    handlePurchaseSuccess,
    handleEvidenceUploaded,
    handleShowDetail,
    handlePlanSelect,
    handleCloseDetailModal,
  } = useTopup()

  const safeHistory = Array.isArray(purchaseHistory) ? purchaseHistory : []

  const formatSubscriptionEndDate = (endDate) => {
    if (!endDate) return null
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(endDate))
  }

  const columns = [
    {
      key: 'purchaseDate',
      header: 'Tanggal',
      width: '140px',
      render: (purchaseDate) => {
        if (!purchaseDate) return '-'
        return (
          <div style={{ fontSize: '0.875rem' }}>
            <div style={{ fontWeight: '500', color: '#111827' }}>
              {new Date(purchaseDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
              {new Date(purchaseDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })} WIB
            </div>
          </div>
        )
      }
    },
    {
      key: 'planName',
      header: 'Paket',
      render: (planName) => planName || '-'
    },
    {
      key: 'bundleType',
      header: 'Tipe',
      width: '120px',
      align: 'center',
      render: (bundleType) => (
        <TypeBadge type={bundleType}>
          {getTypeLabel(bundleType)}
        </TypeBadge>
      )
    },
    {
      key: 'amountPaid',
      header: 'Nominal',
      width: '150px',
      align: 'right',
      render: (amountPaid) => (
        <AmountText>{formatCurrency(amountPaid)}</AmountText>
      )
    },
    {
      key: 'paymentStatus',
      header: 'Status',
      width: '120px',
      align: 'center',
      render: (paymentStatus) => (
        <StatusBadge status={paymentStatus}>
          {getStatusLabel(paymentStatus)}
        </StatusBadge>
      )
    },
    {
      header: 'Aksi',
      width: '100px',
      align: 'center',
      render: (row) => (
        <Button
          size="small"
          variant="primary"
          onClick={() => handleShowDetail(row.id)}
        >
          Detail
        </Button>
      )
    }
  ]

  return (
    <ParallaxProvider>
        <PageContainer>
            <Container>
            {/* <HeaderSection>
                <TitleRow>
                <div>
                    <PageTitle>Top Up</PageTitle>
                    <PageSubtitle>Kelola kredit dan langganan Anda</PageSubtitle>
                </div>
                </TitleRow>
            </HeaderSection>

            <CreditBalanceCard>
                <BalanceGrid $hasSubscription={userStatus?.hasActiveSubscription}>
                <BalanceSection>
                    <BalanceLabel>Saldo Kredit</BalanceLabel>
                    <BalanceAmount>
                    <span>💰</span>
                    {(userStatus?.creditBalance || 0).toLocaleString('id-ID')} Kredit
                    </BalanceAmount>
                </BalanceSection>

                {userStatus?.hasActiveSubscription && userStatus?.subscription && (
                    <BalanceSection $withBorder>
                    <BalanceLabel>Status Langganan</BalanceLabel>
                    <BalanceAmount style={{ fontSize: '1.5rem' }}>
                        <span>⭐</span>
                        Aktif
                    </BalanceAmount>
                    <div style={{
                        fontSize: '0.85rem',
                        marginTop: '0.5rem',
                        color: '#ffffff',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                        opacity: 0.95
                    }}>
                        Hingga {formatSubscriptionEndDate(userStatus.subscription.endDate)}
                    </div>
                    {userStatus.subscription.daysRemaining <= 7 && (
                        <div style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(255, 255, 255, 0.25)',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        color: '#ffffff',
                        fontWeight: '600',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}>
                        ⚠️ Berakhir dalam {userStatus.subscription.daysRemaining} hari
                        </div>
                    )}
                    </BalanceSection>
                )}
                </BalanceGrid>
            </CreditBalanceCard> */}

            <TabsRow>
                <Tab $active={activeTab === 'plans'} onClick={() => setActiveTab('plans')}>
                💳 Pilih Paket
                </Tab>
                <Tab $active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
                📋 Riwayat Transaksi
                </Tab>
            </TabsRow>

            {activeTab === 'plans' && (
                <PlansSection>
                <PricingFilterContainer>
                    {[
                    { key: 'all', label: 'Semua Paket' },
                    { key: 'credits', label: 'Kredit' },
                    { key: 'subscription', label: 'Berlangganan' },
                    { key: 'hybrid', label: 'Paket Hybrid' },
                    ].map(({ key, label }) => (
                    <PlanFilterTab key={key} $active={planFilter === key} onClick={() => setPlanFilter(key)}>
                        {label}
                    </PlanFilterTab>
                    ))}
                </PricingFilterContainer>

                {plansLoading ? (
                    <CreditPurchaseSkeleton planCount={6} />
                ) : filteredPlans.length > 0 ? (
                        <PricingGrid>
                        {filteredPlans.map((plan, index) => (
                            <PricingPlanCard
                                key={planFilter + plan.id}
                                plan={plan}
                                index={index}
                                renderButton={(p) => (
                                    <Button
                                        variant={p.isPopular ? 'primary' : 'outline'}
                                        fullWidth
                                        onClick={() => handlePlanSelect(p)}
                                        disabled={isPurchaseLoading}
                                    >
                                        {isPurchaseLoading ? 'Memproses...' : 'Pilih Paket'}
                                    </Button>
                                )}
                            />
                        ))}

                        </PricingGrid>
                ) : (
                    <EmptyState
                    icon="💳"
                    title="Tidak ada paket tersedia"
                    description="Pilih kategori lain atau coba lagi nanti"
                    />
                )}
                </PlansSection>
            )}

            {activeTab === 'history' && (
                <TableSection>
                <SectionTitle>📋 Riwayat Transaksi</SectionTitle>

                {loading ? (
                    <TopupTableSkeleton rowCount={5} />
                ) : (
                    <>
                    <Table
                        columns={columns}
                        data={safeHistory}
                        loading={loading}
                        striped
                        hoverable
                        emptyText="Belum ada transaksi"
                        emptySubtext="Mulai top up untuk melihat riwayat transaksi Anda"
                    />

                    {!loading && (pagination.page > 1 || !pagination.isLastPage) && (
                        <Pagination
                        currentPage={pagination.page}
                        isLastPage={pagination.isLastPage}
                        onPageChange={handlePageChange}
                        isLoading={loading}
                        variant="admin"
                        language="id"
                        />
                    )}
                    </>
                )}
                </TableSection>
            )}

            <TransactionDetail
                isOpen={showDetailModal}
                onClose={handleCloseDetailModal}
                purchaseId={selectedPurchaseId}
                onEvidenceUploaded={handleEvidenceUploaded}
            />
            </Container>
        </PageContainer>
    </ParallaxProvider>
  )
}

export default Topup
