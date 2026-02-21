import { useTopup } from './hooks/useTopup'
import Table from '@components/common/Table'
import Button from '@components/common/Button'
import Pagination from '@components/Pagination'
import { TopupTableSkeleton } from '@components/common/SkeletonCard'
import CreditPurchase from './components/CreditPurchase'
import TransactionDetail from './components/TransactionDetail'
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
} from './Topup.styles'

function Topup() {
  const {
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
    <Container>
      <HeaderSection>
        <TitleRow>
          <div>
            <PageTitle>Top Up</PageTitle>
            <PageSubtitle>Kelola kredit dan langganan Anda</PageSubtitle>
          </div>
          <Button variant="primary" onClick={handleTopupClick}>
            Top Up Sekarang
          </Button>
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
      </CreditBalanceCard>

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

      <CreditPurchase
        isOpen={showTopupModal}
        onClose={handleCloseTopupModal}
        onPurchaseSuccess={handlePurchaseSuccess}
        onOpenTransactionDetail={handleShowDetail}
      />

      <TransactionDetail
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        purchaseId={selectedPurchaseId}
        onEvidenceUploaded={handleEvidenceUploaded}
      />
    </Container>
  )
}

export default Topup
