import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/challenge/reducer'
import { fetchAdminTags } from '@store/tags/adminAction'
import { fetchAdminChallenges, createChallenge, updateChallenge, deleteChallenge } from '@store/challenge/adminAction'
import Button from '@components/common/Button'
import Modal from '@components/common/Modal'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Dropdown from '@components/common/Dropdown'
import TagSelector from '@components/common/TagSelector'
import Table from '@components/common/Table'
import Pagination from '@components/Pagination'
import { formatJakartaDateLong } from '@utils/dateUtils'
import { ChallengeFilter } from '../../components/Filter'
import {
  SubHeader, SubTitle, ActionCell,
  Badge, ScoringBadge, FormGrid, FormGroup, Label
} from '../../Challenge.styles'
import styled from 'styled-components'

const HintText = styled.p`
  font-size: 0.78rem;
  color: #6b7280;
  margin: 0.25rem 0 0;
  line-height: 1.5;
`

const SCORING_HINTS = {
  classic: 'Kahoot-style: tiap soal punya timer sendiri. Semakin cepat menjawab = poin lebih besar. Streak jawaban benar berturut-turut memberi multiplier (×1.5 ab 3, ×2 ab 5).',
  blitz:   'Skor = jumlah jawaban benar. Timer global berlaku untuk semua soal.',
}

const STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

const SCORING_OPTIONS = [
  { label: 'Classic', value: 'classic' },
  { label: 'Blitz', value: 'blitz' },
]

const defaultForm = {
  title: '', description: '', scoringType: 'classic', durationSeconds: 1800,
  specialDurationSeconds: 120, totalQuestions: 20, basePointsPerCorrect: 1000,
  secondsPerQuestion: 30, maxSpecialPerSession: 0, status: 'draft',
  startAt: '', endAt: '', universityTags: [], semesterTags: [],
}

export default function ChallengesTab({ onConfigure }) {
  const dispatch = useDispatch()
  const { challenges, pagination, loading } = useSelector(state => state.challenge)
  const { tags } = useSelector(state => state.tags)
  const [modal, setModal] = useState({ open: false, mode: 'create', target: null })
  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    dispatch(fetchAdminChallenges())
    dispatch(fetchAdminTags())
  }, [dispatch])

  const universityTags = useMemo(() => tags.find(g => g.name === 'university')?.tags || [], [tags])
  const semesterTags = useMemo(() => tags.find(g => g.name === 'semester')?.tags || [], [tags])

  const openCreate = () => { setForm(defaultForm); setModal({ open: true, mode: 'create', target: null }) }
  const openEdit = (c) => {
    const allTagsFlat = c.tags || []
    setForm({
      title: c.title || '', description: c.description || '',
      scoringType: c.scoringType, durationSeconds: c.durationSeconds, specialDurationSeconds: c.specialDurationSeconds ?? 120,
      totalQuestions: c.totalQuestions, basePointsPerCorrect: c.basePointsPerCorrect,
      secondsPerQuestion: c.secondsPerQuestion ?? 30,
      maxSpecialPerSession: c.maxSpecialPerSession ?? 0,
      status: c.status,
      startAt: c.startAt ? c.startAt.slice(0, 16) : '',
      endAt: c.endAt ? c.endAt.slice(0, 16) : '',
      universityTags: allTagsFlat.filter(t => t.tagGroupName === 'university'),
      semesterTags: allTagsFlat.filter(t => t.tagGroupName === 'semester'),
    })
    setModal({ open: true, mode: 'edit', target: c })
  }

  const handleSave = async () => {
    const { universityTags, semesterTags, ...rest } = form
    const payload = {
      ...rest,
      tagIds: [...(universityTags || []), ...(semesterTags || [])].map(t => t.id),
      durationSeconds: parseInt(form.durationSeconds),
      totalQuestions: parseInt(form.totalQuestions),
      basePointsPerCorrect: parseInt(form.basePointsPerCorrect),
      secondsPerQuestion: parseInt(form.secondsPerQuestion) || 30,
      maxSpecialPerSession: parseInt(form.maxSpecialPerSession) || 0,
      specialDurationSeconds: parseInt(form.specialDurationSeconds) || 120,
      startAt: form.startAt ? new Date(`${form.startAt}:00+07:00`).toISOString() : null,
      endAt: form.endAt ? new Date(`${form.endAt}:00+07:00`).toISOString() : null,
    }
    const onSuccess = () => {
      setModal({ open: false, mode: 'create', target: null })
      dispatch(fetchAdminChallenges())
    }
    if (modal.mode === 'create') {
      await dispatch(createChallenge(payload, onSuccess))
    } else {
      await dispatch(updateChallenge(modal.target.uniqueId, payload, onSuccess))
    }
  }

  const handleDelete = async (c) => {
    if (!window.confirm(`Hapus challenge "${c.title}"?`)) return
    await dispatch(deleteChallenge(c.uniqueId, () => dispatch(fetchAdminChallenges())))
  }

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAdminChallenges())
  }

  const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val?.target?.value ?? val?.value ?? val }))

  const columns = [
    { header: 'Judul', key: 'title' },
    {
      header: 'Tipe Scoring',
      render: (c) => (
        <ScoringBadge $type={c.scoringType}>
          {c.scoringType === 'blitz' ? 'Blitz' : 'Classic'}
        </ScoringBadge>
      ),
    },
    { header: 'Durasi', render: (c) => `${c.durationSeconds}s` },
    { header: 'Soal / Pool', render: (c) => `${c.totalQuestions} soal / ${c.questionCount ?? 0} pool` },
    { header: 'Sesi', render: (c) => c.sessionCount ?? 0 },
    {
      header: 'Tags',
      render: (c) => (c.tags || []).length > 0
        ? (c.tags || []).map(t => t.name).join(', ')
        : '-',
    },
    { header: 'Status', render: (c) => <Badge $status={c.status}>{c.status}</Badge> },
    { header: 'Mulai', render: (c) => c.startAt ? formatJakartaDateLong(c.startAt) : '-' },
    { header: 'Selesai', render: (c) => c.endAt ? formatJakartaDateLong(c.endAt) : '-' },
    {
      header: 'Aksi',
      render: (c) => (
        <ActionCell>
          <Button variant="primary" onClick={() => onConfigure(c)}>Kelola</Button>
          <Button onClick={() => openEdit(c)}>Edit</Button>
          <Button variant="danger" onClick={() => handleDelete(c)}>Hapus</Button>
        </ActionCell>
      ),
    },
  ]

  return (
    <>
      <SubHeader>
        <SubTitle>Daftar Challenge</SubTitle>
        <Button variant="primary" onClick={openCreate}>+ Tambah Challenge</Button>
      </SubHeader>

      <ChallengeFilter />

      <Table
        columns={columns}
        data={challenges}
        loading={loading.isGetListLoading}
        emptyText="Belum ada challenge"
        emptySubtext='Klik "+ Tambah Challenge" untuk memulai.'
      />

      {(pagination.page > 1 || !pagination.isLastPage) && (
        <Pagination
          currentPage={pagination.page}
          isLastPage={pagination.isLastPage}
          onPageChange={handlePageChange}
          variant="admin"
          language="id"
        />
      )}

      {modal.open && (
        <Modal
          isOpen={modal.open}
          onClose={() => setModal({ open: false, mode: 'create', target: null })}
          title={modal.mode === 'create' ? 'Tambah Challenge' : 'Edit Challenge'}
          footer={
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={loading.isCreateLoading || loading.isUpdateLoading}
            >
              {loading.isCreateLoading || loading.isUpdateLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          }
        >
          <FormGrid>
            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>Judul *</Label>
              <TextInput value={form.title} onChange={set('title')} placeholder="Nama challenge" />
            </FormGroup>
            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>Deskripsi</Label>
              <Textarea value={form.description} onChange={set('description')} placeholder="Deskripsi challenge" rows={2} />
            </FormGroup>
            <FormGroup>
              <Label>Tipe Scoring *</Label>
              <Dropdown
                options={SCORING_OPTIONS}
                value={SCORING_OPTIONS.find(o => o.value === form.scoringType)}
                onChange={set('scoringType')}
              />
              {form.scoringType && (
                <HintText>{SCORING_HINTS[form.scoringType]}</HintText>
              )}
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Dropdown
                options={STATUS_OPTIONS}
                value={STATUS_OPTIONS.find(o => o.value === form.status)}
                onChange={set('status')}
              />
            </FormGroup>
            <FormGroup>
              <Label>Durasi (detik) *</Label>
              <TextInput type="number" min="1" value={form.durationSeconds} onChange={set('durationSeconds')} />
            </FormGroup>
            <FormGroup>
              <Label>Jumlah soal per sesi *</Label>
              <TextInput type="number" min="1" value={form.totalQuestions} onChange={set('totalQuestions')} />
            </FormGroup>
            <FormGroup>
              <Label>Poin per jawaban benar</Label>
              <TextInput type="number" min="1" value={form.basePointsPerCorrect} onChange={set('basePointsPerCorrect')} />
            </FormGroup>
            {form.scoringType === 'classic' && (
              <FormGroup>
                <Label>Waktu per soal (detik)</Label>
                <TextInput type="number" min="5" max="120" value={form.secondsPerQuestion} onChange={set('secondsPerQuestion')} />
                <HintText>Timer countdown per soal (Kahoot-style). Minimal 5, maks 120 detik.</HintText>
              </FormGroup>
            )}
            <FormGroup>
              <Label>Maks soal spesial per sesi</Label>
              <TextInput type="number" min="0" value={form.maxSpecialPerSession} onChange={set('maxSpecialPerSession')} />
            </FormGroup>
            {form.scoringType === 'blitz' && (
              <FormGroup>
                <Label>Durasi soal spesial (detik)</Label>
                <TextInput type="number" min="1" value={form.specialDurationSeconds} onChange={set('specialDurationSeconds')} />
                <HintText>Timer terpisah untuk soal spesial setelah soal reguler selesai.</HintText>
              </FormGroup>
            )}
            <FormGroup>
              <Label>Mulai (WIB)</Label>
              <TextInput type="datetime-local" value={form.startAt} onChange={set('startAt')} />
            </FormGroup>
            <FormGroup>
              <Label>Selesai (WIB)</Label>
              <TextInput type="datetime-local" value={form.endAt} onChange={set('endAt')} />
            </FormGroup>
            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>Universitas</Label>
              <TagSelector
                allTags={universityTags}
                selectedTags={form.universityTags}
                onTagsChange={(tags) => setForm(prev => ({ ...prev, universityTags: tags }))}
                placeholder="-- Pilih universitas --"
              />
            </FormGroup>
            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>Semester</Label>
              <TagSelector
                allTags={semesterTags}
                selectedTags={form.semesterTags}
                onTagsChange={(tags) => setForm(prev => ({ ...prev, semesterTags: tags }))}
                placeholder="-- Pilih semester --"
              />
            </FormGroup>
          </FormGrid>
        </Modal>
      )}
    </>
  )
}
