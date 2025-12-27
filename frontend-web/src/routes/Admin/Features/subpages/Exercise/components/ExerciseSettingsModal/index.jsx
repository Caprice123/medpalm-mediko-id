import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Dropdown from '@components/common/Dropdown'
import ModelDropdown from '@components/common/ModelDropdown'
import Textarea from '@components/common/Textarea'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { useExerciseFeatureSetting } from '../../hooks/subhooks/useExerciseFeatureSetting'
import { FormGroup, HintText, Label, VariableBadge } from './ExerciseSettingsModal.styles'
import { ToggleSlider, ToggleSwitch } from '../../../SummaryNotes/components/SummaryNotesSettingsModal/SummaryNotesSettingsModal.styles'

function ExerciseSettingsModal({ onClose }) {
  const { form } = useExerciseFeatureSetting(onClose)
  const { loading } = useSelector(state => state.exercise)

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Feature Setting"
      size="large"
      footer={
        <>
          <Button onClick={onClose}>Batal</Button>
          <Button
            variant="primary"
            onClick={form.handleSubmit}
            disabled={loading.isUpdatingConstants}
          >
            {loading.isUpdatingConstants ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </>
      }
    >
      <FormGroup>
        <Label>Status Fitur</Label>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={form.values.exercise_is_active}
            onChange={(e) => form.setFieldValue('exercise_is_active', e.target.checked)}
          />
          <ToggleSlider />
        </ToggleSwitch>
        <HintText>Aktifkan atau nonaktifkan fitur latihan soal</HintText>
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Judul Fitur"
          placeholder="Latihan Soal Fill-in-the-Blank"
          value={form.values.exercise_feature_title}
          onChange={(e) => form.setFieldValue('exercise_feature_title', e.target.value)}
          error={form.errors.exercise_feature_title}
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Deskripsi Fitur"
          placeholder="Deskripsi singkat"
          value={form.values.exercise_feature_description}
          onChange={(e) => form.setFieldValue('exercise_feature_description', e.target.value)}
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
            value: form.values.exercise_access_type,
            label: form.values.exercise_access_type === 'free' ? 'Gratis' :
                    form.values.exercise_access_type === 'credits' ? 'Credits' :
                    form.values.exercise_access_type === 'subscription' ? 'Subscription' :
                    'Subscription & Credits'
          }}
          onChange={(option) => form.setFieldValue('exercise_access_type', option.value)}
        />
      </FormGroup>

      {(form.values.exercise_access_type === 'credits' || form.values.exercise_access_type === 'subscription_and_credits') && (
        <FormGroup>
          <TextInput
            label="Kredit per Akses"
            placeholder="0"
            value={form.values.exercise_credit_cost}
            onChange={(e) => form.setFieldValue('exercise_credit_cost', e.target.value)}
            error={form.errors.exercise_credit_cost}
          />
        </FormGroup>
      )}

      <FormGroup>
        <ModelDropdown
          value={form.values.exercise_generation_model}
          onChange={(option) => form.setFieldValue('exercise_generation_model', option.value)}
        />
        <HintText>Model yang digunakan untuk generate soal</HintText>
      </FormGroup>

      <FormGroup>
        <Textarea
          label="Prompt Generasi Soal (text based)"
          placeholder="Masukkan prompt untuk generate soal..."
          value={form.values.exercise_generation_prompt_text_based}
          onChange={(e) => form.setFieldValue('exercise_generation_prompt_text_based', e.target.value)}
          style={{ minHeight: '200px' }}
          error={form.errors.exercise_generation_prompt_text_based}
        />
        <HintText>
          Prompt ini digunakan ketika admin menggunakan text based untuk di-generate menjadi soal
        </HintText>
      </FormGroup>

      <FormGroup>
        <Label>Prompt Generasi Soal (document based)</Label>
        <Textarea
          placeholder="Masukkan prompt untuk generate soal..."
          value={form.values.exercise_generation_prompt_document_based}
          onChange={(e) => form.setFieldValue('exercise_generation_prompt_document_based', e.target.value)}
          style={{ minHeight: '200px' }}
          error={form.errors.exercise_generation_prompt_document_based}
        />
        <HintText>
          Prompt ini digunakan ketika admin mengupload dokumen untuk di-generate menjadi soal
        </HintText>
      </FormGroup>
    </Modal>
  )
}

export default ExerciseSettingsModal
