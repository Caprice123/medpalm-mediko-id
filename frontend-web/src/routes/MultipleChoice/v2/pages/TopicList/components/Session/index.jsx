import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { submitMcqSession, submitMcqAnswer } from '@store/mcqNodes'
import {
  Wrapper, SessionContainer, SessionHeader, SessionTitle, CloseBtn,
  StatsRow, QuestionCounter, AnsweredCount,
  ProgressBar, ProgressFill,
  QuestionCard, QuestionMeta, NodePath, NewBadge, QuestionImage, QuestionText,
  OptionsList, OptionButton, OptionLabel, OptionText,
  ExplanationBox, ActionRow, NextButton,
  ResultCard, ResultScore, ResultLabel, ResultStats,
  ResultStat, ResultStatNum, ResultStatLabel,
  ResultActions, SecondaryButton,
} from './Session.styles'

const LABELS = ['A', 'B', 'C', 'D', 'E']

export default function McqSession({ onClose }) {
  const dispatch = useDispatch()
  const { sessionQuestions, loading } = useSelector(s => s.mcqNodes)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)

  const question = sessionQuestions[currentIndex]
  const isAnswered = selectedOption !== null
  const isLast = currentIndex === sessionQuestions.length - 1
  const pct = Math.round(((currentIndex + (isAnswered ? 1 : 0)) / sessionQuestions.length) * 100)

  const handleSelect = (optIdx) => {
    if (isAnswered) return
    const isCorrect = optIdx === question.correctIndex
    setSelectedOption(optIdx)
    setAnswers(prev => [...prev, {
      questionId: question.id,
      nodeId: question.nodeId,
      selectedIndex: optIdx,
      isCorrect,
    }])
    dispatch(submitMcqAnswer(question.id, isCorrect))
  }

  const handleNext = () => {
    if (isLast) {
      setFinished(true)
    } else {
      setCurrentIndex(i => i + 1)
      setSelectedOption(null)
    }
  }

  const handleFinish = () => {
    const nodeMap = new Map()
    for (const a of answers) {
      const key = a.nodeId ?? 0
      if (!nodeMap.has(key)) nodeMap.set(key, { nodeId: key, correct: 0, total: 0 })
      const entry = nodeMap.get(key)
      entry.total++
      if (a.isCorrect) entry.correct++
    }
    const nodeResults = [...nodeMap.values()]
      .filter(r => r.nodeId)
      .map(r => ({ nodeId: r.nodeId, correct: r.correct, total: r.total }))
    if (nodeResults.length > 0) {
      dispatch(submitMcqSession(nodeResults, () => onClose(true)))
    } else {
      onClose(true)
    }
  }

  if (finished) {
    const totalCorrect = answers.filter(a => a.isCorrect).length
    const totalAnswered = answers.length
    const pctScore = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0
    return (
      <Wrapper>
        <SessionContainer>
          <SessionHeader>
            <SessionTitle>Hasil Sesi</SessionTitle>
          </SessionHeader>
          <ResultCard>
            <ResultScore>{pctScore}%</ResultScore>
            <ResultLabel>Skor Sesi</ResultLabel>
            <ResultStats>
              <ResultStat>
                <ResultStatNum>{totalCorrect}</ResultStatNum>
                <ResultStatLabel>Benar</ResultStatLabel>
              </ResultStat>
              <ResultStat>
                <ResultStatNum>{totalAnswered - totalCorrect}</ResultStatNum>
                <ResultStatLabel>Salah</ResultStatLabel>
              </ResultStat>
              <ResultStat>
                <ResultStatNum>{totalAnswered}</ResultStatNum>
                <ResultStatLabel>Total</ResultStatLabel>
              </ResultStat>
            </ResultStats>
            <ResultActions>
              <SecondaryButton onClick={() => onClose(true)} disabled={loading.isSubmittingSession}>
                Kembali
              </SecondaryButton>
              <NextButton onClick={handleFinish} disabled={loading.isSubmittingSession}>
                {loading.isSubmittingSession ? 'Menyimpan...' : 'Simpan & Selesai'}
              </NextButton>
            </ResultActions>
          </ResultCard>
        </SessionContainer>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <SessionContainer>
        <SessionHeader>
          <SessionTitle>Sesi Soal</SessionTitle>
          <CloseBtn onClick={() => onClose(false)} title="Keluar">✕</CloseBtn>
        </SessionHeader>

        <StatsRow>
          <QuestionCounter>Soal <b>{currentIndex + 1}</b> dari {sessionQuestions.length}</QuestionCounter>
          <AnsweredCount>{answers.length} dijawab sesi ini</AnsweredCount>
        </StatsRow>

        <ProgressBar>
          <ProgressFill $pct={pct} />
        </ProgressBar>

        <QuestionCard>
          {(question.topic || question.subtopic || question.isNew) && (
            <QuestionMeta>
              <NodePath>
                {question.topic}
                {question.topic && question.subtopic && ' › '}
                {question.subtopic}
              </NodePath>
              {question.isNew && <NewBadge>Baru</NewBadge>}
            </QuestionMeta>
          )}
          {question.imageUrl && <QuestionImage src={question.imageUrl} alt="" />}
          <QuestionText>{question.question}</QuestionText>
          <OptionsList>
            {question.options.map((opt, i) => (
              <OptionButton
                key={i}
                $answered={isAnswered}
                $selected={isAnswered && selectedOption === i}
                $correct={isAnswered && i === question.correctIndex}
                onClick={() => handleSelect(i)}
              >
                <OptionLabel
                  $answered={isAnswered}
                  $selected={isAnswered && selectedOption === i}
                  $correct={isAnswered && i === question.correctIndex}
                >
                  {LABELS[i]}
                </OptionLabel>
                <OptionText>{opt}</OptionText>
              </OptionButton>
            ))}
          </OptionsList>

          {isAnswered && question.explanation && (
            <ExplanationBox>
              <strong>Penjelasan:</strong> {question.explanation}
            </ExplanationBox>
          )}
        </QuestionCard>

        {isAnswered && (
          <ActionRow>
            <NextButton onClick={handleNext}>
              {isLast ? 'Lihat Hasil →' : 'Lanjut →'}
            </NextButton>
          </ActionRow>
        )}
      </SessionContainer>
    </Wrapper>
  )
}
