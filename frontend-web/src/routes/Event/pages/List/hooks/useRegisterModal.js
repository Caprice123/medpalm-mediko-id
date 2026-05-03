import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { upload } from '@store/common/action'
import { registerEvent } from '@store/event/userAction'
import { MAX_EVIDENCE } from '../utils'

export function useRegisterModal({ event, onSuccess, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.event)
  const { loading: commonLoading } = useSelector(state => state.common)
  const [uploaded, setUploaded] = useState([])
  const [error, setError] = useState('')

  const handleFileSelect = async (files) => {
    setError('')
    const fileArray = files instanceof FileList ? Array.from(files) : [files]
    const remaining = MAX_EVIDENCE - uploaded.length
    const toUpload = fileArray.slice(0, remaining)
    if (fileArray.length > remaining) {
      setError(`Maksimal ${MAX_EVIDENCE} file. ${fileArray.length - remaining} file diabaikan.`)
    }
    for (const file of toUpload) {
      const result = await dispatch(upload(file, 'event-evidence'))
      setUploaded(prev => [...prev, { blobId: result.blobId, name: result.filename || file.name }])
    }
  }

  const handleSubmit = () => {
    if (uploaded.length === 0) { setError('Upload minimal satu bukti pendaftaran.'); return }
    dispatch(registerEvent(
      event.code,
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
