import { useState, memo } from 'react'
import {
  Sidebar,
  TimerCard,
  TimerLabel,
  TimerDisplay,
  TaskSection,
  TaskHeader,
  TaskContent,
  AutoSubmitToggle,
  ToggleSwitch,
  ToggleSlider,
  EndSessionButton,
  DesktopButtonWrapper,
} from '../../SessionPractice.styles'
import Button from '@components/common/Button'
import { AttachmentSection } from './components/AttachmentSection'
import TimerSection from './components/TimerSection'
import { useSelector } from 'react-redux'
import CustomMarkdownRenderer from '@components/common/CustomMarkdownRenderer/CustomMarkdownRenderer'

function SessionSidebar({ onEndSession, isEndingSession }) {
    const [autoSubmit, setAutoSubmit] = useState(false)
    const { sessionDetail } = useSelector(state => state.oscePractice)

  return (
    <Sidebar>
      <TimerSection onEndSession={onEndSession} isEndingSession={isEndingSession} />

      <TaskSection>
        <TaskContent>
        <TaskHeader>Tugas</TaskHeader>
        <CustomMarkdownRenderer item={sessionDetail?.topic.scenario || 'Tidak ada skenario tersedia.'} />
        </TaskContent>

        <AutoSubmitToggle>
          <span>Kirim Otomatis Mati</span>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={autoSubmit}
              onChange={(e) => setAutoSubmit(e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </AutoSubmitToggle>

        {/* Attachments Section */}
        <AttachmentSection />
      </TaskSection>

      <DesktopButtonWrapper>
        <div style={{ margin: '1rem' }}>
            <Button
            variant="danger"
            onClick={() => onEndSession(false)}
            disabled={isEndingSession}
            fullWidth
            >
            {isEndingSession ? 'Mengevaluasi...' : 'Akhiri Sesi'}
            </Button>
        </div>
      </DesktopButtonWrapper>
    </Sidebar>
  )
}

export default memo(SessionSidebar)
