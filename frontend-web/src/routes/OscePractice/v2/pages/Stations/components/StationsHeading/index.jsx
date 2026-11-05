import { Link } from 'react-router-dom'
import { PiArrowLeft } from 'react-icons/pi'
import { OscePracticeRoute } from '@routes/OscePractice/routes'
import { BackLink, Heading } from './StationsHeading.styles'

// The way back is a link, not a button: nothing is in progress on this page, so leaving it
// costs nothing and should not be dressed as a decision.
function StationsHeading() {
  return (
    <header>
      <BackLink as={Link} to={OscePracticeRoute.moduleRoute}>
        <PiArrowLeft size={15} /> Latihan OSCE
      </BackLink>

      <Heading>
        <h1>Pilih kasus</h1>
        <p>Setiap baris membawa rekormu sendiri di kasus itu — nilai terbaik dan kapan terakhir dicoba.</p>
      </Heading>
    </header>
  )
}

export default StationsHeading
