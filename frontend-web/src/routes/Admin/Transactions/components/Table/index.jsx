
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/credit/reducer'
import Pagination from '@components/Pagination'
import { confirmPayment, fetchAllTransactions } from '@store/credit/action'
import Table from '@components/common/Table'
import Button from '@components/common/Button'
import AdminTransactionDetail from '../TransactionDetail'
import {
  getStatusLabel,
  getTypeLabel,
  getPaymentMethodLabel,
  formatCurrency
} from '@utils/transactionUtils'
import {
  TypeBadge,
  AmountText,
  StatusBadge,
  ActionGroup
} from '../../Transactions.styles'

function TransactionList() {
  const dispatch = useDispatch()
  const transactions = useSelector(state => state.credit.transactions) || []
  const loading = useSelector(state => state.credit.loading) || {}
  const pagination = useSelector(state => state.credit.pagination) || { page: 1, perPage: 20, isLastPage: true }
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null)

  // Format transactions for display
  const allTransactions = Array.isArray(transactions) ? transactions.map(t => ({
    ...t,
    displayType: t?.type || 'unknown'
  })) : []

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAllTransactions())
  }
  
  const handleConfirmPayment = async (transaction, status) => {
    const confirmMessage = status === 'completed'
      ? 'Are you sure you want to approve this payment?'
      : 'Are you sure you want to reject this payment?'

    if (!confirm(confirmMessage)) return

    try {
      await dispatch(confirmPayment(transaction.id, status))
      fetchAllTransactions()
      alert(`Payment ${status === 'completed' ? 'approved' : 'rejected'} successfully!`)
    } catch (err) {
      alert('Failed to update payment: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleShowDetail = (purchaseId) => {
    setSelectedPurchaseId(purchaseId)
    setShowDetailModal(true)
  }

  const handleStatusChange = () => {
    dispatch(fetchAllTransactions())
  }
  
    const columns = [
      {
        key: 'id',
        header: 'ID',
        width: '70px',
        render: (id) => `#${id || '-'}`
      },
      {
        key: 'createdAt',
        header: 'Tanggal',
        width: '140px',
        render: (createdAt) => {
          if (!createdAt) return '-'
          return (
            <div style={{ fontSize: '0.875rem' }}>
              <div style={{ fontWeight: '500', color: '#111827' }}>
                {new Date(createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                {new Date(createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })} WIB
              </div>
            </div>
          )
        }
      },
      {
        key: 'user',
        header: 'User',
        width: '200px',
        render: (user) => (
          <div style={{ fontSize: '0.875rem' }}>
            <div style={{ fontWeight: '500', color: '#111827' }}>
              {user.name || 'No Name'}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
              {user.email}
            </div>
          </div>
        )
      },
      {
        key: 'bundleType',
        header: 'Tipe',
        width: '110px',
        align: 'center',
        render: (displayType) => (
          <TypeBadge type={displayType || 'unknown'}>
            {getTypeLabel(displayType, 'id')}
          </TypeBadge>
        )
      },
      {
        key: '',
        header: 'Details',
        render: (row) => (
          <div style={{ fontSize: '0.875rem' }}>
            {row?.creditPlan?.name && (
              <div style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                {row.creditPlan.name}
              </div>
            )}
            <div style={{ color: '#6b7280' }}>
              {row?.description || '-'}
            </div>
            {row?.paymentMethod && (
              <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '4px' }}>
                via {getPaymentMethodLabel(row.paymentMethod, 'id')}
              </div>
            )}
          </div>
        )
      },
      {
        key: 'amountPaid',
        header: 'Nominal',
        width: '120px',
        align: 'right',
        render: (amountPaid) => {
          const amount = amountPaid || 0
          return (
            <div style={{ fontSize: '0.875rem' }}>
              <AmountText positive={amount > 0}>
                {formatCurrency(amount)}
              </AmountText>
            </div>
          )
        }
      },
      {
        key: 'paymentStatus',
        header: 'Status',
        width: '110px',
        align: 'center',
        render: (paymentStatus) => (
          paymentStatus ? (
            <StatusBadge status={paymentStatus}>
              {getStatusLabel(paymentStatus, 'id')}
            </StatusBadge>
          ) : '-'
        )
      },
      {
        key: '',
        header: 'Aksi',
        width: '200px',
        align: 'center',
        render: (row) => (
          <ActionGroup>
            <Button
              size="small"
              variant="primary"
              onClick={() => handleShowDetail(row.id)}
            >
              Detail
            </Button>
          </ActionGroup>
        )
      }
    ]

  return (
    <>
        <Table
            loading={loading.isTransactionsLoading}
            emptyText="No transactions found."
            emptySubtext="Try adjusting your search filters"
            data={allTransactions}
            columns={columns}
            hoverable
            striped
        />

        {((pagination.page == 1 && !pagination.isLastPage) || pagination.page > 1) && (
            <Pagination
                currentPage={pagination.page}
                isLastPage={pagination.isLastPage}
                onPageChange={handlePageChange}
                isLoading={loading.isTransactionsLoading}
                variant="admin"
                language="id"
            />
        )}

        <AdminTransactionDetail
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedPurchaseId(null)
          }}
          purchaseId={selectedPurchaseId}
          onStatusChange={handleStatusChange}
        />
    </>
  )
}

export default TransactionList
