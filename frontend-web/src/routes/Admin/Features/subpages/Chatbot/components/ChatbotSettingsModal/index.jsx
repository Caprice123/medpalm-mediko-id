import { useState } from 'react'
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
  Divider,
  DomainsList,
  DomainItem,
  DomainText,
  AddDomainWrapper
} from './ChatbotSettingsModal.styles'
import { ToggleSlider, ToggleSwitch } from '../../../SummaryNotes/components/SummaryNotesSettingsModal/SummaryNotesSettingsModal.styles'
import EmbeddingModelDropdown from '../../../../../../../components/common/EmbeddingModelDropdown'

function ChatbotSettingsModal({ isOpen, onClose }) {
  const { loading } = useSelector(state => state.chatbot || { loading: {} })
  const { form } = useFeatureSetting(onClose)
  const [newDomain, setNewDomain] = useState('')

  // Parse domains from comma-separated string to array
  const getDomains = () => {
    const domainsString = form.values.chatbot_research_trusted_domains || ''
    return domainsString.split(',').map(d => d.trim()).filter(d => d.length > 0)
  }

  // Add domain to the list
  const addDomain = () => {
    if (newDomain.trim()) {
      const currentDomains = getDomains()
      const updatedDomains = [...currentDomains, newDomain.trim()]
      form.setFieldValue('chatbot_research_trusted_domains', updatedDomains.join(','))
      setNewDomain('')
    }
  }

  // Remove domain from the list
  const removeDomain = (index) => {
    const currentDomains = getDomains()
    const updatedDomains = currentDomains.filter((_, i) => i !== index)
    form.setFieldValue('chatbot_research_trusted_domains', updatedDomains.join(','))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Fitur Chat Assistant"
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading.isUpdatingConstants}>
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
            value={form.values.chatbot_normal_prompt}
            onChange={(e) => form.setFieldValue('chatbot_normal_prompt', e.target.value)}
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
          <Label>Embedding Model AI</Label>
          <EmbeddingModelDropdown
            value={form.values.chatbot_validated_embedding_model || 'gemini-2.5-flash'}
            onChange={(option) => form.setFieldValue('chatbot_validated_embedding_model', option.value)}
          />
          <HintText>Model yang akan dipakai untuk melakukan embedding</HintText>
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
            value={form.values.chatbot_validated_max_context}
            onChange={(e) => form.setFieldValue('chatbot_validated_max_context', e.target.value)}
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
            value={form.values.chatbot_research_max_sources}
            onChange={(e) => form.setFieldValue('chatbot_research_max_sources', e.target.value)}
            hint="Jumlah sitasi/referensi yang diminta dari Perplexity"
          />
        </FormGroup>

        <FormGroup>
          <Label>Filter Domain Terpercaya</Label>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={form.values.chatbot_research_domain_filter_enabled}
              onChange={(e) => form.setFieldValue('chatbot_research_domain_filter_enabled', e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
          <HintText>Aktifkan filter untuk memprioritaskan domain kredibel</HintText>
        </FormGroup>

        <FormGroup>
          <Label>Domain Terpercaya</Label>
          <HintText style={{ marginTop: '0', marginBottom: '0.5rem' }}>
            Domain jurnal medis dan sumber kredibel yang akan diprioritaskan (max 20 domain).
          </HintText>

          {getDomains().length > 0 && (
            <DomainsList>
              {getDomains().map((domain, index) => (
                <DomainItem key={index}>
                  <DomainText>{domain}</DomainText>
                  <Button
                    variant="danger"
                    size="small"
                    type="button"
                    onClick={() => removeDomain(index)}
                  >
                    ✕
                  </Button>
                </DomainItem>
              ))}
            </DomainsList>
          )}

          <AddDomainWrapper>
            <TextInput
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="pubmed.ncbi.nlm.nih.gov"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDomain())}
              style={{ fontFamily: 'monospace', fontSize: '13px' }}
            />
            <Button
              variant="primary"
              type="button"
              onClick={addDomain}
              disabled={!newDomain.trim() || getDomains().length >= 20}
            >
              Tambah
            </Button>
          </AddDomainWrapper>
        </FormGroup>

        <FormGroup>
          <Dropdown
            label="Tipe Filter Waktu"
            options={[
              { value: 'recency', label: 'Recency (Relatif)' },
              { value: 'date_range', label: 'Date Range (Tanggal Spesifik)' }
            ]}
            value={{
              value: form.values.chatbot_research_time_filter_type,
              label: form.values.chatbot_research_time_filter_type === 'recency' ? 'Recency (Relatif)' : 'Date Range (Tanggal Spesifik)'
            }}
            onChange={(option) => form.setFieldValue('chatbot_research_time_filter_type', option.value)}
          />
          <HintText>
            Pilih antara filter relatif (1 bulan terakhir) atau tanggal spesifik
          </HintText>
        </FormGroup>

        {form.values.chatbot_research_time_filter_type === 'recency' ? (
          <FormGroup>
            <Dropdown
              label="Filter Keterbaruan (Recency)"
              options={[
                { value: 'hour', label: '1 Jam Terakhir' },
                { value: 'day', label: '1 Hari Terakhir' },
                { value: 'week', label: '1 Minggu Terakhir' },
                { value: 'month', label: '1 Bulan Terakhir' },
                { value: 'year', label: '1 Tahun Terakhir' }
              ]}
              value={{
                value: form.values.chatbot_research_recency_filter,
                label: form.values.chatbot_research_recency_filter === 'hour' ? '1 Jam Terakhir' :
                       form.values.chatbot_research_recency_filter === 'day' ? '1 Hari Terakhir' :
                       form.values.chatbot_research_recency_filter === 'week' ? '1 Minggu Terakhir' :
                       form.values.chatbot_research_recency_filter === 'month' ? '1 Bulan Terakhir' :
                       '1 Tahun Terakhir'
              }}
              onChange={(option) => form.setFieldValue('chatbot_research_recency_filter', option.value)}
            />
            <HintText>
              Filter berdasarkan waktu relatif dari sekarang
            </HintText>
          </FormGroup>
        ) : (
          <>
            <FormGroup>
              <Label>Published Date Range</Label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <TextInput
                  label="Published After"
                  placeholder="MM/DD/YYYY (e.g., 1/1/2024)"
                  value={form.values.chatbot_research_published_after}
                  onChange={(e) => form.setFieldValue('chatbot_research_published_after', e.target.value)}
                />
                <TextInput
                  label="Published Before"
                  placeholder="MM/DD/YYYY (e.g., 12/31/2024)"
                  value={form.values.chatbot_research_published_before}
                  onChange={(e) => form.setFieldValue('chatbot_research_published_before', e.target.value)}
                />
              </div>
              <HintText>
                Filter berdasarkan tanggal publikasi artikel (format: MM/DD/YYYY)
              </HintText>
            </FormGroup>

            <FormGroup>
              <Label>Last Updated Date Range</Label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <TextInput
                  label="Updated After"
                  placeholder="MM/DD/YYYY (e.g., 1/1/2024)"
                  value={form.values.chatbot_research_updated_after}
                  onChange={(e) => form.setFieldValue('chatbot_research_updated_after', e.target.value)}
                />
                <TextInput
                  label="Updated Before"
                  placeholder="MM/DD/YYYY (e.g., 12/31/2024)"
                  value={form.values.chatbot_research_updated_before}
                  onChange={(e) => form.setFieldValue('chatbot_research_updated_before', e.target.value)}
                />
              </div>
              <HintText>
                Filter berdasarkan tanggal update terakhir konten (format: MM/DD/YYYY)
              </HintText>
            </FormGroup>
          </>
        )}
      </ModeSection>
    </Modal>
  )
}

export default ChatbotSettingsModal
