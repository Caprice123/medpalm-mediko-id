import { useRef, useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toPng } from 'html-to-image'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import styled from 'styled-components'
import { fetchPublicConstants } from '@store/constant/userAction'

const PreviewWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem 0 1.5rem;
`

const ScaleBox = styled.div`
  transform: scale(0.72);
  transform-origin: top center;
  height: calc(480px * 0.72);
`

const ActionRow = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`

const DownloadNote = styled.p`
  text-align: center;
  font-size: 0.8125rem;
  color: #9ca3af;
  margin: 0.75rem 0 0;
`

function parseJson(value) {
  if (!value) return null
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null
  } catch {
    return null
  }
}

// ── The captured card — 480×480, all inline styles for html-to-image ─────────
function ShareCard({ cardRef, challengeTitle, score, rank, totalParticipants, instagramHandle, website }) {
  const displayRank = rank ? `#${rank}` : '—'
  const displayTotal = totalParticipants ? `DARI ${totalParticipants} PESERTA` : 'PESERTA'
  const siteUrl = website || 'medpal.id'
  const igHandle = instagramHandle || '@medpal.id'

  return (
    <div
      ref={cardRef}
      style={{
        width: 480,
        height: 480,
        background: 'linear-gradient(145deg, #0d9488 0%, #0891b2 50%, #0369a1 100%)',
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontFamily: "'Outfit', system-ui, sans-serif",
      }}
    >
      {/* dot-grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* decorative circle top-left */}
      <div style={{
        position: 'absolute', top: -80, left: -80,
        width: 280, height: 280,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '50%',
      }} />

      {/* decorative circle bottom-right */}
      <div style={{
        position: 'absolute', bottom: -60, right: -60,
        width: 220, height: 220,
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '50%',
      }} />

      {/* ── HEADER BAR ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.25rem 1.5rem 0',
        zIndex: 1,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.18)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 999,
          padding: '5px 14px',
          fontSize: 11, fontWeight: 800, color: '#fff',
          letterSpacing: '0.08em',
        }}>
          🏆 MEDPAL CHALLENGE
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em' }}>
          {siteUrl}
        </div>
      </div>

      {/* ── HERO: RANK ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 1.75rem',
        zIndex: 1,
      }}>
        {/* PERINGKAT label */}
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.15em',
          marginBottom: 2,
        }}>
          PERINGKAT
        </div>

        {/* Rank number — biggest element */}
        <div style={{
          fontSize: 104,
          fontWeight: 900,
          color: '#fff',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          textShadow: '0 4px 28px rgba(0,0,0,0.3)',
        }}>
          {displayRank}
        </div>

        {/* DARI X PESERTA */}
        <div style={{
          fontSize: 15,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.65)',
          letterSpacing: '0.06em',
          marginBottom: '1.25rem',
        }}>
          {displayTotal}
        </div>

        {/* Challenge title */}
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.88)',
          lineHeight: 1.4,
          marginBottom: '0.875rem',
          maxWidth: 300,
        }}>
          {challengeTitle}
        </div>

        {/* Score badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.28)',
          borderRadius: 999,
          padding: '5px 16px',
          fontSize: 14,
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '0.06em',
          alignSelf: 'flex-start',
        }}>
          ⚡ {score} POIN
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '0 1.5rem 1.25rem',
        zIndex: 1,
        gap: '1rem',
      }}>
        {/* Social watermark */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.02em' }}>
            📷 {igHandle}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.02em' }}>
            🌐 {siteUrl}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          fontSize: 10,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'right',
          maxWidth: 160,
          lineHeight: 1.4,
        }}>
          Visit {siteUrl} untuk ikuti challenge ini →
        </div>
      </div>
    </div>
  )
}

export default function ShareModal({ isOpen, onClose, challengeTitle, score, rank, totalParticipants }) {
  const cardRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const constants = useSelector(state => state.constant.constants)

  useEffect(() => {
    if (isOpen && !constants.home_social_items) {
      dispatch(fetchPublicConstants(['home_social_items']))
    }
  }, [isOpen, dispatch, constants.home_social_items])

  const socialItems = parseJson(constants.home_social_items)
  const instagramItem = socialItems?.find(s => s.type === 'instagram')
  const instagramHandle = instagramItem?.handle || '@medpal.id'
  const website = 'medpal.id'

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return
    setLoading(true)
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `medpal-challenge-${score}poin.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Share card export failed', err)
    } finally {
      setLoading(false)
    }
  }, [score])

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return
    setLoading(true)
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], `medpal-challenge-${score}poin.png`, { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'Hasil Challenge Medpal',
          text: `Aku peringkat #${rank} dari ${totalParticipants} peserta dengan ${score} poin di "${challengeTitle}" — coba juga di ${website}!`,
          files: [file],
        })
      } else {
        const link = document.createElement('a')
        link.download = `medpal-challenge-${score}poin.png`
        link.href = dataUrl
        link.click()
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Share failed', err)
    } finally {
      setLoading(false)
    }
  }, [score, challengeTitle, rank, totalParticipants])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bagikan Hasil" size="medium">
      <PreviewWrap>
        <ScaleBox>
          <ShareCard
            cardRef={cardRef}
            challengeTitle={challengeTitle}
            score={score}
            rank={rank}
            totalParticipants={totalParticipants}
            instagramHandle={instagramHandle}
            website={website}
          />
        </ScaleBox>
      </PreviewWrap>

      <ActionRow>
        <Button variant="outline" onClick={handleDownload} disabled={loading}>
          ⬇ Download PNG
        </Button>
        <Button variant="primary" onClick={handleShare} disabled={loading}>
          {loading ? 'Menyiapkan...' : '↗ Bagikan'}
        </Button>
      </ActionRow>

      <DownloadNote>
        Gambar akan disimpan ke perangkat kamu · resolusi 960×960px
      </DownloadNote>
    </Modal>
  )
}
