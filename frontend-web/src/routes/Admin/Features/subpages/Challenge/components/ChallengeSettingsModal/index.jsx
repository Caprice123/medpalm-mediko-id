import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import { useChallengeFeatureSetting } from '../../hooks/useChallengeFeatureSetting'
import { FormGroup, Label, HintText } from './ChallengeSettingsModal.styles'
import {
  ToggleSwitch,
  ToggleSlider,
} from '../../../SummaryNotes/components/SummaryNotesSettingsModal/SummaryNotesSettingsModal.styles'

const ACCESS_TYPE_OPTIONS = [
  { value: 'free', label: 'Gratis' },
  { value: 'credits', label: 'Credits' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'subscription_and_credits', label: 'Subscription & Credits' },
]

function ChallengeSettingsModal({ onClose }) {
  const { loading } = useSelector(state => state.constant)
  const { form } = useChallengeFeatureSetting(onClose)

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Pengaturan Fitur Challenge"
      scrollable={false}
      footer={
        <>
          <Button onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={form.handleSubmit} disabled={loading.isUpdateConstantLoading}>
            {loading.isUpdateConstantLoading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      <FormGroup>
        <Label>Status Fitur</Label>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={!!form.values.challenge_is_active}
            onChange={e => form.setFieldValue('challenge_is_active', e.target.checked)}
          />
          <ToggleSlider />
        </ToggleSwitch>
        <HintText>Aktifkan atau nonaktifkan fitur Challenge</HintText>
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Judul Fitur"
          placeholder="Challenge"
          value={form.values.challenge_feature_title}
          onChange={e => form.setFieldValue('challenge_feature_title', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Deskripsi Fitur"
          placeholder="Uji pengetahuanmu dan bersaing dengan pengguna lain"
          value={form.values.challenge_feature_description}
          onChange={e => form.setFieldValue('challenge_feature_description', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Label>Tipe Akses</Label>
        <Dropdown
          options={ACCESS_TYPE_OPTIONS}
          value={ACCESS_TYPE_OPTIONS.find(o => o.value === form.values.challenge_access_type)}
          onChange={option => form.setFieldValue('challenge_access_type', option.value)}
        />
      </FormGroup>
    </Modal>
  )
}

export default ChallengeSettingsModal
