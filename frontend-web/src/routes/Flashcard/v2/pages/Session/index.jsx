import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSessionByUniqueId } from '@store/review/userAction'
import AnkiPlayer from '../Detail/components/AnkiPlayer'
import { Wrapper, DeckContainer } from '../Detail/components/AnkiPlayer/AnkiPlayer.styles'
import { FlashcardRoute } from '../../../routes'
import Button from '@components/common/Button'

export default function SessionPage() {
  const { uniqueId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { sessionCards, loading } = useSelector(state => state.review)

  useEffect(() => {
    dispatch(fetchSessionByUniqueId(uniqueId))
  }, [uniqueId, dispatch])

  if (loading.isFetchingSession) {
    return (
      <Wrapper>
        <DeckContainer style={{ alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <span style={{ color: '#0d9488', fontWeight: 600, fontSize: '1rem' }}>Memuat kartu...</span>
        </DeckContainer>
      </Wrapper>
    )
  }

  if (!loading.isFetchingSession && sessionCards.length === 0) {
    return (
      <Wrapper>
        <DeckContainer style={{ padding: 0, overflow: 'hidden', gap: 0 }}>
          {/* gradient banner */}
          <div style={{
            background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #0891b2 100%)',
            padding: '2.5rem 2rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              border: '2px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem',
            }}>
              🎉
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', margin: 0 }}>
              Semua Beres!
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.8)', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
              Tidak ada kartu yang tersedia untuk sesi ini.
            </p>
          </div>

          {/* body */}
          <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
              padding: '1rem', background: '#f0fdfa', borderRadius: '12px',
              border: '1px solid #99f6e4',
            }}>
              <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>💪</span>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0d9488', marginBottom: '0.2rem' }}>
                  Tetap Konsisten!
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5 }}>
                  Kembali lagi besok — kartu baru akan jatuh tempo dan siap untuk direview.
                </div>
              </div>
            </div>

            <Button variant="primary" onClick={() => navigate(FlashcardRoute.initialRoute)} style={{ width: '100%' }}>
              Kembali ke Daftar
            </Button>
          </div>
        </DeckContainer>
      </Wrapper>
    )
  }

  return (
    <AnkiPlayer
      deck={{ title: 'Review Semua', cards: sessionCards }}
      onBack={() => navigate(FlashcardRoute.initialRoute)}
      recordType="flashcard_card"
    />
  )
}
