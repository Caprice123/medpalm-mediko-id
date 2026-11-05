import { scoreColor } from '../../../../../../utils/sessionState'
import { Row, Head, Mark, Bar, Arithmetic, Comment, Reason } from './CriterionRow.styles'

// One rubric criterion: what it was worth, what it earned, and why.
function CriterionRow({ criterion }) {
  const color = scoreColor(criterion.percentage)

  return (
    <Row>
      <Head>
        <h3>{criterion.label}</h3>
        <Mark $color={color}>
          {criterion.earned} / {criterion.available}
        </Mark>
      </Head>

      <Bar $value={criterion.percentage} $color={color}><i /></Bar>

      <Arithmetic>
        {criterion.percentage}% · bobot {criterion.weight} · kontribusi{' '}
        {criterion.weighted.toFixed(2)}
      </Arithmetic>

      {criterion.comment && <Comment>{criterion.comment}</Comment>}

      {criterion.reason && (
        <Reason>
          <h4>Alasan penilaian</h4>
          <p>{criterion.reason}</p>
        </Reason>
      )}
    </Row>
  )
}

export default CriterionRow
