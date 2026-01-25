import { useState, memo, useEffect } from 'react'
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

// LocalStorage key for auto-send preference
const AUTO_SEND_STORAGE_KEY = 'osce_auto_send_enabled'

// Helper functions for localStorage
const getAutoSendPreference = () => {
  try {
    const stored = localStorage.getItem(AUTO_SEND_STORAGE_KEY)
    return stored !== null ? JSON.parse(stored) : false // Default to false
  } catch (error) {
    console.error('Error reading auto-send preference:', error)
    return false
  }
}

const setAutoSendPreference = (value) => {
  try {
    localStorage.setItem(AUTO_SEND_STORAGE_KEY, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving auto-send preference:', error)
  }
}

function SessionSidebar({ onEndSession, isEndingSession }) {
    const [autoSubmit, setAutoSubmit] = useState(() => getAutoSendPreference())
    const { sessionDetail } = useSelector(state => state.oscePractice)

    // Update localStorage when autoSubmit changes
    useEffect(() => {
      setAutoSendPreference(autoSubmit)
    }, [autoSubmit])

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
