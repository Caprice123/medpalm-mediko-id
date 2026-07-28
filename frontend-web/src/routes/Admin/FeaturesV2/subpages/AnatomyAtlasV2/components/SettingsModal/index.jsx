import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { useAnatomyAtlasSetting } from '../../hooks/useAnatomyAtlasSetting'
import { FormGroup, Label, HintText, ToggleSwitch, ToggleSlider } from './SettingsModal.styles'

const ACCESS_TYPE_OPTIONS = [
  { value: 'free', label: 'Gratis' },
  { value: 'credits', label: 'Credits' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'subscription_and_credits', label: 'Subscription & Credits' },
]

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
      <FormGroup>
        <Label>Status Fitur</Label>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={form.values.anatomy_atlas_is_active}
            onChange={e => form.setFieldValue('anatomy_atlas_is_active', e.target.checked)}
          />
          <ToggleSlider />
        </ToggleSwitch>
        <HintText>Aktifkan atau nonaktifkan fitur Anatomi &amp; Atlas 3D</HintText>
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Judul Fitur"
          placeholder="Anatomi & Atlas 3D"
          value={form.values.anatomy_atlas_feature_title}
          onChange={e => form.setFieldValue('anatomy_atlas_feature_title', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Deskripsi Fitur"
          placeholder="Deskripsi singkat fitur"
          value={form.values.anatomy_atlas_feature_description}
          onChange={e => form.setFieldValue('anatomy_atlas_feature_description', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Dropdown
          label="Tipe Akses"
          options={ACCESS_TYPE_OPTIONS}
          value={ACCESS_TYPE_OPTIONS.find(o => o.value === form.values.anatomy_atlas_access_type) ?? ACCESS_TYPE_OPTIONS[2]}
          onChange={option => form.setFieldValue('anatomy_atlas_access_type', option.value)}
        />
      </FormGroup>

      {(form.values.anatomy_atlas_access_type === 'credits' || form.values.anatomy_atlas_access_type === 'subscription_and_credits') && (
        <FormGroup>
          <TextInput
            label="Kredit per Akses"
            placeholder="0"
            value={form.values.anatomy_atlas_credit_cost}
            onChange={e => form.setFieldValue('anatomy_atlas_credit_cost', e.target.value)}
          />
        </FormGroup>
      )}

      <FormGroup>
        <TextInput
          label="YouTube URL"
          placeholder="https://www.youtube.com/watch?v=..."
          value={form.values.anatomy_atlas_youtube_url}
          onChange={e => form.setFieldValue('anatomy_atlas_youtube_url', e.target.value)}
        />
        <HintText>URL video YouTube sebagai panduan penggunaan fitur ini</HintText>
      </FormGroup>
    </Modal>
  )
}
