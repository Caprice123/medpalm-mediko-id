import { Section, SectionHeading } from '../../SubtopicDetail.styles'
import { ExplanationText, SkeletonBlock } from './ExplanationPanel.styles'

export default function ExplanationPanel({ text, isLoading }) {
  if (isLoading) return <SkeletonBlock />
  if (!text) return null

  return (
    <Section>
      <SectionHeading>Penjelasan</SectionHeading>
      <ExplanationText>{text}</ExplanationText>
    </Section>
  )
}
