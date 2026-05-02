import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { upload } from '@store/common/action'
import { registerWebinar } from '@store/webinar/userAction'
import { MAX_EVIDENCE } from '../utils'

export function useRegisterModal({ webinar, onSuccess, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.webinar)
  const { loading: commonLoading } = useSelector(state => state.common)
  const [uploaded, setUploaded] = useState([])
  const [error, setError] = useState('')

  const handleFileSelect = async (files) => {
    setError('')
    const fileArray = files instanceof FileList ? Array.from(files) : [files]
    const remaining = MAX_EVIDENCE - uploaded.length
    const toUpload = fileArray.slice(0, remaining)
    if (fileArray.length > remaining) {
      setError(`Maksimal ${MAX_EVIDENCE} bukti. ${fileArray.length - remaining} file diabaikan.`)
    }
    for (const file of toUpload) {
      const result = await dispatch(upload(file, 'webinar-evidence'))
      setUploaded(prev => [...prev, { blobId: result.blobId, name: result.filename || file.name }])
    }
  }

  const handleSubmit = () => {
    if (uploaded.length === 0) { setError('Upload minimal satu bukti.'); return }
    dispatch(registerWebinar(
      webinar.uniqueId,
      uploaded.map(f => f.blobId),
      () => { if (onSuccess) onSuccess(); onClose() }
    ))
  }

  const removeFile = (i) => setUploaded(p => p.filter((_, j) => j !== i))

  return {
    uploaded,
    error,
    isRegisterLoading: loading.isRegisterLoading,
    isUploading: commonLoading.isUploading,
    handleFileSelect,
    handleSubmit,
    removeFile,
  }
}
