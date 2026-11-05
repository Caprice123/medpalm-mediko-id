import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import CustomMarkdownRenderer from '@components/common/CustomMarkdownRenderer/CustomMarkdownRenderer'
import { Area } from '../../Station.styles'
import StationClock from './components/StationClock'
import Attachments from './components/Attachments'
import {
  RailBody,
  Section,
  StationTitle,
  StationTags,
  Scenario,
  RailFooter,
} from './BriefRail.styles'

// The board's left area: the clock, the task card, and the station's supplied images. The task
// card stays open — V1 hid it behind a collapsible the student had to remember to reopen.
function BriefRail({ sessionDetail, onEndSession, isEndingSession }) {
  const isEnding = useSelector((state) => state.oscePractice.loading.isEndingSession)
  const tags = sessionDetail?.tags || []
  // Most stations ship no images at all. An empty section with a heading is worse than no
  // section: it reads as something that failed to load.
  const hasAttachments = (sessionDetail?.topic?.attachments || []).length > 0

  return (
    <Area aria-label="Tugas stasiun">
      <StationClock sessionDetail={sessionDetail} onTimeUp={() => onEndSession(true)} />

      <RailBody>
        <Section>
          <StationTitle>{sessionDetail?.topic?.title || 'Stasiun'}</StationTitle>
          {tags.length > 0 && (
            <StationTags>
              {tags.map((tag) => <span key={tag.id}>{tag.name}</span>)}
            </StationTags>
          )}
        </Section>

        <Section>
          <h2>Tugas</h2>
          <Scenario>
            <CustomMarkdownRenderer
              item={sessionDetail?.topic?.scenario || 'Tidak ada skenario tersedia.'}
            />
          </Scenario>
        </Section>

        {hasAttachments && (
          <Section>
            <h2>Lampiran stasiun</h2>
            <Attachments />
          </Section>
        )}
      </RailBody>

      <RailFooter>
        <Button
          variant="danger"
          fullWidth
          onClick={() => onEndSession(false)}
          disabled={isEnding || isEndingSession}
        >
          {isEnding || isEndingSession ? 'Mengevaluasi...' : 'Akhiri & nilai sesi'}
        </Button>
      </RailFooter>
    </Area>
  )
}

export default BriefRail
