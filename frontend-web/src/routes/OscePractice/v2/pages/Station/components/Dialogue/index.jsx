import { useSelector } from 'react-redux'
import { PiChatCircleDots, PiStethoscope } from 'react-icons/pi'
import { Area, AreaHead } from '../../Station.styles'
import MessageStream from '../../../../components/MessageStream'
import VoiceInput from './components/VoiceInput'
import GuidelineNote from './components/GuidelineNote'
import { isAwaitingReply } from '../../../../utils/sessionState'
import { useDialogue } from './hooks/useDialogue'
import { ModeSwitch, ModeButton, ModeLabel, Stream } from './Dialogue.styles'

const PLACEHOLDERS = {
  conversation: 'Tanyakan sesuatu kepada pasien...',
  physical_exam: 'Pemeriksaan apa yang ingin kamu lakukan...',
}

// The board's middle area. Both of the station's conversations live here as two modes of one
// surface, so the worksheet on the right never has to give up its column for them.
function Dialogue() {
  const { mode, setMode, isPhysicalExam, send } = useDialogue()
  const conversationMessages = useSelector((state) => state.oscePractice.sessionMessages)
  const physicalExamMessages = useSelector((state) => state.oscePractice.physicalExamMessages)
  const loading = useSelector((state) => state.oscePractice.loading)

  const isAnswering = isPhysicalExam
    ? loading.isSendingPhysicalExamMessage || loading.isPhysicalExamAssistantTyping
    : loading.isSendingMessage || loading.isAssistantTyping

  // The composer unlocks as soon as the reply is visibly under way, by the same rule the dots
  // use — a stream that never reports `done` must not lock the student out of their station.
  const isBlocked = isAwaitingReply(
    isPhysicalExam ? physicalExamMessages : conversationMessages,
    isAnswering,
  )

  return (
    <Area aria-label="Percakapan dengan pasien">
      <AreaHead>
        <h2 data-mirrors-mode="true">{isPhysicalExam ? 'Pemeriksaan fisik' : 'Anamnesis'}</h2>

        <ModeSwitch role="tablist" aria-label="Mode percakapan">
          <ModeButton
            type="button"
            role="tab"
            aria-selected={!isPhysicalExam}
            $active={!isPhysicalExam}
            onClick={() => setMode('conversation')}
          >
            <PiChatCircleDots size={16} />
            <ModeLabel>Percakapan</ModeLabel>
          </ModeButton>

          <ModeButton
            type="button"
            role="tab"
            aria-selected={isPhysicalExam}
            $active={isPhysicalExam}
            onClick={() => setMode('physical_exam')}
          >
            <PiStethoscope size={16} />
            <ModeLabel>Pemeriksaan fisik</ModeLabel>
          </ModeButton>
        </ModeSwitch>
      </AreaHead>

      <GuidelineNote isPhysicalExam={isPhysicalExam} />

      <Stream>
        <MessageStream isPhysicalExam={isPhysicalExam} />
      </Stream>

      <VoiceInput
        key={mode}
        onSend={send}
        disabled={isBlocked}
        placeholder={PLACEHOLDERS[mode]}
      />
    </Area>
  )
}

export default Dialogue
