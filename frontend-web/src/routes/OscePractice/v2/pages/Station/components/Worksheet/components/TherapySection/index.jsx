import Textarea from '@components/common/Textarea'
import { Hint } from '../../Worksheet.styles'

// No hook: one controlled field whose value belongs to the page's answer state.
function TherapySection({ therapies, setTherapies }) {
  return (
    <>
      <Textarea
        placeholder={'Mis.\nOmeprazole 20 mg 2x1\nDiet rendah lemak\nEdukasi dan kontrol 1 minggu'}
        value={therapies}
        onChange={(event) => setTherapies(event.target.value)}
        rows={7}
      />
      <Hint>
        Tulis farmakologi dan non-farmakologi. Rubrik menilai keduanya, dan bagian yang
        dibiarkan kosong dihitung nol.
      </Hint>
    </>
  )
}

export default TherapySection
