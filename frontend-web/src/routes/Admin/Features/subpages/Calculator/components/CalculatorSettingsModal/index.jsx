import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchConstants, updateConstants } from '@store/constant/action'
import { actions as constantActions } from '@store/constant/reducer'
import Modal from '@components/common/Modal'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import { FormGroup, HintText, Label } from './CalculatorSettingsModal.styles'
import { ToggleSlider, ToggleSwitch } from '../../../SummaryNotes/components/SummaryNotesSettingsModal/SummaryNotesSettingsModal.styles'

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

      // Set filter keys before fetching
      dispatch(constantActions.updateFilter({ key: 'keys', value: keys }))

      const constants = await dispatch(fetchConstants())

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

      await dispatch(updateConstants(settingsToSave))

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Fitur Kalkulator"
      size="large"
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading || saving}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      <FormGroup>
        <Label>Status Fitur</Label>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={settings.calculator_is_active}
            onChange={(e) => handleChange('calculator_is_active', e.target.checked)}
          />
          <ToggleSlider />
        </ToggleSwitch>
        <HintText>Aktifkan atau nonaktifkan fitur kalkulator</HintText>
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Judul Fitur"
          placeholder="Kalkulator Medis"
          value={settings.calculator_feature_title}
          onChange={(e) => handleChange('calculator_feature_title', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Deskripsi Fitur"
          placeholder="Deskripsi singkat"
          value={settings.calculator_feature_description}
          onChange={(e) => handleChange('calculator_feature_description', e.target.value)}
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
            value: settings.calculator_access_type,
            label: settings.calculator_access_type === 'free' ? 'Gratis' :
                   settings.calculator_access_type === 'credits' ? 'Credits' :
                   settings.calculator_access_type === 'subscription' ? 'Subscription' :
                   'Subscription & Credits'
          }}
          onChange={(option) => handleChange('calculator_access_type', option.value)}
        />
      </FormGroup>

      {(settings.calculator_access_type === 'credits' || settings.calculator_access_type === 'subscription_and_credits') && (
        <FormGroup>
          <TextInput
            label="Kredit per Kalkulasi"
            type="number"
            min="0"
            placeholder="0"
            value={settings.calculator_credit_cost}
            onChange={(e) => handleChange('calculator_credit_cost', e.target.value)}
          />
        </FormGroup>
      )}
    </Modal>
  )
}

export default CalculatorSettingsModal
