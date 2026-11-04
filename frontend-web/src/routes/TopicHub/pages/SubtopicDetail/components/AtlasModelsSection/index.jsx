import { PiCube, PiArrowRight } from 'react-icons/pi'
import {
  Section, SectionHeading, SectionDescription,
  ItemGrid, ItemCard, ItemCardIcon, ItemCardText, ItemCardName, ItemCardAction,
} from '../../SubtopicDetail.styles'

export default function AtlasModelsSection({ atlasModels, isLoading, onSelectModel }) {
  if (isLoading || atlasModels.length === 0) return null

  return (
    <Section>
      <SectionHeading>Model 3D Anatomi</SectionHeading>
      <SectionDescription>Setiap model disertai kuis anatomi terkait.</SectionDescription>

      <ItemGrid>
        {atlasModels.map(model => (
          <ItemCard key={model.uniqueId} onClick={() => onSelectModel(model.uniqueId)}>
            <ItemCardIcon><PiCube size={18} /></ItemCardIcon>
            <ItemCardText>
              <ItemCardName>{model.title}</ItemCardName>
            </ItemCardText>
            <ItemCardAction><PiArrowRight size={16} /></ItemCardAction>
          </ItemCard>
        ))}
      </ItemGrid>
    </Section>
  )
}
