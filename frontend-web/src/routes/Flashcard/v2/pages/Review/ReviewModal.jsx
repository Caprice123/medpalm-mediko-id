import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReviewSession } from '@store/review/userAction'
import { getWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import Dropdown from '@components/common/Dropdown'
import AnkiPlayer from '../Detail/components/AnkiPlayer'
import {
  BuilderCard, SectionLabel,
  Row,
} from './Review.styles'
import styled from 'styled-components'

/* ── local styles ── */
const TypeToggle = styled.div`
  display: flex;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 3px;
  gap: 3px;
  margin-bottom: 1.5rem;
`

const TypeBtn = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  background: ${p => p.$active ? 'white' : 'transparent'};
  color: ${p => p.$active ? '#111827' : '#6b7280'};
  box-shadow: ${p => p.$active ? '0 1px 3px rgba(0,0,0,0.12)' : 'none'};
  transition: all 0.15s;
`

const RatingChips = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
`

const RatingChip = styled.button`
  padding: 0.375rem 0.875rem;
  border-radius: 99px;
  border: 2px solid ${p => p.$active ? p.$color : '#e5e7eb'};
  background: ${p => p.$active ? p.$color + '18' : 'white'};
  color: ${p => p.$active ? p.$color : '#6b7280'};
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: ${p => p.$color};
    color: ${p => p.$color};
  }
`

const QuickDesc = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 1.25rem;
  line-height: 1.5;
`

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1.25rem;
`

const SliderInput = styled.input`
  flex: 1;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(
    to right,
    #0d9488 0%,
    #0d9488 ${p => (p.value - 1) / 99 * 100}%,
    #e5e7eb ${p => (p.value - 1) / 99 * 100}%,
    #e5e7eb 100%
  );
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #0d9488;
    box-shadow: 0 1px 4px rgba(13,148,136,0.4);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border: none;
    border-radius: 50%;
    background: #0d9488;
    box-shadow: 0 1px 4px rgba(13,148,136,0.4);
    cursor: pointer;
  }
`

const SliderValue = styled.span`
  min-width: 2.5rem;
  text-align: right;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0d9488;
`

const RATING_OPTIONS = [
  { key: 'again', label: 'Lagi',  color: '#ef4444' },
  { key: 'hard',  label: 'Sulit', color: '#f97316' },
  { key: 'good',  label: 'Baik',  color: '#3b82f6' },
  { key: 'easy',  label: 'Mudah', color: '#22c55e' },
]

export default function ReviewModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const { sessionCards, loading } = useSelector(state => state.review)

  const [reviewType, setReviewType] = useState('all')
  const [departments, setDepartments] = useState([])
  const [allTopics, setAllTopics] = useState([])
  const [topics, setTopics] = useState([])
  const [selectedDept, setSelectedDept] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedRatings, setSelectedRatings] = useState([])  // multi-select
  const [limit, setLimit] = useState(20)
  const [playing, setPlaying] = useState(false)

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
  }, [dispatch, isOpen])

  useEffect(() => {
    setSelectedTopic(null)
    if (!selectedDept) {
      setTopics(allTopics)
    } else {
      setTopics(allTopics.filter(t => t.parentId === selectedDept.value))
    }
  }, [selectedDept, allTopics])

  const toggleRating = (key) => {
    setSelectedRatings(prev =>
      prev.includes(key) ? prev.filter(r => r !== key) : [...prev, key]
    )
  }

  const handleClose = () => {
    setPlaying(false)
    onClose()
  }

  const buildParams = () => {
    if (reviewType === 'all') {
      return { recordType: 'flashcard_card', mode: 'due_today', limit: 100 }
    }
    return {
      recordType: 'flashcard_card',
      mode: 'all',
      limit,
      ...(selectedRatings.length > 0 ? { lastRating: selectedRatings.join(',') } : {}),
      ...(selectedTopic ? { nodeId: selectedTopic.value } : selectedDept ? { departmentNodeId: selectedDept.value } : {}),
    }
  }

  const handleStart = async () => {
    await dispatch(fetchReviewSession(buildParams()))
    setPlaying(true)
  }

  if (playing) {
    if (loading.isFetchingSession) return createPortal(
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#0d9488', fontWeight: 600, fontSize: '1rem' }}>Memuat kartu...</span>
      </div>,
      document.body
    )

    if (sessionCards.length === 0) return createPortal(
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#f0fdfa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <span style={{ color: '#6b7280', fontSize: '0.9375rem' }}>Tidak ada kartu untuk sesi ini.</span>
        <Button variant="secondary" onClick={() => setPlaying(false)}>Kembali</Button>
      </div>,
      document.body
    )

    return createPortal(
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto' }}>
        <AnkiPlayer
          deck={{ title: 'Sesi Review', cards: sessionCards }}
          onBack={() => setPlaying(false)}
          recordType="flashcard_card"
        />
      </div>,
      document.body
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sesi Review" size="large">
      <TypeToggle>
        <TypeBtn $active={reviewType === 'all'} onClick={() => setReviewType('all')}>
          Review Semua
        </TypeBtn>
        <TypeBtn $active={reviewType === 'custom'} onClick={() => setReviewType('custom')}>
          Review Kustom
        </TypeBtn>
      </TypeToggle>

      {reviewType === 'all' ? (
        <>
          <QuickDesc>
            Review semua kartu yang sudah jatuh tempo hari ini, termasuk kartu baru yang belum pernah dipelajari.
          </QuickDesc>
          <Button
            variant="primary"
            fullWidth
            onClick={handleStart}
            disabled={loading.isFetchingSession}
          >
            {loading.isFetchingSession ? 'Memuat...' : 'Mulai Sesi'}
          </Button>
        </>
      ) : (
        <BuilderCard style={{ border: 'none', padding: 0 }}>
          <SectionLabel>Filter Berdasarkan Rating Terakhir</SectionLabel>
          <RatingChips>
            {RATING_OPTIONS.map(r => (
              <RatingChip
                key={r.key}
                $active={selectedRatings.includes(r.key)}
                $color={r.color}
                onClick={() => toggleRating(r.key)}
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
              value={selectedDept}
              onChange={setSelectedDept}
              isClearable
            />
            <Dropdown
              placeholder="Semua Topik"
              options={topics}
              value={selectedTopic}
              onChange={setSelectedTopic}
              isClearable
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
            <SliderValue>{limit}</SliderValue>
          </SliderRow>

          <Button
            variant="primary"
            fullWidth
            onClick={handleStart}
            disabled={loading.isFetchingSession}
            style={{ marginTop: '0.5rem' }}
          >
            {loading.isFetchingSession ? 'Memuat...' : 'Mulai Sesi'}
          </Button>
        </BuilderCard>
      )}

    </Modal>
  )
}
