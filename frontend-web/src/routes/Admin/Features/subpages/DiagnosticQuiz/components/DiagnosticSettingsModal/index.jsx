import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import { useFeatureSetting } from '../../hooks/subhooks/useFeatureSetting'
import { FormGroup, HintText, Label } from './DiagnosticSettingsModal.styles'
import { ToggleSlider, ToggleSwitch } from '../../../SummaryNotes/components/SummaryNotesSettingsModal/SummaryNotesSettingsModal.styles'

function AnatomySettingsModal({ onClose }) {
  const { loading } = useSelector(state => state.diagnostic)
  const { form } = useFeatureSetting(onClose)

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Pengaturan Fitur Quiz Diagnostik"
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
            checked={form.values.diagnostic_is_active}
            onChange={(e) => form.setFieldValue('diagnostic_is_active', e.target.checked)}
          />
          <ToggleSlider />
        </ToggleSwitch>
        <HintText>Aktifkan atau nonaktifkan fitur quiz diagnostik</HintText>
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Judul Fitur"
          placeholder="Quiz Diagnostik"
          value={form.values.diagnostic_feature_title}
          onChange={(e) => form.setFieldValue('diagnostic_feature_title', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Deskripsi Fitur"
          placeholder="Deskripsi singkat"
          value={form.values.diagnostic_feature_description}
          onChange={(e) => form.setFieldValue('diagnostic_feature_description', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="YouTube URL"
          placeholder="https://www.youtube.com/embed/..."
          value={form.values.diagnostic_youtube_url}
          onChange={(e) => form.setFieldValue('diagnostic_youtube_url', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Judul Bagian Soal"
          placeholder="Identifikasi Bagian Anatomi"
          value={form.values.diagnostic_section_title}
          onChange={(e) => form.setFieldValue('diagnostic_section_title', e.target.value)}
          hint="Judul yang ditampilkan pada bagian soal di halaman quiz"
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
            value: form.values.diagnostic_access_type,
            label: form.values.diagnostic_access_type === 'free' ? 'Gratis' :
                   form.values.diagnostic_access_type === 'credits' ? 'Credits' :
                   form.values.diagnostic_access_type === 'subscription' ? 'Subscription' :
                   'Subscription & Credits'
          }}
          onChange={(option) => form.setFieldValue('diagnostic_access_type', option.value)}
        />
      </FormGroup>

      {(form.values.diagnostic_access_type === 'credits' || form.values.diagnostic_access_type === 'subscription_and_credits') && (
        <FormGroup>
          <TextInput
            label="Kredit per Quiz"
            type="number"
            min="0"
            placeholder="0"
            value={form.values.diagnostic_credit_cost}
            onChange={(e) => form.setFieldValue('diagnostic_credit_cost', e.target.value)}
          />
        </FormGroup>
      )}
    </Modal>
  )
}

export default AnatomySettingsModal
