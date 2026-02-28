import Modal from '@components/common/Modal'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import { useAtlasFeatureSetting } from '../../hooks/subhooks/useAtlasFeatureSetting'
import { FormGroup, HintText, Label } from './AtlasSettingsModal.styles'
import { ToggleSlider, ToggleSwitch } from '../../../SummaryNotes/components/SummaryNotesSettingsModal/SummaryNotesSettingsModal.styles'
import { useSelector } from 'react-redux'

function AtlasSettingsModal({ onClose }) {
  const { loading } = useSelector(state => state.atlas)
  const { form } = useAtlasFeatureSetting(onClose)

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Pengaturan Fitur Atlas 3D"
      size="large"
      footer={
        <>
          <Button onClick={onClose} disabled={false}>
            Batal
          </Button>
          <Button variant="primary" onClick={form.handleSubmit} disabled={false}>
            {loading?.isUpdatingConstants ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      <FormGroup>
        <Label>Status Fitur</Label>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={form.values.atlas_is_active}
            onChange={e => form.setFieldValue('atlas_is_active', e.target.checked)}
          />
          <ToggleSlider />
        </ToggleSwitch>
        <HintText>Aktifkan atau nonaktifkan fitur Atlas 3D</HintText>
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Judul Fitur"
          placeholder="Atlas 3D"
          value={form.values.atlas_feature_title}
          onChange={e => form.setFieldValue('atlas_feature_title', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Deskripsi Fitur"
          placeholder="Pelajari anatomi secara interaktif dengan model 3D"
          value={form.values.atlas_feature_description}
          onChange={e => form.setFieldValue('atlas_feature_description', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Dropdown
          label="Tipe Akses"
          options={[
            { value: 'free', label: 'Gratis' },
            { value: 'credits', label: 'Credits' },
            { value: 'subscription', label: 'Subscription' },
            { value: 'subscription_and_credits', label: 'Subscription & Credits' }
          ]}
          value={{
            value: form.values.atlas_access_type,
            label:
              form.values.atlas_access_type === 'free' ? 'Gratis' :
              form.values.atlas_access_type === 'credits' ? 'Credits' :
              form.values.atlas_access_type === 'subscription' ? 'Subscription' :
              'Subscription & Credits'
          }}
          onChange={option => form.setFieldValue('atlas_access_type', option.value)}
        />
      </FormGroup>

      {(form.values.atlas_access_type === 'credits' || form.values.atlas_access_type === 'subscription_and_credits') && (
        <FormGroup>
          <TextInput
            label="Kredit per Akses"
            type="number"
            min="0"
            placeholder="0"
            value={form.values.atlas_credit_cost}
            onChange={e => form.setFieldValue('atlas_credit_cost', e.target.value)}
          />
        </FormGroup>
      )}
    </Modal>
  )
}

export default AtlasSettingsModal
