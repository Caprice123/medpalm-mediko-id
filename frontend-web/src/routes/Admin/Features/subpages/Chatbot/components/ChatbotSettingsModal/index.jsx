import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Dropdown from '@components/common/Dropdown'
import ModelDropdown from '@components/common/ModelDropdown'
import Textarea from '@components/common/Textarea'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { useFeatureSetting } from '../../hooks/useFeatureSetting'
import {
  FormGroup,
  Label,
  HintText,
  SectionTitle,
  ModeSection,
  ModeHeader,
  ModeTitle,
  ModeIcon,
  Divider
} from './ChatbotSettingsModal.styles'
import { ToggleSlider, ToggleSwitch } from '../../../SummaryNotes/components/SummaryNotesSettingsModal/SummaryNotesSettingsModal.styles'

function ChatbotSettingsModal({ isOpen, onClose }) {
  const { loading } = useSelector(state => state.chatbot || { loading: {} })
  const { form } = useFeatureSetting(onClose)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Fitur Chat Assistant"
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
      {/* Basic Settings */}
      <SectionTitle>Pengaturan Dasar</SectionTitle>

      <FormGroup>
        <Label>Status Fitur</Label>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={form.values.chatbot_is_active}
            onChange={(e) => form.setFieldValue('chatbot_is_active', e.target.checked)}
          />
          <ToggleSlider />
        </ToggleSwitch>
        <HintText>Aktifkan atau nonaktifkan fitur chat assistant</HintText>
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Judul Fitur"
          placeholder="Chat Assistant"
          value={form.values.chatbot_feature_title}
          onChange={(e) => form.setFieldValue('chatbot_feature_title', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Deskripsi Fitur"
          placeholder="Deskripsi singkat"
          value={form.values.chatbot_feature_description}
          onChange={(e) => form.setFieldValue('chatbot_feature_description', e.target.value)}
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
            value: form.values.chatbot_access_type,
            label: form.values.chatbot_access_type === 'free' ? 'Gratis' :
                   form.values.chatbot_access_type === 'credits' ? 'Credits' :
                   form.values.chatbot_access_type === 'subscription' ? 'Subscription' :
                   'Subscription & Credits'
          }}
          onChange={(option) => form.setFieldValue('chatbot_access_type', option.value)}
        />
      </FormGroup>

      <Divider />

      {/* Normal Mode Settings */}
      <SectionTitle>Konfigurasi Mode AI</SectionTitle>

      <ModeSection>
        <ModeHeader>
          <ModeIcon>🤖</ModeIcon>
          <ModeTitle>Normal Mode</ModeTitle>
        </ModeHeader>

        <FormGroup>
          <Label>Status Mode</Label>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={form.values.chatbot_normal_enabled}
              onChange={(e) => form.setFieldValue('chatbot_normal_enabled', e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
          <HintText>Mode percakapan umum menggunakan Gemini</HintText>
        </FormGroup>

        <FormGroup>
          <Label>Model AI</Label>
          <ModelDropdown
            value={form.values.chatbot_normal_model || 'gemini-2.5-flash'}
            onChange={(option) => form.setFieldValue('chatbot_normal_model', option.value)}
          />
        </FormGroup>

        {(form.values.chatbot_access_type === 'credits' || form.values.chatbot_access_type === 'subscription_and_credits') && (
          <FormGroup>
            <TextInput
              label="Kredit per Pesan"
              type="number"
              min="0"
              placeholder="5"
              value={form.values.chatbot_normal_cost}
              onChange={(e) => form.setFieldValue('chatbot_normal_cost', e.target.value)}
            />
          </FormGroup>
        )}

        <FormGroup>
          <TextInput
            label="Jumlah Pesan Konteks"
            type="number"
            placeholder="10"
            value={form.values.chatbot_normal_last_message_count}
            onChange={(e) => form.setFieldValue('chatbot_normal_last_message_count', e.target.value)}
            hint="Jumlah pesan sebelumnya yang digunakan sebagai konteks"
          />
        </FormGroup>

        <FormGroup>
          <Label>System Prompt</Label>
          <Textarea
            placeholder="Masukkan system prompt untuk Normal Mode..."
            value={form.values.chatbot_normal_system_prompt}
            onChange={(e) => form.setFieldValue('chatbot_normal_system_prompt', e.target.value)}
            style={{ minHeight: '120px' }}
          />
          <HintText>
            Instruksi untuk AI tentang cara merespons dalam Normal Mode
          </HintText>
        </FormGroup>
      </ModeSection>

      <Divider />

      {/* Validated Search Mode Settings */}
      <ModeSection>
        <ModeHeader>
          <ModeIcon>📚</ModeIcon>
          <ModeTitle>Validated Search Mode</ModeTitle>
        </ModeHeader>

        <FormGroup>
          <Label>Status Mode</Label>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={form.values.chatbot_validated_enabled}
              onChange={(e) => form.setFieldValue('chatbot_validated_enabled', e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
          <HintText>Mode dengan konteks dari Summary Notes</HintText>
        </FormGroup>

        <FormGroup>
          <Label>Model AI</Label>
          <ModelDropdown
            value={form.values.chatbot_validated_model || 'gemini-2.5-flash'}
            onChange={(option) => form.setFieldValue('chatbot_validated_model', option.value)}
          />
        </FormGroup>

        {(form.values.chatbot_access_type === 'credits' || form.values.chatbot_access_type === 'subscription_and_credits') && (
          <FormGroup>
            <TextInput
              label="Kredit per Pesan"
              type="number"
              min="0"
              placeholder="8"
              value={form.values.chatbot_validated_cost}
              onChange={(e) => form.setFieldValue('chatbot_validated_cost', e.target.value)}
            />
          </FormGroup>
        )}

        <FormGroup>
          <TextInput
            label="Jumlah Pesan Konteks"
            type="number"
            placeholder="10"
            value={form.values.chatbot_validated_last_message_count}
            onChange={(e) => form.setFieldValue('chatbot_validated_last_message_count', e.target.value)}
            hint="Jumlah pesan sebelumnya yang digunakan sebagai konteks"
          />
        </FormGroup>

        <FormGroup>
          <Label>System Prompt</Label>
          <Textarea
            placeholder="Masukkan system prompt untuk Validated Search Mode..."
            value={form.values.chatbot_validated_system_prompt}
            onChange={(e) => form.setFieldValue('chatbot_validated_system_prompt', e.target.value)}
            style={{ minHeight: '120px' }}
          />
          <HintText>
            Instruksi untuk AI tentang cara menggunakan Summary Notes sebagai konteks
          </HintText>
        </FormGroup>

        <FormGroup>
          <TextInput
            label="Jumlah Summary Notes untuk RAG"
            type="number"
            placeholder="5"
            value={form.values.chatbot_validated_search_count}
            onChange={(e) => form.setFieldValue('chatbot_validated_search_count', e.target.value)}
            hint="Jumlah summary notes yang diambil dari vector database"
          />
        </FormGroup>

        <FormGroup>
          <TextInput
            label="Threshold Similarity Score"
            type="number"
            step="0.1"
            min="0"
            max="1"
            placeholder="0.3"
            value={form.values.chatbot_validated_threshold}
            onChange={(e) => form.setFieldValue('chatbot_validated_threshold', e.target.value)}
            hint="Skor minimum kemiripan untuk menyertakan summary notes (0-1)"
          />
        </FormGroup>
      </ModeSection>

      <Divider />

      {/* Research Mode Settings */}
      <ModeSection>
        <ModeHeader>
          <ModeIcon>🔍</ModeIcon>
          <ModeTitle>Research Mode</ModeTitle>
        </ModeHeader>

        <FormGroup>
          <Label>Status Mode</Label>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={form.values.chatbot_research_enabled}
              onChange={(e) => form.setFieldValue('chatbot_research_enabled', e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
          <HintText>Mode research menggunakan Perplexity AI</HintText>
        </FormGroup>

        <FormGroup>
          <Label>Model Perplexity</Label>
          <ModelDropdown
            value={form.values.chatbot_research_model || 'sonar'}
            onChange={(option) => form.setFieldValue('chatbot_research_model', option.value)}
          />
        </FormGroup>

        {(form.values.chatbot_access_type === 'credits' || form.values.chatbot_access_type === 'subscription_and_credits') && (
          <FormGroup>
            <TextInput
              label="Kredit per Pesan"
              type="number"
              min="0"
              placeholder="15"
              value={form.values.chatbot_research_cost}
              onChange={(e) => form.setFieldValue('chatbot_research_cost', e.target.value)}
            />
          </FormGroup>
        )}

        <FormGroup>
          <TextInput
            label="Jumlah Pesan Konteks"
            type="number"
            placeholder="10"
            value={form.values.chatbot_research_last_message_count}
            onChange={(e) => form.setFieldValue('chatbot_research_last_message_count', e.target.value)}
            hint="Jumlah pesan sebelumnya yang digunakan sebagai konteks"
          />
        </FormGroup>

        <FormGroup>
          <Label>System Prompt</Label>
          <Textarea
            placeholder="Masukkan system prompt untuk Research Mode..."
            value={form.values.chatbot_research_system_prompt}
            onChange={(e) => form.setFieldValue('chatbot_research_system_prompt', e.target.value)}
            style={{ minHeight: '120px' }}
          />
          <HintText>
            Instruksi untuk AI tentang cara melakukan research dan memberikan jawaban
          </HintText>
        </FormGroup>

        <FormGroup>
          <TextInput
            label="Jumlah Sitasi"
            type="number"
            placeholder="5"
            value={form.values.chatbot_research_citations_count}
            onChange={(e) => form.setFieldValue('chatbot_research_citations_count', e.target.value)}
            hint="Jumlah sitasi/referensi yang diminta dari Perplexity"
          />
        </FormGroup>
      </ModeSection>
    </Modal>
  )
}

export default ChatbotSettingsModal
