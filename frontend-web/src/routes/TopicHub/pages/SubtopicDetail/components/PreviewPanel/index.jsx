import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { startFlashcardNodeSession, submitFlashcardRating } from '@store/flashcardNodes/userAction'
import { startMcqNodeSession, submitMcqAnswer, submitMcqSession } from '@store/mcqNodes'
import { fetchNodePreview } from '@store/featureNodes'
import { fetchSummaryNoteDetailV2 } from '@store/summaryNotes/v2/userAction'
import BlockNoteEditor from '@components/BlockNoteEditor'
import {
  Backdrop, Drawer, DrawerHeader, DrawerTitle, CloseBtn,
  TabBar, TabBtn, PanelContent,
  NoteItem, NoteIcon, NoteInfo, NoteTitle, NoteReadTime, NoteExtLink,
  NoteDetailHeader, NoteBackBtn, OpenFullBtn, NoteDetailTitle, NoteEditorWrap,
  CountLabel, SessionRow, CountInput, StartButton,
  PlayerHeader, PlayerStats, PlayerCounter, PlayerBackBtn,
  PlayerProgress, PlayerFill,
  PlayerFlipArea, PlayerFlipCard, PlayerFront, PlayerBack,
  PlayerCardLabel, PlayerCardText, PlayerFlipHint,
  PlayerActionRow, PlayerRatingBtn,
  PlayerDoneWrap, PlayerDoneText,
  McqQuestion, McqText, McqOptions, McqOption, McqOptionLabel, McqOptionText,
  McqExplanation, McqActionRow, McqNextBtn,
  McqResult, McqScore, McqScoreLabel, McqResultStats, McqResultStat,
  McqResultNum, McqResultLabel, McqResultActions, McqSecondaryBtn,
} from './PreviewPanel.styles'

const RATINGS = [
  { key: 'again', label: 'Lagi',  color: '#ef4444' },
  { key: 'hard',  label: 'Sulit', color: '#f97316' },
  { key: 'good',  label: 'Baik',  color: '#3b82f6' },
  { key: 'easy',  label: 'Mudah', color: '#22c55e' },
]
const MAX_LAGI = 2
const MCQ_LABELS = ['A', 'B', 'C', 'D', 'E']

const TABS = [
  { key: 'flashcard',     statKey: 'flashcardCards', unit: 'kartu' },
  { key: 'mcq',          statKey: 'mcqQuestions',   unit: 'soal' },
  { key: 'summary_notes', statKey: 'summaryNotes',   unit: 'catatan' },
]

export default function PreviewPanel({ open, onClose, activeTab, onTabChange, subtopic, stats, features }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { sessionCards, loading: fcLoading } = useSelector(s => s.flashcardNodes)
  const { sessionQuestions, loading: mcqLoading } = useSelector(s => s.mcqNodes)

  // summary notes state
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [noteDetail, setNoteDetail] = useState(null)
  const [noteDetailLoading, setNoteDetailLoading] = useState(false)

  // session count inputs
  const [counts, setCounts] = useState({ flashcard: 20, mcq: 20 })

  // flashcard player state
  const [fcPlaying, setFcPlaying] = useState(false)
  const [queue, setQueue] = useState([])
  const [cardIndex, setCardIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [retryCounts, setRetryCounts] = useState({})
  const [fcDone, setFcDone] = useState(false)

  // mcq player state
  const [mcqPlaying, setMcqPlaying] = useState(false)
  const [mcqQuestions, setMcqQuestions] = useState([])
  const [mcqIndex, setMcqIndex] = useState(0)
  const [mcqSelected, setMcqSelected] = useState(null)
  const [mcqAnswers, setMcqAnswers] = useState([])
  const [mcqFinished, setMcqFinished] = useState(false)

  // reset everything when tab changes or panel closes
  useEffect(() => {
    setFcPlaying(false); setFcDone(false)
    setMcqPlaying(false); setMcqFinished(false)
    setSelectedNote(null); setNoteDetail(null)
  }, [activeTab, open])

  // seed flashcard queue from Redux when session starts
  useEffect(() => {
    if (fcPlaying) {
      setQueue([...sessionCards])
      setCardIndex(0); setRevealed(false); setRetryCounts({}); setFcDone(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fcPlaying])

  // seed mcq questions from Redux when session starts
  useEffect(() => {
    if (mcqPlaying) {
      setMcqQuestions([...sessionQuestions])
      setMcqIndex(0); setMcqSelected(null); setMcqAnswers([]); setMcqFinished(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mcqPlaying])

  // fetch summary notes list
  useEffect(() => {
    if (!open || !subtopic?.id || activeTab !== 'summary_notes') return
    setNotes([])
    dispatch(fetchNodePreview(subtopic.id, 'summary_note')).then(data => setNotes(data || []))
  }, [open, activeTab, subtopic?.id, dispatch])

  const handleReveal = useCallback(() => setRevealed(true), [])

  const parsedContent = useMemo(() => {
    if (!noteDetail?.content) return null
    try { return typeof noteDetail.content === 'string' ? JSON.parse(noteDetail.content) : noteDetail.content }
    catch { return null }
  }, [noteDetail?.content])

  // — all hooks above this line —

  if (!open) return null

  const flashcardMax = stats?.flashcardCards ?? 0
  const mcqMax = stats?.mcqQuestions ?? 0

  // note handlers
  const handleNoteClick = async (note) => {
    setSelectedNote(note)
    setNoteDetail(null)
    setNoteDetailLoading(true)
    const detail = await dispatch(fetchSummaryNoteDetailV2(note.uniqueId))
    setNoteDetail(detail)
    setNoteDetailLoading(false)
  }

  // flashcard handlers
  const handleStartFlashcard = () => {
    const n = Math.min(Math.max(1, counts.flashcard), flashcardMax)
    dispatch(startFlashcardNodeSession(subtopic.id, n, () => setFcPlaying(true)))
  }

  const handleRate = (ratingKey) => {
    const card = queue[cardIndex]
    dispatch(submitFlashcardRating(card.id, ratingKey))
    const retryCount = retryCounts[card.id] || 0
    let newQueue = queue
    if (ratingKey === 'again' && retryCount < MAX_LAGI) {
      newQueue = [...queue, card]
      setQueue(newQueue)
      setRetryCounts(prev => ({ ...prev, [card.id]: retryCount + 1 }))
    }
    const next = cardIndex + 1
    if (next >= newQueue.length) setFcDone(true)
    else { setCardIndex(next); setRevealed(false) }
  }

  // mcq handlers
  const handleStartMcq = () => {
    const n = Math.min(Math.max(1, counts.mcq), mcqMax)
    dispatch(startMcqNodeSession(subtopic.id, n)).then(() => setMcqPlaying(true))
  }

  const handleMcqSelect = (optIdx) => {
    if (mcqSelected !== null) return
    const q = mcqQuestions[mcqIndex]
    const isCorrect = optIdx === q.correctIndex
    setMcqSelected(optIdx)
    setMcqAnswers(prev => [...prev, { questionId: q.id, nodeId: q.nodeId, selectedIndex: optIdx, isCorrect }])
    dispatch(submitMcqAnswer(q.id, isCorrect))
  }

  const handleMcqNext = () => {
    if (mcqIndex === mcqQuestions.length - 1) setMcqFinished(true)
    else { setMcqIndex(i => i + 1); setMcqSelected(null) }
  }

  const handleMcqSubmit = () => {
    const nodeMap = new Map()
    for (const a of mcqAnswers) {
      const key = a.nodeId ?? 0
      if (!nodeMap.has(key)) nodeMap.set(key, { nodeId: key, correct: 0, total: 0 })
      const entry = nodeMap.get(key)
      entry.total++
      if (a.isCorrect) entry.correct++
    }
    const nodeResults = [...nodeMap.values()].filter(r => r.nodeId).map(r => ({ nodeId: r.nodeId, correct: r.correct, total: r.total }))
    if (nodeResults.length > 0) dispatch(submitMcqSession(nodeResults, () => setMcqPlaying(false)))
    else setMcqPlaying(false)
  }

  const visibleTabs = TABS.filter(t => (stats?.[t.statKey] ?? 0) > 0)
  const fcCard = queue[cardIndex]
  const fcRetryCount = fcCard ? (retryCounts[fcCard.id] || 0) : 0
  const mcqQ = mcqQuestions[mcqIndex]
  const mcqIsAnswered = mcqSelected !== null
  const mcqIsLast = mcqIndex === mcqQuestions.length - 1
  const totalCorrect = mcqAnswers.filter(a => a.isCorrect).length

  return (
    <>
      <Backdrop onClick={onClose} />
      <Drawer>
        <DrawerHeader>
          <DrawerTitle>{subtopic?.name} · Sumber Belajar</DrawerTitle>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </DrawerHeader>

        <TabBar>
          {visibleTabs.map(({ key }) => {
            const feat = features.find(f => f.sessionType === key)
            return (
              <TabBtn key={key} $active={activeTab === key} onClick={() => onTabChange(key)}>
                {feat?.icon} {feat?.name ?? key}
              </TabBtn>
            )
          })}
        </TabBar>

        <PanelContent>
          {/* ── Summary notes list ── */}
          {activeTab === 'summary_notes' && !selectedNote && (
            notes.length === 0
              ? <CountLabel>Tidak ada catatan tersedia.</CountLabel>
              : notes.map(note => (
                <NoteItem key={note.id} onClick={() => handleNoteClick(note)}>
                  <NoteIcon>📖</NoteIcon>
                  <NoteInfo>
                    <NoteTitle>{note.title}</NoteTitle>
                    <NoteReadTime>{note.readingMinutes} menit baca</NoteReadTime>
                  </NoteInfo>
                  <NoteExtLink>↗</NoteExtLink>
                </NoteItem>
              ))
          )}

          {/* ── Summary note detail ── */}
          {activeTab === 'summary_notes' && selectedNote && (
            <>
              <NoteDetailHeader>
                <NoteBackBtn onClick={() => { setSelectedNote(null); setNoteDetail(null) }}>
                  ← Kembali
                </NoteBackBtn>
                <OpenFullBtn href={`/summary-notes/${selectedNote.uniqueId}`} target="_blank" rel="noopener noreferrer">
                  Buka Penuh ↗
                </OpenFullBtn>
              </NoteDetailHeader>
              {noteDetailLoading ? (
                <CountLabel style={{ marginTop: '1rem' }}>Memuat...</CountLabel>
              ) : noteDetail ? (
                <>
                  <NoteDetailTitle>{noteDetail.title}</NoteDetailTitle>
                  <NoteEditorWrap>
                    {parsedContent && (
                      <BlockNoteEditor initialContent={parsedContent} editable={false} />
                    )}
                  </NoteEditorWrap>
                </>
              ) : null}
            </>
          )}

          {/* ── Flashcard setup ── */}
          {activeTab === 'flashcard' && !fcPlaying && (
            <>
              <CountLabel>{flashcardMax} kartu tersedia</CountLabel>
              <SessionRow>
                <CountInput
                  type="number" min={1} max={flashcardMax} value={counts.flashcard}
                  onChange={e => setCounts(prev => ({ ...prev, flashcard: parseInt(e.target.value) || 1 }))}
                />
                <StartButton onClick={handleStartFlashcard} disabled={fcLoading.isStartingSession || flashcardMax === 0}>
                  {fcLoading.isStartingSession ? 'Memulai...' : 'Mulai Sesi'}
                </StartButton>
              </SessionRow>
            </>
          )}

          {/* ── Flashcard done ── */}
          {activeTab === 'flashcard' && fcPlaying && fcDone && (
            <PlayerDoneWrap>
              <PlayerDoneText>Sesi selesai! Semua kartu telah dikerjakan.</PlayerDoneText>
              <StartButton onClick={() => { setFcPlaying(false); setFcDone(false) }}>Sesi Baru</StartButton>
            </PlayerDoneWrap>
          )}

          {/* ── Flashcard player ── */}
          {activeTab === 'flashcard' && fcPlaying && !fcDone && (
            <>
              <PlayerHeader>
                <PlayerStats><PlayerCounter>Kartu <b>{cardIndex + 1}</b> dari {queue.length}</PlayerCounter></PlayerStats>
                <PlayerBackBtn onClick={() => { setFcPlaying(false); setFcDone(false) }}>✕</PlayerBackBtn>
              </PlayerHeader>
              <PlayerProgress><PlayerFill $progress={(cardIndex / queue.length) * 100} /></PlayerProgress>
              <PlayerFlipArea $clickable={!revealed} onClick={!revealed ? handleReveal : undefined}>
                <PlayerFlipCard $flipped={revealed}>
                  <PlayerFront>
                    <PlayerCardLabel>Pertanyaan</PlayerCardLabel>
                    <PlayerCardText>{fcCard?.front}</PlayerCardText>
                    {!revealed && <PlayerFlipHint>Klik untuk flip</PlayerFlipHint>}
                  </PlayerFront>
                  <PlayerBack>
                    <PlayerCardLabel>Jawaban</PlayerCardLabel>
                    <PlayerCardText>{fcCard?.back}</PlayerCardText>
                  </PlayerBack>
                </PlayerFlipCard>
              </PlayerFlipArea>
              {revealed && (
                <PlayerActionRow>
                  {RATINGS.map(r => (
                    <PlayerRatingBtn key={r.key} $color={r.color} onClick={() => handleRate(r.key)} disabled={r.key === 'again' && fcRetryCount >= MAX_LAGI}>
                      {r.label}
                    </PlayerRatingBtn>
                  ))}
                </PlayerActionRow>
              )}
            </>
          )}

          {/* ── MCQ setup ── */}
          {activeTab === 'mcq' && !mcqPlaying && (
            <>
              <CountLabel>{mcqMax} soal tersedia</CountLabel>
              <SessionRow>
                <CountInput
                  type="number" min={1} max={mcqMax} value={counts.mcq}
                  onChange={e => setCounts(prev => ({ ...prev, mcq: parseInt(e.target.value) || 1 }))}
                />
                <StartButton onClick={handleStartMcq} disabled={mcqLoading.isStartingSession || mcqMax === 0}>
                  {mcqLoading.isStartingSession ? 'Memulai...' : 'Mulai Sesi'}
                </StartButton>
              </SessionRow>
            </>
          )}

          {/* ── MCQ result ── */}
          {activeTab === 'mcq' && mcqPlaying && mcqFinished && (
            <McqResult>
              <McqScore>{mcqAnswers.length > 0 ? Math.round((totalCorrect / mcqAnswers.length) * 100) : 0}%</McqScore>
              <McqScoreLabel>Skor Sesi</McqScoreLabel>
              <McqResultStats>
                <McqResultStat><McqResultNum>{totalCorrect}</McqResultNum><McqResultLabel>Benar</McqResultLabel></McqResultStat>
                <McqResultStat><McqResultNum>{mcqAnswers.length - totalCorrect}</McqResultNum><McqResultLabel>Salah</McqResultLabel></McqResultStat>
                <McqResultStat><McqResultNum>{mcqAnswers.length}</McqResultNum><McqResultLabel>Total</McqResultLabel></McqResultStat>
              </McqResultStats>
              <McqResultActions>
                <McqSecondaryBtn onClick={() => setMcqPlaying(false)} disabled={mcqLoading.isSubmittingSession}>Kembali</McqSecondaryBtn>
                <McqNextBtn onClick={handleMcqSubmit} disabled={mcqLoading.isSubmittingSession}>
                  {mcqLoading.isSubmittingSession ? 'Menyimpan...' : 'Simpan & Selesai'}
                </McqNextBtn>
              </McqResultActions>
            </McqResult>
          )}

          {/* ── MCQ player ── */}
          {activeTab === 'mcq' && mcqPlaying && !mcqFinished && mcqQ && (
            <>
              <PlayerHeader>
                <PlayerStats><PlayerCounter>Soal <b>{mcqIndex + 1}</b> dari {mcqQuestions.length}</PlayerCounter></PlayerStats>
                <PlayerBackBtn onClick={() => setMcqPlaying(false)}>✕</PlayerBackBtn>
              </PlayerHeader>
              <PlayerProgress>
                <PlayerFill $progress={((mcqIndex + (mcqIsAnswered ? 1 : 0)) / mcqQuestions.length) * 100} />
              </PlayerProgress>
              <McqQuestion>
                <McqText>{mcqQ.question}</McqText>
                <McqOptions>
                  {mcqQ.options.map((opt, i) => (
                    <McqOption key={i} $answered={mcqIsAnswered} $selected={mcqIsAnswered && mcqSelected === i} $correct={mcqIsAnswered && i === mcqQ.correctIndex} onClick={() => handleMcqSelect(i)}>
                      <McqOptionLabel $answered={mcqIsAnswered} $selected={mcqIsAnswered && mcqSelected === i} $correct={mcqIsAnswered && i === mcqQ.correctIndex}>{MCQ_LABELS[i]}</McqOptionLabel>
                      <McqOptionText>{opt}</McqOptionText>
                    </McqOption>
                  ))}
                </McqOptions>
                {mcqIsAnswered && mcqQ.explanation && (
                  <McqExplanation><strong>Penjelasan:</strong> {mcqQ.explanation}</McqExplanation>
                )}
              </McqQuestion>
              {mcqIsAnswered && (
                <McqActionRow>
                  <McqNextBtn onClick={handleMcqNext}>{mcqIsLast ? 'Lihat Hasil →' : 'Lanjut →'}</McqNextBtn>
                </McqActionRow>
              )}
            </>
          )}
        </PanelContent>
      </Drawer>
    </>
  )
}
