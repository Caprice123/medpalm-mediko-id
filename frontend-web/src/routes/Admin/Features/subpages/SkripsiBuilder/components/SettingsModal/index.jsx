import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Dropdown from '@components/common/Dropdown'
import ModelDropdown from '@components/common/ModelDropdown'
import EmbeddingModelDropdown from '@components/common/EmbeddingModelDropdown'
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
} from './SettingsModal.styles'
import { ToggleSlider, ToggleSwitch } from '../../../SummaryNotes/components/SummaryNotesSettingsModal/SummaryNotesSettingsModal.styles'

function SettingsModal({ isOpen, onClose }) {
  const { loading } = useSelector(state => state.constant || { loading: {} })
  const { form } = useFeatureSetting(onClose)

  // Check if AI Researcher model is Perplexity
  const isPerplexityModel = form.values.skripsi_ai_researcher_model?.startsWith('sonar')

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
        <TextInput
          label="YouTube URL"
          placeholder="https://www.youtube.com/embed/..."
          value={form.values.skripsi_youtube_url}
          onChange={(e) => form.setFieldValue('skripsi_youtube_url', e.target.value)}
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

        {/* Only show for Perplexity models */}
        {isPerplexityModel && (
          <>
            {/* V1 fields hidden — superseded by V2 below */}

            <FormGroup>
              <Label>Informasi untuk User</Label>
              <Textarea
                placeholder="Deskripsi mode untuk ditampilkan ke pengguna..."
                value={form.values.skripsi_ai_researcher_user_information}
                onChange={(e) => form.setFieldValue('skripsi_ai_researcher_user_information', e.target.value)}
                style={{ minHeight: '80px' }}
              />
              <HintText>
                Deskripsi singkat tentang AI Researcher Mode yang akan ditampilkan ke pengguna
              </HintText>
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

        {/* V2 — 3-stage pipeline (Perplexity retrieval) */}
        <>
          <Divider />
          <SectionTitle style={{ fontSize: '13px', color: '#6c757d', marginBottom: '12px' }}>
            AI Researcher V2 — Perplexity Pipeline (User Biasa)
          </SectionTitle>

            <FormGroup>
              <ModelDropdown
                label="Stage 1 — Reformulation Model"
                value={form.values.skripsi_ai_researcher_reformulation_model || 'gemini-2.5-flash'}
                onChange={(option) => form.setFieldValue('skripsi_ai_researcher_reformulation_model', option.value)}
              />
              <HintText>Model Gemini untuk reformulasi query Indonesia → English + generate related queries</HintText>
            </FormGroup>

            <FormGroup>
              <ModelDropdown
                label="Stage 3 — Generation Model"
                value={form.values.skripsi_ai_researcher_v2_generation_model || 'gemini-2.5-flash'}
                onChange={(option) => form.setFieldValue('skripsi_ai_researcher_v2_generation_model', option.value)}
              />
              <HintText>Model Gemini untuk generate jawaban berdasarkan sumber dari Perplexity</HintText>
            </FormGroup>

            <FormGroup>
              <Label>V2 Reformulation Prompt (Stage 1)</Label>
              <Textarea
                placeholder="Prompt untuk reformulasi query..."
                value={form.values.skripsi_ai_researcher_v2_reformulation_prompt}
                onChange={(e) => form.setFieldValue('skripsi_ai_researcher_v2_reformulation_prompt', e.target.value)}
                style={{ minHeight: '180px', fontFamily: 'monospace', fontSize: '13px' }}
              />
              <HintText>
                Prompt untuk Gemini mereformulasi query. Output JSON: {'{ "main_query": "...", "related_queries": [...] }'}. Placeholder: {'{{conversation_history}}'}, {'{{user_query}}'}
              </HintText>
            </FormGroup>

            <FormGroup>
              <Label>V2 Retrieval System Prompt (Stage 2)</Label>
              <Textarea
                placeholder="System prompt untuk Perplexity sebagai retriever..."
                value={form.values.skripsi_ai_researcher_v2_retrieval_system_prompt}
                onChange={(e) => form.setFieldValue('skripsi_ai_researcher_v2_retrieval_system_prompt', e.target.value)}
                style={{ minHeight: '100px', fontFamily: 'monospace', fontSize: '13px' }}
              />
              <HintText>
                Instruksi untuk Perplexity (hanya sebagai retriever — bukan yang generate jawaban akhir)
              </HintText>
            </FormGroup>

            <FormGroup>
              <Label>V2 User Message Template (Stage 2)</Label>
              <Textarea
                placeholder="Template pesan untuk Perplexity..."
                value={form.values.skripsi_ai_researcher_v2_user_message_template}
                onChange={(e) => form.setFieldValue('skripsi_ai_researcher_v2_user_message_template', e.target.value)}
                style={{ minHeight: '120px', fontFamily: 'monospace', fontSize: '13px' }}
              />
              <HintText>
                Template pesan ke Perplexity. Placeholder: {'{{main_query}}'}, {'{{related_queries}}'}
              </HintText>
            </FormGroup>

            <FormGroup>
              <Label>V2 Generation Prompt (Stage 3)</Label>
              <Textarea
                placeholder="System prompt untuk Gemini generator..."
                value={form.values.skripsi_ai_researcher_v2_generation_prompt}
                onChange={(e) => form.setFieldValue('skripsi_ai_researcher_v2_generation_prompt', e.target.value)}
                style={{ minHeight: '200px', fontFamily: 'monospace', fontSize: '13px' }}
              />
              <HintText>
                Prompt untuk Gemini menghasilkan jawaban dari sumber Perplexity. Placeholder: {'{{context}}'}. Instruksikan sitasi [1] [2] (pisah), bukan [1,2].
              </HintText>
            </FormGroup>
        </>

        {/* V3 — 3-stage pipeline using OpenAlex (for tutor role) */}
        <>
          <Divider />
          <SectionTitle style={{ fontSize: '13px', color: '#6c757d', marginBottom: '12px' }}>
            AI Researcher V3 — OpenAlex Pipeline (Tutor Role)
          </SectionTitle>

          <FormGroup>
            <ModelDropdown
              label="Stage 1 — Reformulation Model"
              value={form.values.skripsi_ai_researcher_v3_reformulation_model || 'gemini-2.5-flash'}
              onChange={(option) => form.setFieldValue('skripsi_ai_researcher_v3_reformulation_model', option.value)}
            />
            <HintText>Model Gemini untuk reformulasi query Indonesia → English + generate related queries</HintText>
          </FormGroup>

          <FormGroup>
            <ModelDropdown
              label="Stage 3 — Generation Model"
              value={form.values.skripsi_ai_researcher_v3_generation_model || 'gemini-2.5-flash'}
              onChange={(option) => form.setFieldValue('skripsi_ai_researcher_v3_generation_model', option.value)}
            />
            <HintText>Model Gemini untuk generate jawaban berdasarkan paper dari OpenAlex</HintText>
          </FormGroup>

          <FormGroup>
            <TextInput
              label="Max Results (OpenAlex)"
              type="number"
              min="1"
              max="20"
              placeholder="8"
              value={form.values.skripsi_ai_researcher_v3_max_results}
              onChange={(e) => form.setFieldValue('skripsi_ai_researcher_v3_max_results', e.target.value)}
              hint="Jumlah maksimal paper dari OpenAlex yang diambil per pencarian"
            />
          </FormGroup>

          <FormGroup>
            <Label>V3 Reformulation Prompt (Stage 1)</Label>
            <Textarea
              placeholder="Prompt untuk reformulasi query ke format OpenAlex..."
              value={form.values.skripsi_ai_researcher_v3_reformulation_prompt}
              onChange={(e) => form.setFieldValue('skripsi_ai_researcher_v3_reformulation_prompt', e.target.value)}
              style={{ minHeight: '180px', fontFamily: 'monospace', fontSize: '13px' }}
            />
            <HintText>
              Prompt untuk Gemini mereformulasi query. Output JSON: {'{ "main_query": "...", "related_queries": [...] }'}. Placeholder: {'{{conversation_history}}'}, {'{{user_query}}'}
            </HintText>
          </FormGroup>

          <FormGroup>
            <Label>V3 Generation Prompt (Stage 3)</Label>
            <Textarea
              placeholder="System prompt untuk Gemini generator dengan sumber OpenAlex..."
              value={form.values.skripsi_ai_researcher_v3_generation_prompt}
              onChange={(e) => form.setFieldValue('skripsi_ai_researcher_v3_generation_prompt', e.target.value)}
              style={{ minHeight: '200px', fontFamily: 'monospace', fontSize: '13px' }}
            />
            <HintText>
              Prompt untuk Gemini menghasilkan jawaban dari paper OpenAlex. Placeholder: {'{{context}}'}. Instruksikan sitasi [1] [2] (pisah), bukan [1,2].
            </HintText>
          </FormGroup>
        </>

      </ModeSection>

      <ModeSection>
        <ModeHeader>
          <ModeIcon>📚</ModeIcon>
          <ModeTitle>Validated Search Mode</ModeTitle>
        </ModeHeader>

        <FormGroup>
          <Label>Status</Label>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={form.values.skripsi_validated_enabled}
              onChange={(e) => form.setFieldValue('skripsi_validated_enabled', e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
          <HintText>Aktifkan atau nonaktifkan Validated Search Mode (pencarian berbasis summary notes)</HintText>
        </FormGroup>

        <FormGroup>
          <ModelDropdown
            label="Model AI"
            value={form.values.skripsi_validated_model}
            onChange={(option) => form.setFieldValue('skripsi_validated_model', option.value)}
          />
          <HintText>Model AI untuk menghasilkan respons berdasarkan summary notes</HintText>
        </FormGroup>

        <FormGroup>
          <EmbeddingModelDropdown
            value={form.values.skripsi_validated_embedding_model}
            onChange={(option) => form.setFieldValue('skripsi_validated_embedding_model', option.value)}
          />
          <HintText>Model embedding untuk mencari similarity dengan summary notes</HintText>
        </FormGroup>

        <FormGroup>
          <TextInput
            label="Biaya per Pesan (Kredit)"
            type="number"
            min="0"
            placeholder="0"
            value={form.values.skripsi_validated_cost}
            onChange={(e) => form.setFieldValue('skripsi_validated_cost', e.target.value)}
            hint="Jumlah kredit yang dikurangi setiap kali pengguna mengirim pesan"
          />
        </FormGroup>

        <FormGroup>
          <TextInput
            label="Jumlah Pesan Konteks"
            type="number"
            min="0"
            placeholder="10"
            value={form.values.skripsi_validated_context_messages}
            onChange={(e) => form.setFieldValue('skripsi_validated_context_messages', e.target.value)}
            hint="Jumlah pesan terakhir yang akan digunakan sebagai konteks percakapan"
          />
        </FormGroup>

        <FormGroup>
          <TextInput
            label="Jumlah Hasil Pencarian"
            type="number"
            min="1"
            max="20"
            placeholder="5"
            value={form.values.skripsi_validated_search_count}
            onChange={(e) => form.setFieldValue('skripsi_validated_search_count', e.target.value)}
            hint="Jumlah summary notes yang akan diambil dari database (1-20)"
          />
        </FormGroup>

        <FormGroup>
          <TextInput
            label="Similarity Threshold"
            type="number"
            min="0"
            max="1"
            step="0.1"
            placeholder="0.3"
            value={form.values.skripsi_validated_threshold}
            onChange={(e) => form.setFieldValue('skripsi_validated_threshold', e.target.value)}
            hint="Minimum similarity score (0-1). Semakin tinggi, semakin strict pencarian"
          />
        </FormGroup>

        <FormGroup>
          <Label>Query Rewrite (Reformulasi)</Label>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={form.values.skripsi_validated_rewrite_enabled}
              onChange={(e) => form.setFieldValue('skripsi_validated_rewrite_enabled', e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
          <HintText>Aktifkan reformulasi query berdasarkan konteks percakapan</HintText>
        </FormGroup>

        <FormGroup>
          <Label>Rewrite Prompt</Label>
          <Textarea
            placeholder="Masukkan prompt untuk query rewrite..."
            value={form.values.skripsi_validated_rewrite_prompt}
            onChange={(e) => form.setFieldValue('skripsi_validated_rewrite_prompt', e.target.value)}
            style={{ minHeight: '150px', fontFamily: 'monospace', fontSize: '13px' }}
          />
          <HintText>
            Prompt untuk mereformulasi pertanyaan agar lebih spesifik. Gunakan placeholder: {'{{conversation_history}}'} dan {'{{user_query}}'}
          </HintText>
        </FormGroup>

        <FormGroup>
          <Label>System Prompt</Label>
          <Textarea
            placeholder="Masukkan system prompt untuk validated mode..."
            value={form.values.skripsi_validated_system_prompt}
            onChange={(e) => form.setFieldValue('skripsi_validated_system_prompt', e.target.value)}
            style={{ minHeight: '150px' }}
          />
          <HintText>
            Instruksi untuk AI tentang cara merespons (harus menggunakan konteks dari summary notes, sitasi inline)
          </HintText>
        </FormGroup>

        <FormGroup>
          <Label>Informasi untuk User</Label>
          <Textarea
            placeholder="Deskripsi mode untuk ditampilkan ke pengguna..."
            value={form.values.skripsi_validated_user_information}
            onChange={(e) => form.setFieldValue('skripsi_validated_user_information', e.target.value)}
            style={{ minHeight: '80px' }}
          />
          <HintText>
            Deskripsi singkat tentang Validated Search Mode yang akan ditampilkan ke pengguna
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
          <Label>Content Prompt (Stage 1 - Diagram Generation)</Label>
          <Textarea
            placeholder="Masukkan content prompt untuk analisis dan ekstraksi nodes/connections..."
            value={form.values.skripsi_diagram_builder_content_prompt}
            onChange={(e) => form.setFieldValue('skripsi_diagram_builder_content_prompt', e.target.value)}
            style={{ minHeight: '150px' }}
          />
          <HintText>
            Prompt untuk menganalisis deskripsi user dan mengekstrak struktur diagram (nodes dan connections). Digunakan saat generate diagram.
          </HintText>
        </FormGroup>

        <FormGroup>
          <Label>Format Prompt (Chat Interface)</Label>
          <Textarea
            placeholder="Masukkan format prompt untuk chat assistant..."
            value={form.values.skripsi_diagram_builder_format_prompt}
            onChange={(e) => form.setFieldValue('skripsi_diagram_builder_format_prompt', e.target.value)}
            style={{ minHeight: '120px' }}
          />
          <HintText>
            Prompt untuk chat assistant yang membantu user merencanakan dan merancang diagram. Digunakan di chat interface.
          </HintText>
        </FormGroup>
      </ModeSection>
    </Modal>
  )
}

export default SettingsModal
