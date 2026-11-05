import { useState, memo } from 'react'
import {
  FormContainer,
  FormSection,
  SectionTitle,
  AddItemContainer,
  ItemsList,
  ItemCard,
  ItemText,
  RemoveButton,
  EmptyListText,
} from '../../SessionPractice.styles'
import Button from "@components/common/Button"
import TextInput from '@components/common/TextInput'

function PsikiatriDiagnosisTab({
  diagnosisUtama,
  setDiagnosisUtama,
  diagnosisPembanding,
  setDiagnosisPembanding,
}) {
  const [newDiagnosisUtama, setNewDiagnosisUtama] = useState('')
  const [newDiagnosisPembanding, setNewDiagnosisPembanding] = useState('')

  const handleAddDiagnosisUtama = () => {
    if (!newDiagnosisUtama.trim()) return

    setDiagnosisUtama(prev => [...prev, newDiagnosisUtama.trim()])
    setNewDiagnosisUtama('')
  }

  const handleRemoveDiagnosisUtama = (index) => {
    setDiagnosisUtama(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddDiagnosisPembanding = () => {
    if (!newDiagnosisPembanding.trim()) return

    setDiagnosisPembanding(prev => [...prev, newDiagnosisPembanding.trim()])
    setNewDiagnosisPembanding('')
  }

  const handleRemoveDiagnosisPembanding = (index) => {
    setDiagnosisPembanding(prev => prev.filter((_, i) => i !== index))
  }

  // Handle Enter key press for auto-add
  const handleUtamaKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddDiagnosisUtama()
    }
  }

  const handlePembandingKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddDiagnosisPembanding()
    }
  }

  return (
    <FormContainer>
      {/* Diagnosa Utama */}
      <FormSection>
        <SectionTitle>
          DIAGNOSA UTAMA
        </SectionTitle>

        <AddItemContainer>
          <TextInput
            placeholder="Tambahkan diagnosa utama (tekan Enter untuk menambah)..."
            value={newDiagnosisUtama}
            onChange={(e) => setNewDiagnosisUtama(e.target.value)}
            onKeyDown={handleUtamaKeyDown}
          />
          <Button variant="primary"
            onClick={handleAddDiagnosisUtama}
            disabled={!newDiagnosisUtama.trim()}
          >
            Tambah
          </Button>
        </AddItemContainer>

        {diagnosisUtama.length > 0 ? (
          <ItemsList>
            {diagnosisUtama.map((diagnosis, index) => (
              <ItemCard key={index}>
                <ItemText>
                  {index + 1}. {diagnosis}
                </ItemText>
                <RemoveButton onClick={() => handleRemoveDiagnosisUtama(index)}>
                  ❌
                </RemoveButton>
              </ItemCard>
            ))}
          </ItemsList>
        ) : (
          <EmptyListText>
            Belum ada diagnosa utama
          </EmptyListText>
        )}
      </FormSection>

      {/* Diagnosa Pembanding */}
      <FormSection>
        <SectionTitle>
          DIAGNOSA PEMBANDING
        </SectionTitle>

        <AddItemContainer>
          <TextInput
            placeholder="Tambahkan diagnosa pembanding (tekan Enter untuk menambah)..."
            value={newDiagnosisPembanding}
            onChange={(e) => setNewDiagnosisPembanding(e.target.value)}
            onKeyDown={handlePembandingKeyDown}
          />
          <Button variant="primary"
            onClick={handleAddDiagnosisPembanding}
            disabled={!newDiagnosisPembanding.trim()}
          >
            Tambah
          </Button>
        </AddItemContainer>

        {diagnosisPembanding.length > 0 ? (
          <ItemsList>
            {diagnosisPembanding.map((diagnosis, index) => (
              <ItemCard key={index}>
                <ItemText>
                  {index + 1}. {diagnosis}
                </ItemText>
                <RemoveButton onClick={() => handleRemoveDiagnosisPembanding(index)}>
                  ❌
                </RemoveButton>
              </ItemCard>
            ))}
          </ItemsList>
        ) : (
          <EmptyListText>
            Belum ada diagnosa pembanding
          </EmptyListText>
        )}
      </FormSection>
    </FormContainer>
  )
}

export default memo(PsikiatriDiagnosisTab)
