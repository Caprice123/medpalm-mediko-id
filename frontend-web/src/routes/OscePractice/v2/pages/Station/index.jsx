import { createPortal } from 'react-dom'
import { PiClipboardText } from 'react-icons/pi'
import Button from '@components/common/Button'
import Loading from '@components/common/Loading'
import BriefRail from './components/BriefRail'
import Dialogue from './components/Dialogue'
import Worksheet from './components/Worksheet'
import EndSessionDialog from './components/EndSessionDialog'
import { useStation } from './hooks/useStation'
import { useWorksheetDrawer } from './hooks/useWorksheetDrawer'
import {
  Page,
  Board,
  WorksheetDrawer,
  DrawerPanel,
  WorksheetToggle,
  MobileEndBar,
} from './Station.styles'

// `/osce-practice/session/:sessionId/practice`. The station board: task on the left, the
// patient in the middle, the rubric's worksheet on the right. V1 put the worksheet's three
// sections behind tabs, which is how a student could hear the bell with Diagnosa still empty.
function Station() {
  const {
    sessionDetail, loading, isReady, isPsikiatri, answers,
    worksheetStatus, endDialog, requestEnd, closeEnd, confirmEnd,
  } = useStation()

  const {
    isWorksheetVisible, hasColumn, isDrawerOpen, openDrawer, closeDrawer,
  } = useWorksheetDrawer()

  if (!isReady) {
    return (
      <Page>
        <Loading type="oval" text="Membuka kasus..." height="70vh" />
      </Page>
    )
  }

  const worksheet = (
    <Worksheet
      isPsikiatri={isPsikiatri}
      answers={answers}
      status={worksheetStatus}
      onClose={hasColumn ? undefined : closeDrawer}
    />
  )

  return (
    <Page>
      <Board>
        <BriefRail
          sessionDetail={sessionDetail}
          onEndSession={requestEnd}
          isEndingSession={loading.isEndingSession}
        />

        <Dialogue />

        {hasColumn && worksheet}
      </Board>

      {/* Once the worksheet loses its column, its state still has to be readable from the
          board — so the docked toggle carries the count of what is still empty. */}
      {!hasColumn && !isDrawerOpen && (
        <WorksheetToggle type="button" onClick={openDrawer}>
          <PiClipboardText size={16} />
          Lembar kerja
          {worksheetStatus.emptyCount > 0 && <b>{worksheetStatus.emptyCount}</b>}
        </WorksheetToggle>
      )}

      {/* Portalled out of the page tree so the sheet is anchored to the viewport, not to
          whichever ancestor happens to establish a containing block. */}
      {!hasColumn && isWorksheetVisible && createPortal(
        <WorksheetDrawer onClick={closeDrawer}>
          <DrawerPanel onClick={(event) => event.stopPropagation()}>
            {worksheet}
          </DrawerPanel>
        </WorksheetDrawer>,
        document.body,
      )}

      <MobileEndBar>
        <Button
          variant="danger"
          fullWidth
          onClick={() => requestEnd(false)}
          disabled={loading.isEndingSession}
        >
          {loading.isEndingSession ? 'Mengevaluasi...' : 'Akhiri & nilai sesi'}
        </Button>
      </MobileEndBar>

      <EndSessionDialog
        isOpen={endDialog.isOpen}
        auto={endDialog.auto}
        isProcessing={loading.isEndingSession}
        status={worksheetStatus}
        onClose={closeEnd}
        onConfirm={confirmEnd}
      />
    </Page>
  )
}

export default Station
