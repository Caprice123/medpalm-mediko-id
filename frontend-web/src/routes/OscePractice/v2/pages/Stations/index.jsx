import StationsHeading from './components/StationsHeading'
import StationFilters from './components/StationFilters'
import StationList from './components/StationList'
import StartGate from '../../components/StartGate'
import { useStations } from './hooks/useStations'
import { Page, PageContainer } from '../../styles/surface.styles'
import { Stack } from './Stations.styles'

// `/osce-practice/stations`. Picking the next station, on its own page.
//
// This was the hub's right-hand panel until the catalogue outgrew it: two accumulating lists
// shared one scroll, so every "Muat Lebih Banyak" here pushed the history panel — the one with
// the status filter, the one students come back for — further out of reach. The hub keeps the
// rail and the history; browsing a long list is a different task and gets the room for it.
function Stations() {
  const { startTarget, requestStart, closeStartGate } = useStations()

  return (
    <Page>
      <PageContainer fluid="xl">
        <Stack>
          <StationsHeading />
          <StationFilters />
          <StationList onStart={requestStart} />
        </Stack>
      </PageContainer>

      <StartGate target={startTarget} onClose={closeStartGate} />
    </Page>
  )
}

export default Stations
