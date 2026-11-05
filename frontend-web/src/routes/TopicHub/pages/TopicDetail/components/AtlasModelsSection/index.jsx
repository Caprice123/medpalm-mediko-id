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

  /* A module heading only earns its place when it has something to group. Most
     modules hold a single model whose title repeats the module name, so those
     cards go straight into one grid; the handful of modules holding two or
     three models ("Stroke Iskemik dan Hemoragik" → "Stroke Iskemik", "Stroke
     hemoragik") keep their heading and sit below it. Deciding this per module
     rather than per page is what keeps one topic from looking entirely
     different from the next. */
  const singles = atlasGroups.filter(group => group.models.length === 1)
  const grouped = atlasGroups.filter(group => group.models.length > 1)

  const renderModel = (model) => (
    <ItemCard key={model.uniqueId} onClick={() => onSelectModel(model.uniqueId)}>
      <ItemCardName>{model.title}</ItemCardName>
      <ItemCardArrow><PiArrowRight size={16} /></ItemCardArrow>
    </ItemCard>
  )

  return (
    <Section>
      <SectionHeading>Model 3D Anatomi</SectionHeading>
      <SectionDescription>
        Setiap model disertai kuis anatomi terkait.
      </SectionDescription>

      {singles.length > 0 && (
        <ItemGrid>{singles.flatMap(group => group.models).map(renderModel)}</ItemGrid>
      )}

      {grouped.map(group => (
        <ModuleGroup key={group.moduleId}>
          <ModuleTitle>{group.moduleName}</ModuleTitle>
          <ItemGrid>{group.models.map(renderModel)}</ItemGrid>
        </ModuleGroup>
      ))}
    </Section>
  )
}
