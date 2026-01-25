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
  Select,
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
} from './SettingsModal.styles'
import { ToggleSlider, ToggleSwitch } from '../../../SummaryNotes/components/SummaryNotesSettingsModal/SummaryNotesSettingsModal.styles'

function SettingsModal({ isOpen, onClose }) {
  const { loading } = useSelector(state => state.constant || { loading: {} })
  const { form } = useFeatureSetting(onClose)
  const [newDomain, setNewDomain] = useState('')

  // Check if AI Researcher model is Perplexity
  const isPerplexityModel = form.values.skripsi_ai_researcher_model?.startsWith('sonar')

  // Parse domains from comma-separated string to array
  const getDomains = () => {
    const domainsString = form.values.skripsi_ai_researcher_trusted_domains || ''
    return domainsString.split(',').map(d => d.trim()).filter(d => d.length > 0)
  }

  // Add domain to the list
  const addDomain = () => {
    if (newDomain.trim()) {
      const currentDomains = getDomains()
      const updatedDomains = [...currentDomains, newDomain.trim()]
      form.setFieldValue('skripsi_ai_researcher_trusted_domains', updatedDomains.join(','))
      setNewDomain('')
    }
  }

  // Remove domain from the list
  const removeDomain = (index) => {
    const currentDomains = getDomains()
    const updatedDomains = currentDomains.filter((_, i) => i !== index)
    form.setFieldValue('skripsi_ai_researcher_trusted_domains', updatedDomains.join(','))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Fitur"
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading.isUpdateConstantLoading}>
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

        {/* Domain Filtering - Only show for Perplexity models */}
        {isPerplexityModel && (
          <>
            <FormGroup>
              <Label>Filter Domain Terpercaya</Label>
              <ToggleSwitch>
                <input
                  type="checkbox"
                  checked={form.values.skripsi_ai_researcher_domain_filter_enabled}
                  onChange={(e) => form.setFieldValue('skripsi_ai_researcher_domain_filter_enabled', e.target.checked)}
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
                  value: form.values.skripsi_ai_researcher_time_filter_type,
                  label: form.values.skripsi_ai_researcher_time_filter_type === 'recency' ? 'Recency (Relatif)' : 'Date Range (Tanggal Spesifik)'
                }}
                onChange={(option) => form.setFieldValue('skripsi_ai_researcher_time_filter_type', option.value)}
              />
              <HintText>
                Pilih antara filter relatif (1 bulan terakhir) atau tanggal spesifik
              </HintText>
            </FormGroup>

            {form.values.skripsi_ai_researcher_time_filter_type === 'recency' ? (
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
                    value: form.values.skripsi_ai_researcher_recency_filter,
                    label: form.values.skripsi_ai_researcher_recency_filter === 'hour' ? '1 Jam Terakhir' :
                           form.values.skripsi_ai_researcher_recency_filter === 'day' ? '1 Hari Terakhir' :
                           form.values.skripsi_ai_researcher_recency_filter === 'week' ? '1 Minggu Terakhir' :
                           form.values.skripsi_ai_researcher_recency_filter === 'month' ? '1 Bulan Terakhir' :
                           '1 Tahun Terakhir'
                  }}
                  onChange={(option) => form.setFieldValue('skripsi_ai_researcher_recency_filter', option.value)}
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
                      value={form.values.skripsi_ai_researcher_published_after}
                      onChange={(e) => form.setFieldValue('skripsi_ai_researcher_published_after', e.target.value)}
                    />
                    <TextInput
                      label="Published Before"
                      placeholder="MM/DD/YYYY (e.g., 12/31/2024)"
                      value={form.values.skripsi_ai_researcher_published_before}
                      onChange={(e) => form.setFieldValue('skripsi_ai_researcher_published_before', e.target.value)}
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
                      value={form.values.skripsi_ai_researcher_updated_after}
                      onChange={(e) => form.setFieldValue('skripsi_ai_researcher_updated_after', e.target.value)}
                    />
                    <TextInput
                      label="Updated Before"
                      placeholder="MM/DD/YYYY (e.g., 12/31/2024)"
                      value={form.values.skripsi_ai_researcher_updated_before}
                      onChange={(e) => form.setFieldValue('skripsi_ai_researcher_updated_before', e.target.value)}
                    />
                  </div>
                  <HintText>
                    Filter berdasarkan tanggal update terakhir konten (format: MM/DD/YYYY)
                  </HintText>
                </FormGroup>
              </>
            )}
          </>
        )}
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
