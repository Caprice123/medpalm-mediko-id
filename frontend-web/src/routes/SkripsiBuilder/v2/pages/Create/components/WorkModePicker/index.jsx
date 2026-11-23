import { FaBolt, FaRegHandPaper } from 'react-icons/fa'
import { BlockLabel, Block } from '../../Create.styles'
import {
  ModeGrid, ModeCard, ModeHeading, ModeIcon, ModeDescription,
} from './WorkModePicker.styles'

// "Generate sekaligus" is the AI filling every empty section in one pass. It
// does not run here: the editor opens first and writes itself in front of the
// student, so the wait is spent watching the report appear rather than
// watching a button spin.
const WorkModePicker = ({ workMode, onSelect }) => (
  <Block>
    <BlockLabel>Cara mengerjakan</BlockLabel>

    <ModeGrid>
      <ModeCard
        type="button"
        $selected={workMode === 'generate'}
        onClick={() => onSelect('generate')}
      >
        <ModeHeading>
          <ModeIcon><FaBolt /></ModeIcon>
          Generate sekaligus
        </ModeHeading>
        <ModeDescription>
          AI menulis tiap bagian di editor, kamu tinggal merevisi.
        </ModeDescription>
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
  </Block>
)

export default WorkModePicker
