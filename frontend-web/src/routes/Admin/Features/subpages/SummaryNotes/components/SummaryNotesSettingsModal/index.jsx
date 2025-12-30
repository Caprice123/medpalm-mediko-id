import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Dropdown from '@components/common/Dropdown'
import ModelDropdown from '@components/common/ModelDropdown'
import Textarea from '@components/common/Textarea'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { useFeatureSetting } from '../../hooks/subhooks/useFeatureSetting'
import { FormGroup, HintText, Label, ToggleSwitch, ToggleSlider } from './SummaryNotesSettingsModal.styles'

function SummaryNotesSettingsModal({ isOpen, onClose }) {
  const { loading } = useSelector(state => state.summaryNotes)
  const { form } = useFeatureSetting(onClose)

  return (
    <Modal
      isOpen={isOpen}
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
            checked={form.values.summary_notes_is_active}
            onChange={(e) => form.setFieldValue('summary_notes_is_active', e.target.checked)}
          />
          <ToggleSlider />
        </ToggleSwitch>
        <HintText>Aktifkan atau nonaktifkan fitur ringkasan materi</HintText>
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Judul Fitur"
          placeholder="Ringkasan Materi"
          value={form.values.summary_notes_feature_title}
          onChange={(e) => form.setFieldValue('summary_notes_feature_title', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Deskripsi Fitur"
          placeholder="Deskripsi singkat"
          value={form.values.summary_notes_feature_description}
          onChange={(e) => form.setFieldValue('summary_notes_feature_description', e.target.value)}
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
            value: form.values.summary_notes_access_type,
            label: form.values.summary_notes_access_type === 'free' ? 'Gratis' :
                   form.values.summary_notes_access_type === 'credits' ? 'Credits' :
                   form.values.summary_notes_access_type === 'subscription' ? 'Subscription' :
                   'Subscription & Credits'
          }}
          onChange={(option) => form.setFieldValue('summary_notes_access_type', option.value)}
        />
      </FormGroup>

      {(form.values.summary_notes_access_type === 'credits' || form.values.summary_notes_access_type === 'subscription_and_credits') && (
        <FormGroup>
          <TextInput
            label="Kredit per Akses"
            type="number"
            min="0"
            placeholder="0"
            value={form.values.summary_notes_credit_cost}
            onChange={(e) => form.setFieldValue('summary_notes_credit_cost', e.target.value)}
          />
        </FormGroup>
      )}

      <FormGroup>
        <ModelDropdown
          value={form.values.summary_notes_generation_model}
          onChange={(option) => form.setFieldValue('summary_notes_generation_model', option.value)}
        />
        <HintText>Model yang digunakan untuk generate ringkasan dari dokumen</HintText>
      </FormGroup>

      <FormGroup>
        <Label>Prompt Generasi Ringkasan</Label>
        <Textarea
          placeholder="Masukkan prompt untuk generate ringkasan..."
          value={form.values.summary_notes_generation_prompt}
          onChange={(e) => form.setFieldValue('summary_notes_generation_prompt', e.target.value)}
          style={{ minHeight: '200px' }}
        />
        <HintText>
          Prompt ini digunakan ketika admin mengupload dokumen untuk di-generate menjadi ringkasan
        </HintText>
      </FormGroup>
    </Modal>
  )
}

export default SummaryNotesSettingsModal
