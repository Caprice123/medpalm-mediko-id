import { PiMicrophone, PiStop, PiPaperPlaneRight } from 'react-icons/pi'
import { useVoiceInput } from './hooks/useVoiceInput'
import {
  Composer,
  Field,
  Entry,
  Interim,
  Mic,
  Send,
  ComposerFoot,
  AutoSend,
  Switch,
} from './VoiceInput.styles'

const micLabel = (recording) => {
  if (recording.isTranscribing) return 'Memproses...'
  return recording.isRecording ? 'Berhenti' : 'Rekam'
}

function VoiceInput({ onSend, disabled, placeholder }) {
  const {
    entryRef, text, setText, heard, autoSend, toggleAutoSend,
    recording, send, toggleRecording, handleKeyDown,
  } = useVoiceInput({ onSend, disabled })

  const isBusy = recording.isRecording || recording.isTranscribing

  return (
    <Composer>
      <Field>
        <Entry
          ref={entryRef}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isBusy}
          placeholder={placeholder}
          rows={1}
          aria-label={placeholder}
        />

        {heard && (
          <Interim aria-live="polite">
            <span className="typed">{text}</span>
            <span className="heard">{heard}</span>
          </Interim>
        )}

        <Mic
          type="button"
          onClick={toggleRecording}
          $recording={recording.isRecording || recording.isTranscribing}
          disabled={recording.isTranscribing || disabled}
          title={recording.isTranscribing
            ? 'Memproses audio'
            : recording.isRecording ? 'Hentikan rekaman' : 'Mulai rekam'}
        >
          {recording.isRecording ? <PiStop size={17} /> : <PiMicrophone size={17} />}
          {micLabel(recording)}
        </Mic>

        <Send
          type="button"
          onClick={() => send()}
          disabled={!text.trim() || isBusy || disabled}
          title="Kirim"
        >
          <PiPaperPlaneRight size={17} />
        </Send>
      </Field>

      <ComposerFoot>
        <AutoSend>
          <input type="checkbox" checked={autoSend} onChange={toggleAutoSend} />
          <Switch $on={autoSend} />
          Kirim otomatis setelah rekaman
        </AutoSend>
        <span>Typo aman — AI tetap memahami konteksnya.</span>
      </ComposerFoot>
    </Composer>
  )
}

export default VoiceInput
