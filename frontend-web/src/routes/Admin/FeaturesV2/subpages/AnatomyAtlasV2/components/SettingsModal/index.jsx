import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { useAnatomyAtlasSetting } from '../../hooks/useAnatomyAtlasSetting'
import { FormGroup, Label, HintText, SectionDivider, ToggleSwitch, ToggleSlider } from './SettingsModal.styles'

const ACCESS_TYPE_OPTIONS = [
  { value: 'free', label: 'Gratis' },
  { value: 'credits', label: 'Credits' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'subscription_and_credits', label: 'Subscription & Credits' },
]

function FeatureSection({ prefix, label, form }) {
  const isActiveKey = `${prefix}_is_active`
  const titleKey = `${prefix}_feature_title`
  const descKey = `${prefix}_feature_description`
  const accessTypeKey = `${prefix}_access_type`
  const creditCostKey = `${prefix}_credit_cost`
  const youtubeUrlKey = `${prefix}_youtube_url`

  return (
    <>
      <FormGroup>
        <Label>Status Fitur</Label>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={form.values[isActiveKey]}
            onChange={e => form.setFieldValue(isActiveKey, e.target.checked)}
          />
          <ToggleSlider />
        </ToggleSwitch>
        <HintText>Aktifkan atau nonaktifkan fitur {label}</HintText>
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Judul Fitur"
          placeholder={label}
          value={form.values[titleKey]}
          onChange={e => form.setFieldValue(titleKey, e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Deskripsi Fitur"
          placeholder="Deskripsi singkat fitur"
          value={form.values[descKey]}
          onChange={e => form.setFieldValue(descKey, e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Dropdown
          label="Tipe Akses"
          options={ACCESS_TYPE_OPTIONS}
          value={ACCESS_TYPE_OPTIONS.find(o => o.value === form.values[accessTypeKey]) ?? ACCESS_TYPE_OPTIONS[2]}
          onChange={option => form.setFieldValue(accessTypeKey, option.value)}
        />
      </FormGroup>

      {(form.values[accessTypeKey] === 'credits' || form.values[accessTypeKey] === 'subscription_and_credits') && (
        <FormGroup>
          <TextInput
            label="Kredit per Akses"
            placeholder="0"
            value={form.values[creditCostKey]}
            onChange={e => form.setFieldValue(creditCostKey, e.target.value)}
          />
        </FormGroup>
      )}

      <FormGroup>
        <TextInput
          label="YouTube URL"
          placeholder="https://www.youtube.com/watch?v=..."
          value={form.values[youtubeUrlKey]}
          onChange={e => form.setFieldValue(youtubeUrlKey, e.target.value)}
        />
        <HintText>URL video YouTube sebagai panduan penggunaan fitur ini</HintText>
      </FormGroup>
    </>
  )
}

export default function SettingsModal({ onClose }) {
  const { form } = useAnatomyAtlasSetting(onClose)
  const { loading } = useSelector(state => state.constant)
  const isSaving = loading?.isUpdateConstantLoading

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Pengaturan Anatomi & Atlas 3D"
      size="large"
      footer={
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={form.handleSubmit} disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      }
    >
      <FeatureSection prefix="atlas" label="Atlas 3D" form={form} />

      <SectionDivider><h4>Pengaturan Quiz Anatomi</h4></SectionDivider>
      <FeatureSection prefix="anatomy" label="Quiz Anatomi" form={form} />
    </Modal>
  )
}
