import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchCalculatorConstants, updateCalculatorConstants } from '@store/calculator/action'
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
  Select,
  HintText,
  ToggleSwitch,
  ToggleSlider,
  ModalFooter,
  Button,
  LoadingSpinner
} from './CalculatorSettingsModal.styles'

function CalculatorSettingsModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    calculator_feature_title: '',
    calculator_feature_description: '',
    calculator_access_type: 'free',
    calculator_credit_cost: '0',
    calculator_is_active: true
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
        'calculator_feature_title',
        'calculator_feature_description',
        'calculator_access_type',
        'calculator_credit_cost',
        'calculator_is_active'
      ]

      const constants = await dispatch(fetchCalculatorConstants(keys))

      console.log('Fetched calculator constants:', constants)

      // Convert string boolean to actual boolean for calculator_is_active
      const processedConstants = {
        ...constants,
        calculator_is_active: constants.calculator_is_active === 'true' || constants.calculator_is_active === true
      }

      setSettings(prevSettings => ({
        ...prevSettings,
        ...processedConstants
      }))
    } catch (error) {
      console.error('Failed to fetch calculator settings:', error)
      // Don't show alert on initial load if settings don't exist yet
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
    // Validation
    if (!settings.calculator_feature_title.trim()) {
      alert('Judul fitur tidak boleh kosong')
      return
    }

    const creditCost = parseInt(settings.calculator_credit_cost)
    if (isNaN(creditCost) || creditCost < 0) {
      alert('Jumlah kredit harus berupa angka positif')
      return
    }

    setSaving(true)
    try {
      // Convert boolean to string for calculator_is_active
      const settingsToSave = {
        ...settings,
        calculator_is_active: String(settings.calculator_is_active)
      }

      await dispatch(updateCalculatorConstants(settingsToSave))

      alert('Pengaturan berhasil disimpan!')
      onClose()
    } catch (error) {
      console.error('Failed to save calculator settings:', error)
      alert('Gagal menyimpan pengaturan: ' + (error.message || 'Terjadi kesalahan'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>⚙️ Pengaturan Fitur Kalkulator</ModalTitle>
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
                <Label>
                  Status Fitur
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '400' }}>
                    {settings.calculator_is_active ? '(Aktif)' : '(Nonaktif)'}
                  </span>
                </Label>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={settings.calculator_is_active}
                    onChange={(e) => handleChange('calculator_is_active', e.target.checked)}
                  />
                  <ToggleSlider />
                </ToggleSwitch>
                <HintText>Aktifkan atau nonaktifkan fitur kalkulator untuk pengguna</HintText>
              </FormGroup>

              <FormGroup>
                <Label>Judul Fitur *</Label>
                <Input
                  type="text"
                  placeholder="Contoh: Kalkulator Medis"
                  value={settings.calculator_feature_title}
                  onChange={(e) => handleChange('calculator_feature_title', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Deskripsi Fitur</Label>
                <Input
                  type="text"
                  placeholder="Deskripsi singkat tentang fitur kalkulator..."
                  value={settings.calculator_feature_description}
                  onChange={(e) => handleChange('calculator_feature_description', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Tipe Akses *</Label>
                <Select
                  value={settings.calculator_access_type}
                  onChange={(e) => handleChange('calculator_access_type', e.target.value)}
                >
                  <option value="free">Gratis</option>
                  <option value="credits">Credits</option>
                  <option value="subscription">Subscription</option>
                  <option value="subscription_and_credits">Subscription & Credits</option>
                </Select>
                <HintText>Tentukan cara pengguna mengakses fitur ini</HintText>
              </FormGroup>

              {(settings.calculator_access_type === 'credits' || settings.calculator_access_type === 'subscription_and_credits') && (
                <FormGroup>
                  <Label>Jumlah Kredit per Kalkulasi *</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={settings.calculator_credit_cost}
                    onChange={(e) => handleChange('calculator_credit_cost', e.target.value)}
                  />
                  <HintText>Kredit yang akan dikurangi setiap kali user menggunakan kalkulator</HintText>
                </FormGroup>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} disabled={saving}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading || saving}>
            {saving ? <LoadingSpinner /> : '💾 Simpan Pengaturan'}
          </Button>
        </ModalFooter>
      </Modal>
    </Overlay>
  )
}

export default CalculatorSettingsModal
