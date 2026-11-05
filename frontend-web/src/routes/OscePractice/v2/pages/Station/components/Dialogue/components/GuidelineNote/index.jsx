import { useState } from 'react'
import { useSelector } from 'react-redux'
import { PiCaretDown, PiCaretRight } from 'react-icons/pi'
import { Note, Toggle, Body } from './GuidelineNote.styles'

// The command vocabulary for physical examination is not guessable, so the station ships one.
// Admins can override it per station; this is the fallback.
const DEFAULT_PHYSICAL_EXAM_GUIDE = `Tuliskan pemeriksaan yang ingin kamu lakukan, dan sistem mengembalikan temuan objektifnya.

Contoh:
Tanda vital — "periksa tanda vital", "ukur tekanan darah"
Kepala & leher — "inspeksi kepala dan leher", "palpasi kelenjar limfe"
Thorax — "auskultasi paru", "perkusi thorax"
Abdomen — "palpasi abdomen", "auskultasi bising usus"
Ekstremitas — "inspeksi ekstremitas", "tes kekuatan otot"
Neurologis — "tes refleks patella", "pemeriksaan nervus kranialis"

Untuk bertanya kepada pasien, pindah ke Percakapan.`

// Physical examination opens expanded because its vocabulary has to be learned; the anamnesis
// guide is a reminder, so it starts out of the way.
const DEFAULT_OPEN = { physical_exam: true, conversation: false }

function GuidelineNote({ isPhysicalExam }) {
  const topic = useSelector((state) => state.oscePractice.sessionDetail?.topic)

  // Each mode keeps its own open state in one component rather than the component being
  // remounted per mode. Switching modes used to throw this component away and build a new
  // one, which also meant a student who collapsed the guide got it back open on every switch.
  const [openByMode, setOpenByMode] = useState(DEFAULT_OPEN)

  const mode = isPhysicalExam ? 'physical_exam' : 'conversation'
  const isOpen = openByMode[mode]

  const text = isPhysicalExam
    ? (topic?.physicalExamGuideline || DEFAULT_PHYSICAL_EXAM_GUIDE)
    : topic?.guide

  if (!text) return null

  return (
    <Note>
      <Toggle
        type="button"
        aria-expanded={isOpen}
        onClick={() => setOpenByMode((current) => ({ ...current, [mode]: !current[mode] }))}
      >
        {isOpen ? <PiCaretDown size={14} /> : <PiCaretRight size={14} />}
        {isPhysicalExam ? 'Panduan pemeriksaan fisik' : 'Panduan stasiun'}
      </Toggle>
      {isOpen && <Body>{text}</Body>}
    </Note>
  )
}

export default GuidelineNote
