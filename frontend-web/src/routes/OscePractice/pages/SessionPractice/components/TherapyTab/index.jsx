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

function TherapyTab({ therapies, setTherapies }) {
  const [newTherapy, setNewTherapy] = useState('')

  const handleAddTherapy = () => {
    if (!newTherapy.trim()) return

    setTherapies(prev => [...prev, newTherapy.trim()])
    setNewTherapy('')
  }

  const handleRemoveTherapy = (index) => {
    setTherapies(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <FormContainer>
      <FormSection>
        <SectionTitle>
          💊 TERAPI
        </SectionTitle>

        <AddItemContainer>
          <FormInput
            type="text"
            placeholder="Tambahkan terapi/pengobatan..."
            value={newTherapy}
            onChange={(e) => setNewTherapy(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddTherapy()
              }
            }}
          />
          <AddButton
            onClick={handleAddTherapy}
            disabled={!newTherapy.trim()}
          >
            + Tambah
          </AddButton>
        </AddItemContainer>

        <HintText>
          Contoh: Omeprazole 20mg 2x1, Diet rendah lemak
        </HintText>

        {therapies.length > 0 ? (
          <ItemsList>
            {therapies.map((therapy, index) => (
              <ItemCard key={index}>
                <ItemText>
                  {index + 1}. {therapy}
                </ItemText>
                <RemoveButton onClick={() => handleRemoveTherapy(index)}>
                  ❌
                </RemoveButton>
              </ItemCard>
            ))}
          </ItemsList>
        ) : (
          <EmptyListText>
            Belum ada terapi yang ditambahkan
          </EmptyListText>
        )}
      </FormSection>
    </FormContainer>
  )
}

export default memo(TherapyTab)
