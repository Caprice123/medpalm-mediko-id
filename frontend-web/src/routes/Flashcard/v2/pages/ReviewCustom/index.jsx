import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { startReviewSession } from '@store/review/userAction'
import { getWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'
import Button from '@components/common/Button'
import Dropdown from '@components/common/Dropdown'
import AnkiPlayer from '../Detail/components/AnkiPlayer'
import {
  Container, Title, Subtitle, BuilderCard, SectionLabel, Row, EmptyHint,
  RatingChips, RatingChip, SliderRow, SliderInput, SliderValue,
} from '../Review/Review.styles'
import { FlashcardRoute } from '../../../routes'

const RATING_OPTIONS = [
  { key: 'again', label: 'Lagi',  color: '#ef4444' },
  { key: 'hard',  label: 'Sulit', color: '#f97316' },
  { key: 'good',  label: 'Baik',  color: '#3b82f6' },
  { key: 'easy',  label: 'Mudah', color: '#22c55e' },
]

export default function ReviewCustomPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
    getWithToken(Endpoints.api.featureNodes, { nodeType: 'department' }).then(res => {
      setDepartments((res.data.data || []).map(n => ({ value: String(n.id), label: n.name })))
    })
    getWithToken(Endpoints.api.featureNodes, { nodeType: 'topic' }).then(res => {
      const mapped = (res.data.data || []).map(n => ({ value: String(n.id), label: n.name, parentId: String(n.parentId) }))
      setAllTopics(mapped)
      setTopics(mapped)
    })
  }, [])

  useEffect(() => {
    if (selectedDepts.length === 0) {
      setTopics(allTopics)
    } else {
      const deptIds = new Set(selectedDepts.map(d => d.value))
      setTopics(allTopics.filter(t => deptIds.has(t.parentId)))
      setSelectedTopics(prev => prev.filter(t => deptIds.has(t.parentId)))
    }
  }, [selectedDepts, allTopics])

  const toggleRating = (key) => {
    setSelectedRatings(prev =>
      prev.includes(key) ? prev.filter(r => r !== key) : [...prev, key]
    )
  }

  const handleStart = async () => {
    await dispatch(startReviewSession({
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
    }))
    setPlaying(true)
  }

  if (playing) {
    if (loading.isFetchingSession) return (
      <Container><EmptyHint>Memuat kartu...</EmptyHint></Container>
    )
    if (sessionCards.length === 0) return (
      <Container>
        <EmptyHint>Tidak ada kartu untuk filter yang dipilih.</EmptyHint>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="secondary" onClick={() => setPlaying(false)}>Kembali ke Filter</Button>
        </div>
      </Container>
    )
    return (
      <AnkiPlayer
        deck={{ title: 'Review Kustom', cards: sessionCards }}
        onBack={() => setPlaying(false)}
        recordType="flashcard_card"
      />
    )
  }

  return (
    <Container>
      <Title>Review Kustom</Title>
      <Subtitle>Pilih filter rating, topik, dan jumlah kartu untuk sesi ini.</Subtitle>

      <BuilderCard>
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
    </Container>
  )
}
