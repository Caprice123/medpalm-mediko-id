import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import FileUpload from '@components/common/FileUpload'
import { upload } from '@store/common/action'
import { createWebinar, updateWebinar, fetchAdminWebinars } from '@store/webinar/adminAction'
import {
  FormSection, Label, Row, StatusToggle, StatusOption, ErrorText,
  SectionTitle, SpeakerCard, SpeakerCardHeader, SpeakerCardBody,
  LinkRow, LinkRowInputs, AddButton, RemoveButton,
} from './WebinarFormModal.styles'

const STATUS_OPTIONS = ['draft', 'published', 'cancelled']
const MAX_SPEAKERS = 5
const MAX_LINKS = 5

function WebinarFormModal({ mode = 'create', initialValues, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.webinar)
  const { loading: commonLoading } = useSelector(state => state.common)

  const [values, setValues] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    benefits: initialValues?.benefits || '',
    startAt: initialValues?.startAt
      ? new Date(initialValues.startAt).toISOString().slice(0, 16)
      : '',
    endAt: initialValues?.endAt
      ? new Date(initialValues.endAt).toISOString().slice(0, 16)
      : '',
    registrationStartAt: initialValues?.registrationStartAt
      ? new Date(initialValues.registrationStartAt).toISOString().slice(0, 16)
      : '',
    registrationEndAt: initialValues?.registrationEndAt
      ? new Date(initialValues.registrationEndAt).toISOString().slice(0, 16)
      : '',
    status: initialValues?.status || 'draft',
    thumbnailBlobId: null,
    thumbnailFile: initialValues?.thumbnail
      ? { name: initialValues.thumbnail.filename, url: initialValues.thumbnail.url }
      : null,
  })
  const [speakers, setSpeakers] = useState(
    initialValues?.speakers?.length > 0
      ? initialValues.speakers
      : [{ name: '', bio: '' }]
  )
  const [suitableFor, setSuitableFor] = useState(
    initialValues?.suitableFor?.length > 0
      ? initialValues.suitableFor
      : ['']
  )
  const [joinLinks, setJoinLinks] = useState(
    initialValues?.joinUrl?.length > 0
      ? initialValues.joinUrl.map(l => l.url || l)
      : ['']
  )
  const [errors, setErrors] = useState({})

  const set = (key, value) => setValues(v => ({ ...v, [key]: value }))

  // ── Speakers ──────────────────────────────────────────────────────────────
  const addSpeaker = () => {
    if (speakers.length >= MAX_SPEAKERS) return
    setSpeakers(prev => [...prev, { name: '', bio: '' }])
  }
  const removeSpeaker = (i) => setSpeakers(prev => prev.filter((_, j) => j !== i))
  const updateSpeaker = (i, key, val) =>
    setSpeakers(prev => prev.map((s, j) => j === i ? { ...s, [key]: val } : s))

  // ── Suitable for ─────────────────────────────────────────────────────────
  const addSuitable = () => {
    if (suitableFor.length >= 10) return
    setSuitableFor(prev => [...prev, ''])
  }
  const removeSuitable = (i) => setSuitableFor(prev => prev.filter((_, j) => j !== i))
  const updateSuitable = (i, val) =>
    setSuitableFor(prev => prev.map((s, j) => j === i ? val : s))

  // ── Join links ────────────────────────────────────────────────────────────
  const addLink = () => {
    if (joinLinks.length >= MAX_LINKS) return
    setJoinLinks(prev => [...prev, ''])
  }
  const removeLink = (i) => setJoinLinks(prev => prev.filter((_, j) => j !== i))
  const updateLink = (i, val) =>
    setJoinLinks(prev => prev.map((l, j) => j === i ? val : l))

  const validate = () => {
    const e = {}
    if (!values.title.trim()) e.title = 'Judul wajib diisi'
    if (!values.startAt) e.startAt = 'Tanggal mulai wajib diisi'
    if (!values.registrationStartAt) e.registrationStartAt = 'Tanggal buka pendaftaran wajib diisi'
    if (!values.registrationEndAt) e.registrationEndAt = 'Tanggal tutup pendaftaran wajib diisi'
    const validLinks = joinLinks.filter(l => l.trim())
    if (validLinks.length === 0) e.joinLinks = 'Minimal satu link bergabung wajib diisi'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleThumbnailSelect = async (file) => {
    const result = await dispatch(upload(file, 'webinar'))
    set('thumbnailBlobId', result.blobId)
    set('thumbnailFile', { name: result.filename, url: result.url })
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const payload = {
      title: values.title,
      description: values.description || undefined,
      speakers: speakers.filter(s => s.name.trim()),
      benefits: values.benefits || undefined,
      suitableFor: suitableFor.filter(s => s.trim()),
      joinUrl: joinLinks.filter(l => l.trim()).map(url => ({ url })),
      startAt: values.startAt,
      endAt: values.endAt || undefined,
      registrationStartAt: values.registrationStartAt,
      registrationEndAt: values.registrationEndAt,
      status: values.status,
      thumbnailBlobId: values.thumbnailBlobId || undefined,
    }

    const onSuccess = () => {
      dispatch(fetchAdminWebinars())
      onClose()
    }

    if (mode === 'create') {
      dispatch(createWebinar(payload, onSuccess))
    } else {
      dispatch(updateWebinar(initialValues.uniqueId, payload, onSuccess))
    }
  }

  const isLoading = mode === 'create' ? loading.isCreateLoading : loading.isUpdateLoading

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={mode === 'create' ? 'Tambah Webinar Baru' : 'Edit Webinar'}
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      <FormSection>
        <TextInput
          label="Judul"
          required
          value={values.title}
          onChange={e => set('title', e.target.value)}
          placeholder="Judul webinar"
          error={errors.title}
        />
      </FormSection>

      <FormSection>
        <Textarea
          label="Deskripsi"
          value={values.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Deskripsi singkat webinar"
          rows={3}
        />
      </FormSection>

      {/* ── Speakers ── */}
      <FormSection>
        <SectionTitle>
          Pembicara
          {speakers.length < MAX_SPEAKERS && (
            <AddButton type="button" onClick={addSpeaker}>+ Tambah Pembicara</AddButton>
          )}
        </SectionTitle>
        {speakers.map((speaker, i) => (
          <SpeakerCard key={i}>
            <SpeakerCardHeader>
              <span>Pembicara {i + 1}</span>
              {speakers.length > 1 && (
                <RemoveButton type="button" onClick={() => removeSpeaker(i)}>Hapus</RemoveButton>
              )}
            </SpeakerCardHeader>
            <SpeakerCardBody>
              <TextInput
                label="Nama"
                value={speaker.name}
                onChange={e => updateSpeaker(i, 'name', e.target.value)}
                placeholder="Nama pembicara"
              />
              <Textarea
                label="Bio / CV Singkat"
                value={speaker.bio}
                onChange={e => updateSpeaker(i, 'bio', e.target.value)}
                placeholder="Deskripsi singkat pembicara"
                rows={2}
              />
            </SpeakerCardBody>
          </SpeakerCard>
        ))}
      </FormSection>

      <FormSection>
        <Textarea
          label="Benefit"
          value={values.benefits}
          onChange={e => set('benefits', e.target.value)}
          placeholder="Apa yang peserta dapatkan? (rekaman, materi PPT, sertifikat, dll)"
          rows={3}
        />
      </FormSection>

      {/* ── Suitable for ── */}
      <FormSection>
        <SectionTitle>
          Cocok Untuk
          <AddButton type="button" onClick={addSuitable}>+ Tambah</AddButton>
        </SectionTitle>
        {suitableFor.map((item, i) => (
          <LinkRow key={i}>
            <TextInput
              value={item}
              onChange={e => updateSuitable(i, e.target.value)}
              placeholder="Contoh: Mahasiswa kedokteran"
            />
            {suitableFor.length > 1 && (
              <RemoveButton type="button" onClick={() => removeSuitable(i)}>✕</RemoveButton>
            )}
          </LinkRow>
        ))}
      </FormSection>

      {/* ── Join links ── */}
      <FormSection>
        <SectionTitle>
          Link Bergabung
          {joinLinks.length < MAX_LINKS && (
            <AddButton type="button" onClick={addLink}>+ Tambah Link</AddButton>
          )}
        </SectionTitle>
        {errors.joinLinks && <ErrorText>{errors.joinLinks}</ErrorText>}
        {joinLinks.map((link, i) => (
          <LinkRow key={i}>
            <TextInput
              placeholder="https://..."
              type="url"
              value={link}
              onChange={e => updateLink(i, e.target.value)}
            />
            {joinLinks.length > 1 && (
              <RemoveButton type="button" onClick={() => removeLink(i)}>✕</RemoveButton>
            )}
          </LinkRow>
        ))}
      </FormSection>

      <Row>
        <FormSection>
          <TextInput
            label="Tanggal Mulai"
            required
            type="datetime-local"
            value={values.startAt}
            onChange={e => set('startAt', e.target.value)}
            error={errors.startAt}
          />
        </FormSection>
        <FormSection>
          <TextInput
            label="Tanggal Selesai"
            type="datetime-local"
            value={values.endAt}
            onChange={e => set('endAt', e.target.value)}
          />
        </FormSection>
      </Row>

      <Row>
        <FormSection>
          <TextInput
            label="Pendaftaran Dibuka"
            required
            type="datetime-local"
            value={values.registrationStartAt}
            onChange={e => set('registrationStartAt', e.target.value)}
            error={errors.registrationStartAt}
          />
        </FormSection>
        <FormSection>
          <TextInput
            label="Pendaftaran Ditutup"
            required
            type="datetime-local"
            value={values.registrationEndAt}
            onChange={e => set('registrationEndAt', e.target.value)}
            error={errors.registrationEndAt}
          />
        </FormSection>
      </Row>

      <FormSection>
        <Label>Thumbnail (opsional)</Label>
        <FileUpload
          file={values.thumbnailFile}
          onFileSelect={handleThumbnailSelect}
          onRemove={() => { set('thumbnailBlobId', null); set('thumbnailFile', null) }}
          acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
          acceptedTypesLabel="JPG, PNG, WEBP"
          maxSizeMB={5}
          isUploading={commonLoading.isUploading}
          uploadText="Klik untuk upload thumbnail"
        />
      </FormSection>

      <FormSection>
        <Label>Status</Label>
        <StatusToggle>
          {STATUS_OPTIONS.map(s => (
            <StatusOption key={s} checked={values.status === s}>
              <input
                type="radio"
                name="webinar-status"
                value={s}
                checked={values.status === s}
                onChange={() => set('status', s)}
              />
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </StatusOption>
          ))}
        </StatusToggle>
      </FormSection>
    </Modal>
  )
}

export default WebinarFormModal
