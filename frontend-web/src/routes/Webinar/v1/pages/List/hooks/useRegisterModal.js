import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { upload } from '@store/common/action'
import { registerWebinar } from '@store/webinar/userAction'

const MAX_FILES = 3

export function useRegisterModal({ webinar, onSuccess, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.webinar)
  const { loading: commonLoading } = useSelector(state => state.common)

  const [uploadedFiles, setUploadedFiles] = useState([])
  const [error, setError] = useState('')

  const handleFileSelect = async (filesOrFile) => {
    setError('')
    const files = filesOrFile instanceof FileList ? Array.from(filesOrFile) : [filesOrFile]

    const remaining = MAX_FILES - uploadedFiles.length
    if (remaining <= 0) {
      setError(`Maksimal ${MAX_FILES} file.`)
      return
    }

    const toUpload = files.slice(0, remaining)
    if (files.length > remaining) {
      setError(`Hanya ${remaining} file lagi yang bisa ditambahkan (maks. ${MAX_FILES}).`)
    }

    for (const file of toUpload) {
      const result = await dispatch(upload(file, 'webinar-evidence'))
      if (result?.blobId) {
        setUploadedFiles(prev => [...prev, { blobId: result.blobId, filename: result.filename || file.name }])
      }
    }
  }

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    setError('')
  }

  const handleSubmit = () => {
    if (uploadedFiles.length === 0) {
      setError('Harap upload minimal satu bukti pendaftaran.')
      return
    }
    dispatch(registerWebinar(
      webinar.uniqueId,
      uploadedFiles.map(f => f.blobId),
      () => { if (onSuccess) onSuccess(); onClose() }
    ))
  }

  return {
    isRegisterLoading: loading.isRegisterLoading,
    isUploading: commonLoading.isUploading,
    uploadedFiles,
    error,
    canAddMore: uploadedFiles.length < MAX_FILES,
    handleFileSelect,
    removeFile,
    handleSubmit,
  }
}
