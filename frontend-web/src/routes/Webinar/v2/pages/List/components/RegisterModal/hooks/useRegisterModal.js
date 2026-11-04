import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { upload } from '@store/common/action'
import { registerWebinar } from '@store/webinar/v2/userAction'
import { MAX_EVIDENCE } from '../../../utils/registrationState'

export function useRegisterModal({ webinar, onSuccess, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.webinarV2)
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
      const result = await dispatch(upload(file, 'webinar-evidence'))
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
      setError('Unggah minimal satu bukti pendaftaran sebelum mengirim.')
      return
    }
    dispatch(registerWebinar(
      webinar.uniqueId,
      uploadedFiles.map(f => f.blobId),
      () => {
        if (onSuccess) onSuccess()
        onClose()
      },
    ))
  }

  return {
    isRegistering: loading.isRegistering,
    isUploading: commonLoading.isUploading,
    uploadedFiles,
    error,
    canAddMore: uploadedFiles.length < MAX_EVIDENCE,
    handleFileSelect,
    removeFile,
    handleSubmit,
  }
}
