import { useSelector } from 'react-redux'
import {
  ReadOnlyBlock,
  AnswerList,
  AnswerText,
  NotAnswered,
} from '../../EvidencePanel.styles'

// What the student actually submitted. Read here rather than threaded down: nothing between
// the page and this view branches on the answers.
function AnswersView() {
  const answer = useSelector((state) => state.oscePractice.sessionDetail?.userAnswer)

  const diagnosis = answer?.diagnosis || { utama: '', pembanding: [] }
  const primary = diagnosis.utama
  const differentials = diagnosis.pembanding || []
  const therapy = answer?.therapy || ''

  const hasPrimary = Array.isArray(primary) ? primary.length > 0 : !!String(primary || '').trim()

  return (
    <>
      <ReadOnlyBlock>
        <h3>Diagnosis utama</h3>
        {!hasPrimary ? (
          <NotAnswered>Tidak diisi — dihitung nol pada rubrik.</NotAnswered>
        ) : Array.isArray(primary) ? (
          <AnswerList>
            {primary.map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}
          </AnswerList>
        ) : (
          <AnswerText>{primary}</AnswerText>
        )}
      </ReadOnlyBlock>

      <ReadOnlyBlock>
        <h3>Diagnosis pembanding</h3>
        {differentials.length === 0 ? (
          <NotAnswered>Tidak diisi.</NotAnswered>
        ) : (
          <AnswerList>
            {differentials.map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}
          </AnswerList>
        )}
      </ReadOnlyBlock>

      <ReadOnlyBlock>
        <h3>Terapi</h3>
        {!therapy.trim() ? (
          <NotAnswered>Tidak diisi — dihitung nol pada rubrik.</NotAnswered>
        ) : (
          <AnswerText>{therapy}</AnswerText>
        )}
      </ReadOnlyBlock>
    </>
  )
}

export default AnswersView
