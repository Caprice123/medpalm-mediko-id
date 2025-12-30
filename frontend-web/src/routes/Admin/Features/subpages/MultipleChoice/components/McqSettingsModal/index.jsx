import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Dropdown from '@components/common/Dropdown'
import ModelDropdown from '@components/common/ModelDropdown'
import Textarea from '@components/common/Textarea'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { useFeatureSetting } from '../../hooks/subhooks/useFeatureSetting'
import { FormGroup, HintText, Label } from './McqSettingsModal.styles'
import { ToggleSlider, ToggleSwitch } from '../../../SummaryNotes/components/SummaryNotesSettingsModal/SummaryNotesSettingsModal.styles'

function McqSettingsModal({ onClose }) {
  const { loading } = useSelector(state => state.mcq)
  const { form } = useFeatureSetting(onClose)

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Pengaturan Fitur"
      size="large"
      footer={
        <>
          <Button onClick={onClose} disabled={loading.isUpdatingConstants}>
            Batal
          </Button>
          <Button variant="primary" onClick={form.handleSubmit} disabled={loading.isUpdatingConstants}>
            {loading.isUpdatingConstants ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      <FormGroup>
        <Label>Status Fitur</Label>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={form.values.mcq_is_active}
            onChange={(e) => form.setFieldValue('mcq_is_active', e.target.checked)}
          />
          <ToggleSlider />
        </ToggleSwitch>
        <HintText>Aktifkan atau nonaktifkan fitur multiple choice quiz</HintText>
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Judul Fitur"
          placeholder="Multiple Choice Quiz"
          value={form.values.mcq_feature_title}
          onChange={(e) => form.setFieldValue('mcq_feature_title', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Deskripsi Fitur"
          placeholder="Deskripsi singkat"
          value={form.values.mcq_feature_description}
          onChange={(e) => form.setFieldValue('mcq_feature_description', e.target.value)}
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
            value: form.values.mcq_access_type,
            label: form.values.mcq_access_type === 'free' ? 'Gratis' :
                   form.values.mcq_access_type === 'credits' ? 'Credits' :
                   form.values.mcq_access_type === 'subscription' ? 'Subscription' :
                   'Subscription & Credits'
          }}
          onChange={(option) => form.setFieldValue('mcq_access_type', option.value)}
        />
      </FormGroup>

      {(form.values.mcq_access_type === 'credits' || form.values.mcq_access_type === 'subscription_and_credits') && (
        <FormGroup>
          <TextInput
            label="Kredit per Quiz"
            type="number"
            min="0"
            placeholder="0"
            value={form.values.mcq_credit_cost}
            onChange={(e) => form.setFieldValue('mcq_credit_cost', e.target.value)}
            hint="Biaya kredit yang diperlukan untuk mengakses satu quiz"
          />
        </FormGroup>
      )}

      <FormGroup>
        <ModelDropdown
          value={form.values.mcq_generation_model}
          onChange={(option) => form.setFieldValue('mcq_generation_model', option.value)}
        />
        <HintText>Model AI yang digunakan untuk generate soal dari dokumen</HintText>
      </FormGroup>

      <FormGroup>
        <Label>Prompt Generasi Soal (Opsional)</Label>
        <Textarea
          placeholder="Masukkan prompt custom untuk generasi soal pilihan ganda..."
          value={form.values.mcq_generation_prompt}
          onChange={(e) => form.setFieldValue('mcq_generation_prompt', e.target.value)}
          style={{ minHeight: '200px' }}
        />
        <HintText>Prompt custom untuk mengarahkan AI dalam generate soal. Kosongkan untuk menggunakan prompt default.</HintText>
      </FormGroup>
    </Modal>
  )
}

export default McqSettingsModal
