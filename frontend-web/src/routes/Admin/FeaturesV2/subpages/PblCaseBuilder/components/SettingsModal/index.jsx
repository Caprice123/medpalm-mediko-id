import { useSelector } from 'react-redux'
import SettingsModal from '@components/common/SettingsModal'
import TextInput from '@components/common/TextInput'
import NumberInput from '@components/common/NumberInput'
import Dropdown from '@components/common/Dropdown'
import { aiModelsGrouped, getModelLabel, imageModelsGrouped, getImageModelLabel } from '@config/aiModels'
import { usePblSettings } from './hooks/usePblSettings'
import {
  FormGroup, Label, HintText, SectionDivider, TwoUp, ToggleSwitch, ToggleSlider,
} from './SettingsModal.styles'

// The text editor runs on Gemini, so a Perplexity search model is not an
// option here even though the shared catalogue lists both.
const TEXT_MODEL_OPTIONS = aiModelsGrouped.filter(group => group.label === 'GEMINI')

const ACCESS_TYPE_OPTIONS = [
  { value: 'free', label: 'Gratis' },
  { value: 'credits', label: 'Credits' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'subscription_and_credits', label: 'Subscription & Credits' },
]

const Toggle = ({ id, checked, onChange }) => (
  <ToggleSwitch>
    <input id={id} type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} />
    <ToggleSlider />
  </ToggleSwitch>
)

// One panel per section, each with its own switch and credit cost, so an admin
// can leave the Searcher on while the Diagram Builder is off.
const PblSettingsModal = ({ isOpen, onClose }) => {
  const { form } = usePblSettings(onClose)
  const isSaving = useSelector(state => state.constant.loading.isUpdateConstantLoading)

  const field = (key) => (event) => form.setFieldValue(key, event.target.value)
  const toggle = (key) => (checked) => form.setFieldValue(key, checked)

  return (
    <SettingsModal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan PBL Case Builder"
      onSave={form.handleSubmit}
      loading={isSaving}
      saveButtonText="Simpan"
      cancelButtonText="Batal"
    >
      <FormGroup>
        <Label htmlFor="pbl-feature-active">Status Fitur</Label>
        <Toggle
          id="pbl-feature-active"
          checked={form.values.skripsi_is_active}
          onChange={toggle('skripsi_is_active')}
        />
        <HintText>
          Mematikan ini juga mematikan Skripsi Builder V1 — keduanya memakai saklar yang sama.
        </HintText>
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Judul Fitur"
          value={form.values.skripsi_feature_title}
          onChange={field('skripsi_feature_title')}
          placeholder="PBL Case Builder"
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Deskripsi Fitur"
          value={form.values.skripsi_feature_description}
          onChange={field('skripsi_feature_description')}
          placeholder="Deskripsi singkat fitur"
        />
      </FormGroup>

      <FormGroup>
        <Dropdown
          label="Tipe Akses"
          options={ACCESS_TYPE_OPTIONS}
          value={ACCESS_TYPE_OPTIONS.find(option => option.value === form.values.skripsi_access_type)}
          onChange={option => form.setFieldValue('skripsi_access_type', option?.value)}
          isClearable={false}
        />
      </FormGroup>

      <SectionDivider>
        <h4>AI Chat</h4>
        <p>Tab percakapan di editor laporan.</p>

        <FormGroup>
          <Label htmlFor="pbl-chat-enabled">Aktif</Label>
          <Toggle
            id="pbl-chat-enabled"
            checked={form.values.pbl_ai_chat_enabled}
            onChange={toggle('pbl_ai_chat_enabled')}
          />
        </FormGroup>

        <NumberInput
          label="Biaya kredit per pesan"
          value={form.values.pbl_ai_chat_cost}
          onChange={field('pbl_ai_chat_cost')}
          min={0}
          allowDecimal
        />
      </SectionDivider>

      <SectionDivider>
        <h4>Edit dengan AI</h4>
        <p>Menyunting teks yang diblok mahasiswa di dalam bagian laporan.</p>

        <FormGroup>
          <Label htmlFor="pbl-ai-edit-enabled">Aktif</Label>
          <Toggle
            id="pbl-ai-edit-enabled"
            checked={form.values.pbl_ai_edit_enabled}
            onChange={toggle('pbl_ai_edit_enabled')}
          />
        </FormGroup>

        <FormGroup>
          <Dropdown
            label="Model"
            options={TEXT_MODEL_OPTIONS}
            value={{
              value: form.values.pbl_ai_edit_model,
              label: getModelLabel(form.values.pbl_ai_edit_model),
            }}
            onChange={option => form.setFieldValue('pbl_ai_edit_model', option?.value)}
            isClearable={false}
          />
          <HintText>Pilih model Gemini — penyuntingan teks tidak memakai model pencarian.</HintText>
        </FormGroup>

        <NumberInput
          label="Biaya kredit per revisi"
          value={form.values.pbl_ai_edit_cost}
          onChange={field('pbl_ai_edit_cost')}
          min={0}
          allowDecimal
        />
      </SectionDivider>

      <SectionDivider>
        <h4>Searcher</h4>
        <p>Pencarian jurnal dan sumber ilmiah lewat Perplexity.</p>

        <FormGroup>
          <Label htmlFor="pbl-searcher-enabled">Aktif</Label>
          <Toggle
            id="pbl-searcher-enabled"
            checked={form.values.pbl_searcher_enabled}
            onChange={toggle('pbl_searcher_enabled')}
          />
        </FormGroup>

        <TwoUp>
          <NumberInput
            label="Biaya kredit per pencarian"
            value={form.values.pbl_searcher_cost}
            onChange={field('pbl_searcher_cost')}
            min={0}
            allowDecimal
          />
          <NumberInput
            label="Hasil default"
            value={form.values.pbl_searcher_max_results}
            onChange={field('pbl_searcher_max_results')}
            min={1}
            max={20}
            hint="Dipakai saat mahasiswa tidak mengatur batas hasil."
          />
        </TwoUp>
      </SectionDivider>

      <SectionDivider>
        <h4>Diagram Builder</h4>
        <p>Diagram digambar sebagai gambar oleh model Gemini.</p>

        <FormGroup>
          <Label htmlFor="pbl-diagram-enabled">Aktif</Label>
          <Toggle
            id="pbl-diagram-enabled"
            checked={form.values.pbl_diagram_enabled}
            onChange={toggle('pbl_diagram_enabled')}
          />
        </FormGroup>

        <FormGroup>
          <Dropdown
            label="Model Gambar"
            options={imageModelsGrouped}
            value={{
              value: form.values.pbl_diagram_image_model,
              label: getImageModelLabel(form.values.pbl_diagram_image_model),
            }}
            onChange={option => form.setFieldValue('pbl_diagram_image_model', option?.value)}
            isClearable={false}
          />
          <HintText>Hanya model Gemini yang bisa menghasilkan gambar.</HintText>
        </FormGroup>

        <NumberInput
          label="Biaya kredit per diagram"
          value={form.values.pbl_diagram_cost}
          onChange={field('pbl_diagram_cost')}
          min={0}
          allowDecimal
        />
      </SectionDivider>
    </SettingsModal>
  )
}

export default PblSettingsModal
