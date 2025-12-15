import { useSelector } from 'react-redux'
import Dropdown from '@components/common/Dropdown'
import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  FormGroup,
  Label,
  Input,
  Textarea,
  HintText,
  ToggleSwitch,
  ToggleSlider,
  ModalFooter,
  Button,
  LoadingSpinner
} from './McqSettingsModal.styles'
import { useFeatureSetting } from '../../hooks/subhooks/useFeatureSetting'

function McqSettingsModal({ onClose }) {
  const { loading } = useSelector(state => state.mcq)
  const { form } = useFeatureSetting(onClose)

  return (
    <Overlay isOpen={true} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Pengaturan Fitur Multiple Choice Quiz</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {loading.isConstantsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <LoadingSpinner />
              <div style={{ marginTop: '1rem', color: '#6b7280' }}>Memuat pengaturan...</div>
            </div>
          ) : (
            <>
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
                <Label>Judul Fitur</Label>
                <Input
                  type="text"
                  placeholder="Multiple Choice Quiz"
                  value={form.values.mcq_feature_title}
                  onChange={(e) => form.setFieldValue('mcq_feature_title', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Deskripsi Fitur</Label>
                <Input
                  type="text"
                  placeholder="Deskripsi singkat"
                  value={form.values.mcq_feature_description}
                  onChange={(e) => form.setFieldValue('mcq_feature_description', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Tipe Akses</Label>
                <Dropdown
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
                  <Label>Kredit per Quiz</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.values.mcq_credit_cost}
                    onChange={(e) => form.setFieldValue('mcq_credit_cost', e.target.value)}
                  />
                  <HintText>Biaya kredit yang diperlukan untuk mengakses satu quiz</HintText>
                </FormGroup>
              )}

              <FormGroup>
                <Label>Model AI untuk Generasi Soal</Label>
                <Dropdown
                  options={[
                    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
                    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
                    { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash Experimental' }
                  ]}
                  value={{
                    value: form.values.mcq_generation_model,
                    label: form.values.mcq_generation_model === 'gemini-1.5-flash' ? 'Gemini 1.5 Flash' :
                           form.values.mcq_generation_model === 'gemini-1.5-pro' ? 'Gemini 1.5 Pro' :
                           'Gemini 2.0 Flash Experimental'
                  }}
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
                />
                <HintText>Prompt custom untuk mengarahkan AI dalam generate soal. Kosongkan untuk menggunakan prompt default.</HintText>
              </FormGroup>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} disabled={loading.isUpdatingConstants}>
            Batal
          </Button>
          <Button variant="primary" onClick={form.handleSubmit} disabled={loading.isUpdatingConstants}>
            {loading.isUpdatingConstants ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </ModalFooter>
      </Modal>
    </Overlay>
  )
}

export default McqSettingsModal
