import Button from '@components/common/Button'
import Modal from '@components/common/Modal'
import { useCustomSession } from '../../hooks/useCustomSession'
import TopicSection from '../TopicSection'
import { Footer, StartButton } from './CustomSessionPanel.styles'
import { useSelector } from 'react-redux'

export default function CustomSessionPanel({ onClose }) {
    const { topics } = useSelector(state => state.mcqNodes)
  const {
    sectionList, subtopicsMap, loadingTopics,
    updateSection, addSection, removeSection,
    totalCount, handleStart, canStart, loading,
  } = useCustomSession(onClose)

  const topicOptions = topics.map(t => ({ value: t.id, label: t.name }))

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="large"
      title={`Buat Sesi Custom — Total ${totalCount} soal`}
      footer={
        <Footer>
          <Button variant="secondary" onClick={addSection}>+ Tambah topik lain</Button>
          <StartButton onClick={handleStart} disabled={!canStart} style={{ flex: 1 }}>
            {loading.isStartingSession ? 'Menyiapkan...' : `→ Mulai Sesi (${totalCount} soal)`}
          </StartButton>
        </Footer>
      }
    >
      {sectionList.map((d, i) => (
        <TopicSection
          key={d.id}
          index={i}
          item={d}
          topicOptions={topicOptions}
          subtopicsMap={subtopicsMap}
          loadingTopics={loadingTopics}
          onUpdate={updates => updateSection(d.id, updates)}
          onRemove={() => removeSection(d.id)}
          canRemove={sectionList.length > 1}
        />
      ))}
    </Modal>
  )
}
