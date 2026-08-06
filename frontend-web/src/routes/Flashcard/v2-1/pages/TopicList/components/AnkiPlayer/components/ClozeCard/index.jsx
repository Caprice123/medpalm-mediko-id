import { useClozeCard } from './hooks/useClozeCard'
import { Wrapper, Eyebrow, TextBlock, Blank, CorrectAnswer, Divider, UserAnswer, BlankInput, RevealButton } from './ClozeCard.styles'

const normalize = (value) => (value || '').trim().toLowerCase()

export default function ClozeCard({ text, answers, onFullyRevealed }) {
  const { parts, revealed, userAnswers, setUserAnswer, reveal } = useClozeCard({ text, onFullyRevealed })

  return (
    <Wrapper>
      {!revealed && <Eyebrow>Lengkapi kalimat berikut</Eyebrow>}
      <TextBlock>
        {parts.map((part, i) => {
          if (part.type === 'text') return <span key={i}>{part.value}</span>

          if (!revealed) {
            return (
              <BlankInput
                key={i}
                value={userAnswers[part.number] || ''}
                onChange={e => setUserAnswer(part.number, e.target.value)}
                onKeyDown={e => e.key === 'Enter' && reveal()}
                placeholder="..."
                autoComplete="off"
              />
            )
          }

          const correctAnswer = answers[part.number - 1] || ''
          const userAnswer = userAnswers[part.number] || ''
          const isCorrect = normalize(userAnswer) === normalize(correctAnswer)

          return (
            <Blank key={i} $correct={isCorrect}>
              {isCorrect
                ? <CorrectAnswer $correct>{userAnswer}</CorrectAnswer>
                : (
                  <>
                    <CorrectAnswer $correct={false}>{correctAnswer}</CorrectAnswer>
                    <Divider />
                    <UserAnswer $correct={false}>{userAnswer || 'Tidak dijawab'}</UserAnswer>
                  </>
                )}
            </Blank>
          )
        })}
      </TextBlock>

      {!revealed && <RevealButton onClick={reveal}>Tampilkan Jawaban</RevealButton>}
    </Wrapper>
  )
}
