import { useSelector } from 'react-redux'
import { PiMicrophone, PiCheckCircle, PiWaveform, PiCircleDashed } from 'react-icons/pi'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { topicTags, batchTags } from '../../../../utils/sessionState'
import { useStartGate } from './hooks/useStartGate'
import {
  TaskCard,
  TaskMeta,
  Checks,
  Check,
  GateError,
  Footnote,
  FooterActions,
} from './StartGate.styles'

const PROVIDER_LABELS = {
  deepgram: 'Transkripsi real-time siap digunakan',
  whisper: 'Layanan transkripsi siap digunakan',
}

// The gate between picking a station and the bell: the task card, then the two checks the
// browser has to pass. A modal is right here precisely because this is the one moment that
// does need protected focus — once it closes the clock is running.
function StartGate({ target, onClose }) {
  const {
    microphoneGranted, isRequestingMicrophone, microphoneError,
    sttProvider, isTestingProvider, requestMicrophone, start,
  } = useStartGate(target, { onClose })

  const { isCreatingSession, isStartingSession } = useSelector((state) => state.oscePractice.loading)

  if (!target) return null

  const subject = target.kind === 'session' ? target.session : target.station
  const title = subject.topicTitle || subject.title
  const tags = [...topicTags(subject.tags), ...batchTags(subject.tags)]
  const isStarting = isCreatingSession || isStartingSession
  const canStart = microphoneGranted && !!sttProvider && !isTestingProvider && !isStarting

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Sebelum bel berbunyi"
      size="medium"
      footer={(
        <FooterActions>
          <Button variant="secondary" onClick={onClose} disabled={isStarting}>
            Batal
          </Button>
          <Button variant="primary" onClick={start} disabled={!canStart}>
            {isStarting ? 'Memulai...' : isTestingProvider ? 'Memeriksa...' : 'Mulai latihan'}
          </Button>
        </FooterActions>
      )}
    >
      <TaskCard>
        <h3>{title}</h3>
        {(subject.scenario || subject.description) && (
          <p>{subject.scenario || subject.description}</p>
        )}
        <TaskMeta>
          {tags.map((tag) => <span key={tag.id}>{tag.name}</span>)}
          <span>{subject.durationMinutes || 15} menit</span>
        </TaskMeta>
      </TaskCard>

      <Checks>
        <Check $ready={microphoneGranted}>
          {microphoneGranted ? <PiCheckCircle size={22} /> : <PiMicrophone size={22} />}
          <div>
            <strong>Akses mikrofon</strong>
            <small>
              {microphoneGranted
                ? 'Mikrofon siap — kamu bisa bicara langsung ke pasien AI.'
                : 'Diperlukan untuk merekam anamnesis kamu selama sesi.'}
            </small>
          </div>
          {!microphoneGranted && (
            <Button variant="outline" size="small" onClick={requestMicrophone} disabled={isRequestingMicrophone}>
              {isRequestingMicrophone ? 'Meminta...' : 'Berikan izin'}
            </Button>
          )}
        </Check>

        <Check $ready={!!sttProvider && !isTestingProvider}>
          {!isTestingProvider && sttProvider ? <PiCheckCircle size={22} /> : <PiWaveform size={22} />}
          <div>
            <strong>Layanan speech-to-text</strong>
            <small>
              {isTestingProvider
                ? 'Memeriksa konektivitas layanan transkripsi...'
                : PROVIDER_LABELS[sttProvider] || 'Menentukan layanan transkripsi terbaik yang tersedia...'}
            </small>
          </div>
          {isTestingProvider && <PiCircleDashed size={18} />}
        </Check>
      </Checks>

      {microphoneError && <GateError>{microphoneError}</GateError>}

      <Footnote>
        Audio kamu hanya dipakai untuk penilaian OSCE ini. Pastikan kamu di tempat yang tenang —
        begitu sesi mulai, waktunya berjalan dan bel berbunyi otomatis.
      </Footnote>
    </Modal>
  )
}

export default StartGate
