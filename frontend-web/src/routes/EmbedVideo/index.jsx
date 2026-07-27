import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageRoot, VideoEl, WatermarkGrid, WatermarkText } from './EmbedVideo.styles'

const WATERMARK_COUNT = 24 // 4 cols × 6 rows

function EmbedVideoPage() {
  const [params] = useSearchParams()
  const src = params.get('src')
  const canDownload = params.get('download') === '1'
  const videoRef = useRef(null)

  // Block Ctrl/Cmd+S for users who cannot download
  useEffect(() => {
    if (canDownload) return
    const block = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') e.preventDefault()
    }
    window.addEventListener('keydown', block)
    return () => window.removeEventListener('keydown', block)
  }, [canDownload])

  if (!src) {
    return (
      <PageRoot>
        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Video tidak tersedia.</span>
      </PageRoot>
    )
  }

  return (
    <PageRoot>
      <VideoEl
        ref={videoRef}
        src={src}
        controls
        {...(!canDownload && {
          controlsList: 'nodownload',
          disablePictureInPicture: true,
          onContextMenu: (e) => e.preventDefault(),
        })}
        playsInline
      />

      {!canDownload && (
        <WatermarkGrid>
          {Array.from({ length: WATERMARK_COUNT }, (_, i) => (
            <WatermarkText key={i}>Mediko.id</WatermarkText>
          ))}
        </WatermarkGrid>
      )}
    </PageRoot>
  )
}

export default EmbedVideoPage
