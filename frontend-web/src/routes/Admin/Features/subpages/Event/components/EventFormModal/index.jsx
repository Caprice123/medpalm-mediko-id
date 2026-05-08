import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import FileUpload from '@components/common/FileUpload'
import { upload } from '@store/common/action'
import { fetchAdminFeatures } from '@store/feature/adminAction'
import { createEvent, updateEvent, fetchAdminEvents } from '@store/event/adminAction'
import { toJakartaInputValue } from '@utils/dateUtils'
import {
  FormSection, Label, Row, StatusToggle, StatusOption, ErrorText, HintText,
  SectionTitle, QuotaTypeToggle, QuotaOption, FeatureRow, FeatureCheckLabel, FeatureDurationInput,
} from './EventFormModal.styles'

const STATUS_OPTIONS = ['draft', 'published', 'cancelled']
const CREDIT_TYPE_OPTIONS = ['permanent', 'expiring']
const QUOTA_TYPE_OPTIONS = ['none', 'credits', 'subscription', 'both']

function getInitialQuotaType(values) {
  const hasCredits = (values?.creditsOnApproval || 0) > 0
  const hasSub = (values?.allowedFeatures || []).length > 0
  if (hasCredits && hasSub) return 'both'
  if (hasCredits) return 'credits'
  if (hasSub) return 'subscription'
  return 'none'
}

function EventFormModal({ mode = 'create', initialValues, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.event)
  const { loading: commonLoading } = useSelector(state => state.common)
  const appFeatures = useSelector(state => state.feature.features)

  useEffect(() => {
    if (appFeatures.length === 0) dispatch(fetchAdminFeatures())
  }, [])

  const ALL_FEATURES = appFeatures.filter(f => f.sessionType).map(f => ({ key: f.sessionType, label: f.name }))

  // allowedFeatures: [{ key, durationDays }]
  const [values, setValues] = useState({
    code: initialValues?.code || '',
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    registrationStartAt: toJakartaInputValue(initialValues?.registrationStartAt),
    registrationEndAt: toJakartaInputValue(initialValues?.registrationEndAt),
    status: initialValues?.status || 'draft',
    thumbnailBlobId: null,
    thumbnailFile: initialValues?.thumbnail
      ? { name: initialValues.thumbnail.filename, url: initialValues.thumbnail.url } : null,
    creditsOnApproval: initialValues?.creditsOnApproval || 0,
    creditType: initialValues?.creditType || 'permanent',
    creditExpiryDays: initialValues?.creditExpiryDays || '',
    allowedFeatures: initialValues?.allowedFeatures || [],
  })
  const [quotaType, setQuotaType] = useState(getInitialQuotaType(initialValues))
  const [errors, setErrors] = useState({})

  const set = (key, value) => setValues(v => ({ ...v, [key]: value }))

  const getFeatureEntry = (key) => values.allowedFeatures.find(f => f.key === key)
  const isFeatureEnabled = (key) => !!getFeatureEntry(key)

  const toggleFeature = (key) => {
    const current = values.allowedFeatures
    if (isFeatureEnabled(key)) {
      set('allowedFeatures', current.filter(f => f.key !== key))
    } else {
      set('allowedFeatures', [...current, { key, durationDays: '' }])
    }
  }

  const setFeatureDuration = (key, durationDays) => {
    set('allowedFeatures', values.allowedFeatures.map(f => f.key === key ? { ...f, durationDays } : f))
  }

  const validate = () => {
    const e = {}
    if (!values.code.trim()) e.code = 'Code wajib diisi'
    if (!values.title.trim()) e.title = 'Judul wajib diisi'
    if ((quotaType === 'credits' || quotaType === 'both') && !values.creditsOnApproval) {
      e.creditsOnApproval = 'Jumlah kredit wajib diisi'
    }
    if ((quotaType === 'subscription' || quotaType === 'both') && values.allowedFeatures.length === 0) {
      e.allowedFeatures = 'Pilih minimal satu fitur'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleThumbnailSelect = async (file) => {
    const result = await dispatch(upload(file, 'events'))
    set('thumbnailBlobId', result.blobId)
    set('thumbnailFile', { name: result.filename, url: result.url })
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const includeCredits = quotaType === 'credits' || quotaType === 'both'
    const includeSub = quotaType === 'subscription' || quotaType === 'both'

    const payload = {
      title: values.title,
      description: values.description || undefined,
      registrationStartAt: values.registrationStartAt ? new Date(`${values.registrationStartAt}:00+07:00`).toISOString() : undefined,
      registrationEndAt: values.registrationEndAt ? new Date(`${values.registrationEndAt}:00+07:00`).toISOString() : undefined,
      status: values.status,
      thumbnailBlobId: values.thumbnailBlobId || undefined,
      creditsOnApproval: includeCredits ? parseInt(values.creditsOnApproval) : 0,
      creditType: includeCredits ? values.creditType : 'permanent',
      creditExpiryDays: (includeCredits && values.creditType === 'expiring' && values.creditExpiryDays)
        ? parseInt(values.creditExpiryDays) : undefined,
      allowedFeatures: includeSub
        ? values.allowedFeatures
            .filter(f => f.key && parseInt(f.durationDays) > 0)
            .map(f => ({ key: f.key, durationDays: parseInt(f.durationDays) }))
        : [],
    }

    const onSuccess = () => { dispatch(fetchAdminEvents()); onClose() }

    if (mode === 'create') {
      dispatch(createEvent({ ...payload, code: values.code }, onSuccess))
    } else {
      dispatch(updateEvent(initialValues.code, payload, onSuccess))
    }
  }

  const isLoading = mode === 'create' ? loading.isCreateLoading : loading.isUpdateLoading
  const showCredits = quotaType === 'credits' || quotaType === 'both'
  const showSub = quotaType === 'subscription' || quotaType === 'both'

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={mode === 'create' ? 'Tambah Event Baru' : 'Edit Event'}
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
          label="Code"
          required
          value={values.code}
          onChange={e => set('code', e.target.value)}
          placeholder="Contoh: MED-CONF-2026"
          error={errors.code}
          disabled={mode === 'edit'}
        />
        {mode === 'create' && <HintText>Kode unik event. Tidak dapat diubah setelah dibuat.</HintText>}
      </FormSection>

      <FormSection>
        <TextInput label="Judul" required value={values.title} onChange={e => set('title', e.target.value)} placeholder="Judul event" error={errors.title} />
      </FormSection>

      <FormSection>
        <Textarea label="Deskripsi" value={values.description} onChange={e => set('description', e.target.value)} placeholder="Deskripsi singkat event" rows={4} />
      </FormSection>

      <Row>
        <FormSection>
          <TextInput label="Pendaftaran Dibuka" type="datetime-local" value={values.registrationStartAt} onChange={e => set('registrationStartAt', e.target.value)} />
        </FormSection>
        <FormSection>
          <TextInput label="Pendaftaran Ditutup" type="datetime-local" value={values.registrationEndAt} onChange={e => set('registrationEndAt', e.target.value)} />
        </FormSection>
      </Row>

      {/* ── Quota on Approval ── */}
      <FormSection>
        <SectionTitle>Reward saat Disetujui</SectionTitle>
        <QuotaTypeToggle>
          {QUOTA_TYPE_OPTIONS.map(opt => (
            <QuotaOption key={opt} checked={quotaType === opt} onClick={() => setQuotaType(opt)}>
              {{ none: 'Tidak Ada', credits: 'Kredit', subscription: 'Langganan', both: 'Keduanya' }[opt]}
            </QuotaOption>
          ))}
        </QuotaTypeToggle>
      </FormSection>

      {showCredits && (
        <>
          <Row>
            <FormSection>
              <TextInput label="Jumlah Kredit" required type="number" min="1" value={values.creditsOnApproval} onChange={e => set('creditsOnApproval', e.target.value)} error={errors.creditsOnApproval} placeholder="0" />
            </FormSection>
            <FormSection>
              <Label>Tipe Kredit</Label>
              <StatusToggle>
                {CREDIT_TYPE_OPTIONS.map(s => (
                  <StatusOption key={s} checked={values.creditType === s}>
                    <input type="radio" name="credit-type" value={s} checked={values.creditType === s} onChange={() => set('creditType', s)} />
                    {s === 'permanent' ? 'Permanen' : 'Kadaluarsa'}
                  </StatusOption>
                ))}
              </StatusToggle>
            </FormSection>
          </Row>
          {values.creditType === 'expiring' && (
            <FormSection>
              <TextInput label="Kadaluarsa setelah (hari)" type="number" min="1" value={values.creditExpiryDays} onChange={e => set('creditExpiryDays', e.target.value)} placeholder="30" />
            </FormSection>
          )}
        </>
      )}

      {showSub && (
        <FormSection>
          <Label>Fitur & Durasi Akses</Label>
          {errors.allowedFeatures && <ErrorText>{errors.allowedFeatures}</ErrorText>}
          {ALL_FEATURES.map(f => {
            const enabled = isFeatureEnabled(f.key)
            const entry = getFeatureEntry(f.key)
            return (
              <FeatureRow key={f.key} $enabled={enabled}>
                <FeatureCheckLabel $enabled={enabled}>
                  <input type="checkbox" checked={enabled} onChange={() => toggleFeature(f.key)} />
                  {f.label}
                </FeatureCheckLabel>
                <FeatureDurationInput
                  type="number"
                  min="1"
                  placeholder="0"
                  disabled={!enabled}
                  value={entry?.durationDays || ''}
                  onChange={e => setFeatureDuration(f.key, e.target.value)}
                />
                <HintText style={{ margin: 0, whiteSpace: 'nowrap' }}>hari</HintText>
              </FeatureRow>
            )
          })}
        </FormSection>
      )}

      <FormSection>
        <Label>Thumbnail (opsional)</Label>
        <FileUpload file={values.thumbnailFile} onFileSelect={handleThumbnailSelect} onRemove={() => { set('thumbnailBlobId', null); set('thumbnailFile', null) }} acceptedTypes={['image/jpeg', 'image/png', 'image/webp']} acceptedTypesLabel="JPG, PNG, WEBP" maxSizeMB={5} isUploading={commonLoading.isUploading} uploadText="Klik untuk upload thumbnail" />
      </FormSection>

      <FormSection>
        <Label>Status</Label>
        <StatusToggle>
          {STATUS_OPTIONS.map(s => (
            <StatusOption key={s} checked={values.status === s}>
              <input type="radio" name="event-status" value={s} checked={values.status === s} onChange={() => set('status', s)} />
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </StatusOption>
          ))}
        </StatusToggle>
      </FormSection>
    </Modal>
  )
}

export default EventFormModal
