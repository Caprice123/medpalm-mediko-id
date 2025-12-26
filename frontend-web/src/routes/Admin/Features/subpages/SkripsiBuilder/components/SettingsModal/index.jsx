import { useSelector } from 'react-redux'
import Dropdown from '@components/common/Dropdown'
import { aiModels } from '@config/aiModels'
import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Textarea,
  Select,
  HintText,
  ToggleSwitch,
  ToggleSlider,
  Button,
  LoadingSpinner,
  SectionTitle,
  ModeSection,
  ModeHeader,
  ModeTitle,
  ModeIcon,
  Divider
} from './SettingsModal.styles'
import { useFeatureSetting } from '../../hooks/useFeatureSetting'

function SettingsModal({ isOpen, onClose }) {
  const { loading } = useSelector(state => state.constant || { loading: {} })
  const { form } = useFeatureSetting(onClose)

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Pengaturan Fitur Skripsi Builder</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {loading.isGetListConstantsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <LoadingSpinner />
              <div style={{ marginTop: '1rem', color: '#6b7280' }}>Memuat pengaturan...</div>
            </div>
          ) : (
            <>
              {/* Basic Information */}
              <SectionTitle>Pengaturan Dasar</SectionTitle>

              <FormGroup>
                <Label>Judul Fitur</Label>
                <Input
                  type="text"
                  placeholder="Skripsi Builder"
                  value={form.values.skripsi_builder_title}
                  onChange={(e) => form.setFieldValue('skripsi_builder_title', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Deskripsi Fitur</Label>
                <Input
                  type="text"
                  placeholder="Deskripsi singkat"
                  value={form.values.skripsi_builder_description}
                  onChange={(e) => form.setFieldValue('skripsi_builder_description', e.target.value)}
                />
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
                      checked={form.values.ai_researcher_enabled}
                      onChange={(e) => form.setFieldValue('ai_researcher_enabled', e.target.checked)}
                    />
                    <ToggleSlider />
                  </ToggleSwitch>
                  <HintText>Aktifkan atau nonaktifkan AI Researcher</HintText>
                </FormGroup>

                <FormGroup>
                  <Label>Jumlah Tab</Label>
                  <Select
                    value={form.values.ai_researcher_max_tabs}
                    onChange={(e) => form.setFieldValue('ai_researcher_max_tabs', e.target.value)}
                  >
                    <option value="1">1 Tab</option>
                    <option value="2">2 Tab</option>
                    <option value="3">3 Tab</option>
                  </Select>
                  <HintText>Jumlah tab AI Researcher yang tersedia untuk pengguna</HintText>
                </FormGroup>

                <FormGroup>
                  <Label>Model AI</Label>
                  <Dropdown
                    options={Object.entries(aiModels.gemini).map(([value, label]) => ({ value, label }))}
                    value={{
                      value: form.values.ai_researcher_model,
                      label: aiModels.gemini[form.values.ai_researcher_model] || 'Gemini 2.5 Flash'
                    }}
                    onChange={(option) => form.setFieldValue('ai_researcher_model', option.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Kredit per Pesan</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="1"
                    value={form.values.ai_researcher_credits}
                    onChange={(e) => form.setFieldValue('ai_researcher_credits', e.target.value)}
                  />
                  <HintText>Jumlah kredit yang dikurangi setiap kali pengguna mengirim pesan</HintText>
                </FormGroup>

                <FormGroup>
                  <Label>System Prompt</Label>
                  <Textarea
                    placeholder="Masukkan system prompt untuk AI Researcher..."
                    value={form.values.ai_researcher_system_prompt}
                    onChange={(e) => form.setFieldValue('ai_researcher_system_prompt', e.target.value)}
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
                      checked={form.values.paraphraser_enabled}
                      onChange={(e) => form.setFieldValue('paraphraser_enabled', e.target.checked)}
                    />
                    <ToggleSlider />
                  </ToggleSwitch>
                  <HintText>Aktifkan atau nonaktifkan Paraphraser</HintText>
                </FormGroup>

                <FormGroup>
                  <Label>Model AI</Label>
                  <Dropdown
                    options={Object.entries(aiModels.gemini).map(([value, label]) => ({ value, label }))}
                    value={{
                      value: form.values.paraphraser_model,
                      label: aiModels.gemini[form.values.paraphraser_model] || 'Gemini 2.5 Flash'
                    }}
                    onChange={(option) => form.setFieldValue('paraphraser_model', option.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Kredit per Pesan</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="1"
                    value={form.values.paraphraser_credits}
                    onChange={(e) => form.setFieldValue('paraphraser_credits', e.target.value)}
                  />
                  <HintText>Jumlah kredit yang dikurangi setiap kali pengguna mengirim pesan</HintText>
                </FormGroup>

                <FormGroup>
                  <Label>System Prompt</Label>
                  <Textarea
                    placeholder="Masukkan system prompt untuk Paraphraser..."
                    value={form.values.paraphraser_system_prompt}
                    onChange={(e) => form.setFieldValue('paraphraser_system_prompt', e.target.value)}
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
                      checked={form.values.diagram_builder_enabled}
                      onChange={(e) => form.setFieldValue('diagram_builder_enabled', e.target.checked)}
                    />
                    <ToggleSlider />
                  </ToggleSwitch>
                  <HintText>Aktifkan atau nonaktifkan Diagram Builder</HintText>
                </FormGroup>

                <FormGroup>
                  <Label>Model AI</Label>
                  <Dropdown
                    options={Object.entries(aiModels.gemini).map(([value, label]) => ({ value, label }))}
                    value={{
                      value: form.values.diagram_builder_model,
                      label: aiModels.gemini[form.values.diagram_builder_model] || 'Gemini 2.5 Flash'
                    }}
                    onChange={(option) => form.setFieldValue('diagram_builder_model', option.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Kredit per Pesan</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="1"
                    value={form.values.diagram_builder_credits}
                    onChange={(e) => form.setFieldValue('diagram_builder_credits', e.target.value)}
                  />
                  <HintText>Jumlah kredit yang dikurangi setiap kali pengguna mengirim pesan</HintText>
                </FormGroup>

                <FormGroup>
                  <Label>System Prompt</Label>
                  <Textarea
                    placeholder="Masukkan system prompt untuk Diagram Builder..."
                    value={form.values.diagram_builder_system_prompt}
                    onChange={(e) => form.setFieldValue('diagram_builder_system_prompt', e.target.value)}
                    style={{ minHeight: '120px' }}
                  />
                  <HintText>
                    Instruksi untuk AI tentang cara membuat diagram yang informatif
                  </HintText>
                </FormGroup>
              </ModeSection>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} disabled={loading.isUpdateConstantLoading}>
            Batal
          </Button>
          <Button variant="primary" onClick={form.handleSubmit} disabled={loading.isUpdateConstantLoading}>
            {loading.isUpdateConstantLoading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </ModalFooter>
      </Modal>
    </Overlay>
  )
}

export default SettingsModal
