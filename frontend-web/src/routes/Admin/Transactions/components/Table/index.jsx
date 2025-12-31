
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/credit/reducer'
import Pagination from '@components/Pagination'
import { confirmPayment, fetchAllTransactions } from '@store/credit/action'
import Table from '@components/common/Table'
import Button from '@components/common/Button'
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
  
    const columns = [
      {
        key: 'id',
        header: 'ID',
        width: '70px',
        render: (id) => `#${id || '-'}`
      },
      {
        key: 'createdAt',
        header: 'Date & Time',
        width: '140px',
        render: (createdAt) => {
          if (!createdAt) return '-'
          return (
            <div style={{ fontSize: '0.875rem' }}>
              <div style={{ fontWeight: '500', color: '#111827' }}>
                {new Date(createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                {new Date(createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
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
          user ? (
            <div style={{ fontSize: '0.875rem' }}>
              <div style={{ fontWeight: '500', color: '#111827' }}>
                {user.name || 'No Name'}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                {user.email}
              </div>
            </div>
          ) : (
            <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>User ID: {userId || '-'}</span>
          )
        )
      },
      {
        key: 'type',
        header: 'Type',
        width: '110px',
        align: 'center',
        render: (displayType) => (
          <TypeBadge type={displayType || 'unknown'}>
            {displayType || 'unknown'}
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
                via {row.paymentMethod}
              </div>
            )}
          </div>
        )
      },
      {
        key: '',
        header: 'Amount',
        width: '120px',
        align: 'right',
        render: (row) => {
          const amount = row?.amount || 0
          const balance = row?.balanceAfter || row?.balanceBefore || 0
          return (
            <div style={{ fontSize: '0.875rem' }}>
              <AmountText positive={amount > 0}>
                {amount > 0 ? '+' : ''}{amount}
              </AmountText>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                Balance: {balance}
              </div>
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
              {paymentStatus}
            </StatusBadge>
          ) : '-'
        )
      },
      {
        key: '',
        header: 'Actions',
        width: '180px',
        align: 'center',
        render: (row) => {
          if (row.type === 'purchase' && row?.paymentStatus === 'pending') {
            return (
              <ActionGroup>
                <Button
                  size="small"
                  onClick={() => handleConfirmPayment(row, 'completed')}
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  variant="danger"
                  onClick={() => handleConfirmPayment(row, 'failed')}
                >
                  Reject
                </Button>
              </ActionGroup>
            )
          }
          return <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</span>
        }
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
    </>
  )
}

export default TransactionList
