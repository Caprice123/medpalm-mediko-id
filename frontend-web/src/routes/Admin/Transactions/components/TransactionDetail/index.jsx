import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTransactionDetail,
  approveTransaction,
  rejectTransaction,
} from '@store/pricing/adminAction'
import { actions } from '@store/pricing/reducer'

const { clearTransactionDetail } = actions
import Button from '@components/common/Button'
import {
  getStatusLabel,
  getTypeLabel,
  getPaymentMethodLabel,
  formatCurrency,
  formatDate,
  getFileIcon
} from '@utils/transactionUtils'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  DetailSection,
  SectionTitle,
  DetailGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
  StatusBadge,
  TypeBadge,
  EvidenceSection,
  EvidenceList,
  EvidenceItem,
  FileIcon,
  FileInfo,
  FileName,
  FileDate,
  LoadingState,
  ErrorState,
  ActionButtons,
  UserInfo,
  UserName,
  UserEmail
} from './TransactionDetail.styles'

function AdminTransactionDetail({ isOpen, onClose, purchaseId, onStatusChange }) {
  const dispatch = useDispatch()
  const { transactionDetail: transaction, loading, error } = useSelector(state => state.pricing)

  useEffect(() => {
    if (isOpen && purchaseId) {
      dispatch(fetchTransactionDetail(purchaseId))
    }

    // Cleanup on unmount or when modal closes
    return () => {
      if (!isOpen) {
        dispatch(clearTransactionDetail())
      }
    }
  }, [isOpen, purchaseId, dispatch])

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this purchase? This will grant the user credits/subscription.')) {
      return
    }

    try {
      await dispatch(approveTransaction(purchaseId))
      alert('Purchase approved successfully!')
      onClose()
      if (onStatusChange) onStatusChange()
    } catch (error) {
      console.error('Error approving purchase:', error)
      alert(error.response?.data?.error || 'Failed to approve purchase')
    }
  }

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this purchase? This action cannot be undone.')) {
      return
    }

    try {
      await dispatch(rejectTransaction(purchaseId))
      alert('Purchase rejected successfully!')
      onClose()
      if (onStatusChange) onStatusChange()
    } catch (error) {
      console.error('Error rejecting purchase:', error)
      alert(error.response?.data?.error || 'Failed to reject purchase')
    }
  }

  if (!isOpen) return null

  return (
    <Modal $isOpen={isOpen} onClick={handleModalClick}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            📋 Transaction Detail
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {loading.isTransactionDetailLoading && (
            <LoadingState>
              Loading transaction details...
            </LoadingState>
          )}

          {error && (
            <ErrorState>
              {error}
            </ErrorState>
          )}

          {!loading.isTransactionDetailLoading && !error && transaction && (
            <>
              <DetailSection>
                <SectionTitle>User Information</SectionTitle>
                <UserInfo>
                  <UserName>{transaction.user.name}</UserName>
                  <UserEmail>{transaction.user.email}</UserEmail>
                </UserInfo>
              </DetailSection>

              <DetailSection>
                <SectionTitle>Plan Information</SectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Plan Name</DetailLabel>
                    <DetailValue>{transaction.planName}</DetailValue>
                  </DetailItem>
                  {transaction.planDescription && (
                    <DetailItem>
                      <DetailLabel>Description</DetailLabel>
                      <DetailValue>{transaction.planDescription}</DetailValue>
                    </DetailItem>
                  )}
                  <DetailItem>
                    <DetailLabel>Type</DetailLabel>
                    <DetailValue>
                      <TypeBadge type={transaction.bundleType}>
                        {getTypeLabel(transaction.bundleType, 'id')}
                      </TypeBadge>
                    </DetailValue>
                  </DetailItem>
                  {transaction.pricingPlan?.creditsIncluded > 0 && (
                    <DetailItem>
                      <DetailLabel>Credits</DetailLabel>
                      <DetailValue>{transaction.pricingPlan.creditsIncluded} Credits</DetailValue>
                    </DetailItem>
                  )}
                  {transaction.pricingPlan?.durationDays > 0 && (
                    <DetailItem>
                      <DetailLabel>Duration</DetailLabel>
                      <DetailValue>{transaction.pricingPlan.durationDays} Days</DetailValue>
                    </DetailItem>
                  )}
                </DetailGrid>
              </DetailSection>

              <DetailSection>
                <SectionTitle>Payment Information</SectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Purchase Date</DetailLabel>
                    <DetailValue>{formatDate(transaction.purchaseDate)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Amount Paid</DetailLabel>
                    <DetailValue style={{ fontSize: '1.125rem', color: '#059669' }}>
                      {formatCurrency(transaction.amountPaid)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Payment Method</DetailLabel>
                    <DetailValue>{getPaymentMethodLabel(transaction.paymentMethod, 'id')}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Status</DetailLabel>
                    <DetailValue>
                      <StatusBadge status={transaction.paymentStatus}>
                        {getStatusLabel(transaction.paymentStatus, 'id')}
                      </StatusBadge>
                    </DetailValue>
                  </DetailItem>
                  {transaction.paymentReference && (
                    <DetailItem>
                      <DetailLabel>Reference</DetailLabel>
                      <DetailValue style={{ fontSize: '0.8125rem', fontFamily: 'monospace' }}>
                        {transaction.paymentReference}
                      </DetailValue>
                    </DetailItem>
                  )}
                </DetailGrid>
              </DetailSection>

              {transaction.paymentEvidence && transaction.paymentEvidence.length > 0 && (
                <DetailSection>
                  <SectionTitle>Payment Evidence</SectionTitle>
                  <EvidenceSection>
                    <EvidenceList>
                      {transaction.paymentEvidence.map((evidence) => (
                        <EvidenceItem key={evidence.id}>
                          <FileIcon>{getFileIcon(evidence.contentType)}</FileIcon>
                          <FileInfo>
                            <FileName>{evidence.filename}</FileName>
                            <FileDate>Uploaded: {formatDate(evidence.uploadedAt)}</FileDate>
                          </FileInfo>
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => window.open(evidence.url, '_blank')}
                          >
                            Lihat
                          </Button>
                        </EvidenceItem>
                      ))}
                    </EvidenceList>
                  </EvidenceSection>
                </DetailSection>
              )}

              {/* Action Buttons for waiting_approval */}
              {transaction.paymentStatus === 'waiting_approval' && (
                <ActionButtons>
                  <Button
                    variant="primary"
                    onClick={handleApprove}
                    disabled={loading.isApprovingTransaction || loading.isRejectingTransaction}
                  >
                    {loading.isApprovingTransaction ? 'Processing...' : '✓ Approve'}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleReject}
                    disabled={loading.isApprovingTransaction || loading.isRejectingTransaction}
                  >
                    {loading.isRejectingTransaction ? 'Processing...' : '✗ Reject'}
                  </Button>
                </ActionButtons>
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AdminTransactionDetail
