import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { OscePracticeRoute } from '@routes/OscePractice/routes'
import { scoreColor } from '../../../../utils/sessionState'
import { Heading, LastResult, ResultScore } from './PageHeading.styles'

function PageHeading() {
  const lastResult = useSelector((state) => state.oscePracticeV2.hub?.lastResult)

  return (
    <Heading>
      <h1>Latihan OSCE</h1>
      <p>Simulasi stasiun dengan pasien AI, dinilai dengan rubrik penguji.</p>

      {lastResult && (
        <LastResult as={Link} to={OscePracticeRoute.resultRoute(lastResult.uniqueId)}>
          Hasil terakhir: <strong>{lastResult.topicTitle}</strong>
          <ResultScore $color={scoreColor(lastResult.percentage)}>
            {Math.round(lastResult.percentage)}
          </ResultScore>
        </LastResult>
      )}
    </Heading>
  )
}

export default PageHeading
