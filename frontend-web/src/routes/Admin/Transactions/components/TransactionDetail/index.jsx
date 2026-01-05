import { useEffect, useState } from 'react'
import { getWithToken, postWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'
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
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (isOpen && purchaseId) {
      fetchTransactionDetail()
    }
  }, [isOpen, purchaseId])

  const fetchTransactionDetail = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getWithToken(`${Endpoints.pricing.admin.list}/purchases/${purchaseId}`)
      setTransaction(response.data.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load transaction details')
      console.error('Error fetching transaction detail:', err)
    } finally {
      setLoading(false)
    }
  }

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
      setProcessing(true)
      await postWithToken(`${Endpoints.pricing.admin.list}/purchases/${purchaseId}/approve`, {
        status: 'completed'
      })

      alert('Purchase approved successfully!')
      onClose()
      if (onStatusChange) onStatusChange()
    } catch (error) {
      console.error('Error approving purchase:', error)
      alert(error.response?.data?.error || 'Failed to approve purchase')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this purchase? This action cannot be undone.')) {
      return
    }

    try {
      setProcessing(true)
      await postWithToken(`${Endpoints.pricing.admin.list}/purchases/${purchaseId}/approve`, {
        status: 'failed'
      })

      alert('Purchase rejected successfully!')
      onClose()
      if (onStatusChange) onStatusChange()
    } catch (error) {
      console.error('Error rejecting purchase:', error)
      alert(error.response?.data?.error || 'Failed to reject purchase')
    } finally {
      setProcessing(false)
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
          {loading && (
            <LoadingState>
              Loading transaction details...
            </LoadingState>
          )}

          {error && (
            <ErrorState>
              {error}
            </ErrorState>
          )}

          {!loading && !error && transaction && (
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
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : '✓ Approve'}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleReject}
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : '✗ Reject'}
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
