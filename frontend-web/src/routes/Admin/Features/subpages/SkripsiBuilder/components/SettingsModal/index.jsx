import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import ModelDropdown from '@components/common/ModelDropdown'
import Textarea from '@components/common/Textarea'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { useFeatureSetting } from '../../hooks/useFeatureSetting'
import {
  FormGroup,
  Label,
  Select,
  HintText,
  SectionTitle,
  ModeSection,
  ModeHeader,
  ModeTitle,
  ModeIcon,
  Divider
} from './SettingsModal.styles'
import { ToggleSlider, ToggleSwitch } from '../../../SummaryNotes/components/SummaryNotesSettingsModal/SummaryNotesSettingsModal.styles'

function SettingsModal({ isOpen, onClose }) {
  const { loading } = useSelector(state => state.constant || { loading: {} })
  const { form } = useFeatureSetting(onClose)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Fitur"
      size="large"
      footer={
        <>
          <Button onClick={onClose} disabled={loading.isUpdateConstantLoading}>
            Batal
          </Button>
          <Button variant="primary" onClick={form.handleSubmit} disabled={loading.isUpdateConstantLoading}>
            {loading.isUpdateConstantLoading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      {/* Basic Information */}
      <SectionTitle>Pengaturan Dasar</SectionTitle>

      <FormGroup>
        <Label>Aktifkan Fitur</Label>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={form.values.skripsi_is_active}
            onChange={(e) => form.setFieldValue('skripsi_is_active', e.target.checked)}
          />
          <ToggleSlider />
        </ToggleSwitch>
        <HintText>Aktifkan atau nonaktifkan fitur Skripsi Builder secara global</HintText>
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Judul Fitur"
          placeholder="Skripsi Builder"
          value={form.values.skripsi_feature_title}
          onChange={(e) => form.setFieldValue('skripsi_feature_title', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Deskripsi Fitur"
          placeholder="Deskripsi singkat"
          value={form.values.skripsi_feature_description}
          onChange={(e) => form.setFieldValue('skripsi_feature_description', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Label>Tipe Akses</Label>
        <Select
          value={form.values.skripsi_access_type}
          onChange={(e) => form.setFieldValue('skripsi_access_type', e.target.value)}
        >
          <option value="subscription">Subscription Only</option>
          <option value="credits">Credits Only</option>
          <option value="subscription_and_credits">Subscription & Credits</option>
        </Select>
        <HintText>
          Subscription: hanya pengguna berlangganan yang bisa mengakses<br/>
          Credits: gunakan kredit per pesan<br/>
          Subscription & Credits: pengguna berlangganan gratis, non-subscriber bayar kredit
        </HintText>
      </FormGroup>

      <Divider />

      {/* AI Researcher Configuration */}
      <SectionTitle>Konfigurasi Sub-Fitur</SectionTitle>

      <ModeSection>
        <ModeHeader>
          <ModeIcon>🔍</ModeIcon>
          <ModeTitle>AI Researcher</ModeTitle>
        </ModeHeader>

        <FormGroup>
          <Label>Status</Label>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={form.values.skripsi_ai_researcher_enabled}
              onChange={(e) => form.setFieldValue('skripsi_ai_researcher_enabled', e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
          <HintText>Aktifkan atau nonaktifkan AI Researcher</HintText>
        </FormGroup>

        <FormGroup>
          <TextInput
            label="Jumlah Tab"
            type="number"
            placeholder="3"
            value={form.values.skripsi_ai_researcher_count}
            onChange={(e) => form.setFieldValue('skripsi_ai_researcher_count', e.target.value)}
            hint="Jumlah tab AI Researcher yang tersedia untuk pengguna"
          />
        </FormGroup>

        <FormGroup>
          <Label>Model AI</Label>
          <ModelDropdown
            value={form.values.skripsi_ai_researcher_model}
            onChange={(option) => form.setFieldValue('skripsi_ai_researcher_model', option.value)}
          />
        </FormGroup>

        <FormGroup>
          <TextInput
            label="Biaya per Pesan (Kredit)"
            type="number"
            min="0"
            placeholder="0"
            value={form.values.skripsi_ai_researcher_cost}
            onChange={(e) => form.setFieldValue('skripsi_ai_researcher_cost', e.target.value)}
            hint="Jumlah kredit yang dikurangi setiap kali pengguna mengirim pesan (jika menggunakan credits)"
          />
        </FormGroup>

        <FormGroup>
          <TextInput
            label="Jumlah Pesan Konteks"
            type="number"
            min="0"
            placeholder="10"
            value={form.values.skripsi_ai_researcher_context_messages}
            onChange={(e) => form.setFieldValue('skripsi_ai_researcher_context_messages', e.target.value)}
            hint="Jumlah pesan terakhir yang akan digunakan sebagai konteks percakapan"
          />
        </FormGroup>

        <FormGroup>
          <Label>System Prompt</Label>
          <Textarea
            placeholder="Masukkan system prompt untuk AI Researcher..."
            value={form.values.skripsi_ai_researcher_prompt}
            onChange={(e) => form.setFieldValue('skripsi_ai_researcher_prompt', e.target.value)}
            style={{ minHeight: '120px' }}
          />
          <HintText>
            Instruksi untuk AI tentang cara melakukan research dan memberikan jawaban
          </HintText>
        </FormGroup>
      </ModeSection>

      <ModeSection>
        <ModeHeader>
          <ModeIcon>📝</ModeIcon>
          <ModeTitle>Paraphraser</ModeTitle>
        </ModeHeader>

        <FormGroup>
          <Label>Status</Label>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={form.values.skripsi_paraphraser_enabled}
              onChange={(e) => form.setFieldValue('skripsi_paraphraser_enabled', e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
          <HintText>Aktifkan atau nonaktifkan Paraphraser</HintText>
        </FormGroup>

        <FormGroup>
          <Label>Model AI</Label>
          <ModelDropdown
            value={form.values.skripsi_paraphraser_model}
            onChange={(option) => form.setFieldValue('skripsi_paraphraser_model', option.value)}
          />
        </FormGroup>

        <FormGroup>
          <TextInput
            label="Biaya per Pesan (Kredit)"
            type="number"
            min="0"
            placeholder="0"
            value={form.values.skripsi_paraphraser_cost}
            onChange={(e) => form.setFieldValue('skripsi_paraphraser_cost', e.target.value)}
            hint="Jumlah kredit yang dikurangi setiap kali pengguna mengirim pesan (jika menggunakan credits)"
          />
        </FormGroup>

        <FormGroup>
          <TextInput
            label="Jumlah Pesan Konteks"
            type="number"
            min="0"
            placeholder="10"
            value={form.values.skripsi_paraphraser_context_messages}
            onChange={(e) => form.setFieldValue('skripsi_paraphraser_context_messages', e.target.value)}
            hint="Jumlah pesan terakhir yang akan digunakan sebagai konteks percakapan"
          />
        </FormGroup>

        <FormGroup>
          <Label>System Prompt</Label>
          <Textarea
            placeholder="Masukkan system prompt untuk Paraphraser..."
            value={form.values.skripsi_paraphraser_prompt}
            onChange={(e) => form.setFieldValue('skripsi_paraphraser_prompt', e.target.value)}
            style={{ minHeight: '120px' }}
          />
          <HintText>
            Instruksi untuk AI tentang cara melakukan paraphrase dengan baik
          </HintText>
        </FormGroup>
      </ModeSection>

      <Divider />

      <ModeSection>
        <ModeHeader>
          <ModeIcon>📊</ModeIcon>
          <ModeTitle>Diagram Builder</ModeTitle>
        </ModeHeader>

        <FormGroup>
          <Label>Status</Label>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={form.values.skripsi_diagram_builder_enabled}
              onChange={(e) => form.setFieldValue('skripsi_diagram_builder_enabled', e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
          <HintText>Aktifkan atau nonaktifkan Diagram Builder</HintText>
        </FormGroup>

        <FormGroup>
          <Label>Model AI</Label>
          <ModelDropdown
            value={form.values.skripsi_diagram_builder_model}
            onChange={(option) => form.setFieldValue('skripsi_diagram_builder_model', option.value)}
          />
        </FormGroup>

        <FormGroup>
          <TextInput
            label="Biaya per Pesan (Kredit)"
            type="number"
            min="0"
            placeholder="0"
            value={form.values.skripsi_diagram_builder_cost}
            onChange={(e) => form.setFieldValue('skripsi_diagram_builder_cost', e.target.value)}
            hint="Jumlah kredit yang dikurangi setiap kali pengguna mengirim pesan (jika menggunakan credits)"
          />
        </FormGroup>

        <FormGroup>
          <TextInput
            label="Jumlah Pesan Konteks"
            type="number"
            min="0"
            placeholder="10"
            value={form.values.skripsi_diagram_builder_context_messages}
            onChange={(e) => form.setFieldValue('skripsi_diagram_builder_context_messages', e.target.value)}
            hint="Jumlah pesan terakhir yang akan digunakan sebagai konteks percakapan"
          />
        </FormGroup>

        <FormGroup>
          <Label>System Prompt</Label>
          <Textarea
            placeholder="Masukkan system prompt untuk Diagram Builder..."
            value={form.values.skripsi_diagram_builder_prompt}
            onChange={(e) => form.setFieldValue('skripsi_diagram_builder_prompt', e.target.value)}
            style={{ minHeight: '120px' }}
          />
          <HintText>
            Instruksi untuk AI tentang cara membuat diagram yang informatif
          </HintText>
        </FormGroup>
      </ModeSection>
    </Modal>
  )
}

export default SettingsModal
