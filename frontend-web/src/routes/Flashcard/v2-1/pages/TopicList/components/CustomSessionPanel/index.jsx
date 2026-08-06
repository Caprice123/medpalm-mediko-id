import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import Modal from '@components/common/Modal'
import { useCustomSession } from '../../hooks/useCustomSession'
import TopicFilterCard from '../TopicFilterCard'
import { Footer, StartButton } from './CustomSessionPanel.styles'

export default function CustomSessionPanel({ onClose }) {
  const { topics, loading } = useSelector(s => s.flashcardNodes)
  const {
    topicFilters, subtopicsMap, loadingTopics,
    updateTopicFilter, addTopicFilter, removeTopicFilter,
    totalCount, handleStart, canStart,
  } = useCustomSession(onClose)

  const topicOptions = topics.map(t => ({ value: t.id, label: t.name }))

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="large"
      title={`Buat Sesi Custom — Total ${totalCount} kartu`}
      footer={
        <Footer>
          <Button variant="secondary" onClick={addTopicFilter}>+ Tambah bidang lain</Button>
          <StartButton onClick={handleStart} disabled={!canStart} style={{ flex: 1 }}>
            {loading.isStartingSession ? 'Menyiapkan...' : `→ Mulai Sesi (${totalCount} kartu)`}
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
