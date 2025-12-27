import { useSelector } from 'react-redux'
import Dropdown from '@components/common/Dropdown'
import ModelDropdown from '@components/common/ModelDropdown'
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
  Select,
  HintText,
  ToggleSwitch,
  ToggleSlider,
  ModalFooter,
  Button,
  LoadingSpinner
} from './SummaryNotesSettingsModal.styles'
import { useFeatureSetting } from '../../hooks/subhooks/useFeatureSetting'

function SummaryNotesSettingsModal({ isOpen, onClose }) {
  const { loading } = useSelector(state => state.summaryNotes)
  const { form } = useFeatureSetting(onClose)

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Pengaturan Fitur Ringkasan Materi</ModalTitle>
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
                    checked={form.values.summary_notes_is_active}
                    onChange={(e) => form.setFieldValue('summary_notes_is_active', e.target.checked)}
                  />
                  <ToggleSlider />
                </ToggleSwitch>
                <HintText>Aktifkan atau nonaktifkan fitur ringkasan materi</HintText>
              </FormGroup>

              <FormGroup>
                <Label>Judul Fitur</Label>
                <Input
                  type="text"
                  placeholder="Ringkasan Materi"
                  value={form.values.summary_notes_feature_title}
                  onChange={(e) => form.setFieldValue('summary_notes_feature_title', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Deskripsi Fitur</Label>
                <Input
                  type="text"
                  placeholder="Deskripsi singkat"
                  value={form.values.summary_notes_feature_description}
                  onChange={(e) => form.setFieldValue('summary_notes_feature_description', e.target.value)}
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
                  <Label>Kredit per Akses</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.values.summary_notes_credit_cost}
                    onChange={(e) => form.setFieldValue('summary_notes_credit_cost', e.target.value)}
                  />
                </FormGroup>
              )}

              <FormGroup>
                <Label>Model Generasi</Label>
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

export default SummaryNotesSettingsModal
