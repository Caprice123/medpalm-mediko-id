import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { startReviewSession } from '@store/review/userAction'
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

export default function ReviewModal({ isOpen, onClose, autoStart = false }) {
  const dispatch = useDispatch()
  const { sessionCards, loading } = useSelector(state => state.review)

  const [departments, setDepartments] = useState([])
  const [allTopics, setAllTopics] = useState([])
  const [topics, setTopics] = useState([])
  const [selectedDepts, setSelectedDepts] = useState([])
  const [selectedTopics, setSelectedTopics] = useState([])
  const [selectedRatings, setSelectedRatings] = useState([])
  const [limit, setLimit] = useState(20)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setPlaying(false)
      return
    }
    if (autoStart) {
      dispatch(fetchReviewSession({ recordType: 'flashcard_card', mode: 'due_today', limit: 100 }))
      setPlaying(true)
      return
    }
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
      const filtered = allTopics.filter(t => deptIds.has(t.parentId))
      setTopics(filtered)
      setSelectedTopics(prev => prev.filter(t => deptIds.has(t.parentId)))
    }
  }, [selectedDepts, allTopics])

  const toggleRating = (key) => {
    setSelectedRatings(prev =>
      prev.includes(key) ? prev.filter(r => r !== key) : [...prev, key]
    )
  }

  const handleClose = () => {
    setPlaying(false)
    onClose()
  }

  const buildParams = () => ({
    recordType: 'flashcard_card',
    mode: 'all',
    limit,
    ...(selectedRatings.length > 0 ? { lastRating: selectedRatings.join(',') } : {}),
    ...(selectedTopics.length > 0
      ? { nodeIds: selectedTopics.map(t => t.value).join(',') }
      : selectedDepts.length > 0
        ? { departmentNodeIds: selectedDepts.map(d => d.value).join(',') }
        : {}),
  })

  const handleStart = async () => {
    await dispatch(startReviewSession(buildParams()))
    setPlaying(true)
  }

  if (playing) {
    if (loading.isFetchingSession) return createPortal(
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#0d9488', fontWeight: 600, fontSize: '1rem' }}>Memuat kartu...</span>
      </div>,
      document.body
    )

    const handleBack = () => {
      setPlaying(false)
      if (autoStart) onClose()
    }

    if (sessionCards.length === 0) return createPortal(
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#f0fdfa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <span style={{ color: '#6b7280', fontSize: '0.9375rem' }}>Tidak ada kartu untuk sesi ini.</span>
        <Button variant="secondary" onClick={handleBack}>Kembali</Button>
      </div>,
      document.body
    )

    return createPortal(
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto' }}>
        <AnkiPlayer
          deck={{ title: 'Sesi Review', cards: sessionCards }}
          onBack={handleBack}
          recordType="flashcard_card"
        />
      </div>,
      document.body
    )
  }

  if (autoStart) return null

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Review Kustom" size="large">
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
    </Modal>
  )
}
