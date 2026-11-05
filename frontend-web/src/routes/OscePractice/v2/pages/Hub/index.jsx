import PageHeading from './components/PageHeading'
import SessionRail from './components/SessionRail'
import StationPanel from './components/StationPanel'
import HistoryPanel from './components/HistoryPanel'
import StartGate from './components/StartGate'
import { useHub } from './hooks/useHub'
import { Page, PageContainer, Board, WorkColumn } from './Hub.styles'

// `/osce-practice`. One board: the rail answers "lanjutkan atau mulai", the work column holds
// picking a station and the past attempts. V1 split these across `/osce-practice` and
// `/osce-practice/topics`.
function Hub() {
  const { startTarget, requestStart, closeStartGate } = useHub()

  return (
    <Page>
      <PageContainer fluid="xl">
        <PageHeading />

        <Board>
          <SessionRail onRequestStart={requestStart} />

          <WorkColumn>
            <StationPanel onStart={requestStart} />
            <HistoryPanel onRequestStart={requestStart} />
          </WorkColumn>
        </Board>
      </PageContainer>

      <StartGate target={startTarget} onClose={closeStartGate} />
    </Page>
  )
}

export default Hub
