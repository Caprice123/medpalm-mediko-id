import EmbedLoadingBanner from '@components/common/EmbedLoadingBanner'
import { EmbedCard, EmbedFrame } from './QuizEmbed.styles'

export default function QuizEmbed({ src, title }) {
  if (!src) return null

  return (
    <EmbedCard>
      <EmbedLoadingBanner />
      <EmbedFrame src={src} title={title} allowFullScreen allow="fullscreen" />
    </EmbedCard>
  )
}
