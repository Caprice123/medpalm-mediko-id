import { useClozeCard } from './hooks/useClozeCard'
import { Wrapper, TextBlockContainer, TextBlock, Blank, UserAnswerTag, AnswerBox, BlankInput, RevealButton } from './ClozeCard.styles'

const normalize = (value) => (value || '').trim().toLowerCase()

export default function ClozeCard({ text, answers, onFullyRevealed }) {
  const { parts, revealed, userAnswers, setUserAnswer, reveal } = useClozeCard({ text, onFullyRevealed })

  return (
    <Wrapper>
      <TextBlockContainer>
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
            const isWrong = userAnswer && normalize(userAnswer) !== normalize(correctAnswer)

            return (
              <Blank key={i}>
                {isWrong && <UserAnswerTag>{userAnswer}</UserAnswerTag>}
                <AnswerBox>{correctAnswer}</AnswerBox>
              </Blank>
            )
          })}
        </TextBlock>
      </TextBlockContainer>

      {!revealed && <RevealButton onClick={reveal}>Buka Semua</RevealButton>}
    </Wrapper>
  )
}
