import { FaBolt, FaRegHandPaper } from 'react-icons/fa'
import { StepLabel, StepNumber } from '../../Create.styles'
import {
  ModeGrid, ModeCard, ModeHeading, ModeIcon, ModeDescription, SoonBadge,
} from './WorkModePicker.styles'

// "Generate sekaligus" is the AI filling every section in one pass. That half
// of the feature is not built yet, so the card is shown but cannot be picked —
// the chosen mode is stored on the set either way, ready for when it lands.
const WorkModePicker = ({ workMode, onSelect }) => (
  <>
    <StepLabel><StepNumber>2</StepNumber> · Cara mengerjakan</StepLabel>

    <ModeGrid>
      <ModeCard type="button" $selected={false} disabled>
        <ModeHeading>
          <ModeIcon><FaBolt /></ModeIcon>
          Generate sekaligus
          <SoonBadge>Segera</SoonBadge>
        </ModeHeading>
        <ModeDescription>AI mengisi semua bagian, kamu tinggal merevisi.</ModeDescription>
      </ModeCard>

      <ModeCard
        type="button"
        $selected={workMode === 'manual'}
        onClick={() => onSelect('manual')}
      >
        <ModeHeading>
          <ModeIcon><FaRegHandPaper /></ModeIcon>
          Kerjakan manual
        </ModeHeading>
        <ModeDescription>Isi tiap bagian sendiri, AI siap membantu.</ModeDescription>
      </ModeCard>
    </ModeGrid>
  </>
)

export default WorkModePicker
