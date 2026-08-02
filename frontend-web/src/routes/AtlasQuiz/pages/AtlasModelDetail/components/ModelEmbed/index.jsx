import { EmbedCard, EmbedFrame } from './ModelEmbed.styles'

export default function ModelEmbed({ src, title }) {
  return (
    <EmbedCard>
      <EmbedFrame src={src} title={title} allowFullScreen allow="fullscreen" />
    </EmbedCard>
  )
}
