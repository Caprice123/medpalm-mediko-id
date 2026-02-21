import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { upload } from '@store/common/action'
import {
  fetchUserTransactionDetail,
  attachPaymentEvidence,
  clearTransactionDetail,
} from '@store/pricing/userAction'
import { actions as commonActions } from '@store/common/reducer'

export const useTransactionDetail = ({ isOpen, purchaseId, onEvidenceUploaded }) => {
  const dispatch = useDispatch()
  const { transactionDetail: transaction, loading, error } = useSelector(state => state.pricing)
  const isUploading = useSelector(state => state.common.loading.isUploading)

  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadedBlob, setUploadedBlob] = useState(null)

  useEffect(() => {
    if (isOpen && purchaseId) {
      dispatch(fetchUserTransactionDetail(purchaseId))
    }

    return () => {
      if (!isOpen) {
        dispatch(clearTransactionDetail())
        setUploadedFile(null)
        setUploadedBlob(null)
      }
    }
  }, [isOpen, purchaseId, dispatch])

  const handlePayNow = () => {
    if (transaction?.invoiceUrl) {
      window.location.href = transaction.invoiceUrl
    }
  }

  const handleFileSelect = async (file) => {
    setUploadedFile(file)
    try {
        await dispatch(upload(file, 'payment_evidence', (res) => {
            setUploadedBlob(res)
        }))
    } catch {
        setUploadedBlob(null)
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setUploadedBlob(null)
  }

  const handleAttachEvidence = () => {
    if (!uploadedBlob?.blobId) {
      dispatch(commonActions.setError('Please upload a file first'))
      return
    }

    dispatch(attachPaymentEvidence(purchaseId, uploadedBlob.blobId, () => {
      setUploadedFile(null)
      setUploadedBlob(null)
      if (onEvidenceUploaded) onEvidenceUploaded()
    }))
  }

  return {
    transaction,
    loading,
    error,
    uploadedFile,
    uploadedBlob,
    isUploading,
    handlePayNow,
    handleFileSelect,
    handleRemoveFile,
    handleAttachEvidence,
  }
}
