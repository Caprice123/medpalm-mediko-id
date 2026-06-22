import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/challenge/reducer'
import {
  fetchAdminQuestions, createQuestion, updateQuestion, deleteQuestion,
  fetchAdminBadges, createBadge, updateBadge, deleteBadge,
  fetchAdminLeaderboard,
} from '@store/challenge/adminAction'
import { upload } from '@store/common/action'
import * as XLSX from 'xlsx'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Button from '@components/common/Button'
import Modal from '@components/common/Modal'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Dropdown from '@components/common/Dropdown'
import FileUpload from '@components/common/FileUpload'
import Loading from '@components/common/Loading'
import CommonTable from '@components/common/Table'
import Pagination from '@components/Pagination'
import { formatJakartaDateTimeFull } from '@utils/dateUtils'
import {
  Container, Header, TabsContainer, Tab,
  SubHeader, SubTitle, Table, Th, Td, Tr, ActionCell,
  Badge, ScoringBadge, EmptyRow, FormGrid, FormGroup, Label,
  OptionRow, OptionLabel, CorrectBtn, BadgeImagePreview,
  BadgeCardGrid, BadgeCard, BadgeCardImage, BadgeCardPlaceholder,
  BadgeCardName, BadgeCardRank, BadgeCardDesc, BadgeCardActions,
} from '../../Challenge.styles'

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E']

const QUESTION_TYPE_OPTIONS = [
  { label: 'Regular', value: false },
  { label: '⭐ Spesial (poin × 2)', value: true },
]

const defaultQuestionForm = {
  question: '',
  questionImageBlobId: null,
  questionImagePreviewUrl: null,
  options: [
    { text: '', imageBlobId: null, imagePreviewUrl: null },
    { text: '', imageBlobId: null, imagePreviewUrl: null },
    { text: '', imageBlobId: null, imagePreviewUrl: null },
    { text: '', imageBlobId: null, imagePreviewUrl: null },
  ],
  correctOptionIndex: 0,
  isSpecial: false,
}

const defaultBadgeForm = {
  name: '', description: '', minRank: 1, maxRank: 10, imageBlobId: null, imagePreviewUrl: null,
}

// ── Sortable question row ────────────────────────────────────────────────────

function SortableQuestionRow({ q, index, onEdit, onDelete, locked }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: q.uniqueId, disabled: locked })

  return (
    <Tr
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        background: isDragging ? '#EFF6FF' : undefined,
      }}
    >
      {!locked && (
        <Td style={{ width: 32, cursor: 'grab', color: '#9CA3AF', fontSize: '1.1rem', userSelect: 'none' }}
          {...attributes} {...listeners}>
          ⠿
        </Td>
      )}
      <Td style={{ width: 40, color: '#9CA3AF', fontSize: '0.8rem' }}>{index + 1}</Td>
      <Td style={{ maxWidth: 260 }}>{q.question || <em style={{ color: '#9CA3AF' }}>(gambar)</em>}</Td>
      <Td>
        {q.isSpecial
          ? <span style={{ background: '#FEF3C7', color: '#92400E', borderRadius: 999, padding: '0.15rem 0.5rem', fontSize: '0.7rem', fontWeight: 600 }}>⭐ Spesial</span>
          : <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Regular</span>}
      </Td>
      <Td>{q.options?.length} opsi</Td>
      <Td>{OPTION_LABELS[q.correctOptionIndex] ?? q.correctOptionIndex}</Td>
      {!locked && (
        <Td>
          <ActionCell>
            <Button onClick={() => onEdit(q)}>Edit</Button>
            <Button variant="danger" onClick={() => onDelete(q)}>Hapus</Button>
          </ActionCell>
        </Td>
      )}
    </Tr>
  )
}

// ── Soal Tab ────────────────────────────────────────────────────────────────

function SoalTab({ challenge }) {
  const dispatch = useDispatch()
  const { questions, questionsPagination, loading } = useSelector(s => s.challenge)
  const [orderedQuestions, setOrderedQuestions] = useState([])
  const [modal, setModal] = useState({ open: false, mode: 'create', target: null })
  const [form, setForm] = useState(defaultQuestionForm)
  const [importResult, setImportResult] = useState(null)
  const fileInputRef = useRef(null)

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    dispatch(fetchAdminQuestions(challenge.uniqueId))
  }, [challenge.uniqueId, dispatch])

  useEffect(() => {
    setOrderedQuestions(questions)
  }, [questions])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!active || !over || active.id === over.id) return

    const oldIdx = orderedQuestions.findIndex(q => q.uniqueId === active.id)
    const newIdx = orderedQuestions.findIndex(q => q.uniqueId === over.id)
    const reordered = arrayMove(orderedQuestions, oldIdx, newIdx)
    setOrderedQuestions(reordered)

    reordered.forEach((q, i) => {
      dispatch(updateQuestion(challenge.uniqueId, q.uniqueId, { order: i }))
    })
  }

  const openCreate = () => {
    setForm(defaultQuestionForm)
    setModal({ open: true, mode: 'create', target: null })
  }

  const openEdit = (q) => {
    setForm({
      question: q.question || '',
      questionImageBlobId: null,
      questionImagePreviewUrl: q.questionImage?.url || null,
      options: (q.options || ['', '', '', '']).map((text, i) => ({
        text,
        imageBlobId: null,
        imagePreviewUrl: q.optionImages?.[i]?.url || null,
      })),
      correctOptionIndex: q.correctOptionIndex,
      isSpecial: q.isSpecial || false,
    })
    setModal({ open: true, mode: 'edit', target: q })
  }

  const handleQuestionImageSelect = async (file) => {
    const result = await dispatch(upload(file, 'challenge-questions'))
    setForm(prev => ({ ...prev, questionImageBlobId: result.blobId, questionImagePreviewUrl: result.url }))
  }

  const handleOptionImageSelect = async (file, idx) => {
    const result = await dispatch(upload(file, 'challenge-questions'))
    setForm(prev => {
      const options = [...prev.options]
      options[idx] = { ...options[idx], imageBlobId: result.blobId, imagePreviewUrl: result.url }
      return { ...prev, options }
    })
  }

  const setOptionText = (idx, e) => {
    const val = e?.target?.value ?? e
    setForm(prev => {
      const options = [...prev.options]
      options[idx] = { ...options[idx], text: val }
      return { ...prev, options }
    })
  }

  const handleSave = async () => {
    const payload = {
      question: form.question || null,
      options: form.options.map(o => o.text),
      correctOptionIndex: form.correctOptionIndex,
      isSpecial: form.isSpecial,
      order: modal.mode === 'create' ? orderedQuestions.length : undefined,
      questionImageBlobId: form.questionImageBlobId || null,
      optionImageBlobIds: form.options.map(o => o.imageBlobId || null),
    }
    const onSuccess = () => {
      setModal({ open: false, mode: 'create', target: null })
      dispatch(fetchAdminQuestions(challenge.uniqueId))
    }
    if (modal.mode === 'create') {
      await dispatch(createQuestion(challenge.uniqueId, payload, onSuccess))
    } else {
      await dispatch(updateQuestion(challenge.uniqueId, modal.target.uniqueId, payload, onSuccess))
    }
  }

  const handleDelete = async (q) => {
    if (!window.confirm('Hapus soal ini?')) return
    await dispatch(deleteQuestion(challenge.uniqueId, q.uniqueId, () => dispatch(fetchAdminQuestions(challenge.uniqueId))))
  }

  const handlePageChange = (page) => {
    dispatch(actions.setQuestionsPage(page))
    dispatch(fetchAdminQuestions(challenge.uniqueId))
  }

  // ── Excel / CSV import ────────────────────────────────────────────────────

  const downloadTemplate = () => {
    const header = ['Pertanyaan', 'Opsi A', 'Opsi B', 'Opsi C', 'Opsi D', 'Opsi E', 'Jawaban Benar (A-E)', 'Tipe (regular/spesial)']
    const example = ['Apa ibu kota Indonesia?', 'Jakarta', 'Surabaya', 'Bandung', 'Medan', '', 'A', 'regular']
    const csv = [header, example].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template_soal_challenge.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })

    const dataRows = rows.slice(1).filter(row => row.some(c => String(c).trim() !== ''))
    const parsedQuestions = []
    const parseErrors = []

    dataRows.forEach((row, i) => {
      const [q, a, b, c, d, e, correct, type] = row.map(x => String(x ?? '').trim())
      const opts = [a, b, c, d, e].filter(o => o !== '')
      if (opts.length < 2) {
        parseErrors.push(`Baris ${i + 2}: Minimal 2 opsi diperlukan`)
        return
      }
      const ci = OPTION_LABELS.indexOf(correct.toUpperCase())
      if (ci < 0 || ci >= opts.length) {
        parseErrors.push(`Baris ${i + 2}: Jawaban benar '${correct}' tidak valid`)
        return
      }
      parsedQuestions.push({
        question: q || null,
        options: opts,
        correctOptionIndex: ci,
        isSpecial: type.toLowerCase() === 'spesial',
        order: orderedQuestions.length + i,
      })
    })

    if (parseErrors.length > 0 && parsedQuestions.length === 0) {
      setImportResult({ created: 0, failed: parseErrors.length, errors: parseErrors })
      return
    }

    dispatch(actions.setLoading({ key: 'isImporting', value: true }))
    let created = 0
    const importErrors = [...parseErrors]
    try {
      for (let i = 0; i < parsedQuestions.length; i++) {
        try {
          await dispatch(createQuestion(challenge.uniqueId, parsedQuestions[i]))
          created++
        } catch (err) {
          importErrors.push(`Soal ${i + 1}: ${err?.message || 'Gagal disimpan'}`)
        }
      }
    } finally {
      dispatch(actions.setLoading({ key: 'isImporting', value: false }))
    }
    setImportResult({ created, failed: parsedQuestions.length - created + parseErrors.length, errors: importErrors })
    dispatch(fetchAdminQuestions(challenge.uniqueId))
  }

  const isLocked = challenge.status === 'active'

  if (loading.isGetQuestionsLoading) return <Loading />

  return (
    <>
      <SubHeader>
        <SubTitle>Pool Soal ({orderedQuestions.length} soal)</SubTitle>
        {!isLocked && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Button onClick={downloadTemplate} style={{ fontSize: '0.8rem' }}>⬇ Template</Button>
            <Button onClick={() => fileInputRef.current?.click()} disabled={loading.isImporting}>
              {loading.isImporting ? 'Mengimpor...' : '📥 Import Excel/CSV'}
            </Button>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={handleImportFile} />
            <Button variant="primary" onClick={openCreate}>+ Tambah Soal</Button>
          </div>
        )}
      </SubHeader>

      {isLocked && (
        <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 6, padding: '0.625rem 1rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#92400E' }}>
          Challenge sedang <strong>aktif</strong> — soal tidak dapat diubah, ditambah, atau dihapus.
        </div>
      )}

      {importResult && (
        <div style={{ background: importResult.failed > 0 ? '#FEF3C7' : '#D1FAE5', border: `1px solid ${importResult.failed > 0 ? '#FCD34D' : '#6EE7B7'}`, borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
          <strong>Import selesai:</strong> {importResult.created} berhasil, {importResult.failed} gagal.
          {importResult.errors.length > 0 && (
            <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
              {importResult.errors.slice(0, 5).map((err, i) => <li key={i}>{err}</li>)}
              {importResult.errors.length > 5 && <li>...dan {importResult.errors.length - 5} error lainnya</li>}
            </ul>
          )}
          <button onClick={() => setImportResult(null)} style={{ marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem' }}>Tutup</button>
        </div>
      )}

      {orderedQuestions.length === 0 ? (
        <EmptyRow>Belum ada soal. Tambah manual atau import via Excel/CSV.</EmptyRow>
      ) : (
        <DndContext sensors={isLocked ? [] : sensors} collisionDetection={closestCenter} onDragEnd={isLocked ? undefined : handleDragEnd}>
          <SortableContext items={orderedQuestions.map(q => q.uniqueId)} strategy={verticalListSortingStrategy}>
            <Table>
              <thead>
                <tr>
                  {!isLocked && <Th style={{ width: 32 }} />}
                  <Th style={{ width: 40 }}>#</Th>
                  <Th>Pertanyaan</Th>
                  <Th>Tipe</Th>
                  <Th>Opsi</Th>
                  <Th>Benar</Th>
                  {!isLocked && <Th>Aksi</Th>}
                </tr>
              </thead>
              <tbody>
                {orderedQuestions.map((q, i) => (
                  <SortableQuestionRow
                    key={q.uniqueId}
                    q={q}
                    index={i}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    locked={isLocked}
                  />
                ))}
              </tbody>
            </Table>
          </SortableContext>
        </DndContext>
      )}

      {(questionsPagination.page > 1 || !questionsPagination.isLastPage) && (
        <Pagination
          currentPage={questionsPagination.page}
          isLastPage={questionsPagination.isLastPage}
          onPageChange={handlePageChange}
          variant="admin"
          language="id"
        />
      )}

      {modal.open && (
        <Modal
          isOpen={modal.open}
          onClose={() => setModal({ open: false, mode: 'create', target: null })}
          title={modal.mode === 'create' ? 'Tambah Soal' : 'Edit Soal'}
          footer={<Button variant="primary" onClick={handleSave} disabled={loading.isQuestionMutating}>{loading.isQuestionMutating ? 'Menyimpan...' : 'Simpan'}</Button>}
        >
          <FormGrid>
            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>Pertanyaan</Label>
              <Textarea
                value={form.question}
                onChange={v => setForm(prev => ({ ...prev, question: v?.target?.value ?? v }))}
                placeholder="Teks pertanyaan (opsional jika ada gambar)"
                rows={3}
              />
            </FormGroup>

            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>Gambar Soal (opsional)</Label>
              {form.questionImagePreviewUrl && (
                <img src={form.questionImagePreviewUrl} alt="soal" style={{ maxWidth: 220, maxHeight: 160, objectFit: 'contain', marginBottom: '0.5rem', borderRadius: 4, border: '1px solid #E5E7EB', display: 'block' }} />
              )}
              <FileUpload onFileSelect={handleQuestionImageSelect} accept="image/*" />
            </FormGroup>

            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>Tipe Soal</Label>
              <Dropdown
                options={QUESTION_TYPE_OPTIONS}
                value={QUESTION_TYPE_OPTIONS.find(o => o.value === form.isSpecial)}
                onChange={opt => setForm(prev => ({ ...prev, isSpecial: opt.value }))}
              />
            </FormGroup>
          </FormGrid>

          <FormGroup style={{ marginTop: '1rem' }}>
            <Label>Opsi Jawaban *</Label>
            {form.options.map((opt, idx) => (
              <div key={idx} style={{ marginBottom: '0.75rem', padding: '0.75rem', border: `1px solid ${form.correctOptionIndex === idx ? '#6EE7B7' : '#E5E7EB'}`, borderRadius: 6, background: form.correctOptionIndex === idx ? '#F0FDF4' : '#FAFAFA' }}>
                <OptionRow>
                  <OptionLabel $correct={form.correctOptionIndex === idx}>{OPTION_LABELS[idx]}.</OptionLabel>
                  <TextInput
                    value={opt.text}
                    onChange={e => setOptionText(idx, e)}
                    placeholder={`Teks opsi ${OPTION_LABELS[idx]} (opsional jika ada gambar)`}
                  />
                  <CorrectBtn
                    type="button"
                    $active={form.correctOptionIndex === idx}
                    onClick={() => setForm(prev => ({ ...prev, correctOptionIndex: idx }))}
                  >
                    {form.correctOptionIndex === idx ? '✓ Benar' : 'Set Benar'}
                  </CorrectBtn>
                </OptionRow>
                <div style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                  {opt.imagePreviewUrl && (
                    <img src={opt.imagePreviewUrl} alt={`opsi ${OPTION_LABELS[idx]}`} style={{ maxWidth: 160, maxHeight: 100, objectFit: 'contain', marginBottom: '0.375rem', borderRadius: 4, border: '1px solid #E5E7EB', display: 'block' }} />
                  )}
                  <FileUpload onFileSelect={file => handleOptionImageSelect(file, idx)} accept="image/*" />
                </div>
              </div>
            ))}
          </FormGroup>
        </Modal>
      )}
    </>
  )
}

// ── Badge Tab ────────────────────────────────────────────────────────────────
/* BADGES COMMENTED OUT — restore when ready
function BadgeTab({ challenge }) {
  const dispatch = useDispatch()
  const { badges, loading } = useSelector(s => s.challenge)
  const [modal, setModal] = useState({ open: false, mode: 'create', target: null })
  const [form, setForm] = useState(defaultBadgeForm)

  useEffect(() => {
    dispatch(fetchAdminBadges(challenge.uniqueId))
  }, [challenge.uniqueId, dispatch])

  const openCreate = () => { setForm(defaultBadgeForm); setModal({ open: true, mode: 'create', target: null }) }
  const openEdit = (b) => {
    setForm({
      name: b.name, description: b.description || '',
      minRank: b.minRank, maxRank: b.maxRank,
      imageBlobId: null, imagePreviewUrl: b.image?.url || null,
    })
    setModal({ open: true, mode: 'edit', target: b })
  }

  const handleImageSelect = async (file) => {
    const result = await dispatch(upload(file, 'challenge-badges'))
    setForm(prev => ({ ...prev, imageBlobId: result.blobId, imagePreviewUrl: result.url }))
  }

  const handleSave = async () => {
    const payload = {
      name: form.name, description: form.description,
      minRank: parseInt(form.minRank), maxRank: parseInt(form.maxRank),
      imageBlobId: form.imageBlobId,
    }
    const onSuccess = () => {
      setModal({ open: false, mode: 'create', target: null })
      dispatch(fetchAdminBadges(challenge.uniqueId))
    }
    if (modal.mode === 'create') {
      await dispatch(createBadge(challenge.uniqueId, payload, onSuccess))
    } else {
      await dispatch(updateBadge(challenge.uniqueId, modal.target.uniqueId, payload, onSuccess))
    }
  }

  const handleDelete = async (b) => {
    if (!window.confirm(`Hapus badge "${b.name}"?`)) return
    await dispatch(deleteBadge(challenge.uniqueId, b.uniqueId, () => dispatch(fetchAdminBadges(challenge.uniqueId))))
  }

  const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val?.target?.value ?? val?.value ?? val }))

  return (
    <>
      <SubHeader>
        <SubTitle>Daftar Badge</SubTitle>
        <Button variant="primary" onClick={openCreate}>+ Tambah Badge</Button>
      </SubHeader>

      {loading.isGetBadgesLoading ? (
        <Loading />
      ) : badges.length === 0 ? (
        <EmptyRow>Belum ada badge. Klik "+ Tambah Badge" untuk memulai.</EmptyRow>
      ) : (
        <BadgeCardGrid>
          {badges.map(b => (
            <BadgeCard key={b.uniqueId}>
              {b.image?.url
                ? <BadgeCardImage src={b.image.url} alt={b.name} />
                : <BadgeCardPlaceholder>🏅</BadgeCardPlaceholder>}
              <BadgeCardName>{b.name}</BadgeCardName>
              <BadgeCardRank>Rank {b.minRank} – {b.maxRank}</BadgeCardRank>
              {b.description && <BadgeCardDesc>{b.description}</BadgeCardDesc>}
              <BadgeCardActions>
                <Button onClick={() => openEdit(b)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(b)}>Hapus</Button>
              </BadgeCardActions>
            </BadgeCard>
          ))}
        </BadgeCardGrid>
      )}

      {modal.open && (
        <Modal
          isOpen={modal.open}
          onClose={() => setModal({ open: false, mode: 'create', target: null })}
          title={modal.mode === 'create' ? 'Tambah Badge' : 'Edit Badge'}
          footer={<Button variant="primary" onClick={handleSave} disabled={loading.isBadgeMutating}>{loading.isBadgeMutating ? 'Menyimpan...' : 'Simpan'}</Button>}
        >
          <FormGrid>
            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>Nama Badge *</Label>
              <TextInput value={form.name} onChange={set('name')} placeholder="Contoh: Gold Badge" />
            </FormGroup>
            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>Deskripsi</Label>
              <Textarea value={form.description} onChange={set('description')} placeholder="Deskripsi badge..." rows={2} />
            </FormGroup>
            <FormGroup>
              <Label>Rank Minimum *</Label>
              <TextInput type="number" min="1" value={form.minRank} onChange={set('minRank')} />
            </FormGroup>
            <FormGroup>
              <Label>Rank Maksimum *</Label>
              <TextInput type="number" min="1" value={form.maxRank} onChange={set('maxRank')} />
            </FormGroup>
            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>Gambar Badge</Label>
              {form.imagePreviewUrl && (
                <BadgeImagePreview src={form.imagePreviewUrl} alt="preview" style={{ marginBottom: '0.5rem' }} />
              )}
              <FileUpload onFileSelect={handleImageSelect} accept="image/*" />
            </FormGroup>
          </FormGrid>
        </Modal>
      )}
    </>
  )
}

*/
// ── Sesi Tab ─────────────────────────────────────────────────────────────────

const formatTime = (totalSeconds) => {
  if (!totalSeconds && totalSeconds !== 0) return '-'
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function SesiTab({ challenge }) {
  const dispatch = useDispatch()
  const { leaderboard, leaderboardPagination, loading } = useSelector(s => s.challenge)

  useEffect(() => {
    dispatch(fetchAdminLeaderboard(challenge.uniqueId))
  }, [challenge.uniqueId, dispatch])

  const handlePageChange = (page) => {
    dispatch(actions.setLeaderboardPage(page))
    dispatch(fetchAdminLeaderboard(challenge.uniqueId))
  }

  const sesiColumns = [
    { header: 'Rank', key: 'rank', width: '60px' },
    { header: 'Nama', render: (s) => s.user?.name || '-' },
    { header: 'Email', render: (s) => s.user?.email || '-' },
    { header: 'Skor', key: 'score' },
    { header: 'Benar', render: (s) => s.correctCount ?? '-' },
    { header: 'Waktu', render: (s) => formatTime(s.totalTimeSeconds) },
    { header: 'Selesai', render: (s) => s.completedAt ? formatJakartaDateTimeFull(s.completedAt) : '-' },
  ]

  return (
    <>
      <SubHeader>
        <SubTitle>Sesi Pengguna</SubTitle>
      </SubHeader>

      <CommonTable
        columns={sesiColumns}
        data={leaderboard}
        loading={loading.isGetLeaderboardLoading}
        emptyText="Belum ada sesi"
        emptySubtext="Belum ada pengguna yang menyelesaikan challenge ini."
      />

      {(leaderboardPagination.page > 1 || !leaderboardPagination.isLastPage) && (
        <Pagination
          currentPage={leaderboardPagination.page}
          isLastPage={leaderboardPagination.isLastPage}
          onPageChange={handlePageChange}
          variant="admin"
          language="id"
        />
      )}
    </>
  )
}

// ── Detail Page ──────────────────────────────────────────────────────────────

export default function ChallengeDetailPage({ challenge, onBack }) {
  const [activeTab, setActiveTab] = useState('soal')

  return (
    <Container>
      <Header>
        <Button onClick={onBack}>← Kembali</Button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>{challenge.title}</h2>
            <Badge $status={challenge.status}>{challenge.status}</Badge>
            <ScoringBadge $type={challenge.scoringType}>
              {challenge.scoringType === 'speed_accuracy' ? 'Speed + Accuracy' : 'Accuracy'}
            </ScoringBadge>
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#6B7280' }}>
            {challenge.durationMinutes} menit · {challenge.totalQuestions} soal per sesi
            {challenge.maxSpecialPerSession > 0 && ` · maks ${challenge.maxSpecialPerSession} soal spesial`}
          </p>
        </div>
      </Header>

      <TabsContainer>
        <Tab $active={activeTab === 'soal'} onClick={() => setActiveTab('soal')}>Soal</Tab>
        {/* <Tab $active={activeTab === 'badge'} onClick={() => setActiveTab('badge')}>Badge</Tab> */}
        <Tab $active={activeTab === 'sesi'} onClick={() => setActiveTab('sesi')}>Sesi</Tab>
      </TabsContainer>

      {activeTab === 'soal' && <SoalTab challenge={challenge} />}
      {/* {activeTab === 'badge' && <BadgeTab challenge={challenge} />} */}
      {activeTab === 'sesi' && <SesiTab challenge={challenge} />}
    </Container>
  )
}
