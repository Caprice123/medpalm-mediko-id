import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { upload } from '@store/common/action'
import { claimEvent } from '@store/event/v2/userAction'
import { MAX_EVIDENCE } from '../../../utils/claimState'

export function useClaimModal({ event, onSuccess, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.eventV2)
  const { loading: commonLoading } = useSelector(state => state.common)

  const [uploadedFiles, setUploadedFiles] = useState([])
  const [error, setError] = useState('')

  const handleFileSelect = async (filesOrFile) => {
    setError('')
    const files = filesOrFile instanceof FileList ? Array.from(filesOrFile) : [filesOrFile]

    const remaining = MAX_EVIDENCE - uploadedFiles.length
    if (remaining <= 0) {
      setError(`Sudah ada ${MAX_EVIDENCE} file. Hapus salah satu kalau mau menggantinya.`)
      return
    }
    if (files.length > remaining) {
      setError(`Hanya ${remaining} file lagi yang bisa ditambahkan — maksimal ${MAX_EVIDENCE}.`)
    }

    for (const file of files.slice(0, remaining)) {
      const result = await dispatch(upload(file, 'event-evidence'))
      if (result?.blobId) {
        setUploadedFiles(prev => [
          ...prev,
          { blobId: result.blobId, filename: result.filename || file.name },
        ])
      } else {
        setError(`"${file.name}" gagal diunggah. Coba unggah ulang file itu.`)
      }
    }
  }

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    setError('')
  }

  const handleSubmit = () => {
    if (uploadedFiles.length === 0) {
      setError('Unggah minimal satu bukti sebelum mengirim klaim.')
      return
    }
    dispatch(claimEvent(
      event.code,
      uploadedFiles.map(f => f.blobId),
      () => {
        if (onSuccess) onSuccess()
        onClose()
      },
    ))
  }

  return {
    isClaiming: loading.isClaiming,
    isUploading: commonLoading.isUploading,
    uploadedFiles,
    error,
    canAddMore: uploadedFiles.length < MAX_EVIDENCE,
    handleFileSelect,
    removeFile,
    handleSubmit,
  }
}
