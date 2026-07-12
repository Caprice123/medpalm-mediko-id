import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchReviewSession, fetchCustomSessions, createCustomSession, deleteCustomSession } from '@store/review/userAction'
import { getWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'
import Button from '@components/common/Button'
import Dropdown from '@components/common/Dropdown'
import TextInput from '@components/common/TextInput'
import AnkiPlayer from '../Detail/components/AnkiPlayer'
import {
  Container, Title, Subtitle, BuilderCard, SectionLabel,
  ModeGrid, ModeOption, Row, SaveRow, SaveToggle, SaveToggleLabel,
  SessionList, SessionCard, SessionName, SessionMeta, SessionActions,
  EmptyHint,
} from './Review.styles'

const MODE_OPTIONS = [
  { value: 'due_today', label: 'Due Hari Ini', desc: 'Kartu yang jadwal reviewnya sudah tiba' },
  { value: 'new_cards', label: 'Kartu Baru', desc: 'Kartu yang belum pernah dipelajari' },
  { value: 'struggling', label: 'Perlu Diulang', desc: 'Kartu yang terakhir dinilai Lagi atau Sulit' },
  { value: 'all', label: 'Semua Kartu', desc: 'Semua kartu dari topik yang dipilih' },
]

const LIMIT_OPTIONS = [10, 20, 30, 50].map(n => ({ value: String(n), label: `${n} kartu` }))

export default function ReviewPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { sessionCards, customSessions, loading } = useSelector(state => state.review)

  const [departments, setDepartments] = useState([])
  const [topics, setTopics] = useState([])
  const [selectedDept, setSelectedDept] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [mode, setMode] = useState('due_today')
  const [limit, setLimit] = useState('20')
  const [saveSession, setSaveSession] = useState(false)
  const [sessionName, setSessionName] = useState('')
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    dispatch(fetchCustomSessions())
    const load = async () => {
      const res = await getWithToken(Endpoints.admin.featureNodes, { nodeType: 'department' })
      setDepartments((res.data.data || []).map(n => ({ value: n.id, label: n.name })))
    }
    load()
  }, [dispatch])

  useEffect(() => {
    if (!selectedDept) { setTopics([]); setSelectedTopic(null); return }
    const load = async () => {
      const res = await getWithToken(Endpoints.admin.featureNodes, { nodeType: 'topic', parentId: selectedDept.value })
      setTopics((res.data.data || []).map(n => ({ value: n.id, label: n.name })))
      setSelectedTopic(null)
    }
    load()
  }, [selectedDept])

  const handleStart = async () => {
    const params = {
      recordType: 'flashcard_card',
      mode,
      limit,
      ...(selectedTopic ? { nodeId: selectedTopic.value } : selectedDept ? { departmentNodeId: selectedDept.value } : {}),
    }
    await dispatch(fetchReviewSession(params))

    if (saveSession && sessionName.trim()) {
      dispatch(createCustomSession({
        name: sessionName.trim(),
        recordType: 'flashcard_card',
        nodeId: selectedTopic?.value ?? null,
        departmentNodeId: selectedDept?.value ?? null,
        mode,
        cardLimit: parseInt(limit),
      }))
    }
    setPlaying(true)
  }

  const handleStartCustom = async (session) => {
    await dispatch(fetchReviewSession({
      recordType: session.record_type,
      nodeId: session.node_id ?? undefined,
      departmentNodeId: session.department_node_id ?? undefined,
      mode: session.mode,
      limit: session.card_limit,
    }))
    setPlaying(true)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Hapus sesi ini?')) return
    dispatch(deleteCustomSession(id, () => dispatch(fetchCustomSessions())))
  }

  if (playing) {
    if (loading.isFetchingSession) return <Container><EmptyHint>Memuat kartu...</EmptyHint></Container>
    if (sessionCards.length === 0) return (
      <Container>
        <EmptyHint>Tidak ada kartu untuk sesi ini.</EmptyHint>
        <Button variant="secondary" onClick={() => setPlaying(false)}>Kembali</Button>
      </Container>
    )
    return (
      <AnkiPlayer
        deck={{ title: 'Sesi Review', cards: sessionCards }}
        onBack={() => setPlaying(false)}
        recordType="flashcard_card"
      />
    )
  }

  return (
    <Container>
      <Title>Sesi Review</Title>
      <Subtitle>Pilih topik dan mode review, lalu mulai sesi belajar.</Subtitle>

      <BuilderCard>
        <SectionLabel>Filter Topik</SectionLabel>
        <Row>
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
            isDisabled={!selectedDept}
          />
        </Row>

        <SectionLabel style={{ marginTop: '1.25rem' }}>Mode Review</SectionLabel>
        <ModeGrid>
          {MODE_OPTIONS.map(opt => (
            <ModeOption key={opt.value} $active={mode === opt.value} onClick={() => setMode(opt.value)}>
              <strong>{opt.label}</strong>
              <span>{opt.desc}</span>
            </ModeOption>
          ))}
        </ModeGrid>

        <Row style={{ marginTop: '1.25rem', alignItems: 'center' }}>
          <SectionLabel style={{ margin: 0 }}>Jumlah Kartu</SectionLabel>
          <Dropdown
            options={LIMIT_OPTIONS}
            value={LIMIT_OPTIONS.find(o => o.value === limit)}
            onChange={opt => setLimit(opt?.value || '20')}
          />
        </Row>

        <SaveRow>
          <SaveToggle onClick={() => setSaveSession(v => !v)} $active={saveSession} />
          <SaveToggleLabel>Simpan sebagai sesi tersimpan</SaveToggleLabel>
        </SaveRow>

        {saveSession && (
          <TextInput
            placeholder="Nama sesi, contoh: Kardiologi — Due"
            value={sessionName}
            onChange={e => setSessionName(e.target.value)}
          />
        )}

        <Button
          variant="primary"
          fullWidth
          onClick={handleStart}
          disabled={loading.isFetchingSession}
          style={{ marginTop: '1rem' }}
        >
          {loading.isFetchingSession ? 'Memuat...' : 'Mulai Sesi'}
        </Button>
      </BuilderCard>

      {customSessions.length > 0 && (
        <>
          <SectionLabel style={{ marginTop: '2rem' }}>Sesi Tersimpan</SectionLabel>
          <SessionList>
            {customSessions.map(s => (
              <SessionCard key={s.id}>
                <div>
                  <SessionName>{s.name}</SessionName>
                  <SessionMeta>{MODE_OPTIONS.find(m => m.value === s.mode)?.label} · {s.card_limit} kartu</SessionMeta>
                </div>
                <SessionActions>
                  <Button variant="primary" onClick={() => handleStartCustom(s)}>Mulai</Button>
                  <Button variant="danger" onClick={() => handleDelete(s.id)}>Hapus</Button>
                </SessionActions>
              </SessionCard>
            ))}
          </SessionList>
        </>
      )}
    </Container>
  )
}
