import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import Modal from '@components/common/Modal'
import { useCustomSession } from '../../hooks/useCustomSession'
import DepartmentSection from '../DepartmentSection'
import { StartButton } from './CustomSessionPanel.styles'

export default function CustomSessionPanel({ topics, onClose }) {
  const { loading } = useSelector(s => s.flashcardNodes)
  const {
    departmentList, subtopicsMap, loadingTopics,
    updateDepartment, addDepartment, removeDepartment,
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
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          <Button variant="secondary" onClick={addDepartment}>+ Tambah bidang lain</Button>
          <StartButton onClick={handleStart} disabled={!canStart} style={{ flex: 1 }}>
            {loading.isStartingSession ? 'Menyiapkan...' : `→ Mulai Sesi (${totalCount} kartu)`}
          </StartButton>
        </div>
      }
    >
      {departmentList.map((d, i) => (
        <DepartmentSection
          key={d.id}
          index={i}
          item={d}
          topicOptions={topicOptions}
          subtopicsMap={subtopicsMap}
          loadingTopics={loadingTopics}
          onUpdate={updates => updateDepartment(d.id, updates)}
          onRemove={() => removeDepartment(d.id)}
          canRemove={departmentList.length > 1}
        />
      ))}
    </Modal>
  )
}
