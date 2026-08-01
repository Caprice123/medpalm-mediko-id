import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createFeatureNode, updateFeatureNode, uploadNodeVideo } from '@store/featureNodes'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import FileUpload from '@components/common/FileUpload'

const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/x-ms-wmv']

function SubtopicFormModal({ subtopic, parentTopic, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.featureNodes)
  const isEdit = !!subtopic

  const [form, setForm] = useState({ name: '', description: '', videoExplanation: '' })
  const [videoUpload, setVideoUpload] = useState(null) // { blobId, filename, url }
  const [videoFile, setVideoFile] = useState(null)
  const [existingVideoUrl, setExistingVideoUrl] = useState(null)
  const [showVideoUpload, setShowVideoUpload] = useState(false)

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: subtopic.name,
        description: subtopic.description ?? '',
        videoExplanation: subtopic.videoExplanation ?? '',
      })
      setExistingVideoUrl(subtopic.videoUrl ? { url: subtopic.videoUrl, name: subtopic.videoFilename, size: subtopic.videoByteSize } : null)
    } else {
      setForm({ name: '', description: '', videoExplanation: '' })
      setExistingVideoUrl(null)
    }
    setVideoUpload(null)
    setVideoFile(null)
    setShowVideoUpload(false)
  }, [isEdit, subtopic])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleVideoSelect = async (file) => {
    setVideoFile(file)
    const result = await dispatch(uploadNodeVideo(file))
    if (result?.blobId) setVideoUpload(result)
    setVideoFile(null)
  }

  const handleRemoveVideo = () => {
    setVideoUpload(null)
    setVideoFile(null)
    setExistingVideoUrl(null)
    setShowVideoUpload(false)
  }

  const handleSubmit = () => {
    const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const payload = {
      name: form.name,
      slug: isEdit ? subtopic.slug : `${parentTopic.slug}-${slug}`,
      visibility: 'general',
      layer: 2,
      parentId: parentTopic.id,
      nodeType: 'subtopik',
      description: form.description || null,
      videoExplanation: form.videoExplanation || null,
      ...(videoUpload?.blobId && { videoBlobId: videoUpload.blobId }),
    }
    if (isEdit) {
      dispatch(updateFeatureNode(subtopic.id, payload, onSuccess))
    } else {
      dispatch(createFeatureNode(payload, onSuccess))
    }
  }

  const isSaving = isEdit ? loading.isUpdating : loading.isCreating

  const activeVideo = videoUpload
    ? { name: videoUpload.filename, url: videoUpload.url, size: null }
    : existingVideoUrl ?? null

  const videoFileForDisplay = activeVideo
    ? { name: activeVideo.name, type: 'video/mp4', size: activeVideo.size }
    : videoFile

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? 'Edit Sub-topik' : 'Tambah Sub-topik Baru'}
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!form.name.trim() || isSaving || loading.isUploadingVideo}>
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextInput
          label="Nama Sub-topik"
          required
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder="Contoh: Anatomi Jantung"
        />

        <Textarea
          label="Deskripsi"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Deskripsi singkat sub-topik ini..."
          rows={3}
        />

        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
            Video Penjelasan
          </div>
          <FileUpload
            file={videoFileForDisplay}
            onFileSelect={handleVideoSelect}
            onRemove={activeVideo ? handleRemoveVideo : undefined}
            acceptedTypes={VIDEO_TYPES}
            acceptedTypesLabel="MP4, MOV, AVI, WebM"
            maxSizeMB={2048}
            isUploading={loading.isUploadingVideo}
            uploadText={loading.isUploadingVideo ? 'Mengunggah video...' : 'Klik atau seret video ke sini'}
            actions={
              activeVideo?.url && (
                <Button
                  size="small"
                  variant="primary"
                  type="button"
                  onClick={() => window.open(activeVideo.url, '_blank')}
                >
                  👁️ Lihat
                </Button>
              )
            }
          />
        </div>

        <Textarea
          label="Keterangan Video"
          value={form.videoExplanation}
          onChange={e => set('videoExplanation', e.target.value)}
          placeholder="Jelaskan isi video ini..."
          rows={3}
        />
      </div>
    </Modal>
  )
}

export default SubtopicFormModal
