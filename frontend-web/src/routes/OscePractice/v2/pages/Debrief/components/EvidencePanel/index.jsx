import { useState } from 'react'
import { useSelector } from 'react-redux'
import CustomMarkdownRenderer from '@components/common/CustomMarkdownRenderer/CustomMarkdownRenderer'
import MessageStream from '../../../../components/MessageStream'
import { Panel, PanelHead, MicroLabel, EvidenceEmpty } from '../../Debrief.styles'
import AnswersView from './components/AnswersView'
import InvestigationsView from './components/InvestigationsView'
import { Tabs, Tab, Viewport, KeyBlock } from './EvidencePanel.styles'

const VIEWS = [
  { key: 'answers', label: 'Jawaban' },
  { key: 'conversation', label: 'Anamnesis' },
  { key: 'physical_exam', label: 'Pemeriksaan fisik' },
  { key: 'investigations', label: 'Penunjang' },
  { key: 'answer_key', label: 'Kunci jawaban' },
]

// The student's side of the board: what they submitted, what they said, and what they saw.
// Opens on Jawaban, because that is what the rubric beside it is marking.
function EvidencePanel() {
  const [view, setView] = useState('answers')
  const answerKey = useSelector((state) => state.oscePractice.sessionDetail?.topic?.answerKey)

  return (
    <Panel>
      <PanelHead>
        <h2>Bukti sesi</h2>
        <MicroLabel>Hanya bisa dibaca</MicroLabel>
      </PanelHead>

      <Tabs role="tablist" aria-label="Bukti sesi">
        {VIEWS.map((entry) => (
          <Tab
            key={entry.key}
            type="button"
            role="tab"
            aria-selected={view === entry.key}
            $active={view === entry.key}
            onClick={() => setView(entry.key)}
          >
            {entry.label}
          </Tab>
        ))}
      </Tabs>

      <Viewport>
        {view === 'answers' && <AnswersView />}
        {view === 'conversation' && <MessageStream isPhysicalExam={false} />}
        {view === 'physical_exam' && <MessageStream isPhysicalExam />}
        {view === 'investigations' && <InvestigationsView />}
        {view === 'answer_key' && (
          answerKey ? (
            <KeyBlock>
              <CustomMarkdownRenderer item={answerKey} />
            </KeyBlock>
          ) : (
            <EvidenceEmpty>Stasiun ini tidak menyertakan kunci jawaban.</EvidenceEmpty>
          )
        )}
      </Viewport>
    </Panel>
  )
}

export default EvidencePanel
