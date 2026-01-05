import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getWithToken, postWithToken } from '@utils/requestUtils'
import { upload } from '@store/common/action'
import Endpoints from '@config/endpoint'
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
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadedBlob, setUploadedBlob] = useState(null)
  const [isAttaching, setIsAttaching] = useState(false)
  const isUploading = useSelector(state => state.common.loading.isUploading)

  useEffect(() => {
    if (isOpen && purchaseId) {
      fetchTransactionDetail()
    } else {
      // Reset upload state when modal is closed
      setUploadedFile(null)
      setUploadedBlob(null)
    }
  }, [isOpen, purchaseId])

  const fetchTransactionDetail = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getWithToken(`${Endpoints.pricing.history}/${purchaseId}`)
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

  const handlePayNow = async () => {
    if (transaction?.invoiceUrl) {
      window.open(transaction.invoiceUrl, '_blank')
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
      setIsAttaching(true)
      await postWithToken(`${Endpoints.pricing.history}/${purchaseId}/evidence`, {
        blobId: uploadedBlob.blobId
      })

      // Refresh transaction details to show newly attached evidence
      await fetchTransactionDetail()

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
    } finally {
      setIsAttaching(false)
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
          {loading && (
            <LoadingState>
              Memuat detail transaksi...
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
                          <UploadButton
                            onClick={handleAttachEvidence}
                            disabled={isAttaching || isUploading}
                          >
                            {isAttaching ? 'Mengirim...' : 'Kirim'}
                          </UploadButton>
                        )
                      }
                    />
                  </EvidenceSection>
                </DetailSection>
              )}

              {/* Action Buttons */}
              {transaction.paymentStatus === 'pending' && transaction.paymentMethod === 'xendit' && (
                <ActionButtons>
                  <PayNowButton onClick={handlePayNow}>
                    💳 Bayar Sekarang
                  </PayNowButton>
                </ActionButtons>
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default TransactionDetail
