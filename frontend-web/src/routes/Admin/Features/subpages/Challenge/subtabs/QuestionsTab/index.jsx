import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/challenge/reducer'
import {
  fetchAdminChallenges, fetchAdminQuestions,
  createQuestion, updateQuestion, deleteQuestion
} from '@store/challenge/adminAction'
import Button from '@components/common/Button'
import Modal from '@components/common/Modal'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Dropdown from '@components/common/Dropdown'
import Loading from '@components/common/Loading'
import Pagination from '@components/Pagination'
import {
  SubHeader, SubTitle, Table, Th, Td, Tr, ActionCell,
  EmptyRow, FormGroup, Label, OptionRow, OptionLabel, CorrectBtn
} from '../../Challenge.styles'

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E']

const defaultForm = {
  question: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '', order: 0,
}

export default function QuestionsTab() {
  const dispatch = useDispatch()
  const { challenges, questions, questionsPagination, loading } = useSelector(state => state.challenge)
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [modal, setModal] = useState({ open: false, mode: 'create', target: null })
  const [form, setForm] = useState(defaultForm)

  useEffect(() => { dispatch(fetchAdminChallenges()) }, [dispatch])

  useEffect(() => {
    if (selectedChallenge) dispatch(fetchAdminQuestions(selectedChallenge.value))
  }, [selectedChallenge, dispatch])

  const challengeOptions = challenges.map(c => ({ label: c.title, value: c.uniqueId }))

  const openCreate = () => { setForm(defaultForm); setModal({ open: true, mode: 'create', target: null }) }
  const openEdit = (q) => {
    setForm({
      question: q.question,
      options: [...q.options],
      correctOptionIndex: q.correctOptionIndex,
      explanation: q.explanation || '',
      order: q.order,
    })
    setModal({ open: true, mode: 'edit', target: q })
  }

  const handleSave = async () => {
    const payload = { ...form, options: form.options.filter(o => o.trim()), correctOptionIndex: form.correctOptionIndex }
    const onSuccess = () => {
      setModal({ open: false, mode: 'create', target: null })
      dispatch(fetchAdminQuestions(selectedChallenge.value))
    }
    if (modal.mode === 'create') {
      await dispatch(createQuestion(selectedChallenge.value, payload, onSuccess))
    } else {
      await dispatch(updateQuestion(selectedChallenge.value, modal.target.uniqueId, payload, onSuccess))
    }
  }

  const handleDelete = async (q) => {
    if (!window.confirm('Hapus soal ini?')) return
    await dispatch(deleteQuestion(selectedChallenge.value, q.uniqueId, () => dispatch(fetchAdminQuestions(selectedChallenge.value))))
  }

  const setOption = (idx, val) => {
    setForm(prev => {
      const opts = [...prev.options]
      opts[idx] = val
      return { ...prev, options: opts }
    })
  }

  const handlePageChange = (page) => {
    dispatch(actions.setQuestionsPage(page))
    dispatch(fetchAdminQuestions(selectedChallenge.value))
  }

  return (
    <>
      <SubHeader>
        <SubTitle>Kelola Soal</SubTitle>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ minWidth: 280 }}>
            <Dropdown
              options={challengeOptions}
              value={selectedChallenge}
              onChange={setSelectedChallenge}
              placeholder="Pilih challenge..."
            />
          </div>
          {selectedChallenge && (
            <Button variant="primary" onClick={openCreate}>+ Tambah Soal</Button>
          )}
        </div>
      </SubHeader>

      {!selectedChallenge && (
        <EmptyRow>Pilih challenge untuk melihat dan mengelola soal.</EmptyRow>
      )}

      {selectedChallenge && loading.isGetQuestionsLoading && <Loading />}

      {selectedChallenge && !loading.isGetQuestionsLoading && questions.length === 0 && (
        <EmptyRow>Belum ada soal. Klik "+ Tambah Soal" untuk memulai.</EmptyRow>
      )}

      {selectedChallenge && !loading.isGetQuestionsLoading && questions.length > 0 && (
        <Table>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Pertanyaan</Th>
              <Th>Opsi</Th>
              <Th>Jawaban Benar</Th>
              <Th>Aksi</Th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, i) => (
              <Tr key={q.uniqueId}>
                <Td>{(questionsPagination.page - 1) * questionsPagination.perPage + i + 1}</Td>
                <Td style={{ maxWidth: 300 }}>{q.question}</Td>
                <Td>{q.options?.length} opsi</Td>
                <Td>{OPTION_LABELS[q.correctOptionIndex] || q.correctOptionIndex}</Td>
                <Td>
                  <ActionCell>
                    <Button onClick={() => openEdit(q)}>Edit</Button>
                    <Button variant="danger" onClick={() => handleDelete(q)}>Hapus</Button>
                  </ActionCell>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      {selectedChallenge && (questionsPagination.page > 1 || !questionsPagination.isLastPage) && (
        <Pagination currentPage={questionsPagination.page} isLastPage={questionsPagination.isLastPage} onPageChange={handlePageChange} variant="admin" language="id" />
      )}

      {modal.open && (
        <Modal
          isOpen={modal.open}
          onClose={() => setModal({ open: false, mode: 'create', target: null })}
          title={modal.mode === 'create' ? 'Tambah Soal' : 'Edit Soal'}
          onConfirm={handleSave}
          confirmText={loading.isQuestionMutating ? 'Menyimpan...' : 'Simpan'}
        >
          <FormGroup>
            <Label>Pertanyaan *</Label>
            <Textarea value={form.question} onChange={v => setForm(prev => ({ ...prev, question: v }))} placeholder="Tulis pertanyaan..." rows={3} />
          </FormGroup>

          <FormGroup style={{ marginTop: '1rem' }}>
            <Label>Opsi Jawaban *</Label>
            {form.options.map((opt, idx) => (
              <OptionRow key={idx}>
                <OptionLabel $correct={form.correctOptionIndex === idx}>{OPTION_LABELS[idx]}.</OptionLabel>
                <TextInput
                  value={opt}
                  onChange={v => setOption(idx, v)}
                  placeholder={`Opsi ${OPTION_LABELS[idx]}`}
                />
                <CorrectBtn
                  type="button"
                  $active={form.correctOptionIndex === idx}
                  onClick={() => setForm(prev => ({ ...prev, correctOptionIndex: idx }))}
                >
                  {form.correctOptionIndex === idx ? 'Benar' : 'Set Benar'}
                </CorrectBtn>
              </OptionRow>
            ))}
          </FormGroup>

          <FormGroup style={{ marginTop: '1rem' }}>
            <Label>Penjelasan (opsional)</Label>
            <Textarea value={form.explanation} onChange={v => setForm(prev => ({ ...prev, explanation: v }))} placeholder="Penjelasan jawaban..." rows={2} />
          </FormGroup>

          <FormGroup style={{ marginTop: '1rem' }}>
            <Label>Urutan</Label>
            <TextInput type="number" min="0" value={form.order} onChange={v => setForm(prev => ({ ...prev, order: v }))} />
          </FormGroup>
        </Modal>
      )}
    </>
  )
}
