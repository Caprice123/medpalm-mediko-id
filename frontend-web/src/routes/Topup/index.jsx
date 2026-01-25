import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPurchaseHistory, fetchUserStatus } from '@store/pricing/action'
import Table from '@components/common/Table'
import Button from '@components/common/Button'
import Pagination from '@components/Pagination'
import CreditPurchase from './components/CreditPurchase/CreditPurchase'
import TransactionDetail from './components/TransactionDetail/TransactionDetail'
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
  AmountText
} from './Topup.styles'

function Topup() {
  const dispatch = useDispatch()
  const [showTopupModal, setShowTopupModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null)

  // Redux state
  const purchaseHistory = useSelector(state => state.pricing.purchaseHistory)
  const pagination = useSelector(state => state.pricing.historyPagination)
  const userStatus = useSelector(state => state.pricing.userStatus)
  const loading = useSelector(state => state.pricing.loading.isHistoryLoading)

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchPurchaseHistory(pagination.page, pagination.perPage))
    dispatch(fetchUserStatus())
  }, [dispatch])

  const handlePageChange = (newPage) => {
    dispatch(fetchPurchaseHistory(newPage, pagination.perPage))
  }

  const handleTopupClick = () => {
    setShowTopupModal(true)
  }

  const handlePurchaseSuccess = () => {
    // Refresh data after successful purchase
    dispatch(fetchPurchaseHistory(pagination.page, pagination.perPage))
    dispatch(fetchUserStatus())
  }

  const handleEvidenceUploaded = () => {
    // Refresh data after evidence upload
    dispatch(fetchPurchaseHistory(pagination.page, pagination.perPage))
    dispatch(fetchUserStatus())
  }

  // Handle showing transaction detail
  const handleShowDetail = (purchaseId) => {
    setSelectedPurchaseId(purchaseId)
    setShowDetailModal(true)
  }

  // Table columns configuration
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

  // Ensure purchaseHistory is an array
  const safeHistory = Array.isArray(purchaseHistory) ? purchaseHistory : []

  // Format subscription end date
  const formatSubscriptionEndDate = (endDate) => {
    if (!endDate) return null
    const date = new Date(endDate)
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  return (
    <Container>
      <HeaderSection>
        <TitleRow>
          <div>
            <PageTitle>Top Up</PageTitle>
            <PageSubtitle>
              Kelola kredit dan langganan Anda
            </PageSubtitle>
          </div>
          <Button variant="primary" onClick={handleTopupClick}>
            Top Up Sekarang
          </Button>
        </TitleRow>
      </HeaderSection>

      {/* Credit Balance Card */}
      <CreditBalanceCard>
        <BalanceGrid $hasSubscription={userStatus?.hasActiveSubscription}>
          {/* Credit Balance */}
          <BalanceSection>
            <BalanceLabel>Saldo Kredit</BalanceLabel>
            <BalanceAmount>
              <span>💰</span>
              {(userStatus?.creditBalance || 0).toLocaleString('id-ID')} Kredit
            </BalanceAmount>
          </BalanceSection>

          {/* Subscription Status */}
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

      {/* Transaction History Table */}
      <TableSection>
        <SectionTitle>
          📋 Riwayat Transaksi
        </SectionTitle>

        <Table
          columns={columns}
          data={safeHistory}
          loading={loading}
          striped
          hoverable
          emptyText="Belum ada transaksi"
          emptySubtext="Mulai top up untuk melihat riwayat transaksi Anda"
        />

        {(pagination.page > 1 || !pagination.isLastPage) && (
          <Pagination
            currentPage={pagination.page}
            isLastPage={pagination.isLastPage}
            onPageChange={handlePageChange}
            isLoading={loading}
            variant="user"
            language="id"
          />
        )}
      </TableSection>

      {/* Topup Modal */}
      <CreditPurchase
        isOpen={showTopupModal}
        onClose={() => setShowTopupModal(false)}
        onPurchaseSuccess={handlePurchaseSuccess}
        onOpenTransactionDetail={handleShowDetail}
      />

      {/* Transaction Detail Modal */}
      <TransactionDetail
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedPurchaseId(null)
        }}
        purchaseId={selectedPurchaseId}
        onEvidenceUploaded={handleEvidenceUploaded}
      />
    </Container>
  )
}

export default Topup
