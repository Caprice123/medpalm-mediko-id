import PageHeading from './components/PageHeading'
import SessionRail from './components/SessionRail'
import HistoryPanel from './components/HistoryPanel'
import StartGate from '../../components/StartGate'
import { useHub } from './hooks/useHub'
import { Page, PageContainer } from '../../styles/surface.styles'
import { Board } from './Hub.styles'

// `/osce-practice`. Two columns: the rail answers "lanjutkan atau mulai", and the history sits
// beside it rather than beneath a catalogue.
//
// The station catalogue used to be the second thing in this column. It outgrew the spot — two
// accumulating lists sharing one scroll meant the history, the list with the status filter and
// the one students come back for, was buried under however many stations had been loaded. It is
// `/osce-practice/stations` now, and the heading carries the way there.
function Hub() {
  const { startTarget, requestStart, closeStartGate } = useHub()

  return (
    <Page>
      <PageContainer fluid="xl">
        <PageHeading />

        <Board>
          <SessionRail onRequestStart={requestStart} />
          <HistoryPanel onRequestStart={requestStart} />
        </Board>
      </PageContainer>

      <StartGate target={startTarget} onClose={closeStartGate} />
    </Page>
  )
}

export default Hub
