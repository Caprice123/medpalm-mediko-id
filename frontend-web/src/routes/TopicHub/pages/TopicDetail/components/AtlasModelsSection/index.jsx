import { useSelector } from 'react-redux'
import { PiArrowRight } from 'react-icons/pi'
import {
  Section, SectionHeading, SectionDescription,
  ItemGrid, ItemCard, ItemCardName, ItemCardArrow,
} from '../../TopicDetail.styles'
import { ModuleGroup, ModuleTitle } from './AtlasModelsSection.styles'

export default function AtlasModelsSection({ onSelectModel }) {
  const atlasGroups = useSelector(s => s.featureNodes.atlasGroups)

  if (atlasGroups.length === 0) return null

  return (
    <Section>
      <SectionHeading>Model 3D Anatomi</SectionHeading>
      <SectionDescription>
        Setiap model disertai kuis anatomi terkait.
      </SectionDescription>

      {atlasGroups.map(group => (
        <ModuleGroup key={group.moduleId}>
          <ModuleTitle>{group.moduleName}</ModuleTitle>
          <ItemGrid>
            {group.models.map(model => (
              <ItemCard key={model.uniqueId} onClick={() => onSelectModel(model.uniqueId)}>
                <ItemCardName>{model.title}</ItemCardName>
                <ItemCardArrow><PiArrowRight size={16} /></ItemCardArrow>
              </ItemCard>
            ))}
          </ItemGrid>
        </ModuleGroup>
      ))}
    </Section>
  )
}
