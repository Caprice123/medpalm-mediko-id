import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { upload } from '@store/common/action'
import {
  fetchUserTransactionDetail,
  attachPaymentEvidence,
  clearTransactionDetail
} from '@store/pricing/action'
import { TransactionDetailSkeleton } from '@components/common/SkeletonCard'
import FileUpload from '@components/common/FileUpload'
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
  EmptyState,
  ActionButtons,
  PayNowButton,
  UploadButton
} from './TransactionDetail.styles'

function TransactionDetail({ isOpen, onClose, purchaseId, onEvidenceUploaded }) {
  const dispatch = useDispatch()
  const { transactionDetail: transaction, loading, error } = useSelector(state => state.pricing)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadedBlob, setUploadedBlob] = useState(null)
  const isUploading = useSelector(state => state.common.loading.isUploading)

  useEffect(() => {
    if (isOpen && purchaseId) {
      dispatch(fetchUserTransactionDetail(purchaseId))
    }

    // Cleanup on unmount or when modal closes
    return () => {
      if (!isOpen) {
        dispatch(clearTransactionDetail())
        setUploadedFile(null)
        setUploadedBlob(null)
      }
    }
  }, [isOpen, purchaseId, dispatch])

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handlePayNow = async () => {
    if (transaction?.invoiceUrl) {
      window.location.href = transaction.invoiceUrl
    }
  }

  const handleFileSelect = async (file) => {
    try {
      setUploadedFile(file)
      const result = await dispatch(upload(file, 'payment_evidence'))

      if (result) {
        setUploadedBlob(result)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file. Please try again.')
      setUploadedFile(null)
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setUploadedBlob(null)
  }

  const handleAttachEvidence = async () => {
    if (!uploadedBlob?.blobId) {
      alert('Please upload a file first')
      return
    }

    try {
      await dispatch(attachPaymentEvidence(purchaseId, uploadedBlob.blobId))

      // Clear upload state
      setUploadedFile(null)
      setUploadedBlob(null)

      // Notify parent to refresh purchase history list
      if (onEvidenceUploaded) {
        onEvidenceUploaded()
      }

      alert('Bukti pembayaran berhasil diunggah dan menunggu persetujuan!')
    } catch (error) {
      console.error('Error attaching evidence:', error)
      alert(error.response?.data?.error || 'Failed to attach payment evidence. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <Modal $isOpen={isOpen} onClick={handleModalClick}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            📋 Detail Transaksi
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {loading.isTransactionDetailLoading ? (
            <TransactionDetailSkeleton />
          ) : error ? (
            <ErrorState>
              {error}
            </ErrorState>
          ) : transaction ? (
            <>
              <DetailSection>
                <SectionTitle>Informasi Paket</SectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Nama Paket</DetailLabel>
                    <DetailValue>{transaction.planName}</DetailValue>
                  </DetailItem>
                  {transaction.planDescription && (
                    <DetailItem>
                      <DetailLabel>Deskripsi</DetailLabel>
                      <DetailValue>{transaction.planDescription}</DetailValue>
                    </DetailItem>
                  )}
                  <DetailItem>
                    <DetailLabel>Tipe</DetailLabel>
                    <DetailValue>
                      <TypeBadge type={transaction.bundleType}>
                        {getTypeLabel(transaction.bundleType)}
                      </TypeBadge>
                    </DetailValue>
                  </DetailItem>
                  {transaction.pricingPlan?.creditsIncluded > 0 && (
                    <DetailItem>
                      <DetailLabel>Kredit</DetailLabel>
                      <DetailValue>{transaction.pricingPlan.creditsIncluded} Kredit</DetailValue>
                    </DetailItem>
                  )}
                  {transaction.pricingPlan?.durationDays > 0 && (
                    <DetailItem>
                      <DetailLabel>Durasi</DetailLabel>
                      <DetailValue>{transaction.pricingPlan.durationDays} Hari</DetailValue>
                    </DetailItem>
                  )}
                </DetailGrid>
              </DetailSection>

              <DetailSection>
                <SectionTitle>Informasi Pembayaran</SectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Tanggal Pembelian</DetailLabel>
                    <DetailValue>{formatDate(transaction.purchaseDate)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Jumlah Dibayar</DetailLabel>
                    <DetailValue style={{ fontSize: '1.125rem', color: '#059669' }}>
                      {formatCurrency(transaction.amountPaid)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Metode Pembayaran</DetailLabel>
                    <DetailValue>{getPaymentMethodLabel(transaction.paymentMethod)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Status</DetailLabel>
                    <DetailValue>
                      <StatusBadge status={transaction.paymentStatus}>
                        {getStatusLabel(transaction.paymentStatus)}
                      </StatusBadge>
                    </DetailValue>
                  </DetailItem>
                  {transaction.paymentReference && (
                    <DetailItem>
                      <DetailLabel>Referensi</DetailLabel>
                      <DetailValue style={{ fontSize: '0.8125rem', fontFamily: 'monospace' }}>
                        {transaction.paymentReference}
                      </DetailValue>
                    </DetailItem>
                  )}
                </DetailGrid>
              </DetailSection>

              {transaction.paymentEvidence && transaction.paymentEvidence.length > 0 && (
                <DetailSection>
                  <SectionTitle>Bukti Pembayaran</SectionTitle>
                  <EvidenceSection>
                    <EvidenceList>
                      {transaction.paymentEvidence.map((evidence) => (
                        <EvidenceItem key={evidence.id}>
                          <FileIcon>{getFileIcon(evidence.contentType)}</FileIcon>
                          <FileInfo>
                            <FileName>{evidence.filename}</FileName>
                            <FileDate>Diunggah: {formatDate(evidence.uploadedAt)}</FileDate>
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

              {transaction.paymentMethod === 'manual' &&
               transaction.paymentStatus === 'pending' &&
               (!transaction.paymentEvidence || transaction.paymentEvidence.length === 0) && (
                <DetailSection>
                  <SectionTitle>Upload Bukti Pembayaran</SectionTitle>
                  <EvidenceSection>
                    <FileUpload
                      file={uploadedFile}
                      onFileSelect={handleFileSelect}
                      onRemove={handleRemoveFile}
                      acceptedTypes={['image/*', 'application/pdf']}
                      acceptedTypesLabel="Image atau PDF"
                      maxSizeMB={10}
                      isUploading={isUploading}
                      uploadText="Klik untuk upload bukti pembayaran"
                      actions={
                        uploadedBlob && (
                          <Button
                            variant="primary"
                            onClick={handleAttachEvidence}
                            disabled={loading.isAttachingEvidence || isUploading}
                          >
                            {loading.isAttachingEvidence ? 'Mengirim...' : 'Kirim'}
                          </Button>
                        )
                      }
                    />
                  </EvidenceSection>
                </DetailSection>
              )}

              {/* Action Buttons */}
              {transaction.paymentStatus === 'pending' && transaction.paymentMethod === 'xendit' && (
                <ActionButtons>
                  <Button variant="primary" onClick={handlePayNow}>
                    💳 Bayar Sekarang
                  </Button>
                </ActionButtons>
              )}
            </>
          ) : null}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default TransactionDetail
