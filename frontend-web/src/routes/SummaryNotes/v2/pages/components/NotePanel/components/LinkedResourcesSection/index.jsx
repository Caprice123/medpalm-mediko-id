import { PiArrowRight, PiBrain, PiCards, PiCompass, PiFolderOpen, PiListNumbers } from 'react-icons/pi'
import { SectionRow, SectionLabel, SectionLine } from '../../NotePanel.styles'
import { useLinkedResourcesSection } from './hooks/useLinkedResourcesSection'
import {
  ResourceGrid, ResourceCard, ResourceIcon, ResourceInfo,
  ResourceKind, ResourceTitle, ResourceMeta, ResourceArrow,
} from './LinkedResourcesSection.styles'

const TYPE_ICONS = {
  topic: PiFolderOpen,
  flashcard: PiCards,
  mcq: PiListNumbers,
  anatomy: PiBrain,
}

export default function LinkedResourcesSection({ topicSlug, topicName, subtopicSlug, subtopicName }) {
  const { resources } = useLinkedResourcesSection({ topicSlug, topicName, subtopicSlug, subtopicName })

  if (resources.length === 0) return null

  return (
    <>
      <SectionRow>
        <SectionLabel><PiCompass />Lanjutkan Belajar</SectionLabel>
        <SectionLine />
      </SectionRow>

      <ResourceGrid>
        {resources.map(resource => {
          const Icon = TYPE_ICONS[resource.type]
          return (
            <ResourceCard key={resource.key} $type={resource.type} onClick={resource.onClick}>
              <ResourceIcon $type={resource.type}><Icon /></ResourceIcon>
              <ResourceInfo>
                <ResourceKind $type={resource.type}>{resource.kind}</ResourceKind>
                <ResourceTitle title={resource.title}>{resource.title}</ResourceTitle>
                {resource.meta && <ResourceMeta title={resource.meta}>{resource.meta}</ResourceMeta>}
              </ResourceInfo>
              <ResourceArrow $type={resource.type}><PiArrowRight /></ResourceArrow>
            </ResourceCard>
          )
        })}
      </ResourceGrid>
    </>
  )
}
