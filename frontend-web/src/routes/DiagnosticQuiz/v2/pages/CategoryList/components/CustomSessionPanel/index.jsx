import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import Modal from '@components/common/Modal'
import { useCustomSession } from '../../hooks/useCustomSession'
import TopicFilterCard from '@routes/Flashcard/v2-1/pages/TopicList/components/TopicFilterCard'
import { Footer, StartButton } from './CustomSessionPanel.styles'

export default function CustomSessionPanel({ onClose }) {
  const { primaryTopics, specialTopics, loading } = useSelector(s => s.diagnosticNodes)
  const {
    topicFilters, subtopicsMap, loadingTopics,
    updateTopicFilter, addTopicFilter, removeTopicFilter,
    totalCount, handleStart, canStart,
  } = useCustomSession(onClose)

  const topicOptions = [...primaryTopics, ...specialTopics].map(t => ({ value: t.id, label: t.name }))

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="large"
      title={`Buat Sesi Custom — Total ${totalCount} soal`}
      footer={
        <Footer>
          <Button variant="secondary" onClick={addTopicFilter}>+ Tambah modul lain</Button>
          <StartButton onClick={handleStart} disabled={!canStart} style={{ flex: 1 }}>
            {loading.isStartingSession ? 'Menyiapkan...' : `→ Mulai Sesi (${totalCount} soal)`}
          </StartButton>
        </Footer>
      }
    >
      {topicFilters.map((f, i) => (
        <TopicFilterCard
          key={f.id}
          index={i}
          item={f}
          topicOptions={topicOptions}
          subtopicsMap={subtopicsMap}
          loadingTopics={loadingTopics}
          onUpdate={updates => updateTopicFilter(f.id, updates)}
          onRemove={() => removeTopicFilter(f.id)}
          canRemove={topicFilters.length > 1}
        />
      ))}
    </Modal>
  )
}
