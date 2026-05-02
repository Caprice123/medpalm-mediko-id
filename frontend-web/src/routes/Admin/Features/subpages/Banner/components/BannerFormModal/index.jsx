import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import FileUpload from '@components/common/FileUpload'
import { upload } from '@store/common/action'
import { createBanner, updateBanner, fetchAdminBanners } from '@store/banner/adminAction'
import {
  FormSection, Label, Row, ColorRow, ColorSwatch, ColorInput,
  ActiveToggle, ToggleSwitch, ToggleLabel, ErrorText,
  PreviewBanner, PreviewText, PreviewButton,
} from './BannerFormModal.styles'

function BannerFormModal({ mode = 'create', initialValues, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.banner)
  const { loading: commonLoading } = useSelector(state => state.common)

  const [values, setValues] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    redirectUrl: initialValues?.redirectUrl || '',
    redirectLabel: initialValues?.redirectLabel || '',
    gradientStart: initialValues?.gradientStart || '#0369a1',
    gradientEnd: initialValues?.gradientEnd || '#15803d',
    isActive: initialValues?.isActive ?? false,
    order: initialValues?.order ?? 0,
    imageBlobId: null,
    imageFile: initialValues?.image
      ? { name: initialValues.image.filename, url: initialValues.image.url }
      : null,
  })
  const [errors, setErrors] = useState({})

  const set = (key, value) => setValues(prev => ({ ...prev, [key]: value }))

  const handleImageSelect = async (file) => {
    const result = await dispatch(upload(file, 'banner'))
    set('imageBlobId', result.blobId)
    set('imageFile', { name: result.filename, url: result.url })
  }

  const validate = () => {
    const errs = {}
    if (!values.title.trim()) errs.title = 'Title is required'
    if (!values.redirectUrl.trim()) errs.redirectUrl = 'Redirect URL is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const payload = {
      title: values.title,
      description: values.description || null,
      redirectUrl: values.redirectUrl,
      redirectLabel: values.redirectLabel || null,
      gradientStart: values.gradientStart || null,
      gradientEnd: values.gradientEnd || null,
      isActive: values.isActive,
      order: values.order,
      ...(values.imageBlobId && { imageBlobId: values.imageBlobId }),
    }

    const onSuccess = () => {
      dispatch(fetchAdminBanners())
      onClose()
    }

    if (mode === 'create') {
      dispatch(createBanner(payload, onSuccess))
    } else {
      dispatch(updateBanner(initialValues.uniqueId, payload, onSuccess))
    }
  }

  const isLoading = mode === 'create' ? loading.isCreateLoading : loading.isUpdateLoading

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={mode === 'create' ? 'Tambah Banner' : 'Edit Banner'}
      size="lg"
    >
      {/* Live preview */}
      <PreviewBanner $gradientStart={values.gradientStart} $gradientEnd={values.gradientEnd}>
        <PreviewText>
          <h3>{values.title || 'Judul Banner'}</h3>
          <p>{values.description || 'Deskripsi banner...'}</p>
        </PreviewText>
        <PreviewButton>{values.redirectLabel || 'Lihat Sekarang'}</PreviewButton>
      </PreviewBanner>

      <FormSection>
        <div>
          <Label>Judul *</Label>
          <TextInput
            value={values.title}
            onChange={e => set('title', e.target.value)}
            placeholder="Judul banner"
          />
          {errors.title && <ErrorText>{errors.title}</ErrorText>}
        </div>

        <div>
          <Label>Deskripsi</Label>
          <Textarea
            value={values.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Deskripsi singkat"
            rows={2}
          />
        </div>

        <Row>
          <div>
            <Label>URL Redirect *</Label>
            <TextInput
              value={values.redirectUrl}
              onChange={e => set('redirectUrl', e.target.value)}
              placeholder="/webinar atau https://..."
            />
            {errors.redirectUrl && <ErrorText>{errors.redirectUrl}</ErrorText>}
          </div>
          <div>
            <Label>Label Tombol</Label>
            <TextInput
              value={values.redirectLabel}
              onChange={e => set('redirectLabel', e.target.value)}
              placeholder="Lihat Sekarang"
            />
          </div>
        </Row>

        <Row>
          <div>
            <Label>Warna Gradien Awal</Label>
            <ColorRow>
              <ColorInput
                type="color"
                value={values.gradientStart}
                onChange={e => set('gradientStart', e.target.value)}
              />
              <TextInput
                value={values.gradientStart}
                onChange={e => set('gradientStart', e.target.value)}
                placeholder="#0369a1"
              />
            </ColorRow>
          </div>
          <div>
            <Label>Warna Gradien Akhir</Label>
            <ColorRow>
              <ColorInput
                type="color"
                value={values.gradientEnd}
                onChange={e => set('gradientEnd', e.target.value)}
              />
              <TextInput
                value={values.gradientEnd}
                onChange={e => set('gradientEnd', e.target.value)}
                placeholder="#15803d"
              />
            </ColorRow>
          </div>
        </Row>

        <Row>
          <div>
            <Label>Urutan Tampil</Label>
            <TextInput
              type="number"
              value={values.order}
              onChange={e => set('order', parseInt(e.target.value) || 0)}
              min={0}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.25rem' }}>
            <ActiveToggle>
              <ToggleSwitch $active={values.isActive}>
                <input
                  type="checkbox"
                  checked={values.isActive}
                  onChange={e => set('isActive', e.target.checked)}
                />
                <span />
              </ToggleSwitch>
              <ToggleLabel>{values.isActive ? 'Aktif' : 'Nonaktif'}</ToggleLabel>
            </ActiveToggle>
          </div>
        </Row>

        <div>
          <Label>Gambar Banner</Label>
          <FileUpload
            file={values.imageFile}
            onFileSelect={handleImageSelect}
            onRemove={() => { set('imageBlobId', null); set('imageFile', null) }}
            acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
            acceptedTypesLabel="JPG, PNG, WEBP"
            maxSizeMB={5}
            isUploading={commonLoading.isUploading}
            uploadText="Klik untuk upload gambar banner"
          />
        </div>
      </FormSection>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : mode === 'create' ? 'Tambah Banner' : 'Simpan'}
        </Button>
      </div>
    </Modal>
  )
}

export default BannerFormModal
