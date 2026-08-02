import {
  CountLabel, SessionRow, CountInput, StartButton,
  PlayerHeader, PlayerStats, PlayerCounter, PlayerBackBtn, PlayerProgress, PlayerFill,
} from '../../PreviewPanel.styles'
import {
  McqQuestion, McqText, McqOptions, McqOption, McqOptionLabel, McqOptionText,
  McqExplanation, McqActionRow, McqNextBtn,
  McqResult, McqScore, McqScoreLabel, McqResultStats, McqResultStat,
  McqResultNum, McqResultLabel, McqResultActions, McqSecondaryBtn,
} from './McqTab.styles'
import { useMcqTab } from './hooks/useMcqTab'

const MCQ_LABELS = ['A', 'B', 'C', 'D', 'E']

export default function McqTab({ subtopic, mcqMax }) {
  const {
    count, setCount,
    playing, questions, index, selected, answers, finished,
    question, isAnswered, isLast, totalCorrect,
    isStarting, isSubmitting,
    handleStart, handleSelect, handleNext, handleSubmit, handleExit,
  } = useMcqTab(subtopic, mcqMax)

  if (!playing) {
    return (
      <>
        <CountLabel>{mcqMax} soal tersedia</CountLabel>
        <SessionRow>
          <CountInput
            type="number" min={1} max={mcqMax} value={count}
            onChange={e => setCount(parseInt(e.target.value) || 1)}
          />
          <StartButton onClick={handleStart} disabled={isStarting || mcqMax === 0}>
            {isStarting ? 'Memulai...' : 'Mulai Sesi'}
          </StartButton>
        </SessionRow>
      </>
    )
  }

  if (finished) {
    return (
      <McqResult>
        <McqScore>{answers.length > 0 ? Math.round((totalCorrect / answers.length) * 100) : 0}%</McqScore>
        <McqScoreLabel>Skor Sesi</McqScoreLabel>
        <McqResultStats>
          <McqResultStat><McqResultNum>{totalCorrect}</McqResultNum><McqResultLabel>Benar</McqResultLabel></McqResultStat>
          <McqResultStat><McqResultNum>{answers.length - totalCorrect}</McqResultNum><McqResultLabel>Salah</McqResultLabel></McqResultStat>
          <McqResultStat><McqResultNum>{answers.length}</McqResultNum><McqResultLabel>Total</McqResultLabel></McqResultStat>
        </McqResultStats>
        <McqResultActions>
          <McqSecondaryBtn onClick={handleExit} disabled={isSubmitting}>Kembali</McqSecondaryBtn>
          <McqNextBtn onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan & Selesai'}
          </McqNextBtn>
        </McqResultActions>
      </McqResult>
    )
  }

  if (!question) return null

  return (
    <>
      <PlayerHeader>
        <PlayerStats><PlayerCounter>Soal <b>{index + 1}</b> dari {questions.length}</PlayerCounter></PlayerStats>
        <PlayerBackBtn onClick={handleExit}>✕</PlayerBackBtn>
      </PlayerHeader>
      <PlayerProgress>
        <PlayerFill $progress={((index + (isAnswered ? 1 : 0)) / questions.length) * 100} />
      </PlayerProgress>
      <McqQuestion>
        <McqText>{question.question}</McqText>
        <McqOptions>
          {question.options.map((opt, i) => (
            <McqOption
              key={i}
              $answered={isAnswered}
              $selected={isAnswered && selected === i}
              $correct={isAnswered && i === question.correctIndex}
              onClick={() => handleSelect(i)}
            >
              <McqOptionLabel
                $answered={isAnswered}
                $selected={isAnswered && selected === i}
                $correct={isAnswered && i === question.correctIndex}
              >
                {MCQ_LABELS[i]}
              </McqOptionLabel>
              <McqOptionText>{opt}</McqOptionText>
            </McqOption>
          ))}
        </McqOptions>
        {isAnswered && question.explanation && (
          <McqExplanation><strong>Penjelasan:</strong> {question.explanation}</McqExplanation>
        )}
      </McqQuestion>
      {isAnswered && (
        <McqActionRow>
          <McqNextBtn onClick={handleNext}>{isLast ? 'Lihat Hasil →' : 'Lanjut →'}</McqNextBtn>
        </McqActionRow>
      )}
    </>
  )
}
