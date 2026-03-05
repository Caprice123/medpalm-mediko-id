import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserChatbotSettings } from '@store/chatbot/userAction'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { ToggleSlider, ToggleSwitch } from '@routes/Admin/Features/subpages/SummaryNotes/components/SummaryNotesSettingsModal/SummaryNotesSettingsModal.styles'
import {
  SectionTitle,
  HintText,
  DomainGrid,
  DomainCheckbox,
  DomainLabel,
  EmptyDomains,
  FilterToggleRow,
  SelectAllRow
} from './ChatbotUserSettingsModal.styles'

function ChatbotUserSettingsModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const { userSettings, loading } = useSelector(state => state.chatbot)

  const [domainFilterEnabled, setDomainFilterEnabled] = useState(true)
  const [selectedDomains, setSelectedDomains] = useState([])

  // Sync local state when modal opens or userSettings changes
  useEffect(() => {
    if (isOpen) {
      setDomainFilterEnabled(userSettings.domainFilterEnabled)
      setSelectedDomains(userSettings.selectedDomains ?? [])
    }
  }, [isOpen, userSettings])

  const availableDomains = userSettings.availableDomains ?? []

  const toggleDomain = (domain) => {
    setSelectedDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    )
  }

  const selectAll = () => setSelectedDomains(availableDomains.map(d => d.domain))
  const clearAll = () => setSelectedDomains([])

  const allSelected = availableDomains.length > 0 &&
    availableDomains.every(d => selectedDomains.includes(d.domain))

  const handleSave = async () => {
    // Empty selectedDomains means "use all admin domains"
    const domainsToSave = allSelected ? [] : selectedDomains
    await dispatch(updateUserChatbotSettings({
      selectedDomains: domainsToSave,
      domainFilterEnabled
    }))
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Research Mode"
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading.isUpdatingSettings}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading.isUpdatingSettings}>
            {loading.isUpdatingSettings ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      <SectionTitle>Filter Domain</SectionTitle>

      <FilterToggleRow>
        <div>
          <strong>Aktifkan Filter Domain</strong>
          <HintText>Batasi hasil pencarian hanya dari domain terpercaya</HintText>
        </div>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={domainFilterEnabled}
            onChange={e => setDomainFilterEnabled(e.target.checked)}
          />
          <ToggleSlider />
        </ToggleSwitch>
      </FilterToggleRow>

      {domainFilterEnabled && (
        <>
          <SelectAllRow>
            <span>
              {selectedDomains.length === 0
                ? 'Semua domain aktif (default)'
                : `${selectedDomains.length} dari ${availableDomains.length} domain dipilih`}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="secondary" size="small" onClick={selectAll} type="button">
                Pilih Semua
              </Button>
              <Button variant="secondary" size="small" onClick={clearAll} type="button">
                Reset
              </Button>
            </div>
          </SelectAllRow>

          <HintText>
            Kosongkan pilihan (reset) untuk menggunakan semua domain yang tersedia. Pilih domain tertentu untuk membatasi hasil pencarian.
          </HintText>

          {availableDomains.length === 0 ? (
            <EmptyDomains>Belum ada domain yang dikonfigurasi oleh admin.</EmptyDomains>
          ) : (
            <DomainGrid>
              {availableDomains.map(({ domain }) => (
                <DomainLabel key={domain} $checked={selectedDomains.includes(domain)}>
                  <DomainCheckbox
                    type="checkbox"
                    checked={selectedDomains.includes(domain)}
                    onChange={() => toggleDomain(domain)}
                  />
                  {domain}
                </DomainLabel>
              ))}
            </DomainGrid>
          )}
        </>
      )}
    </Modal>
  )
}

export default ChatbotUserSettingsModal
