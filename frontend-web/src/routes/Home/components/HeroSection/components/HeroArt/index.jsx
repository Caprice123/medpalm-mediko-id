import { mascots } from '@routes/Home/utils/mascots'
import { useHeroArt } from './hooks/useHeroArt'
import {
  ArtWrap,
  Stage,
  Blob,
  Board,
  BoardHead,
  BoardTag,
  Progress,
  ProgressFill,
  Question,
  Options,
  Option,
  OptionLetter,
  OptionLabel,
  OptionBadge,
  StreakBadge,
  StreakFire,
  StreakValue,
  StreakLabel,
  Mascot,
  Bubble,
} from './HeroArt.styles'

const QUIZ_OPTIONS = [
  { key: 'A', label: 'M. temporalis' },
  { key: 'B', label: 'M. orbicularis oculi', correct: true },
  { key: 'C', label: 'M. frontalis' },
  { key: 'D', label: 'M. procerus' },
]

export default function HeroArt() {
  const { stageRef, boardRef, selected, selectOption } = useHeroArt()

  return (
    <ArtWrap data-aos="fade-left" data-aos-delay="200">
      <Stage ref={stageRef}>
        <Blob />

        <Board ref={boardRef}>
          <BoardHead>
            <span>Quiz Anatomi</span>
            <BoardTag>Soal 3/10</BoardTag>
          </BoardHead>
          <Progress><ProgressFill /></Progress>
          <Question>Otot yang berfungsi menutup kelopak mata adalah…</Question>
          <Options>
            {QUIZ_OPTIONS.map(opt => {
              const state = selected
                ? (opt.correct ? 'ok' : (selected === opt.key ? 'no' : null))
                : null
              return (
                <Option key={opt.key} $state={state} onClick={() => selectOption(opt.key)}>
                  <OptionLetter $state={state}>{opt.key}</OptionLetter>
                  <OptionLabel>{opt.label}</OptionLabel>
                  {state === 'ok' && <OptionBadge>+10 QP</OptionBadge>}
                </Option>
              )
            })}
          </Options>
        </Board>

        <StreakBadge>
          <StreakFire>🔥</StreakFire>
          <div>
            <StreakValue>12 hari</StreakValue>
            <StreakLabel>Streak belajar</StreakLabel>
          </div>
        </StreakBadge>

        <Bubble>Semangat<br />belajarnya!!!</Bubble>

        <Mascot src={mascots.lightbulb} alt="Maskot kapibara MedPal memegang bola lampu" />
      </Stage>
    </ArtWrap>
  )
}
