import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { startReviewSession } from '@store/review/userAction'
import { getWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import Dropdown from '@components/common/Dropdown'
import { FlashcardRoute } from '../../../../routes'
import {
  SectionLabel, RatingChips, RatingChip,
  SliderRow, SliderInput, SliderValue, Row,
} from '../../Review/Review.styles'

const RATING_OPTIONS = [
  { key: 'again', label: 'Lagi',  color: '#ef4444' },
  { key: 'hard',  label: 'Sulit', color: '#f97316' },
  { key: 'good',  label: 'Baik',  color: '#3b82f6' },
  { key: 'easy',  label: 'Mudah', color: '#22c55e' },
]

export default function ReviewCustomModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector(state => state.review)

  const [departments, setDepartments] = useState([])
  const [allTopics, setAllTopics] = useState([])
  const [topics, setTopics] = useState([])
  const [selectedDepts, setSelectedDepts] = useState([])
  const [selectedTopics, setSelectedTopics] = useState([])
  const [selectedRatings, setSelectedRatings] = useState([])
  const [limit, setLimit] = useState(20)

  useEffect(() => {
    if (!isOpen) return
    getWithToken(Endpoints.api.featureNodes, { nodeType: 'department' }).then(res => {
      setDepartments((res.data.data || []).map(n => ({ value: String(n.id), label: n.name })))
    })
    getWithToken(Endpoints.api.featureNodes, { nodeType: 'topic' }).then(res => {
      const mapped = (res.data.data || []).map(n => ({ value: String(n.id), label: n.name, parentId: String(n.parentId) }))
      setAllTopics(mapped)
      setTopics(mapped)
    })
  }, [isOpen])

  useEffect(() => {
    if (selectedDepts.length === 0) {
      setTopics(allTopics)
    } else {
      const deptIds = new Set(selectedDepts.map(d => d.value))
      setTopics(allTopics.filter(t => deptIds.has(t.parentId)))
      setSelectedTopics(prev => prev.filter(t => deptIds.has(t.parentId)))
    }
  }, [selectedDepts, allTopics])

  const handleClose = () => {
    setSelectedDepts([])
    setSelectedTopics([])
    setSelectedRatings([])
    setLimit(20)
    onClose()
  }

  const handleStart = () => {
    dispatch(startReviewSession(
      {
        type: 'custom',
        recordType: 'flashcard_card',
        mode: 'all',
        cardLimit: limit,
        ...(selectedRatings.length > 0 ? { lastRating: selectedRatings.join(',') } : {}),
        ...(selectedTopics.length > 0
          ? { nodeIds: selectedTopics.map(t => t.value).join(',') }
          : selectedDepts.length > 0
            ? { departmentNodeIds: selectedDepts.map(d => d.value).join(',') }
            : {}),
      },
      (uniqueId) => { handleClose(); navigate(FlashcardRoute.sessionRoute(uniqueId)) }
    ))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Review Kustom"
      size="large"
      footer={
        <Button
          variant="primary"
          onClick={handleStart}
          disabled={loading.isFetchingSession}
        >
          {loading.isFetchingSession ? 'Memuat...' : 'Mulai Sesi'}
        </Button>
      }
    >
      <SectionLabel>Filter Berdasarkan Rating Terakhir</SectionLabel>
      <RatingChips>
        {RATING_OPTIONS.map(r => (
          <RatingChip
            key={r.key}
            $active={selectedRatings.includes(r.key)}
            $color={r.color}
            onClick={() => setSelectedRatings(prev =>
              prev.includes(r.key) ? prev.filter(x => x !== r.key) : [...prev, r.key]
            )}
          >
            {r.label}
          </RatingChip>
        ))}
      </RatingChips>

      <SectionLabel>Filter Topik</SectionLabel>
      <Row style={{ marginBottom: '1.25rem' }}>
        <Dropdown
          placeholder="Semua Departemen"
          options={departments}
          value={selectedDepts}
          onChange={v => setSelectedDepts(v || [])}
          isMulti
        />
        <Dropdown
          placeholder="Semua Topik"
          options={topics}
          value={selectedTopics}
          onChange={v => setSelectedTopics(v || [])}
          isMulti
        />
      </Row>

      <SectionLabel>Jumlah Kartu</SectionLabel>
      <SliderRow>
        <SliderInput
          type="range"
          min="1"
          max="100"
          value={limit}
          onChange={e => setLimit(Number(e.target.value))}
        />
        <input
          type="number"
          min="1"
          max="100"
          value={limit}
          onChange={e => {
            const v = Math.min(100, Math.max(1, Number(e.target.value) || 1))
            setLimit(v)
          }}
          style={{
            width: '3.5rem', textAlign: 'center', fontWeight: 700,
            fontSize: '0.9375rem', color: '#0d9488',
            border: '1.5px solid #99f6e4', borderRadius: '8px',
            padding: '0.25rem 0.375rem', outline: 'none',
            flexShrink: 0,
          }}
        />
      </SliderRow>
    </Modal>
  )
}
