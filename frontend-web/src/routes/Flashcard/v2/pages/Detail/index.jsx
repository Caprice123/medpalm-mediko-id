import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchV2UserDeck } from '@store/flashcard/v2/userAction'
import { FlashcardRoute } from '../../../routes'
import AnkiPlayer from './components/AnkiPlayer'
import { PageContainer, LoadingWrap } from './Detail.styles'

function FlashcardV2DetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { detail, loading } = useSelector(state => state.flashcard)
  const isLoading = loading?.isGetDetailFlashcardDeckLoading

  useEffect(() => {
    dispatch(fetchV2UserDeck(id))
  }, [dispatch, id])

  if (isLoading || !detail) {
    return (
      <PageContainer>
        <LoadingWrap>Memuat kartu...</LoadingWrap>
      </PageContainer>
    )
  }

  if (!detail.cards || detail.cards.length === 0) {
    return (
      <PageContainer>
        <LoadingWrap>Deck ini belum memiliki kartu.</LoadingWrap>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <AnkiPlayer
        deck={detail}
        onBack={() => navigate(FlashcardRoute.initialRoute)}
      />
    </PageContainer>
  )
}

export default FlashcardV2DetailPage
