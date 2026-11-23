import PageHeading from './components/PageHeading'
import LiveBand from './components/LiveBand'
import PerformancePanel from './components/PerformancePanel'
import HistoryPanel from './components/HistoryPanel'
import StartGate from '../../components/StartGate'
import { useHub } from './hooks/useHub'
import { Page, PageContainer } from '../../styles/surface.styles'
import { Stack } from './Hub.styles'

// `/osce-practice`. One column, read top to bottom: the station still running, performance per
// topic, then the history.
//
// Performance used to be five bar-mini rows in a rail with the real chart behind a `Grafik`
// button — a modal the student had to know was there. It is a panel on the page now, at rest,
// holding every topic rather than a top five.
//
// The station catalogue is not here at all. It outgrew the spot: two accumulating lists sharing
// one scroll meant the history, the list with the status filter and the one students come back
// for, was buried under however many stations had been loaded. It is
// `/osce-practice/stations` now, and the heading carries the way there.
function Hub() {
  const { startTarget, requestStart, closeStartGate } = useHub()

  return (
    <Page>
      <PageContainer fluid="xl">
        <PageHeading />

        <Stack>
          <LiveBand onRequestStart={requestStart} />
          <PerformancePanel />
          <HistoryPanel onRequestStart={requestStart} />
        </Stack>
      </PageContainer>

      <StartGate target={startTarget} onClose={closeStartGate} />
    </Page>
  )
}

export default Hub
