import { SectionLabel } from '../../SubtopicDetail.styles'
import { ExplanationSection, ExplanationText, SkeletonBlock } from './ExplanationPanel.styles'

export default function ExplanationPanel({ text, isLoading }) {
  if (isLoading) return <SkeletonBlock />
  if (!text) return null

  return (
    <ExplanationSection>
      <SectionLabel>Penjelasan</SectionLabel>
      <ExplanationText>{text}</ExplanationText>
    </ExplanationSection>
  )
}
