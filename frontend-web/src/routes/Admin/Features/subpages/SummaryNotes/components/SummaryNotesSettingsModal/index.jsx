import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchSummaryNotesConstants, updateSummaryNotesConstants } from '@store/summaryNotes/action'
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
  ModalFooter,
  Button,
  LoadingSpinner
} from './SummaryNotesSettingsModal.styles'

function SummaryNotesSettingsModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    summary_notes_feature_title: '',
    summary_notes_feature_description: '',
    summary_notes_generation_model: 'gemini-1.5-pro',
    summary_notes_generation_prompt: '',
    summary_notes_credit_cost: '5'
  })

  useEffect(() => {
    if (isOpen) {
      fetchSettings()
    }
  }, [isOpen])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const keys = [
        'summary_notes_feature_title',
        'summary_notes_feature_description',
        'summary_notes_generation_model',
        'summary_notes_generation_prompt',
        'summary_notes_credit_cost'
      ]

      const constants = await dispatch(fetchSummaryNotesConstants(keys))

      setSettings(prevSettings => ({
        ...prevSettings,
        ...constants
      }))
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    if (!settings.summary_notes_feature_title.trim()) {
      alert('Judul fitur tidak boleh kosong')
      return
    }

    if (!settings.summary_notes_generation_prompt.trim()) {
      alert('Prompt tidak boleh kosong')
      return
    }

    const creditCost = parseInt(settings.summary_notes_credit_cost)
    if (isNaN(creditCost) || creditCost < 0) {
      alert('Jumlah kredit harus berupa angka positif')
      return
    }

    setSaving(true)
    try {
      await dispatch(updateSummaryNotesConstants(settings))
      alert('Pengaturan berhasil disimpan!')
      onClose()
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Gagal menyimpan pengaturan: ' + (error.message || 'Terjadi kesalahan'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Pengaturan Fitur Ringkasan Materi</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <LoadingSpinner />
              <div style={{ marginTop: '1rem', color: '#6b7280' }}>Memuat pengaturan...</div>
            </div>
          ) : (
            <>
              <FormGroup>
                <Label>Judul Fitur *</Label>
                <Input
                  type="text"
                  placeholder="Contoh: Ringkasan Materi"
                  value={settings.summary_notes_feature_title}
                  onChange={(e) => handleChange('summary_notes_feature_title', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Deskripsi Fitur</Label>
                <Textarea
                  placeholder="Deskripsi singkat tentang fitur ini..."
                  value={settings.summary_notes_feature_description}
                  onChange={(e) => handleChange('summary_notes_feature_description', e.target.value)}
                  style={{ minHeight: '80px' }}
                />
              </FormGroup>

              <FormGroup>
                <Label>Model Generasi *</Label>
                <Select
                  value={settings.summary_notes_generation_model}
                  onChange={(e) => handleChange('summary_notes_generation_model', e.target.value)}
                >
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Akurat)</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Cepat)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Cepat)</option>
                  <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Experimental)</option>
                </Select>
                <HintText>Model yang digunakan untuk generate ringkasan dari dokumen</HintText>
              </FormGroup>

              <FormGroup>
                <Label>Prompt Generasi Ringkasan *</Label>
                <Textarea
                  placeholder="Masukkan prompt untuk generate ringkasan..."
                  value={settings.summary_notes_generation_prompt}
                  onChange={(e) => handleChange('summary_notes_generation_prompt', e.target.value)}
                  style={{ minHeight: '200px' }}
                />
                <HintText>
                  Prompt ini digunakan ketika admin mengupload dokumen untuk di-generate menjadi ringkasan
                </HintText>
              </FormGroup>

              <FormGroup>
                <Label>Jumlah Kredit per Akses *</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="5"
                  value={settings.summary_notes_credit_cost}
                  onChange={(e) => handleChange('summary_notes_credit_cost', e.target.value)}
                />
                <HintText>Kredit yang akan dikurangi setiap kali user mengakses ringkasan</HintText>
              </FormGroup>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} disabled={saving}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading || saving}>
            {saving ? <LoadingSpinner /> : 'Simpan Pengaturan'}
          </Button>
        </ModalFooter>
      </Modal>
    </Overlay>
  )
}

export default SummaryNotesSettingsModal
