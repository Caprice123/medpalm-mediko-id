import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { actions } from '@store/flashcardNodes'
import Button from '@components/common/Button'
import { FlashcardRoute } from '../../../../routes'
import {
  Wrapper, ProgressBar, ProgressTrack, ProgressFill, ProgressLabel,
  CardScene, CardInner, CardFront, CardBack, CardLabel, CardText, CardImage, HintText,
  Controls, NavBtn, FlipBtn,
  DoneCard, DoneTitle, DoneSub, DoneActions,
} from './NodeSession.styles'

function NodeSessionPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { sessionCards, sessionIndex } = useSelector(state => state.flashcardNodes)
  const [isFlipped, setIsFlipped] = useState(false)

  const total = sessionCards.length
  const card = sessionCards[sessionIndex] ?? null
  const isDone = sessionIndex >= total

  const goNext = () => {
    setIsFlipped(false)
    setTimeout(() => dispatch(actions.setSessionIndex(sessionIndex + 1)), 150)
  }

  const goPrev = () => {
    setIsFlipped(false)
    setTimeout(() => dispatch(actions.setSessionIndex(sessionIndex - 1)), 150)
  }

  const handleRestart = () => {
    dispatch(actions.setSessionIndex(0))
    setIsFlipped(false)
  }

  if (total === 0) {
    return (
      <Wrapper>
        <DoneCard>
          <DoneTitle>Tidak ada kartu</DoneTitle>
          <DoneSub>Kembali dan pilih sub-topik lain.</DoneSub>
          <DoneActions>
            <Button variant="primary" onClick={() => navigate(FlashcardRoute.topicsRoute)}>
              Kembali ke Topik
            </Button>
          </DoneActions>
        </DoneCard>
      </Wrapper>
    )
  }

  if (isDone) {
    return (
      <Wrapper>
        <DoneCard>
          <div style={{ fontSize: '2.5rem' }}>🎉</div>
          <DoneTitle>Sesi Selesai!</DoneTitle>
          <DoneSub>Kamu sudah menyelesaikan {total} kartu.</DoneSub>
          <DoneActions>
            <Button variant="secondary" onClick={handleRestart}>Ulangi</Button>
            <Button variant="primary" onClick={() => navigate(FlashcardRoute.topicsRoute)}>
              Kembali ke Topik
            </Button>
          </DoneActions>
        </DoneCard>
      </Wrapper>
    )
  }

  const pct = total > 0 ? Math.round((sessionIndex / total) * 100) : 0

  return (
    <Wrapper>
      <ProgressBar>
        <ProgressLabel>
          <span>Kartu {sessionIndex + 1} dari {total}</span>
          <span>{pct}%</span>
        </ProgressLabel>
        <ProgressTrack>
          <ProgressFill $pct={pct} />
        </ProgressTrack>
      </ProgressBar>

      <CardScene onClick={() => setIsFlipped(f => !f)}>
        <CardInner $flipped={isFlipped}>
          <CardFront>
            <CardLabel>Depan</CardLabel>
            <CardText>{card.front}</CardText>
            {!isFlipped && <HintText>Klik untuk melihat jawaban</HintText>}
          </CardFront>
          <CardBack>
            <CardLabel $back>Belakang</CardLabel>
            {card.imageUrl && <CardImage src={card.imageUrl} alt="" />}
            <CardText>{card.back}</CardText>
          </CardBack>
        </CardInner>
      </CardScene>

      <Controls>
        <NavBtn onClick={goPrev} disabled={sessionIndex === 0} title="Sebelumnya">‹</NavBtn>
        <FlipBtn onClick={() => setIsFlipped(f => !f)}>
          {isFlipped ? 'Sembunyikan Jawaban' : 'Lihat Jawaban'}
        </FlipBtn>
        <NavBtn onClick={goNext} title={sessionIndex === total - 1 ? 'Selesai' : 'Selanjutnya'}>
          {sessionIndex === total - 1 ? '✓' : '›'}
        </NavBtn>
      </Controls>
    </Wrapper>
  )
}

export default NodeSessionPage
