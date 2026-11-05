import { memo } from 'react'
import {
  FormContainer,
  FormSection,
  SectionTitle,
} from '../../SessionPractice.styles'
import Textarea from '@components/common/Textarea'

function TherapyTab({ therapies, setTherapies }) {
  return (
    <FormContainer>
      <FormSection>
        <SectionTitle>
          TERAPI
        </SectionTitle>

        <Textarea
          placeholder="Tuliskan terapi/pengobatan yang diberikan...&#10;&#10;Contoh:&#10;Omeprazole 20mg 2x1&#10;Diet rendah lemak&#10;Istirahat cukup"
          value={therapies}
          onChange={(e) => setTherapies(e.target.value)}
          rows={6}
          hint="Tuliskan semua terapi/pengobatan yang Anda berikan kepada pasien"
        />
      </FormSection>
    </FormContainer>
  )
}

export default memo(TherapyTab)
