import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PiArrowRight } from 'react-icons/pi'
import { OscePracticeRoute } from '@routes/OscePractice/routes'
import { scoreColor } from '../../../../utils/sessionState'
import { Heading, Titles, StationsLink, LastResult, ResultScore } from './PageHeading.styles'

// The catalogue is a page of its own, so starting something new is a link out of this one. It
// sits in the heading rather than inside a panel because on a page about sessions already under
// way, "mulai yang baru" is the one action that belongs to the page as a whole.
function PageHeading() {
  const lastResult = useSelector((state) => state.oscePracticeV2.hub?.lastResult)

  return (
    <Heading>
      <Titles>
        <h1>Latihan OSCE</h1>
        <p>Simulasi kasus dengan pasien AI, dinilai dengan rubrik penguji.</p>
      </Titles>

      {/* The link comes before the last-result sentence in the DOM so that on a phone it can
          sit on the heading's own row, in the top-right corner, with the sentence dropping to a
          row of its own underneath. The grid puts them back in reading order on a wide screen. */}
      <StationsLink as={Link} to={OscePracticeRoute.stationsRoute}>
        Pilih kasus <PiArrowRight size={15} />
      </StationsLink>

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
