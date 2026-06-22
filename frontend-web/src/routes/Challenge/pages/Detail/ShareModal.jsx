import { useRef, useState, useCallback } from 'react'
import { toPng } from 'html-to-image'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import styled from 'styled-components'

// ── Wrapper that scales the card for display inside the modal ──────────────
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

// ── The actual captured card — 480×480, inline styles for html-to-image ───
function ShareCard({ cardRef, challengeTitle, score }) {
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
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* large decorative trophy — background watermark */}
      <div style={{
        position: 'absolute',
        right: -20,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 260,
        lineHeight: 1,
        opacity: 0.07,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        🏆
      </div>

      {/* big circle top-left accent */}
      <div style={{
        position: 'absolute', top: -80, left: -80,
        width: 280, height: 280,
        background: 'rgba(255,255,255,0.06)',
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
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em' }}>
          medpal.id
        </div>
      </div>

      {/* ── MAIN SCORE SECTION ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 1.5rem',
        zIndex: 1,
      }}>
        {/* tagline */}
        <div style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.65)',
          marginBottom: '0.25rem',
          letterSpacing: '0.02em',
        }}>
          Aku berhasil menyelesaikan challenge ini! 🎉
        </div>

        {/* challenge title */}
        <div style={{
          fontSize: 17,
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.35,
          marginBottom: '1.5rem',
          maxWidth: 320,
        }}>
          {challengeTitle}
        </div>

        {/* score hero */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <div style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            textShadow: '0 4px 24px rgba(0,0,0,0.25)',
          }}>
            {score}
          </div>
          <div style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.65)',
            letterSpacing: '0.1em',
            paddingBottom: 8,
          }}>
            POIN
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 1.5rem 1.25rem',
        zIndex: 1,
      }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
          Platform Belajar Kedokteran
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.04em' }}>
          medpal.id
        </div>
      </div>
    </div>
  )
}

export default function ShareModal({ isOpen, onClose, challengeTitle, score }) {
  const cardRef = useRef(null)
  const [loading, setLoading] = useState(false)

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
          text: `Aku dapat ${score} poin di "${challengeTitle}" — coba juga di medpal.id!`,
          files: [file],
        })
      } else {
        // fallback: download
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
  }, [score, challengeTitle])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bagikan Hasil"
      size="medium"
    >
      <PreviewWrap>
        <ScaleBox>
          <ShareCard
            cardRef={cardRef}
            challengeTitle={challengeTitle}
            score={score}
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
        Gambar akan disimpan ke perangkat kamu · resolusi 960x960px
      </DownloadNote>
    </Modal>
  )
}
