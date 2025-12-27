import { useSelector } from 'react-redux'
import Dropdown from '@components/common/Dropdown'
import ModelDropdown from '@components/common/ModelDropdown'
import Modal from '@components/common/Modal'
import { useFeatureSetting } from '../../hooks/subhooks/useFeatureSetting'
import Textarea from '@components/common/Textarea'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { FormGroup, HintText, Label } from './FlashcardSettingsModal.styles'
import { ToggleSlider, ToggleSwitch } from '../../../SummaryNotes/components/SummaryNotesSettingsModal/SummaryNotesSettingsModal.styles'

function FlashcardSettingsModal({ onClose }) {
  const { form } = useFeatureSetting(onClose)
  const { loading } = useSelector(state => state.flashcard)

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
            disabled={loading.isCreating}
            >
            {loading.isCreating ? 'Menyimpan...' : 'Simpan Ringkasan'}
            </Button>
        </>
        }
    >
        <FormGroup>
            <Label>Status Fitur</Label>
            <ToggleSwitch>
                <input
                    type="checkbox"
                    checked={form.values.flashcard_is_active}
                    onChange={(e) => form.setFieldValue('flashcard_is_active', e.target.checked)}
                />
                <ToggleSlider />
            </ToggleSwitch>
            <HintText>Aktifkan atau nonaktifkan fitur ringkasan materi</HintText>
        </FormGroup>

        <FormGroup>
            <TextInput
                label="Judul Fitur"
                placeholder="Ringkasan Materi"
                value={form.values.flashcard_feature_title}
                onChange={(e) => form.setFieldValue('flashcard_feature_title', e.target.value)}
                error={form.errors.flashcard_feature_title}
            />
        </FormGroup>

        <FormGroup>
            <TextInput
                label="Deskripsi Fitur"
                placeholder="Deskripsi singkat"
                value={form.values.flashcard_feature_description}
                onChange={(e) => form.setFieldValue('flashcard_feature_description', e.target.value)}
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
                value: form.values.flashcard_access_type,
                label: form.values.flashcard_access_type === 'free' ? 'Gratis' :
                        form.values.flashcard_access_type === 'credits' ? 'Credits' :
                        form.values.flashcard_access_type === 'subscription' ? 'Subscription' :
                        'Subscription & Credits'
                }}
                onChange={(option) => form.setFieldValue('flashcard_access_type', option.value)}
            />
        </FormGroup>

        {(form.values.flashcard_access_type === 'credits' || form.values.flashcard_access_type === 'subscription_and_credits') && (
            <FormGroup>
                <TextInput 
                    label="Kredit per Akses"
                    placeholder="0"
                    value={form.values.flashcard_credit_cost}
                    onChange={(e) => form.setFieldValue('flashcard_credit_cost', e.target.value)}
                    error={form.errors.flashcard_credit_cost}
                />
            </FormGroup>
        )}
        
        <FormGroup>
            <ModelDropdown
                value={form.values.flashcard_generation_model}
                onChange={(option) => form.setFieldValue('flashcard_generation_model', option.value)}
            />
            <HintText>Model yang digunakan untuk generate flashcard dari context</HintText>
        </FormGroup>

        <FormGroup>
            <Textarea
                label="Prompt Generasi Flashcard (text based)"
                placeholder="Masukkan prompt untuk generate flashcard..."
                value={form.values.flashcard_generation_prompt_text_based}
                onChange={(e) => form.setFieldValue('flashcard_generation_prompt_text_based', e.target.value)}
                style={{ minHeight: '200px' }}
                error={form.errors.flashcard_generation_prompt_text_based}
            />
            <HintText>
                Prompt ini digunakan ketika admin menggunakan text based untuk di-generate menjadi flashcard
            </HintText>
        </FormGroup>

        <FormGroup>
            <Label>Prompt Generasi Flashcard (document based)</Label>
            <Textarea
                placeholder="Masukkan prompt untuk generate flashcard..."
                value={form.values.flashcard_generation_prompt_document_based}
                onChange={(e) => form.setFieldValue('flashcard_generation_prompt_document_based', e.target.value)}
                style={{ minHeight: '200px' }}
                error={form.errors.flashcard_generation_prompt_document_based}
            />
            <HintText>
                Prompt ini digunakan ketika admin mengupload dokumen untuk di-generate menjadi flashcard
            </HintText>
        </FormGroup>
    </Modal>
  )
}

export default FlashcardSettingsModal
