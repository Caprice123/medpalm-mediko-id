import { VideoSection, VideoWrapper, VideoFrame, SkeletonVideo } from './VideoPlayer.styles'

export default function VideoPlayer({ embedSrc, title, isLoading }) {
  if (isLoading) return <SkeletonVideo />
  if (!embedSrc) return null

  return (
    <VideoSection>
      <VideoWrapper>
        <VideoFrame
          src={embedSrc}
          title={title}
          allow={import.meta.env.PROD ? 'autoplay; fullscreen' : 'fullscreen'}
          allowFullScreen
        />
      </VideoWrapper>
    </VideoSection>
  )
}
