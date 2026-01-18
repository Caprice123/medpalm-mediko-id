import { useState, memo } from 'react'
import {
  FormContainer,
  FormSection,
  SectionTitle,
  FormInput,
  HintText,
  AddItemContainer,
  AddButton,
  ItemsList,
  ItemCard,
  ItemText,
  RemoveButton,
  EmptyListText,
} from '../../SessionPractice.styles'
import Button from "@components/common/Button"
import TextInput from '@components/common/TextInput'

function DiagnosisTab({
  diagnosisUtama,
  setDiagnosisUtama,
  diagnosisPembanding,
  setDiagnosisPembanding,
}) {
  const [newDiagnosisPembanding, setNewDiagnosisPembanding] = useState('')

  const handleAddDiagnosisPembanding = () => {
    if (!newDiagnosisPembanding.trim()) return

    setDiagnosisPembanding(prev => [...prev, newDiagnosisPembanding.trim()])
    setNewDiagnosisPembanding('')
  }

  const handleRemoveDiagnosisPembanding = (index) => {
    setDiagnosisPembanding(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <FormContainer>
      {/* Diagnosa Utama */}
      <FormSection>
        <SectionTitle>
          DIAGNOSA UTAMA
        </SectionTitle>
        <TextInput
          placeholder="Masukkan diagnosa utama..."
          value={diagnosisUtama}
          onChange={(e) => setDiagnosisUtama(e.target.value)}
        />
        <HintText>
          Contoh: Gastritis Akut, Diabetes Mellitus Tipe 2
        </HintText>
      </FormSection>

      {/* Diagnosa Pembanding */}
      <FormSection>
        <SectionTitle>
          DIAGNOSA PEMBANDING
        </SectionTitle>

        <AddItemContainer>
          <TextInput
            placeholder="Tambahkan diagnosa pembanding..."
            value={newDiagnosisPembanding}
            onChange={(e) => setNewDiagnosisPembanding(e.target.value)}
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

export default memo(DiagnosisTab)
